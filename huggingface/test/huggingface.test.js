// MediSync Healthcare AI Platform - HuggingFace Integration Tests
// Test suite for HuggingFace model integration

const HuggingFaceIntegration = require('../src/huggingface');
const fs = require('fs');
const path = require('path');

describe('HuggingFace Integration', () => {
  let hf;

  beforeEach(() => {
    // Initialize without API key for testing
    hf = new HuggingFaceIntegration({
      cacheDir: './test/cache'
    });
  });

  afterEach(() => {
    // Clean up test cache directory
    if (fs.existsSync('./test/cache')) {
      fs.rmSync('./test/cache', { recursive: true });
    }
  });

  test('should initialize HuggingFace integration', () => {
    expect(hf).toBeInstanceOf(HuggingFaceIntegration);
    expect(hf.config).toBeDefined();
    expect(hf.models).toBeInstanceOf(Map);
    expect(hf.modelMetadata).toBeInstanceOf(Map);
  });

  test('should register models', () => {
    const modelConfig = {
      name: 'test-model',
      type: 'text-classification',
      domain: 'medical'
    };

    hf.registerModel('test-model', modelConfig);
    const registeredModels = hf.getRegisteredModels();

    expect(registeredModels).toContain('test-model');
    expect(registeredModels).toHaveLength(1);
  });

  test('should get system statistics', () => {
    const stats = hf.getStatistics();

    expect(stats).toBeDefined();
    expect(stats.registeredModels).toBe(0);
    expect(stats.loadedModels).toBe(0);
    expect(stats.totalModels).toBe(0);
    expect(stats.cacheDir).toBe('./test/cache');
  });

  test('should handle model loading and unloading', async () => {
    const modelConfig = {
      name: 'test-model',
      type: 'text-classification',
      domain: 'medical'
    };

    hf.registerModel('test-model', modelConfig);

    // Test loading
    expect(() => hf.loadModel('test-model')).not.toThrow();

    // Test metadata
    const metadata = hf.getModelMetadata('test-model');
    expect(metadata).toBeDefined();
    expect(metadata.status).toBe('loaded');

    // Test unloading
    hf.unloadModel('test-model');
    const unloadedMetadata = hf.getModelMetadata('test-model');
    expect(unloadedMetadata.status).toBe('unloaded');
  });

  test('should handle missing model errors', async () => {
    await expect(hf.loadModel('nonexistent-model'))
      .rejects
      .toThrow('Model nonexistent-model not registered');
  });

  test('should get all model metadata', () => {
    const model1Config = {
      name: 'test-model-1',
      type: 'text-classification',
      domain: 'medical'
    };

    const model2Config = {
      name: 'test-model-2',
      type: 'token-classification',
      domain: 'medical'
    };

    hf.registerModel('test-model-1', model1Config);
    hf.registerModel('test-model-2', model2Config);

    const allMetadata = hf.getAllModelMetadata();
    expect(Object.keys(allMetadata)).toHaveLength(2);
    expect(allMetadata['test-model-1']).toBeDefined();
    expect(allMetadata['test-model-2']).toBeDefined();
  });

  test('should handle API key configuration', () => {
    // Test with API key
    const hfWithKey = new HuggingFaceIntegration({
      apiKey: 'test-api-key'
    });

    expect(hfWithKey.config.apiKey).toBe('test-api-key');
    // Note: We can't test actual API calls without a real API key
  });
});