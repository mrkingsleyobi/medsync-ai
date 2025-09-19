// MediSync Healthcare AI Platform - HuggingFace Model Serving
// Express server for HuggingFace model serving

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory model registry (simulated)
const modelRegistry = new Map();

// Register some sample models
modelRegistry.set('medical-bert', {
  name: 'emilyalsentzer/Bio_ClinicalBERT',
  type: 'text-classification',
  domain: 'medical',
  description: 'Clinical BERT for medical text classification',
  version: '1.0.0',
  status: 'loaded'
});

modelRegistry.set('clinical-ner', {
  name: 'd4data/biomedical-ner-all',
  type: 'token-classification',
  domain: 'medical',
  description: 'Biomedical NER for medical entities',
  version: '1.0.0',
  status: 'loaded'
});

modelRegistry.set('medical-qa', {
  name: 'deepset/medical_bert-base-squad2',
  type: 'question-answering',
  domain: 'medical-qa',
  description: 'Medical question answering',
  version: '1.0.0',
  status: 'loaded'
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'MediSync HuggingFace Model Serving API',
    version: '1.0.0',
    status: 'running'
  });
});

// Get all registered models
app.get('/models', (req, res) => {
  const models = Array.from(modelRegistry.entries()).map(([id, model]) => ({
    id,
    ...model
  }));
  res.json({ models });
});

// Get specific model
app.get('/models/:modelId', (req, res) => {
  const model = modelRegistry.get(req.params.modelId);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }
  res.json({ id: req.params.modelId, ...model });
});

// Text classification endpoint
app.post('/models/:modelId/classify', (req, res) => {
  const model = modelRegistry.get(req.params.modelId);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Simulate classification result
  const result = [
    { label: 'medical_diagnosis', score: 0.95 },
    { label: 'treatment_recommendation', score: 0.87 },
    { label: 'medication_prescription', score: 0.78 }
  ];

  res.json({
    model: model.name,
    input: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
    results: result
  });
});

// Named entity recognition endpoint
app.post('/models/:modelId/ner', (req, res) => {
  const model = modelRegistry.get(req.params.modelId);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Simulate NER result
  const result = [
    { entity: 'B-Disease', word: 'diabetes', score: 0.98, start: 10, end: 18 },
    { entity: 'B-Drug', word: 'metformin', score: 0.95, start: 25, end: 34 },
    { entity: 'B-Symptom', word: 'fatigue', score: 0.92, start: 45, end: 52 }
  ];

  res.json({
    model: model.name,
    input: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
    entities: result
  });
});

// Question answering endpoint
app.post('/models/:modelId/qa', (req, res) => {
  const model = modelRegistry.get(req.params.modelId);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }

  const { question, context } = req.body;
  if (!question || !context) {
    return res.status(400).json({ error: 'Question and context are required' });
  }

  // Simulate QA result
  const result = {
    answer: 'The patient should take metformin twice daily with meals.',
    score: 0.95,
    start: 45,
    end: 85
  };

  res.json({
    model: model.name,
    question: question,
    context: context.substring(0, 100) + (context.length > 100 ? '...' : ''),
    answer: result
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HuggingFace Model Server running on port ${PORT}`);
  console.log(`📋 Available models: ${Array.from(modelRegistry.keys()).join(', ')}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/docs`);
});

module.exports = app;