// MediSync Healthcare AI Platform - Queen Agent Coordinator
// This file implements the master healthcare coordinator agent with clinical oversight

const winston = require('winston');
const DAGConsensusManager = require('../consensus/dag-consensus-manager.js');

/**
 * Queen Agent Coordinator Class
 * Master healthcare coordinator with clinical oversight capabilities
 */
class QueenAgentCoordinator {
  /**
   * Create a new Queen Agent Coordinator
   * @param {Object} config - Queen agent configuration
   */
  constructor(config = {}) {
    this.config = {
      agentId: config.agentId || 'queen-agent-001',
      oversightThreshold: config.oversightThreshold || 0.95,
      alertThreshold: config.alertThreshold || 0.85,
      ...config
    };

    this.dagConsensusManager = new DAGConsensusManager({
      confirmationThreshold: 0.67,
      byzantineTolerance: true
    });

    this.agents = new Map(); // Managed agents
    this.decisionHistory = new Map(); // Decision tracking
    this.alerts = new Map(); // Active alerts
    this.metrics = {
      totalDecisions: 0,
      approvedDecisions: 0,
      rejectedDecisions: 0,
      alertsGenerated: 0
    };

    this.logger = this._createLogger();

    this.logger.info('Queen Agent Coordinator initialized', {
      agentId: this.config.agentId,
      oversightThreshold: this.config.oversightThreshold
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
      defaultMeta: { service: 'queen-agent-coordinator' },
      transports: [
        new winston.transports.File({ filename: 'logs/queen-agent-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/queen-agent-combined.log' })
      ]
    });
  }

  /**
   * Register a specialized agent
   * @param {string} agentId - Unique identifier for the agent
   * @param {Object} agentInfo - Information about the agent
   * @returns {boolean} True if registration successful
   */
  registerAgent(agentId, agentInfo) {
    try {
      this.agents.set(agentId, {
        id: agentId,
        ...agentInfo,
        registeredAt: new Date().toISOString(),
        status: 'active',
        decisionCount: 0,
        performance: {
          averageConfidence: 0,
          averageProcessingTime: 0,
          errorCount: 0
        }
      });

      this.logger.info('Agent registered with Queen Coordinator', {
        agentId: agentId,
        agentType: agentInfo.type,
        capabilities: agentInfo.capabilities
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to register agent', {
        agentId: agentId,
        error: error.message,
        stack: error.stack
      });

      return false;
    }
  }

  /**
   * Unregister an agent
   * @param {string} agentId - Unique identifier for the agent
   * @returns {boolean} True if unregistration successful
   */
  unregisterAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'inactive';
      this.logger.info('Agent unregistered from Queen Coordinator', {
        agentId: agentId
      });
      return true;
    }

    return false;
  }

  /**
   * Review and approve/reject a clinical decision
   * @param {Object} decision - Clinical decision to review
   * @param {Object} agentContext - Context from the agent that made the decision
   * @returns {Object} Review result with approval status
   */
  async reviewDecision(decision, agentContext) {
    try {
      this.metrics.totalDecisions++;

      // Add decision to DAG for consensus
      const decisionNodeData = {
        type: 'clinical-decision',
        decision: decision,
        agentContext: agentContext,
        timestamp: Date.now()
      };

      const nodeId = this.dagConsensusManager.addNode(decisionNodeData);

      // Perform clinical oversight review
      const reviewResult = this._performClinicalReview(decision, agentContext);

      // Cast vote in DAG consensus
      this.dagConsensusManager.castVote(nodeId, this.config.agentId, reviewResult.approved);

      // Track decision
      this._trackDecision(decision, agentContext, reviewResult);

      // Update agent performance metrics
      this._updateAgentPerformance(agentContext.agentId, decision, reviewResult);

      // Generate alerts if needed
      if (reviewResult.alert) {
        this._generateAlert(reviewResult.alert, decision, agentContext);
      }

      this.logger.info('Decision reviewed by Queen Agent', {
        decisionId: decision.decisionId,
        approved: reviewResult.approved,
        confidence: decision.confidence,
        agentId: agentContext.agentId
      });

      return {
        ...reviewResult,
        nodeId: nodeId,
        consensusPending: true
      };
    } catch (error) {
      this.logger.error('Failed to review decision', {
        decisionId: decision?.decisionId,
        agentId: agentContext?.agentId,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Perform clinical review of a decision
   * @param {Object} decision - Clinical decision to review
   * @param {Object} agentContext - Context from the agent that made the decision
   * @returns {Object} Review result
   * @private
   */
  _performClinicalReview(decision, agentContext) {
    const confidence = decision.confidence || 0;
    const agent = this.agents.get(agentContext.agentId);

    // Check for critical alerts first - these should always require review
    if (decision.alerts && decision.alerts.length > 0) {
      const criticalAlerts = decision.alerts.filter(alert =>
        alert.severity === 'critical' || alert.severity === 'high'
      );

      if (criticalAlerts.length > 0) {
        return {
          approved: false,
          reason: 'Critical alerts detected',
          alert: {
            type: 'critical-alert',
            severity: 'high',
            message: 'Decision requires human review due to critical alerts',
            details: criticalAlerts
          },
          confidence: confidence
        };
      }
    }

    // Check if decision meets oversight threshold
    if (confidence >= this.config.oversightThreshold) {
      this.metrics.approvedDecisions++;
      return {
        approved: true,
        reason: 'High confidence decision meets oversight threshold',
        confidence: confidence
      };
    }

    // Check agent performance
    if (agent && agent.decisionCount > 5 && agent.performance.averageConfidence < 0.7) {
      return {
        approved: false,
        reason: 'Agent performance below threshold',
        alert: {
          type: 'agent-performance',
          severity: 'medium',
          message: 'Decision requires review due to agent performance issues',
          details: {
            agentId: agentContext.agentId,
            avgConfidence: agent.performance.averageConfidence
          }
        },
        confidence: confidence
      };
    }

    // Default approval for moderate confidence
    if (confidence >= this.config.alertThreshold) {
      this.metrics.approvedDecisions++;
      return {
        approved: true,
        reason: 'Decision meets alert threshold',
        confidence: confidence
      };
    }

    // Low confidence decisions require review
    return {
      approved: false,
      reason: 'Low confidence decision requires review',
      alert: {
        type: 'low-confidence',
        severity: 'medium',
        message: 'Decision requires human review due to low confidence',
        details: {
          confidence: confidence,
          threshold: this.config.alertThreshold
        }
      },
      confidence: confidence
    };
  }

  /**
   * Track decision for historical analysis
   * @param {Object} decision - Clinical decision
   * @param {Object} agentContext - Agent context
   * @param {Object} reviewResult - Review result
   * @private
   */
  _trackDecision(decision, agentContext, reviewResult) {
    const decisionRecord = {
      decisionId: decision.decisionId,
      agentId: agentContext.agentId,
      decisionType: decision.type || 'unknown',
      confidence: decision.confidence,
      approved: reviewResult.approved,
      reason: reviewResult.reason,
      timestamp: new Date().toISOString(),
      processingTime: decision.processingTime || 0
    };

    this.decisionHistory.set(decision.decisionId, decisionRecord);
  }

  /**
   * Update agent performance metrics
   * @param {string} agentId - Agent identifier
   * @param {Object} decision - Clinical decision
   * @param {Object} reviewResult - Review result
   * @private
   */
  _updateAgentPerformance(agentId, decision, reviewResult) {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    agent.decisionCount++;

    // Update average confidence
    const totalConfidence = agent.performance.averageConfidence * (agent.decisionCount - 1) + decision.confidence;
    agent.performance.averageConfidence = totalConfidence / agent.decisionCount;

    // Update average processing time
    if (decision.processingTime) {
      const totalTime = agent.performance.averageProcessingTime * (agent.decisionCount - 1) + decision.processingTime;
      agent.performance.averageProcessingTime = totalTime / agent.decisionCount;
    }

    // Update error count
    if (!reviewResult.approved) {
      agent.performance.errorCount++;
    }
  }

  /**
   * Generate alert for critical issues
   * @param {Object} alertInfo - Alert information
   * @param {Object} decision - Related decision
   * @param {Object} agentContext - Agent context
   * @private
   */
  _generateAlert(alertInfo, decision, agentContext) {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const alert = {
      alertId: alertId,
      ...alertInfo,
      decisionId: decision.decisionId,
      agentId: agentContext.agentId,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.set(alertId, alert);
    this.metrics.alertsGenerated++;

    this.logger.warn('Alert generated by Queen Agent', {
      alertId: alertId,
      type: alertInfo.type,
      severity: alertInfo.severity,
      decisionId: decision.decisionId
    });

    // In a real implementation, this would trigger notifications
    // For now, we'll just log it
  }

  /**
   * Acknowledge an alert
   * @param {string} alertId - Alert identifier
   * @returns {boolean} True if alert was acknowledged
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.logger.info('Alert acknowledged', {
        alertId: alertId
      });
      return true;
    }

    return false;
  }

  /**
   * Get active alerts
   * @returns {Array} Array of active alerts
   */
  getActiveAlerts() {
    const activeAlerts = [];
    for (const [alertId, alert] of this.alerts) {
      if (!alert.acknowledged) {
        activeAlerts.push(alert);
      }
    }
    return activeAlerts;
  }

  /**
   * Get decision history
   * @param {string} filter - Optional filter criteria
   * @returns {Array} Array of decision records
   */
  getDecisionHistory(filter = null) {
    const history = Array.from(this.decisionHistory.values());

    if (filter) {
      return history.filter(record => {
        if (filter.agentId && record.agentId !== filter.agentId) return false;
        if (filter.decisionType && record.decisionType !== filter.decisionType) return false;
        if (filter.approved !== undefined && record.approved !== filter.approved) return false;
        return true;
      });
    }

    return history;
  }

  /**
   * Get agent information
   * @param {string} agentId - Agent identifier
   * @returns {Object|null} Agent information or null if not found
   */
  getAgent(agentId) {
    return this.agents.get(agentId) || null;
  }

  /**
   * Get all registered agents
   * @returns {Array} Array of agent information
   */
  getAllAgents() {
    return Array.from(this.agents.values());
  }

  /**
   * Get system metrics
   * @returns {Object} System metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeAgents: this.agents.size,
      activeAlerts: this.getActiveAlerts().length,
      dagStats: this.dagConsensusManager.getStats()
    };
  }

  /**
   * Shutdown the Queen Agent Coordinator
   * @returns {Promise<boolean>} True if shutdown successful
   */
  async shutdown() {
    try {
      this.logger.info('Shutting down Queen Agent Coordinator', {
        agentId: this.config.agentId
      });

      // Perform any cleanup operations here
      // For example, save state, close connections, etc.

      this.logger.info('Queen Agent Coordinator shutdown complete', {
        agentId: this.config.agentId
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to shutdown Queen Agent Coordinator', {
        agentId: this.config.agentId,
        error: error.message,
        stack: error.stack
      });

      return false;
    }
  }
}

module.exports = QueenAgentCoordinator;