// MediSync Healthcare AI Platform - Medical Imaging Agent Tests
// This file contains tests for the Medical Imaging agent

const MedicalImagingAgent = require('./medical-imaging-agent.js');

describe('MedicalImagingAgent', () => {
  let imagingAgent;

  beforeEach(() => {
    imagingAgent = new MedicalImagingAgent({
      agentId: 'test-imaging-agent',
      supportedModalities: ['x-ray', 'mri']
    });
  });

  test('should initialize with correct configuration', () => {
    expect(imagingAgent.config.agentId).toBe('test-imaging-agent');
    expect(imagingAgent.config.type).toBe('medical-imaging');
    expect(imagingAgent.supportedModalities).toEqual(['x-ray', 'mri']);
  });

  test('should initialize successfully', async () => {
    const result = await imagingAgent.initialize();
    expect(result).toBe(true);
    expect(imagingAgent.status).toBe('active');
  });

  test('should process valid imaging task', async () => {
    await imagingAgent.initialize();

    const task = {
      id: 'task-001',
      type: 'imaging-analysis',
      data: {
        imageType: 'x-ray',
        imageSize: '1024x768'
      },
      timestamp: new Date().toISOString()
    };

    const result = await imagingAgent.processTask(task);

    expect(result.taskId).toBe('task-001');
    expect(result.agentId).toBe('test-imaging-agent');
    expect(result.status).toBe('completed');
    expect(result.result.type).toBe('imaging-analysis');
    expect(result.result.imageType).toBe('x-ray');
    expect(result.result.findings).toBeDefined();
    expect(result.result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.result.confidence).toBeLessThanOrEqual(1.0);
  });

  test('should reject invalid imaging task', async () => {
    await imagingAgent.initialize();

    const task = {
      id: 'task-002',
      type: 'imaging-analysis',
      data: {
        imageType: 'invalid-type'
      },
      timestamp: new Date().toISOString()
    };

    await expect(imagingAgent.processTask(task)).rejects.toThrow('Unsupported image type');
  });

  test('should reject task with missing data', async () => {
    await imagingAgent.initialize();

    const task = {
      id: 'task-003',
      type: 'imaging-analysis',
      data: {},
      timestamp: new Date().toISOString()
    };

    await expect(imagingAgent.processTask(task)).rejects.toThrow('Invalid imaging task');
  });

  test('should load and track models', async () => {
    await imagingAgent.initialize();

    const modelConfig = {
      type: 'cnn',
      version: '1.0.0',
      accuracy: 0.95
    };

    const result = await imagingAgent.loadModel('model-001', modelConfig);
    expect(result).toBe(true);

    const loadedModels = imagingAgent.getLoadedModels();
    expect(loadedModels.length).toBe(1);
    expect(loadedModels[0].id).toBe('model-001');
    expect(loadedModels[0].type).toBe('cnn');
    expect(loadedModels[0].version).toBe('1.0.0');
  });

  test('should provide status information', async () => {
    await imagingAgent.initialize();

    const status = imagingAgent.getStatus();
    expect(status.agentId).toBe('test-imaging-agent');
    expect(status.type).toBe('medical-imaging');
    expect(status.status).toBe('active');
    expect(status.capabilities).toEqual(['image-analysis', 'radiology-ai', 'pattern-recognition']);
    expect(status.metrics).toBeDefined();
  });

  test('should shutdown successfully', async () => {
    await imagingAgent.initialize();

    const result = await imagingAgent.shutdown();
    expect(result).toBe(true);
    expect(imagingAgent.status).toBe('shutdown');
  });
});