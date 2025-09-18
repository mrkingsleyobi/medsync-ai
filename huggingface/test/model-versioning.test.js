// MediSync Healthcare AI Platform - Model Versioning Tests
// Test suite for model versioning and management system

const ModelVersioningSystem = require('../src/model-versioning');
const fs = require('fs');
const path = require('path');

describe('Model Versioning System', () => {
  let versioning;
  const testStorageDir = './test/versions';

  beforeEach(() => {
    versioning = new ModelVersioningSystem({
      versionStorageDir: testStorageDir,
      maxVersions: 3
    });
  });

  afterEach(() => {
    // Clean up test storage directory
    if (fs.existsSync(testStorageDir)) {
      fs.rmSync(testStorageDir, { recursive: true });
    }
  });

  test('should initialize model versioning system', () => {
    expect(versioning).toBeInstanceOf(ModelVersioningSystem);
    expect(versioning.config).toBeDefined();
    expect(versioning.modelVersions).toBeInstanceOf(Map);
    expect(versioning.modelMetadata).toBeInstanceOf(Map);
  });

  test('should register model versions', () => {
    const versionInfo = {
      version: '1.0.0',
      name: 'test-model',
      description: 'Test model for versioning'
    };

    const versionId = versioning.registerModelVersion('test-model', versionInfo);
    expect(versionId).toBe('test-model-1.0.0');

    const versions = versioning.getModelVersions('test-model');
    expect(versions).toHaveLength(1);
    expect(versions[0].version).toBe('1.0.0');
    expect(versions[0].status).toBe('registered');
  });

  test('should get model versions', () => {
    const version1 = { version: '1.0.0', name: 'test-model' };
    const version2 = { version: '1.1.0', name: 'test-model' };

    versioning.registerModelVersion('test-model', version1);
    versioning.registerModelVersion('test-model', version2);

    const versions = versioning.getModelVersions('test-model');
    expect(versions).toHaveLength(2);
    // Should be sorted with newest first
    expect(versions[0].version).toBe('1.1.0');
    expect(versions[1].version).toBe('1.0.0');
  });

  test('should get specific model version', () => {
    const versionInfo = { version: '1.0.0', name: 'test-model' };

    versioning.registerModelVersion('test-model', versionInfo);

    const version = versioning.getModelVersion('test-model', '1.0.0');
    expect(version).toBeDefined();
    expect(version.version).toBe('1.0.0');

    const nonExistent = versioning.getModelVersion('test-model', '2.0.0');
    expect(nonExistent).toBeNull();
  });

  test('should get latest model version', () => {
    const version1 = { version: '1.0.0', name: 'test-model' };
    const version2 = { version: '1.1.0', name: 'test-model' };
    const version3 = { version: '2.0.0', name: 'test-model' };

    versioning.registerModelVersion('test-model', version1);
    versioning.registerModelVersion('test-model', version2);
    versioning.registerModelVersion('test-model', version3);

    const latest = versioning.getLatestVersion('test-model');
    expect(latest).toBeDefined();
    expect(latest.version).toBe('2.0.0');
  });

  test('should update version status', () => {
    const versionInfo = { version: '1.0.0', name: 'test-model' };

    versioning.registerModelVersion('test-model', versionInfo);
    const versionId = versioning.generateVersionId('test-model', '1.0.0');

    versioning.updateVersionStatus(versionId, 'production', { deployedAt: '2023-01-01' });

    const version = versioning.getModelVersion('test-model', '1.0.0');
    expect(version.status).toBe('production');
    expect(version.deployedAt).toBe('2023-01-01');
  });

  test('should delete model version', () => {
    const versionInfo = { version: '1.0.0', name: 'test-model' };

    versioning.registerModelVersion('test-model', versionInfo);
    expect(versioning.getModelVersions('test-model')).toHaveLength(1);

    const deleted = versioning.deleteModelVersion('test-model', '1.0.0');
    expect(deleted).toBeDefined();
    expect(deleted.version).toBe('1.0.0');

    const versions = versioning.getModelVersions('test-model');
    expect(versions).toHaveLength(0);
  });

  test('should promote version to production', () => {
    const versionInfo = { version: '1.0.0', name: 'test-model' };

    versioning.registerModelVersion('test-model', versionInfo);
    const result = versioning.promoteToProduction('test-model', '1.0.0');

    expect(result).toBe(true);

    const version = versioning.getModelVersion('test-model', '1.0.0');
    expect(version.status).toBe('production');
  });

  test('should rollback to previous version', () => {
    const versionInfo = { version: '1.0.0', name: 'test-model' };

    versioning.registerModelVersion('test-model', versionInfo);
    const result = versioning.rollbackVersion('test-model', '1.0.0');

    expect(result).toBe(true);
  });

  test('should handle version comparison', () => {
    expect(versioning.compareVersions('1.0.0', '1.0.1')).toBe(-1);
    expect(versioning.compareVersions('1.1.0', '1.0.1')).toBe(1);
    expect(versioning.compareVersions('1.0.0', '1.0.0')).toBe(0);
    expect(versioning.compareVersions('2.0.0', '1.9.9')).toBe(1);
  });

  test('should auto-cleanup old versions', () => {
    // Register more versions than maxVersions
    for (let i = 0; i < 5; i++) {
      const versionInfo = { version: `1.${i}.0`, name: 'test-model' };
      versioning.registerModelVersion('test-model', versionInfo);
    }

    const versions = versioning.getModelVersions('test-model');
    // Should only keep maxVersions (3)
    expect(versions).toHaveLength(3);
    // Should keep newest versions
    expect(versions[0].version).toBe('1.4.0');
    expect(versions[1].version).toBe('1.3.0');
    expect(versions[2].version).toBe('1.2.0');
  });

  test('should get all model metadata', () => {
    const version1 = { version: '1.0.0', name: 'test-model-1' };
    const version2 = { version: '1.0.0', name: 'test-model-2' };

    versioning.registerModelVersion('test-model-1', version1);
    versioning.registerModelVersion('test-model-2', version2);

    const allMetadata = versioning.getAllModelMetadata();
    expect(Object.keys(allMetadata)).toHaveLength(2);
  });

  test('should get system statistics', () => {
    const version1 = { version: '1.0.0', name: 'test-model' };
    const version2 = { version: '1.1.0', name: 'test-model' };

    versioning.registerModelVersion('test-model', version1);
    versioning.registerModelVersion('test-model', version2);

    // Update one version to production status
    const versionId = versioning.generateVersionId('test-model', '1.0.0');
    versioning.updateVersionStatus(versionId, 'production');

    const stats = versioning.getStatistics();
    expect(stats.totalModels).toBe(1);
    expect(stats.totalVersions).toBe(2);
    expect(stats.productionVersions).toBe(1);
  });
});