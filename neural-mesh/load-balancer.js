// MediSync Healthcare AI Platform - Load Balancer
// This file implements load balancing for AI inference across the neural mesh

const winston = require('winston');

/**
 * Load Balancer Class
 * Implements load balancing strategies for distributing AI inference tasks
 */
class LoadBalancer {
  /**
   * Create a new Load Balancer
   * @param {Object} neuralMesh - Reference to the neural mesh
   * @param {Object} config - Load balancing configuration
   */
  constructor(neuralMesh, config) {
    this.neuralMesh = neuralMesh;
    this.config = config;
    this.logger = this._createLogger();
    this.nodeWeights = new Map();
    this.nodeHealth = new Map();
    this.requestCounts = new Map();
    this.lastSelectedIndex = new Map();

    // Initialize node weights from config
    this._initializeNodeWeights();

    this.logger.info('Load Balancer created', {
      service: 'load-balancer',
      strategy: config.strategy
    });
  }

  /**
   * Create logger instance
   * @returns {Object} Winston logger instance
   */
  _createLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'load-balancer' },
      transports: [
        new winston.transports.File({ filename: 'logs/load-balancer-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/load-balancer-combined.log' })
      ]
    });
  }

  /**
   * Initialize node weights from configuration
   * @private
   */
  _initializeNodeWeights() {
    const nodeWeightConfig = this.config.nodeWeight || {};
    for (const [nodeType, weight] of Object.entries(nodeWeightConfig)) {
      this.nodeWeights.set(nodeType, weight);
    }

    this.logger.info('Node weights initialized', {
      weights: Object.fromEntries(this.nodeWeights)
    });
  }

  /**
   * Select the best node for a task based on load balancing strategy
   * @param {Array} candidateNodes - Array of candidate node IDs
   * @param {Object} taskRequirements - Requirements for the task
   * @returns {string|null} Selected node ID or null if no suitable node found
   */
  selectNode(candidateNodes, taskRequirements = {}) {
    if (!candidateNodes || candidateNodes.length === 0) {
      return null;
    }

    // Filter out unhealthy nodes
    const healthyNodes = candidateNodes.filter(nodeId => this._isNodeHealthy(nodeId));

    if (healthyNodes.length === 0) {
      this.logger.warn('No healthy nodes available for task', {
        candidateNodeCount: candidateNodes.length,
        taskRequirements
      });
      return null;
    }

    // Apply load balancing strategy
    switch (this.config.strategy) {
      case 'round-robin':
        return this._selectRoundRobin(healthyNodes);
      case 'weighted-round-robin':
        return this._selectWeightedRoundRobin(healthyNodes, taskRequirements);
      case 'least-connections':
        return this._selectLeastConnections(healthyNodes);
      case 'performance-based':
        return this._selectPerformanceBased(healthyNodes, taskRequirements);
      default:
        // Default to simple round-robin
        return this._selectRoundRobin(healthyNodes);
    }
  }

  /**
   * Select node using round-robin strategy
   * @param {Array} nodes - Array of node IDs
   * @returns {string} Selected node ID
   * @private
   */
  _selectRoundRobin(nodes) {
    // Simple round-robin selection
    const key = nodes.join(',');
    const lastIndex = this.lastSelectedIndex.get(key) || 0;
    const selectedIndex = (lastIndex + 1) % nodes.length;
    const selectedNode = nodes[selectedIndex];

    // Store last selected index for next round
    this.lastSelectedIndex.set(key, selectedIndex);

    this.logger.info('Node selected using round-robin', {
      selectedNode,
      selectedIndex
    });

    return selectedNode;
  }

  /**
   * Select node using weighted round-robin strategy
   * @param {Array} nodes - Array of node IDs
   * @param {Object} taskRequirements - Requirements for the task
   * @returns {string} Selected node ID
   * @private
   */
  _selectWeightedRoundRobin(nodes, taskRequirements) {
    // Get node weights based on capabilities
    const weightedNodes = nodes.map(nodeId => {
      const node = this.neuralMesh.nodeManager.getNode(nodeId);
      if (!node) return { nodeId, weight: 1 };

      // Calculate weight based on node type and capabilities
      let weight = this.nodeWeights.get(node.type) || 1;

      // Increase weight if node has specific capabilities required by task
      if (taskRequirements.requiredCapabilities) {
        const matchingCapabilities = taskRequirements.requiredCapabilities.filter(cap =>
          node.capabilities.includes(cap)
        ).length;
        weight += matchingCapabilities;
      }

      return { nodeId, weight };
    });

    // Weighted selection
    const totalWeight = weightedNodes.reduce((sum, node) => sum + node.weight, 0);
    let random = Math.random() * totalWeight;

    for (const node of weightedNodes) {
      random -= node.weight;
      if (random <= 0) {
        this.logger.info('Node selected using weighted round-robin', {
          selectedNode: node.nodeId,
          weight: node.weight,
          totalWeight
        });
        return node.nodeId;
      }
    }

    // Fallback to first node
    return nodes[0];
  }

  /**
   * Select node with least connections
   * @param {Array} nodes - Array of node IDs
   * @returns {string} Selected node ID
   * @private
   */
  _selectLeastConnections(nodes) {
    // Get node with least requests
    let minRequests = Infinity;
    let selectedNode = null;

    for (const nodeId of nodes) {
      const requestCount = this.requestCounts.get(nodeId) || 0;
      if (requestCount < minRequests) {
        minRequests = requestCount;
        selectedNode = nodeId;
      }
    }

    // Increment request count for selected node
    const currentCount = this.requestCounts.get(selectedNode) || 0;
    this.requestCounts.set(selectedNode, currentCount + 1);

    this.logger.info('Node selected using least connections', {
      selectedNode,
      requestCount: minRequests
    });

    return selectedNode;
  }

  /**
   * Select node based on performance metrics
   * @param {Array} nodes - Array of node IDs
   * @param {Object} taskRequirements - Requirements for the task
   * @returns {string} Selected node ID
   * @private
   */
  _selectPerformanceBased(nodes, taskRequirements) {
    // Select node with best performance metrics
    let bestScore = -Infinity;
    let selectedNode = null;

    for (const nodeId of nodes) {
      const node = this.neuralMesh.nodeManager.getNode(nodeId);
      if (!node) continue;

      // Calculate performance score based on various factors
      let score = 0;

      // Factor 1: Node weight (based on type)
      const weight = this.nodeWeights.get(node.type) || 1;
      score += weight * 10;

      // Factor 2: Request count (fewer is better)
      const requestCount = this.requestCounts.get(nodeId) || 0;
      score -= requestCount;

      // Factor 3: Capabilities match
      if (taskRequirements.requiredCapabilities) {
        const matchingCapabilities = taskRequirements.requiredCapabilities.filter(cap =>
          node.capabilities.includes(cap)
        ).length;
        score += matchingCapabilities * 5;
      }

      // Factor 4: Health status
      if (this._isNodeHealthy(nodeId)) {
        score += 20;
      }

      if (score > bestScore) {
        bestScore = score;
        selectedNode = nodeId;
      }
    }

    // Increment request count for selected node
    if (selectedNode) {
      const currentCount = this.requestCounts.get(selectedNode) || 0;
      this.requestCounts.set(selectedNode, currentCount + 1);
    }

    this.logger.info('Node selected using performance-based strategy', {
      selectedNode,
      score: bestScore
    });

    return selectedNode;
  }

  /**
   * Check if a node is healthy
   * @param {string} nodeId - Node ID to check
   * @returns {boolean} True if node is healthy
   * @private
   */
  _isNodeHealthy(nodeId) {
    const node = this.neuralMesh.nodeManager.getNode(nodeId);
    if (!node) return false;

    // Check node status
    if (node.status !== 'active') {
      return false;
    }

    // Check health status if available
    const healthStatus = this.nodeHealth.get(nodeId);
    if (healthStatus && !healthStatus.healthy) {
      return false;
    }

    return true;
  }

  /**
   * Update node health status
   * @param {string} nodeId - Node ID
   * @param {Object} healthInfo - Health information
   */
  updateNodeHealth(nodeId, healthInfo) {
    this.nodeHealth.set(nodeId, healthInfo);
    this.logger.info('Node health updated', {
      nodeId,
      healthInfo
    });
  }

  /**
   * Get load balancing statistics
   * @returns {Object} Load balancing statistics
   */
  getStatistics() {
    return {
      strategy: this.config.strategy,
      nodeWeights: Object.fromEntries(this.nodeWeights),
      nodeHealth: Object.fromEntries(this.nodeHealth),
      requestCounts: Object.fromEntries(this.requestCounts)
    };
  }

  /**
   * Reset load balancer statistics
   */
  resetStatistics() {
    this.requestCounts.clear();
    this.lastSelectedIndex.clear();
    this.logger.info('Load balancer statistics reset');
  }
}

module.exports = LoadBalancer;