// MediSync Healthcare AI Platform - Synaptic Neural Mesh Tests
// This file contains basic tests for the neural mesh implementation

const SynapticNeuralMesh = require('./mesh.js');

describe('Synaptic Neural Mesh', () => {
  let neuralMesh;

  beforeEach(() => {
    neuralMesh = new SynapticNeuralMesh();
  });

  describe('Initialization', () => {
    it('should create a new neural mesh instance', () => {
      expect(neuralMesh).toBeDefined();
      expect(neuralMesh.meshId).toBe('medisync-neural-mesh-v1');
      expect(neuralMesh.isInitialized).toBe(false);
    });

    it('should initialize the neural mesh successfully', async () => {
      const result = await neuralMesh.initialize();
      expect(result).toBe(true);
      expect(neuralMesh.isInitialized).toBe(true);
    });
  });

  describe('Node Management', () => {
    beforeEach(async () => {
      await neuralMesh.initialize();
    });

    it('should deploy a new node successfully', async () => {
      const nodeConfig = {
        type: 'worker',
        capabilities: ['ai-inference']
      };

      const result = await neuralMesh.deployNode('test-node-1', nodeConfig);
      expect(result).toBe(true);
      expect(neuralMesh.nodeManager.listNodes().length).toBe(4); // 3 default nodes + 1 new node
    });

    it('should fail to deploy a node if mesh is not initialized', async () => {
      const unitializedMesh = new SynapticNeuralMesh();
      const nodeConfig = {
        type: 'worker',
        capabilities: ['ai-inference']
      };

      await expect(unitializedMesh.deployNode('test-node-2', nodeConfig))
        .rejects
        .toThrow('Neural mesh not initialized');
    });
  });

  describe('Status', () => {
    it('should return correct status information', async () => {
      await neuralMesh.initialize();

      const status = neuralMesh.getStatus();
      expect(status.meshId).toBe('medisync-neural-mesh-v1');
      expect(status.isInitialized).toBe(true);
      expect(status.nodeCount).toBe(3); // 3 specialized nodes are deployed by default
      expect(status.config).toBeDefined();
    });
  });

  describe('Shutdown', () => {
    it('should shutdown the neural mesh successfully', async () => {
      await neuralMesh.initialize();

      const result = await neuralMesh.shutdown();
      expect(result).toBe(true);
      expect(neuralMesh.isInitialized).toBe(false);
    });
  });
});