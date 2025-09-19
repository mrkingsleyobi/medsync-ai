// MediSync Healthcare AI Platform - Medical Image Classification Tests
// Test suite for medical image classification

const MedicalImageClassification = require('../src/medical-image-classification');
const fs = require('fs');

describe('Medical Image Classification', () => {
  let imageClassifier;

  beforeEach(() => {
    // Initialize without API key for testing
    imageClassifier = new MedicalImageClassification({
      timeout: 1000 // Short timeout for testing
    });
  });

  test('should initialize medical image classification system', () => {
    expect(imageClassifier).toBeInstanceOf(MedicalImageClassification);
    expect(imageClassifier.config).toBeDefined();
    expect(imageClassifier.models).toBeDefined();
  });

  test('should get available models', () => {
    const models = imageClassifier.getAvailableModels();
    expect(models).toBeDefined();
    expect(Object.keys(models)).toHaveLength(5);
    expect(models.vit_medical).toBeDefined();
    expect(models.resnet_medical).toBeDefined();
    expect(models.radiology_cnn).toBeDefined();
    expect(models.dermatology_cnn).toBeDefined();
    expect(models.pathology_cnn).toBeDefined();
  });

  test('should get model information', () => {
    const modelInfo = imageClassifier.getModelInfo('vit_medical');
    expect(modelInfo).toBeDefined();
    expect(modelInfo.name).toBe('google/vit-base-patch16-224');
    expect(modelInfo.type).toBe('image-classification');

    const nonExistent = imageClassifier.getModelInfo('non-existent');
    expect(nonExistent).toBeNull();
  });

  test('should get system statistics', () => {
    const stats = imageClassifier.getStatistics();
    expect(stats).toBeDefined();
    expect(stats.defaultModel).toBe('google/vit-base-patch16-224');
    expect(stats.availableModels).toBe(5);
    expect(stats.modelTypes).toContain('image-classification');
  });

  test('should handle missing API key', async () => {
    await expect(imageClassifier.classifyImageFromFile('test.jpg'))
      .rejects
      .toThrow('HuggingFace API key not configured');
  });

  test('should handle missing image file', async () => {
    // Mock the HuggingFace client to avoid API calls
    imageClassifier.hf = { imageClassification: jest.fn() };

    await expect(imageClassifier.classifyImageFromFile('non-existent.jpg'))
      .rejects
      .toThrow('Image file not found: non-existent.jpg');
  });

  test('should handle invalid image buffer', async () => {
    // Mock the HuggingFace client to avoid API calls
    imageClassifier.hf = { imageClassification: jest.fn() };

    await expect(imageClassifier.classifyImageFromBuffer('not-a-buffer'))
      .rejects
      .toThrow('Image data must be a Buffer');
  });

  test('should handle non-existent model', async () => {
    // Mock the HuggingFace client to avoid API calls
    imageClassifier.hf = { imageClassification: jest.fn() };

    // Mock file system access
    jest.spyOn(fs.promises, 'access').mockResolvedValue();

    await expect(imageClassifier.classifyImageFromFile('test.jpg', 'non-existent-model'))
      .rejects
      .toThrow('Model non-existent-model not found');
  });

  test('should handle batch classification errors', async () => {
    await expect(imageClassifier.batchClassifyImages('not-an-array'))
      .rejects
      .toThrow('Images must be a non-empty array');

    await expect(imageClassifier.batchClassifyImages([]))
      .rejects
      .toThrow('Images must be a non-empty array');
  });

  test('should classify radiology images', async () => {
    // Mock the HuggingFace client to avoid API calls
    imageClassifier.hf = {
      imageClassification: jest.fn().mockResolvedValue([
        { label: 'chest_xray', score: 0.95 }
      ])
    };

    // Mock file system
    jest.spyOn(fs.promises, 'access').mockResolvedValue();
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Buffer.from('test-image-data'));

    const result = await imageClassifier.classifyRadiologyImage('chest-xray.jpg');
    expect(result).toBeDefined();
    expect(result.model).toBe('StanfordAIMI/chest-imagenet');
    expect(result.results).toHaveLength(1);
  });

  test('should classify dermatology images', async () => {
    // Mock the HuggingFace client to avoid API calls
    imageClassifier.hf = {
      imageClassification: jest.fn().mockResolvedValue([
        { label: 'melanoma', score: 0.87 }
      ])
    };

    const imageBuffer = Buffer.from('test-image-data');
    const result = await imageClassifier.classifyDermatologyImage(imageBuffer);
    expect(result).toBeDefined();
    expect(result.model).toBe('mdbootstrap/resnet50-dermoscopic-images');
  });

  test('should classify pathology images', async () => {
    // Mock the HuggingFace client to avoid API calls
    imageClassifier.hf = {
      imageClassification: jest.fn().mockResolvedValue([
        { label: 'cancerous_tissue', score: 0.92 }
      ])
    };

    // Mock file system
    jest.spyOn(fs.promises, 'access').mockResolvedValue();
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Buffer.from('test-image-data'));

    const result = await imageClassifier.classifyPathologyImage('tissue-slide.jpg');
    expect(result).toBeDefined();
    expect(result.model).toBe('histo-resnet50');
  });

  test('should batch classify images', async () => {
    // Mock the HuggingFace client to avoid API calls
    imageClassifier.hf = {
      imageClassification: jest.fn()
        .mockResolvedValueOnce([{ label: 'chest_xray', score: 0.95 }])
        .mockResolvedValueOnce([{ label: 'abdomen_xray', score: 0.87 }])
    };

    // Mock file system
    jest.spyOn(fs.promises, 'access').mockResolvedValue();
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Buffer.from('test-image-data'));

    const images = [
      'chest-xray.jpg',
      Buffer.from('abdomen-image-data')
    ];

    const result = await imageClassifier.batchClassifyImages(images, 'vit_medical');
    expect(result).toBeDefined();
    expect(result.total).toBe(2);
    expect(result.successful).toBe(2);
    expect(result.failed).toBe(0);
    expect(result.results).toHaveLength(2);
  });

  test('should get top classification result', () => {
    const results = [
      { label: 'class1', score: 0.75 },
      { label: 'class2', score: 0.95 },
      { label: 'class3', score: 0.65 }
    ];

    const topResult = imageClassifier.getTopResult(results);
    expect(topResult).toBeDefined();
    expect(topResult.label).toBe('class2');
    expect(topResult.score).toBe(0.95);
  });

  test('should filter results by confidence threshold', () => {
    const results = [
      { label: 'class1', score: 0.75 },
      { label: 'class2', score: 0.95 },
      { label: 'class3', score: 0.65 },
      { label: 'class4', score: 0.45 }
    ];

    const filtered = imageClassifier.filterByConfidence(results, 0.7);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].score).toBeGreaterThanOrEqual(0.7);
    expect(filtered[1].score).toBeGreaterThanOrEqual(0.7);
  });
});