// MediSync Healthcare AI Platform - Text Classification Tests
// Test suite for medical text classification

const MedicalTextClassification = require('../src/text-classification');

describe('Medical Text Classification', () => {
  let textClassifier;

  beforeEach(() => {
    // Initialize without API key for testing
    textClassifier = new MedicalTextClassification({
      timeout: 1000 // Short timeout for testing
    });
  });

  test('should initialize text classification system', () => {
    expect(textClassifier).toBeInstanceOf(MedicalTextClassification);
    expect(textClassifier.config).toBeDefined();
    expect(textClassifier.models).toBeDefined();
  });

  test('should get available models', () => {
    const models = textClassifier.getAvailableModels();
    expect(models).toBeDefined();
    expect(Object.keys(models)).toHaveLength(3);
    expect(models.clinical_bert).toBeDefined();
    expect(models.pubmed_bert).toBeDefined();
    expect(models.medical_bart).toBeDefined();
  });

  test('should get model information', () => {
    const modelInfo = textClassifier.getModelInfo('clinical_bert');
    expect(modelInfo).toBeDefined();
    expect(modelInfo.name).toBe('emilyalsentzer/Bio_ClinicalBERT');
    expect(modelInfo.type).toBe('text-classification');

    const nonExistent = textClassifier.getModelInfo('non-existent');
    expect(nonExistent).toBeNull();
  });

  test('should get system statistics', () => {
    const stats = textClassifier.getStatistics();
    expect(stats).toBeDefined();
    expect(stats.defaultModel).toBe('emilyalsentzer/Bio_ClinicalBERT');
    expect(stats.availableModels).toBe(3);
    expect(stats.modelTypes).toContain('text-classification');
    expect(stats.modelTypes).toContain('zero-shot-classification');
  });

  test('should handle missing API key', async () => {
    await expect(textClassifier.classifyText('test text'))
      .rejects
      .toThrow('HuggingFace API key not configured');
  });

  test('should handle missing text', async () => {
    // Mock the HuggingFace client to avoid API calls
    textClassifier.hf = { textClassification: jest.fn() };

    await expect(textClassifier.classifyText(''))
      .rejects
      .toThrow('Text is required for classification');

    await expect(textClassifier.classifyText(null))
      .rejects
      .toThrow('Text is required for classification');
  });

  test('should handle non-existent model', async () => {
    // Mock the HuggingFace client to avoid API calls
    textClassifier.hf = { textClassification: jest.fn() };

    await expect(textClassifier.classifyText('test text', 'non-existent-model'))
      .rejects
      .toThrow('Model non-existent-model not found');
  });

  test('should handle batch classification errors', async () => {
    await expect(textClassifier.batchClassify('not-an-array'))
      .rejects
      .toThrow('Texts must be a non-empty array');

    await expect(textClassifier.batchClassify([]))
      .rejects
      .toThrow('Texts must be a non-empty array');
  });

  test('should classify document type', async () => {
    // Mock the HuggingFace client to avoid API calls
    textClassifier.hf = {
      textClassification: jest.fn().mockResolvedValue([
        { label: 'clinical_note', score: 0.95 }
      ])
    };

    const result = await textClassifier.classifyDocumentType('Patient has diabetes and hypertension.');
    expect(result).toBeDefined();
    expect(result.model).toBe('emilyalsentzer/Bio_ClinicalBERT');
    expect(result.results).toHaveLength(1);
  });

  test('should classify research type', async () => {
    // Mock the HuggingFace client to avoid API calls
    textClassifier.hf = {
      textClassification: jest.fn().mockResolvedValue([
        { label: 'research_abstract', score: 0.87 }
      ])
    };

    const result = await textClassifier.classifyResearchType('This study investigates the effects of...');
    expect(result).toBeDefined();
    expect(result.model).toBe('microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext');
  });

  test('should classify medical specialty with zero-shot', async () => {
    // Mock the HuggingFace client to avoid API calls
    textClassifier.hf = {
      zeroShotClassification: jest.fn().mockResolvedValue({
        sequence: 'Patient presents with chest pain and shortness of breath.',
        labels: ['cardiology', 'neurology', 'oncology'],
        scores: [0.92, 0.05, 0.03]
      })
    };

    const result = await textClassifier.classifyMedicalSpecialty('Patient presents with chest pain and shortness of breath.');
    expect(result).toBeDefined();
    expect(result.model).toBe('facebook/bart-large-mnli');
    expect(result.type).toBe('zero-shot-classification');
  });

  test('should batch classify texts', async () => {
    // Mock the HuggingFace client to avoid API calls
    textClassifier.hf = {
      textClassification: jest.fn()
        .mockResolvedValueOnce([{ label: 'clinical_note', score: 0.95 }])
        .mockResolvedValueOnce([{ label: 'discharge_summary', score: 0.87 }])
    };

    const texts = [
      'Patient has diabetes and hypertension.',
      'Discharge summary for patient with heart failure.'
    ];

    const result = await textClassifier.batchClassify(texts, 'clinical_bert');
    expect(result).toBeDefined();
    expect(result.total).toBe(2);
    expect(result.successful).toBe(2);
    expect(result.failed).toBe(0);
    expect(result.results).toHaveLength(2);
  });

  test('should handle batch classification with errors', async () => {
    // Mock the HuggingFace client to simulate one failure
    textClassifier.hf = {
      textClassification: jest.fn()
        .mockResolvedValueOnce([{ label: 'clinical_note', score: 0.95 }])
        .mockRejectedValueOnce(new Error('API timeout'))
    };

    const texts = [
      'Patient has diabetes and hypertension.',
      'This should cause an error.'
    ];

    const result = await textClassifier.batchClassify(texts, 'clinical_bert');
    expect(result).toBeDefined();
    expect(result.total).toBe(2);
    expect(result.successful).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.results).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
  });
});