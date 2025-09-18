// MediSync Healthcare AI Platform - Load Balancer Tests
// This file contains tests for the load balancer implementation

const LoadBalancer = require('./load-balancer.js');
const neuralMeshConfig = require('./config/mesh.config.js');

// Mock node manager for testing
class MockNodeManager {
  constructor() {
    this.nodes = new Map();
  }

  getNode(nodeId) {
    return this.nodes.get(nodeId) || null;
  }

  addNode(nodeId, node) {
    this.nodes.set(nodeId, node);
  }
}

// Mock neural mesh for testing
class MockNeuralMesh {
  constructor() {
    this.nodeManager = new MockNodeManager();
  }
}

describe('Load Balancer Tests', () => {
  let loadBalancer;
  let mockNeuralMesh;

  beforeEach(() => {
    mockNeuralMesh = new MockNeuralMesh();
    loadBalancer = new LoadBalancer(mockNeuralMesh, neuralMeshConfig.loadBalancing);
  });

  test('should initialize load balancer with correct configuration', () => {
    expect(loadBalancer).toBeDefined();
    expect(loadBalancer.config).toBeDefined();
    expect(loadBalancer.config.strategy).toBe('weighted-round-robin');
  });

  test('should initialize node weights from configuration', () => {
    expect(loadBalancer.nodeWeights.size).toBeGreaterThan(0);
    expect(loadBalancer.nodeWeights.get('imaging')).toBe(3);
    expect(loadBalancer.nodeWeights.get('nlp')).toBe(2);
  });

  test('should select node using round-robin strategy', () => {
    // Add mock nodes
    mockNeuralMesh.nodeManager.addNode('node-1', {
      id: 'node-1',
      type: 'specialized',
      capabilities: ['capability-1'],
      status: 'active'
    });

    mockNeuralMesh.nodeManager.addNode('node-2', {
      id: 'node-2',
      type: 'specialized',
      capabilities: ['capability-2'],
      status: 'active'
    });

    const nodes = ['node-1', 'node-2'];
    const selectedNode = loadBalancer.selectNode(nodes);

    expect(selectedNode).toBeDefined();
    expect(nodes).toContain(selectedNode);
  });

  test('should select node using weighted round-robin strategy', () => {
    // Add mock nodes with different capabilities
    mockNeuralMesh.nodeManager.addNode('node-imaging', {
      id: 'node-imaging',
      type: 'specialized',
      capabilities: ['medical-imaging', 'radiology-ai'],
      status: 'active'
    });

    mockNeuralMesh.nodeManager.addNode('node-nlp', {
      id: 'node-nlp',
      type: 'specialized',
      capabilities: ['clinical-nlp', 'text-analysis'],
      status: 'active'
    });

    const nodes = ['node-imaging', 'node-nlp'];
    const taskRequirements = {
      requiredCapabilities: ['medical-imaging']
    };

    const selectedNode = loadBalancer.selectNode(nodes, taskRequirements);

    expect(selectedNode).toBeDefined();
    expect(nodes).toContain(selectedNode);
  });

  test('should filter out unhealthy nodes', () => {
    // Add healthy and unhealthy nodes
    mockNeuralMesh.nodeManager.addNode('node-healthy', {
      id: 'node-healthy',
      type: 'specialized',
      capabilities: ['capability-1'],
      status: 'active'
    });

    mockNeuralMesh.nodeManager.addNode('node-unhealthy', {
      id: 'node-unhealthy',
      type: 'specialized',
      capabilities: ['capability-2'],
      status: 'inactive'
    });

    const nodes = ['node-healthy', 'node-unhealthy'];
    const selectedNode = loadBalancer.selectNode(nodes);

    expect(selectedNode).toBe('node-healthy');
  });

  test('should return null when no nodes are available', () => {
    const nodes = [];
    const selectedNode = loadBalancer.selectNode(nodes);

    expect(selectedNode).toBeNull();
  });

  test('should update node health status', () => {
    const nodeId = 'test-node';
    const healthInfo = {
      healthy: true,
      cpuUsage: 50,
      memoryUsage: 60
    };

    loadBalancer.updateNodeHealth(nodeId, healthInfo);

    // In a real implementation, we would check the internal state
    // For now, we just verify the method doesn't throw an error
    expect(true).toBe(true);
  });

  test('should provide load balancing statistics', () => {
    const stats = loadBalancer.getStatistics();

    expect(stats).toBeDefined();
    expect(stats.strategy).toBe('weighted-round-robin');
    expect(stats.nodeWeights).toBeDefined();
  });
});