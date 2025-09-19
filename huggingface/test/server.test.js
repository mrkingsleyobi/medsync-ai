// MediSync Healthcare AI Platform - HuggingFace Server Tests
// Test suite for HuggingFace model serving

const request = require('supertest');
const app = require('../src/server');

describe('HuggingFace Model Server', () => {
  test('should return server info on root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('MediSync HuggingFace Model Serving API');
    expect(response.body.version).toBe('1.0.0');
    expect(response.body.status).toBe('running');
  });

  test('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.uptime).toBeDefined();
    expect(response.body.timestamp).toBeDefined();
  });

  test('should return list of models', async () => {
    const response = await request(app).get('/models');
    expect(response.status).toBe(200);
    expect(response.body.models).toBeDefined();
    expect(Array.isArray(response.body.models)).toBe(true);
    expect(response.body.models.length).toBeGreaterThan(0);
  });

  test('should return specific model info', async () => {
    const response = await request(app).get('/models/medical-bert');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe('medical-bert');
    expect(response.body.name).toBe('emilyalsentzer/Bio_ClinicalBERT');
    expect(response.body.type).toBe('text-classification');
  });

  test('should return 404 for non-existent model', async () => {
    const response = await request(app).get('/models/non-existent-model');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Model not found');
  });

  test('should handle text classification', async () => {
    const response = await request(app)
      .post('/models/medical-bert/classify')
      .send({ text: 'Patient has diabetes and is prescribed metformin.' });

    expect(response.status).toBe(200);
    expect(response.body.model).toBe('emilyalsentzer/Bio_ClinicalBERT');
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.results)).toBe(true);
  });

  test('should handle named entity recognition', async () => {
    const response = await request(app)
      .post('/models/clinical-ner/ner')
      .send({ text: 'Patient has diabetes and is prescribed metformin.' });

    expect(response.status).toBe(200);
    expect(response.body.model).toBe('d4data/biomedical-ner-all');
    expect(response.body.entities).toBeDefined();
    expect(Array.isArray(response.body.entities)).toBe(true);
  });

  test('should handle question answering', async () => {
    const response = await request(app)
      .post('/models/medical-qa/qa')
      .send({
        question: 'What medication should the patient take?',
        context: 'The patient has been diagnosed with diabetes. The doctor prescribed metformin twice daily.'
      });

    expect(response.status).toBe(200);
    expect(response.body.model).toBe('deepset/medical_bert-base-squad2');
    expect(response.body.answer).toBeDefined();
    expect(response.body.answer.answer).toBeDefined();
  });

  test('should return 400 for missing text in classification', async () => {
    const response = await request(app)
      .post('/models/medical-bert/classify')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Text is required');
  });

  test('should return 400 for missing question/context in QA', async () => {
    const response = await request(app)
      .post('/models/medical-qa/qa')
      .send({ question: 'What medication?' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Question and context are required');
  });
});