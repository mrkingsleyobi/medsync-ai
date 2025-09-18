// MediSync Healthcare AI Platform - Neural Mesh Integration Tests
// This file contains integration tests for the neural mesh implementation

const SynapticNeuralMesh = require('./mesh.js');
const neuralMeshConfig = require('./config/mesh.config.js');

describe('Synaptic Neural Mesh Integration Tests', () => {
  let neuralMesh;

  beforeEach(async () => {
    neuralMesh = new SynapticNeuralMesh(neuralMeshConfig);
    await neuralMesh.initialize();
  });

  afterEach(async () => {
    if (neuralMesh) {
      await neuralMesh.shutdown();
    }
  });

  test('should initialize the neural mesh successfully', () => {
    expect(neuralMesh.isInitialized).toBe(true);
    expect(neuralMesh.meshId).toBe(neuralMeshConfig.meshId);
    expect(neuralMesh.nodeManager).toBeDefined();
    expect(neuralMesh.distributedProcessor).toBeDefined();
    expect(neuralMesh.protocolManager).toBeDefined();
    expect(neuralMesh.modelIntegrationManager).toBeDefined();
  });

  test('should deploy specialized nodes during initialization', () => {
    const nodes = neuralMesh.nodeManager.listNodes();
    expect(nodes.length).toBeGreaterThan(0);

    // Check that we have at least one of each specialized node type based on config
    const nodeTypes = nodes.map(nodeId => {
      const node = neuralMesh.nodeManager.getNode(nodeId);
      return node.type;
    });

    // Based on the config, we should have specialized nodes
    expect(nodeTypes).toContain('specialized');
  });

  test('should register and deploy medical AI models', async () => {
    // Register a medical imaging model
    const modelId = 'medical-imaging-model-001';
    const modelConfig = {
      type: 'medical-imaging',
      capabilities: ['image-analysis', 'radiology'],
      accuracy: 0.95,
      version: '1.0.0'
    };

    const result = await neuralMesh.registerModel(modelId, modelConfig);
    expect(result).toBe(true);

    // Check that the model is registered
    const modelInfo = neuralMesh.getModelInfo(modelId);
    expect(modelInfo).toBeDefined();
    expect(modelInfo.id).toBe(modelId);
    expect(modelInfo.type).toBe('medical-imaging');
    expect(modelInfo.capabilities).toEqual(['image-analysis', 'radiology']);
    expect(modelInfo.status).toBe('registered');
  });

  test('should perform inference with registered models', async () => {
    // Register a model first
    const modelId = 'clinical-nlp-model-001';
    const modelConfig = {
      type: 'clinical-nlp',
      capabilities: ['text-classification', 'entity-extraction'],
      accuracy: 0.92,
      version: '1.0.0'
    };

    await neuralMesh.registerModel(modelId, modelConfig);

    // Perform inference
    const inputData = {
      text: 'Patient presents with chronic pain and requires medication management',
      language: 'en'
    };

    const result = await neuralMesh.performInference(modelId, inputData);
    expect(result).toBeDefined();
    expect(result.type).toBe('nlp-analysis');
    expect(result.entities).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  test('should process distributed tasks across the mesh', async () => {
    const taskId = 'task-001';
    const taskData = {
      type: 'medical-data-processing',
      patientId: 'patient-123',
      data: {
        vitalSigns: { heartRate: 72, bloodPressure: '120/80' },
        symptoms: ['headache', 'fatigue']
      }
    };

    const result = await neuralMesh.processTask(taskId, taskData);
    expect(result).toBeDefined();
    expect(result.combined).toBe(true);
    expect(result.results).toBeDefined();
    expect(result.summary).toBeDefined();
  });

  test('should provide mesh status information', () => {
    const status = neuralMesh.getStatus();
    expect(status).toBeDefined();
    expect(status.meshId).toBe(neuralMeshConfig.meshId);
    expect(status.isInitialized).toBe(true);
    expect(status.nodeCount).toBeGreaterThan(0);
    expect(status.nodes).toBeDefined();
    expect(status.config).toBeDefined();
    expect(status.nodeStatus).toBeDefined();
    expect(status.connectionStatus).toBeDefined();
  });
});