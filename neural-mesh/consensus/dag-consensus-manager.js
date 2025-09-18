// MediSync Healthcare AI Platform - DAG-based Consensus Manager
// This file implements a Directed Acyclic Graph (DAG) based consensus mechanism for distributed decision making

const winston = require('winston');
const crypto = require('crypto');

/**
 * DAG-based Consensus Manager Class
 * Implements a consensus mechanism using Directed Acyclic Graph for distributed decision making
 */
class DAGConsensusManager {
  /**
   * Create a new DAG Consensus Manager
   * @param {Object} config - Consensus configuration
   */
  constructor(config = {}) {
    this.config = {
      confirmationThreshold: config.confirmationThreshold || 0.67, // 2/3 consensus
      maxDepth: config.maxDepth || 100,
      byzantineTolerance: config.byzantineTolerance || true,
      ...config
    };

    // DAG structure to store nodes and their relationships
    this.dag = new Map(); // nodeId -> { data, parents, children, votes, timestamp }
    this.tips = new Set(); // Current tips (nodes with no children)
    this.genesisNodeId = null;

    // Voting and consensus tracking
    this.votes = new Map(); // nodeId -> Map of voterId -> vote
    this.confirmations = new Map(); // nodeId -> confirmation status

    this.logger = this._createLogger();

    // Initialize the DAG with a genesis node
    this._initializeDAG();

    this.logger.info('DAG Consensus Manager created', {
      service: 'dag-consensus-manager',
      confirmationThreshold: this.config.confirmationThreshold
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
      defaultMeta: { service: 'dag-consensus-manager' },
      transports: [
        new winston.transports.File({ filename: 'logs/dag-consensus-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/dag-consensus-combined.log' })
      ]
    });
  }

  /**
   * Initialize the DAG with a genesis node
   * @private
   */
  _initializeDAG() {
    const genesisData = {
      type: 'genesis',
      timestamp: Date.now(),
      creator: 'system'
    };

    this.genesisNodeId = this._createNodeId(genesisData);
    this.dag.set(this.genesisNodeId, {
      id: this.genesisNodeId,
      data: genesisData,
      parents: [],
      children: [],
      votes: new Map(),
      timestamp: genesisData.timestamp,
      confirmed: true
    });

    this.tips.add(this.genesisNodeId);
    this.confirmations.set(this.genesisNodeId, true);

    this.logger.info('DAG initialized with genesis node', {
      genesisNodeId: this.genesisNodeId
    });
  }

  /**
   * Create a unique node ID based on data
   * @param {Object} data - Node data
   * @returns {string} Unique node ID
   * @private
   */
  _createNodeId(data) {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data) + Date.now() + Math.random());
    return hash.digest('hex').substring(0, 32);
  }

  /**
   * Add a new node to the DAG
   * @param {Object} data - Node data
   * @param {Array} parentIds - Parent node IDs (optional, will select tips if not provided)
   * @returns {string} New node ID
   */
  addNode(data, parentIds = null) {
    try {
      // If no parents specified, select from current tips
      if (!parentIds || parentIds.length === 0) {
        parentIds = this._selectParents();
      }

      const nodeId = this._createNodeId(data);
      const timestamp = Date.now();

      // Create the new node
      const node = {
        id: nodeId,
        data: data,
        parents: parentIds,
        children: [],
        votes: new Map(),
        timestamp: timestamp,
        confirmed: false
      };

      // Add to DAG
      this.dag.set(nodeId, node);

      // Update parent-child relationships
      for (const parentId of parentIds) {
        const parent = this.dag.get(parentId);
        if (parent) {
          parent.children.push(nodeId);
          // Remove parent from tips if it now has children
          this.tips.delete(parentId);
        }
      }

      // Add to tips
      this.tips.add(nodeId);

      this.logger.info('Node added to DAG', {
        nodeId: nodeId,
        parentCount: parentIds.length,
        tipCount: this.tips.size
      });

      // Check for consensus on this node
      setImmediate(() => this._checkConsensus(nodeId));

      return nodeId;
    } catch (error) {
      this.logger.error('Failed to add node to DAG', {
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Select parent nodes for a new node
   * @returns {Array} Selected parent node IDs
   * @private
   */
  _selectParents() {
    // Simple selection: take up to 2 tips randomly
    const tipsArray = Array.from(this.tips);
    const selected = [];

    // Always include the most recent tip
    if (tipsArray.length > 0) {
      selected.push(tipsArray[tipsArray.length - 1]);
    }

    // Add one more random tip if available
    if (tipsArray.length > 1) {
      const randomIndex = Math.floor(Math.random() * (tipsArray.length - 1));
      selected.push(tipsArray[randomIndex]);
    }

    return selected.length > 0 ? selected : [this.genesisNodeId];
  }

  /**
   * Cast a vote for a node
   * @param {string} nodeId - Node ID to vote on
   * @param {string} voterId - ID of the voter
   * @param {boolean} vote - Vote (true for approval, false for rejection)
   * @returns {boolean} True if vote was recorded
   */
  castVote(nodeId, voterId, vote) {
    try {
      const node = this.dag.get(nodeId);
      if (!node) {
        this.logger.warn('Attempted to vote on non-existent node', {
          nodeId: nodeId,
          voterId: voterId
        });
        return false;
      }

      // Record the vote
      node.votes.set(voterId, vote);

      this.logger.info('Vote cast for node', {
        nodeId: nodeId,
        voterId: voterId,
        vote: vote
      });

      // Check for consensus
      setImmediate(() => this._checkConsensus(nodeId));

      return true;
    } catch (error) {
      this.logger.error('Failed to cast vote', {
        nodeId: nodeId,
        voterId: voterId,
        error: error.message,
        stack: error.stack
      });

      return false;
    }
  }

  /**
   * Check if a node has reached consensus
   * @param {string} nodeId - Node ID to check
   * @private
   */
  _checkConsensus(nodeId) {
    const node = this.dag.get(nodeId);
    if (!node || node.confirmed) {
      return;
    }

    // Count votes
    let approveVotes = 0;
    let totalVotes = 0;

    for (const vote of node.votes.values()) {
      totalVotes++;
      if (vote) {
        approveVotes++;
      }
    }

    // Check if consensus threshold is met
    if (totalVotes > 0 && (approveVotes / totalVotes) >= this.config.confirmationThreshold) {
      node.confirmed = true;
      this.confirmations.set(nodeId, true);

      this.logger.info('Node confirmed through consensus', {
        nodeId: nodeId,
        approveVotes: approveVotes,
        totalVotes: totalVotes,
        consensusRatio: approveVotes / totalVotes
      });

      // Propagate confirmation to parents
      this._propagateConfirmation(nodeId);
    }
  }

  /**
   * Propagate confirmation to parent nodes
   * @param {string} nodeId - Node ID to propagate from
   * @private
   */
  _propagateConfirmation(nodeId) {
    const node = this.dag.get(nodeId);
    if (!node) return;

    // Confirm all parents recursively
    for (const parentId of node.parents) {
      const parent = this.dag.get(parentId);
      if (parent && !parent.confirmed) {
        parent.confirmed = true;
        this.confirmations.set(parentId, true);

        this.logger.info('Parent node confirmed through propagation', {
          nodeId: parentId,
          childNodeId: nodeId
        });

        // Continue propagation
        this._propagateConfirmation(parentId);
      }
    }
  }

  /**
   * Detect and handle Byzantine faults
   * @param {string} nodeId - Node ID to check
   * @returns {boolean} True if Byzantine fault detected
   */
  detectByzantineFault(nodeId) {
    if (!this.config.byzantineTolerance) {
      return false;
    }

    const node = this.dag.get(nodeId);
    if (!node) {
      return false;
    }

    // Simple Byzantine detection: check for conflicting votes
    let approveVotes = 0;
    let rejectVotes = 0;

    for (const vote of node.votes.values()) {
      if (vote) {
        approveVotes++;
      } else {
        rejectVotes++;
      }
    }

    // If both approve and reject votes are significant, potential Byzantine behavior
    const totalVotes = approveVotes + rejectVotes;
    const conflictThreshold = 0.3; // 30% conflict threshold

    if (totalVotes > 0 &&
        (approveVotes / totalVotes) > conflictThreshold &&
        (rejectVotes / totalVotes) > conflictThreshold) {

      this.logger.warn('Potential Byzantine fault detected', {
        nodeId: nodeId,
        approveVotes: approveVotes,
        rejectVotes: rejectVotes,
        totalVotes: totalVotes
      });

      return true;
    }

    return false;
  }

  /**
   * Get confirmed nodes
   * @returns {Array} Array of confirmed node IDs
   */
  getConfirmedNodes() {
    const confirmed = [];
    for (const [nodeId, isConfirmed] of this.confirmations) {
      if (isConfirmed) {
        confirmed.push(nodeId);
      }
    }
    return confirmed;
  }

  /**
   * Get node information
   * @param {string} nodeId - Node ID
   * @returns {Object|null} Node information or null if not found
   */
  getNode(nodeId) {
    return this.dag.get(nodeId) || null;
  }

  /**
   * Get DAG statistics
   * @returns {Object} DAG statistics
   */
  getStats() {
    const totalNodes = this.dag.size;
    const confirmedNodes = this.getConfirmedNodes().length;
    const tipCount = this.tips.size;

    return {
      totalNodes: totalNodes,
      confirmedNodes: confirmedNodes,
      unconfirmedNodes: totalNodes - confirmedNodes,
      tipCount: tipCount,
      confirmationRate: totalNodes > 0 ? confirmedNodes / totalNodes : 0
    };
  }

  /**
   * Prune old nodes to manage memory
   * @param {number} maxAge - Maximum age in milliseconds
   */
  pruneOldNodes(maxAge = 3600000) { // 1 hour default
    const now = Date.now();
    const nodesToRemove = [];

    for (const [nodeId, node] of this.dag) {
      // Don't remove genesis node or confirmed nodes
      if (nodeId === this.genesisNodeId || node.confirmed) {
        continue;
      }

      // Check if node is too old
      if (now - node.timestamp > maxAge) {
        nodesToRemove.push(nodeId);
      }
    }

    // Remove old nodes
    for (const nodeId of nodesToRemove) {
      this.dag.delete(nodeId);
      this.tips.delete(nodeId);
      this.votes.delete(nodeId);
      this.confirmations.delete(nodeId);
    }

    this.logger.info('Pruned old nodes', {
      prunedCount: nodesToRemove.length,
      remainingNodes: this.dag.size
    });
  }
}

module.exports = DAGConsensusManager;