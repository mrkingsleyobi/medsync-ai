// MediSync Healthcare AI Platform - Medical NER Tests
// Test suite for medical named entity recognition

const MedicalNamedEntityRecognition = require('../src/medical-ner');

describe('Medical Named Entity Recognition', () => {
  let ner;

  beforeEach(() => {
    // Initialize without API key for testing
    ner = new MedicalNamedEntityRecognition({
      timeout: 1000 // Short timeout for testing
    });
  });

  test('should initialize medical NER system', () => {
    expect(ner).toBeInstanceOf(MedicalNamedEntityRecognition);
    expect(ner.config).toBeDefined();
    expect(ner.models).toBeDefined();
  });

  test('should get available models', () => {
    const models = ner.getAvailableModels();
    expect(models).toBeDefined();
    expect(Object.keys(models)).toHaveLength(4);
    expect(models.biomedical_ner).toBeDefined();
    expect(models.clinical_ner).toBeDefined();
    expect(models.disease_ner).toBeDefined();
    expect(models.drug_ner).toBeDefined();
  });

  test('should get model information', () => {
    const modelInfo = ner.getModelInfo('biomedical_ner');
    expect(modelInfo).toBeDefined();
    expect(modelInfo.name).toBe('d4data/biomedical-ner-all');
    expect(modelInfo.type).toBe('token-classification');

    const nonExistent = ner.getModelInfo('non-existent');
    expect(nonExistent).toBeNull();
  });

  test('should get system statistics', () => {
    const stats = ner.getStatistics();
    expect(stats).toBeDefined();
    expect(stats.defaultModel).toBe('d4data/biomedical-ner-all');
    expect(stats.availableModels).toBe(4);
    expect(stats.modelTypes).toContain('token-classification');
  });

  test('should handle missing API key', async () => {
    await expect(ner.extractEntities('test text'))
      .rejects
      .toThrow('HuggingFace API key not configured');
  });

  test('should handle missing text', async () => {
    // Mock the HuggingFace client to avoid API calls
    ner.hf = { tokenClassification: jest.fn() };

    await expect(ner.extractEntities(''))
      .rejects
      .toThrow('Text is required for entity extraction');

    await expect(ner.extractEntities(null))
      .rejects
      .toThrow('Text is required for entity extraction');
  });

  test('should handle non-existent model', async () => {
    // Mock the HuggingFace client to avoid API calls
    ner.hf = { tokenClassification: jest.fn() };

    await expect(ner.extractEntities('test text', 'non-existent-model'))
      .rejects
      .toThrow('Model non-existent-model not found');
  });

  test('should handle batch extraction errors', async () => {
    await expect(ner.batchExtractEntities('not-an-array'))
      .rejects
      .toThrow('Texts must be a non-empty array');

    await expect(ner.batchExtractEntities([]))
      .rejects
      .toThrow('Texts must be a non-empty array');
  });

  test('should extract medical conditions', async () => {
    // Mock the HuggingFace client to avoid API calls
    ner.hf = {
      tokenClassification: jest.fn().mockResolvedValue([
        { entity: 'B-Disease', word: 'diabetes', score: 0.98, start: 10, end: 18 }
      ])
    };

    const result = await ner.extractMedicalConditions('Patient has diabetes and hypertension.');
    expect(result).toBeDefined();
    expect(result.model).toBe('prajjwal1/bert-medium-disease');
    expect(result.entities).toHaveLength(1);
  });

  test('should extract medications', async () => {
    // Mock the HuggingFace client to avoid API calls
    ner.hf = {
      tokenClassification: jest.fn().mockResolvedValue([
        { entity: 'B-Drug', word: 'metformin', score: 0.95, start: 25, end: 34 }
      ])
    };

    const result = await ner.extractMedications('Patient prescribed metformin twice daily.');
    expect(result).toBeDefined();
    expect(result.model).toBe('dslim/bert-base-NER');
  });

  test('should extract clinical entities', async () => {
    // Mock the HuggingFace client to avoid API calls
    ner.hf = {
      tokenClassification: jest.fn().mockResolvedValue([
        { entity: 'B-Problem', word: 'hypertension', score: 0.92, start: 15, end: 26 }
      ])
    };

    const result = await ner.extractClinicalEntities('Diagnosis: hypertension with medication review.');
    expect(result).toBeDefined();
    expect(result.model).toBe('Clinical-AI-AI/clinical-ner');
  });

  test('should batch extract entities', async () => {
    // Mock the HuggingFace client to avoid API calls
    ner.hf = {
      tokenClassification: jest.fn()
        .mockResolvedValueOnce([
          { entity: 'B-Disease', word: 'diabetes', score: 0.98 }
        ])
        .mockResolvedValueOnce([
          { entity: 'B-Drug', word: 'metformin', score: 0.95 }
        ])
    };

    const texts = [
      'Patient has diabetes.',
      'Prescribed metformin.'
    ];

    const result = await ner.batchExtractEntities(texts, 'biomedical_ner');
    expect(result).toBeDefined();
    expect(result.total).toBe(2);
    expect(result.successful).toBe(2);
    expect(result.failed).toBe(0);
    expect(result.results).toHaveLength(2);
  });

  test('should filter entities by type', () => {
    const entities = [
      { entity: 'B-Disease', word: 'diabetes', score: 0.98 },
      { entity: 'B-Drug', word: 'metformin', score: 0.95 },
      { entity: 'B-Symptom', word: 'fatigue', score: 0.92 }
    ];

    const diseases = ner.filterEntitiesByType(entities, 'B-Disease');
    expect(diseases).toHaveLength(1);
    expect(diseases[0].word).toBe('diabetes');

    const multiple = ner.filterEntitiesByType(entities, ['B-Disease', 'B-Symptom']);
    expect(multiple).toHaveLength(2);
  });

  test('should get entity statistics', () => {
    const entities = [
      { entity: 'B-Disease', word: 'diabetes', score: 0.98 },
      { entity: 'B-Drug', word: 'metformin', score: 0.95 },
      { entity: 'B-Disease', word: 'hypertension', score: 0.92 },
      { entity: 'B-Symptom', word: 'fatigue', score: 0.89 }
    ];

    const stats = ner.getEntityStatistics(entities);
    expect(stats).toBeDefined();
    expect(stats['B-Disease']).toBe(2);
    expect(stats['B-Drug']).toBe(1);
    expect(stats['B-Symptom']).toBe(1);
  });

  test('should extract unique entity types', () => {
    const entities = [
      { entity: 'B-Disease', word: 'diabetes' },
      { entity: 'B-Drug', word: 'metformin' },
      { entity: 'B-Disease', word: 'hypertension' },
      { entity: 'B-Symptom', word: 'fatigue' }
    ];

    const uniqueTypes = ner.extractUniqueEntityTypes(entities);
    expect(uniqueTypes).toHaveLength(3);
    expect(uniqueTypes).toContain('B-Disease');
    expect(uniqueTypes).toContain('B-Drug');
    expect(uniqueTypes).toContain('B-Symptom');
  });
});