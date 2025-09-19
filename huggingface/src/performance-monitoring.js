// MediSync Healthcare AI Platform - Model Performance Monitoring
// Performance monitoring system for HuggingFace models

const fs = require('fs');
const path = require('path');

class ModelPerformanceMonitoring {
  constructor(config = {}) {
    this.config = {
      metricsStorageDir: config.metricsStorageDir || './metrics',
      collectionInterval: config.collectionInterval || 60000, // 1 minute
      retentionPeriod: config.retentionPeriod || '7d', // 7 days
      ...config
    };

    // In-memory metrics storage
    this.metrics = new Map();
    this.performanceHistory = new Map();

    console.log('Model Performance Monitoring initialized', {
      metricsStorageDir: this.config.metricsStorageDir,
      collectionInterval: this.config.collectionInterval
    });
  }

  /**
   * Initialize the monitoring system asynchronously
   * @returns {Promise<void>}
   */
  async initialize() {
    // Create metrics storage directory if it doesn't exist
    try {
      await fs.promises.mkdir(this.config.metricsStorageDir, { recursive: true });
      console.log('Metrics storage directory created', { dir: this.config.metricsStorageDir });
    } catch (error) {
      console.error('Failed to create metrics storage directory', { error: error.message });
    }

    // Start metrics collection if enabled
    if (this.config.collectionInterval > 0) {
      this.startMetricsCollection();
    }
  }

  /**
   * Start automatic metrics collection
   */
  startMetricsCollection() {
    this.collectionIntervalId = setInterval(async () => {
      try {
        await this.collectSystemMetrics();
      } catch (error) {
        console.error('Failed to collect system metrics', { error: error.message });
      }
    }, this.config.collectionInterval);

    console.log('Metrics collection started', { interval: this.config.collectionInterval });
  }

  /**
   * Stop automatic metrics collection
   */
  stopMetricsCollection() {
    if (this.collectionIntervalId) {
      clearInterval(this.collectionIntervalId);
      this.collectionIntervalId = null;
      console.log('Metrics collection stopped');
    }
  }

  /**
   * Record model inference metrics
   * @param {string} modelId - Model identifier
   * @param {Object} metrics - Performance metrics
   */
  recordInferenceMetrics(modelId, metrics) {
    if (!this.metrics.has(modelId)) {
      this.metrics.set(modelId, {
        inferenceCount: 0,
        totalLatency: 0,
        totalTokens: 0,
        errors: 0,
        lastInference: null,
        performanceHistory: []
      });
    }

    const modelMetrics = this.metrics.get(modelId);

    // Update metrics
    modelMetrics.inferenceCount += 1;
    modelMetrics.totalLatency += metrics.latency || 0;
    modelMetrics.totalTokens += metrics.tokens || 0;

    if (metrics.error) {
      modelMetrics.errors += 1;
    }

    modelMetrics.lastInference = new Date().toISOString();

    // Store in performance history
    const historyEntry = {
      timestamp: new Date().toISOString(),
      ...metrics
    };

    modelMetrics.performanceHistory.push(historyEntry);

    // Keep only recent history (last 100 entries)
    if (modelMetrics.performanceHistory.length > 100) {
      modelMetrics.performanceHistory.shift();
    }

    // Store metrics to disk
    this.saveMetricsToFile(modelId, modelMetrics).catch(error => {
      console.error('Failed to save metrics to file', { modelId, error: error.message });
    });

    console.log('Inference metrics recorded', { modelId, ...metrics });
  }

  /**
   * Record system metrics
   */
  async collectSystemMetrics() {
    const systemMetrics = {
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      uptime: process.uptime()
    };

    // Save system metrics
    const metricsFile = path.join(this.config.metricsStorageDir, 'system-metrics.json');
    let existingMetrics = [];

    try {
      if (fs.existsSync(metricsFile)) {
        const data = await fs.promises.readFile(metricsFile, 'utf8');
        existingMetrics = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to read existing system metrics', { error: error.message });
    }

    existingMetrics.push(systemMetrics);

    // Keep only recent metrics (last 1000 entries)
    if (existingMetrics.length > 1000) {
      existingMetrics = existingMetrics.slice(-1000);
    }

    try {
      await fs.promises.writeFile(metricsFile, JSON.stringify(existingMetrics, null, 2));
    } catch (error) {
      console.error('Failed to write system metrics', { error: error.message });
    }

    console.log('System metrics collected', {
      memory: `${(systemMetrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      uptime: `${Math.floor(systemMetrics.uptime / 60)} minutes`
    });
  }

  /**
   * Get model performance metrics
   * @param {string} modelId - Model identifier
   * @returns {Object} Performance metrics
   */
  getModelMetrics(modelId) {
    const metrics = this.metrics.get(modelId);
    if (!metrics) {
      return null;
    }

    // Calculate averages
    const avgLatency = metrics.inferenceCount > 0
      ? metrics.totalLatency / metrics.inferenceCount
      : 0;

    const avgTokens = metrics.inferenceCount > 0
      ? metrics.totalTokens / metrics.inferenceCount
      : 0;

    const errorRate = metrics.inferenceCount > 0
      ? (metrics.errors / metrics.inferenceCount) * 100
      : 0;

    return {
      modelId,
      inferenceCount: metrics.inferenceCount,
      avgLatency: parseFloat(avgLatency.toFixed(2)),
      avgTokens: parseFloat(avgTokens.toFixed(2)),
      errorRate: parseFloat(errorRate.toFixed(2)),
      errors: metrics.errors,
      lastInference: metrics.lastInference,
      uptime: process.uptime()
    };
  }

  /**
   * Get all model metrics
   * @returns {Object} All model metrics
   */
  getAllModelMetrics() {
    const allMetrics = {};
    for (const [modelId, metrics] of this.metrics.entries()) {
      allMetrics[modelId] = this.getModelMetrics(modelId);
    }
    return allMetrics;
  }

  /**
   * Get performance history for a model
   * @param {string} modelId - Model identifier
   * @param {number} limit - Number of history entries to return
   * @returns {Array} Performance history
   */
  getPerformanceHistory(modelId, limit = 50) {
    const metrics = this.metrics.get(modelId);
    if (!metrics) {
      return [];
    }

    const history = metrics.performanceHistory;
    return limit > 0 ? history.slice(-limit) : history;
  }

  /**
   * Get system metrics
   * @returns {Object} System metrics
   */
  getSystemMetrics() {
    const metricsFile = path.join(this.config.metricsStorageDir, 'system-metrics.json');
    if (fs.existsSync(metricsFile)) {
      const data = fs.readFileSync(metricsFile, 'utf8');
      const metrics = JSON.parse(data);
      return metrics.slice(-50); // Return last 50 entries
    }
    return [];
  }

  /**
   * Check if model performance meets requirements
   * @param {string} modelId - Model identifier
   * @param {Object} requirements - Performance requirements
   * @returns {Object} Performance check results
   */
  checkPerformanceRequirements(modelId, requirements = {}) {
    const metrics = this.getModelMetrics(modelId);
    if (!metrics) {
      return { passed: false, reason: 'No metrics available' };
    }

    const results = {
      passed: true,
      checks: {}
    };

    // Check latency requirement
    if (requirements.maxLatency) {
      const latencyCheck = metrics.avgLatency <= requirements.maxLatency;
      results.checks.latency = {
        passed: latencyCheck,
        actual: metrics.avgLatency,
        required: requirements.maxLatency
      };

      if (!latencyCheck) {
        results.passed = false;
      }
    }

    // Check error rate requirement
    if (requirements.maxErrorRate) {
      const errorCheck = metrics.errorRate <= requirements.maxErrorRate;
      results.checks.errorRate = {
        passed: errorCheck,
        actual: metrics.errorRate,
        required: requirements.maxErrorRate
      };

      if (!errorCheck) {
        results.passed = false;
      }
    }

    // Check minimum inference count
    if (requirements.minInferenceCount) {
      const countCheck = metrics.inferenceCount >= requirements.minInferenceCount;
      results.checks.inferenceCount = {
        passed: countCheck,
        actual: metrics.inferenceCount,
        required: requirements.minInferenceCount
      };

      if (!countCheck) {
        results.passed = false;
      }
    }

    return results;
  }

  /**
   * Generate performance report
   * @param {string} modelId - Model identifier (optional)
   * @returns {Object} Performance report
   */
  generatePerformanceReport(modelId = null) {
    const report = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
      },
      models: modelId ?
        { [modelId]: this.getModelMetrics(modelId) } :
        this.getAllModelMetrics()
    };

    return report;
  }

  /**
   * Save metrics to file
   * @param {string} modelId - Model identifier
   * @param {Object} metrics - Metrics data
   */
  async saveMetricsToFile(modelId, metrics) {
    const metricsFile = path.join(this.config.metricsStorageDir, `${modelId}-metrics.json`);
    try {
      await fs.promises.writeFile(metricsFile, JSON.stringify(metrics, null, 2));
    } catch (error) {
      console.error('Failed to save metrics to file', { modelId, error: error.message });
    }
  }

  /**
   * Load metrics from file
   * @param {string} modelId - Model identifier
   * @returns {Promise<Object>} Metrics data
   */
  async loadMetricsFromFile(modelId) {
    const metricsFile = path.join(this.config.metricsStorageDir, `${modelId}-metrics.json`);
    try {
      if (fs.existsSync(metricsFile)) {
        const data = await fs.promises.readFile(metricsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load metrics from file', { modelId, error: error.message });
    }
    return null;
  }

  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getStatistics() {
    let totalInferences = 0;
    let totalErrors = 0;

    for (const metrics of this.metrics.values()) {
      totalInferences += metrics.inferenceCount;
      totalErrors += metrics.errors;
    }

    const errorRate = totalInferences > 0
      ? (totalErrors / totalInferences) * 100
      : 0;

    return {
      totalModels: this.metrics.size,
      totalInferences: totalInferences,
      totalErrors: totalErrors,
      errorRate: parseFloat(errorRate.toFixed(2)),
      metricsStorageDir: this.config.metricsStorageDir,
      collectionInterval: this.config.collectionInterval
    };
  }

  /**
   * Clean up old metrics files
   */
  async cleanupOldMetrics() {
    // Parse retention period from config (e.g., '7d', '30d', '1w')
    let retentionDays = 7; // default to 7 days
    if (this.config.retentionPeriod) {
      const match = this.config.retentionPeriod.match(/^(\d+)([dwmy])$/);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        switch (unit) {
          case 'd': // days
            retentionDays = value;
            break;
          case 'w': // weeks
            retentionDays = value * 7;
            break;
          case 'm': // months (approximate)
            retentionDays = value * 30;
            break;
          case 'y': // years (approximate)
            retentionDays = value * 365;
            break;
        }
      }
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const metricsDir = this.config.metricsStorageDir;
    try {
      if (fs.existsSync(metricsDir)) {
        const files = await fs.promises.readdir(metricsDir);
        for (const file of files) {
          const filePath = path.join(metricsDir, file);
          try {
            const stats = await fs.promises.stat(filePath);

            if (stats.mtime < cutoffDate) {
              await fs.promises.unlink(filePath);
              console.log('Old metrics file cleaned up', { file });
            }
          } catch (error) {
            console.error('Failed to process file', { file, error: error.message });
          }
        }
      }
    } catch (error) {
      console.error('Failed to clean up old metrics files', { error: error.message });
    }
  }
}

module.exports = ModelPerformanceMonitoring;