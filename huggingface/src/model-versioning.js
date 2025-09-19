// MediSync Healthcare AI Platform - Model Versioning System
// Model versioning and management system for HuggingFace models

const fs = require('fs');
const path = require('path');

class ModelVersioningSystem {
  constructor(config = {}) {
    this.config = {
      versionStorageDir: config.versionStorageDir || './models/versions',
      maxVersions: config.maxVersions || 5,
      autoCleanup: config.autoCleanup !== false, // Default to true
      ...config
    };

    // In-memory registry of model versions
    this.modelVersions = new Map();
    this.modelMetadata = new Map();

    console.log('Model Versioning System initialized', {
      versionStorageDir: this.config.versionStorageDir,
      maxVersions: this.config.maxVersions
    });
  }

  /**
   * Initialize the versioning system asynchronously
   * @returns {Promise<void>}
   */
  async initialize() {
    // Create version storage directory if it doesn't exist
    try {
      await fs.promises.mkdir(this.config.versionStorageDir, { recursive: true });
      console.log('Version storage directory created', { dir: this.config.versionStorageDir });
    } catch (error) {
      console.error('Failed to create version storage directory', { error: error.message });
    }
  }

  /**
   * Register a new model version
   * @param {string} modelId - Unique identifier for the model
   * @param {Object} versionInfo - Version information
   * @returns {string} Version ID
   */
  registerModelVersion(modelId, versionInfo) {
    if (!this.modelVersions.has(modelId)) {
      this.modelVersions.set(modelId, []);
    }

    const versions = this.modelVersions.get(modelId);
    const versionId = this.generateVersionId(modelId, versionInfo.version);

    // Add version info
    const versionData = {
      id: versionId,
      modelId: modelId,
      ...versionInfo,
      createdAt: new Date().toISOString(),
      status: 'registered'
    };

    versions.push(versionData);

    // Sort versions by version number (newest first)
    versions.sort((a, b) => this.compareVersions(b.version, a.version));

    // Limit to max versions if autoCleanup is enabled
    if (this.config.autoCleanup && versions.length > this.config.maxVersions) {
      const removedVersions = versions.splice(this.config.maxVersions);
      this.cleanupOldVersions(modelId, removedVersions);
    }

    // Store metadata
    this.modelMetadata.set(versionId, versionData);

    console.log('Model version registered', { modelId, versionId, version: versionInfo.version });
    return versionId;
  }

  /**
   * Get all versions for a model
   * @param {string} modelId - Model identifier
   * @returns {Array} List of versions
   */
  getModelVersions(modelId) {
    return this.modelVersions.get(modelId) || [];
  }

  /**
   * Get specific model version
   * @param {string} modelId - Model identifier
   * @param {string} version - Version identifier
   * @returns {Object} Version information
   */
  getModelVersion(modelId, version) {
    const versions = this.getModelVersions(modelId);
    return versions.find(v => v.version === version) || null;
  }

  /**
   * Get latest version of a model
   * @param {string} modelId - Model identifier
   * @returns {Object} Latest version information
   */
  getLatestVersion(modelId) {
    const versions = this.getModelVersions(modelId);
    return versions.length > 0 ? versions[0] : null;
  }

  /**
   * Update model version status
   * @param {string} versionId - Version identifier
   * @param {string} status - New status
   * @param {Object} metadata - Additional metadata
   */
  updateVersionStatus(versionId, status, metadata = {}) {
    const versionData = this.modelMetadata.get(versionId);
    if (versionData) {
      const updatedData = {
        ...versionData,
        status: status,
        updatedAt: new Date().toISOString(),
        ...metadata
      };

      this.modelMetadata.set(versionId, updatedData);

      // Update in model versions array
      const versions = this.modelVersions.get(versionData.modelId);
      if (versions) {
        const index = versions.findIndex(v => v.id === versionId);
        if (index !== -1) {
          versions[index] = updatedData;
        }
      }

      console.log('Model version status updated', { versionId, status });
    }
  }

  /**
   * Delete a model version
   * @param {string} modelId - Model identifier
   * @param {string} version - Version to delete
   */
  deleteModelVersion(modelId, version) {
    const versions = this.modelVersions.get(modelId);
    if (versions) {
      const index = versions.findIndex(v => v.version === version);
      if (index !== -1) {
        const removedVersion = versions.splice(index, 1)[0];
        const versionId = this.generateVersionId(modelId, version);
        this.modelMetadata.delete(versionId);

        // Clean up any stored files for this version
        this.cleanupVersionFiles(modelId, version).catch(error => {
          console.error('Failed to clean up version files', { modelId, version, error: error.message });
        });

        console.log('Model version deleted', { modelId, version });
        return removedVersion;
      }
    }
    return null;
  }

  /**
   * Promote a model version to production
   * @param {string} modelId - Model identifier
   * @param {string} version - Version to promote
   */
  promoteToProduction(modelId, version) {
    const versionData = this.getModelVersion(modelId, version);
    if (versionData) {
      this.updateVersionStatus(
        this.generateVersionId(modelId, version),
        'production',
        { promotedAt: new Date().toISOString() }
      );

      console.log('Model version promoted to production', { modelId, version });
      return true;
    }
    return false;
  }

  /**
   * Rollback to a previous model version
   * @param {string} modelId - Model identifier
   * @param {string} version - Version to rollback to
   */
  rollbackVersion(modelId, version) {
    const versionData = this.getModelVersion(modelId, version);
    if (versionData) {
      // Set current production version to rollback
      this.updateVersionStatus(
        this.generateVersionId(modelId, version),
        'production',
        { rolledBackAt: new Date().toISOString() }
      );

      console.log('Model version rolled back', { modelId, version });
      return true;
    }
    return false;
  }

  /**
   * Get all model metadata
   * @returns {Object} All model metadata
   */
  getAllModelMetadata() {
    const metadata = {};
    for (const [versionId, versionData] of this.modelMetadata.entries()) {
      metadata[versionId] = versionData;
    }
    return metadata;
  }

  /**
   * Generate version ID
   * @param {string} modelId - Model identifier
   * @param {string} version - Version string
   * @returns {string} Version ID
   */
  generateVersionId(modelId, version) {
    return `${modelId}-${version}`;
  }

  /**
   * Compare version strings
   * @param {string} v1 - First version
   * @param {string} v2 - Second version
   * @returns {number} Comparison result
   */
  compareVersions(v1, v2) {
    const parts1 = v1.split('.');
    const parts2 = v2.split('.');

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || '';
      const part2 = parts2[i] || '';

      // Try to parse as numbers first
      const num1 = parseInt(part1, 10);
      const num2 = parseInt(part2, 10);

      // If both are valid numbers, compare numerically
      if (!isNaN(num1) && !isNaN(num2)) {
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
      } else {
        // If not numbers, compare as strings
        if (part1 > part2) return 1;
        if (part1 < part2) return -1;
      }
    }

    return 0;
  }

  /**
   * Clean up old versions
   * @param {string} modelId - Model identifier
   * @param {Array} versions - Versions to clean up
   */
  cleanupOldVersions(modelId, versions) {
    versions.forEach(version => {
      const versionId = this.generateVersionId(modelId, version.version);
      this.modelMetadata.delete(versionId);
      this.cleanupVersionFiles(modelId, version.version).catch(error => {
        console.error('Failed to clean up version files', { modelId, version: version.version, error: error.message });
      });
    });

    console.log('Old versions cleaned up', { modelId, count: versions.length });
  }

  /**
   * Clean up version files
   * @param {string} modelId - Model identifier
   * @param {string} version - Version string
   */
  async cleanupVersionFiles(modelId, version) {
    const versionDir = path.join(this.config.versionStorageDir, modelId, version);
    try {
      if (fs.existsSync(versionDir)) {
        await fs.promises.rm(versionDir, { recursive: true });
        console.log('Version files cleaned up', { modelId, version });
      }
    } catch (error) {
      console.error('Failed to clean up version files', { modelId, version, error: error.message });
    }
  }

  /**
   * Save model version to disk
   * @param {string} modelId - Model identifier
   * @param {string} version - Version string
   * @param {Object} modelData - Model data to save
   */
  async saveModelVersion(modelId, version, modelData) {
    const versionDir = path.join(this.config.versionStorageDir, modelId, version);
    try {
      await fs.promises.mkdir(versionDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create version directory', { modelId, version, error: error.message });
      return;
    }

    const modelPath = path.join(versionDir, 'model.json');
    try {
      await fs.promises.writeFile(modelPath, JSON.stringify(modelData, null, 2));
      console.log('Model version saved to disk', { modelId, version, path: modelPath });
    } catch (error) {
      console.error('Failed to save model version to disk', { modelId, version, error: error.message });
    }
  }

  /**
   * Load model version from disk
   * @param {string} modelId - Model identifier
   * @param {string} version - Version string
   * @returns {Promise<Object>} Model data
   */
  async loadModelVersion(modelId, version) {
    const modelPath = path.join(this.config.versionStorageDir, modelId, version, 'model.json');
    try {
      if (fs.existsSync(modelPath)) {
        const data = await fs.promises.readFile(modelPath, 'utf8');
        console.log('Model version loaded from disk', { modelId, version, path: modelPath });
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load model version from disk', { modelId, version, error: error.message });
    }
    return null;
  }

  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getStatistics() {
    let totalVersions = 0;
    let productionVersions = 0;

    for (const versions of this.modelVersions.values()) {
      totalVersions += versions.length;
      productionVersions += versions.filter(v => v.status === 'production').length;
    }

    return {
      totalModels: this.modelVersions.size,
      totalVersions: totalVersions,
      productionVersions: productionVersions,
      versionStorageDir: this.config.versionStorageDir,
      maxVersions: this.config.maxVersions
    };
  }
}

module.exports = ModelVersioningSystem;