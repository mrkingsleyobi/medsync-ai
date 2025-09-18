// MediSync Healthcare AI Platform - Agent Monitoring Dashboard
// This file implements a web-based dashboard for monitoring agent activities

const express = require('express');
const path = require('path');
const winston = require('winston');

/**
 * Agent Monitoring Dashboard Class
 * Web-based dashboard for monitoring agent activities and system health
 */
class AgentMonitoringDashboard {
  /**
   * Create a new Agent Monitoring Dashboard
   * @param {Object} config - Dashboard configuration
   */
  constructor(config = {}) {
    this.config = {
      port: config.port || 3001,
      host: config.host || 'localhost',
      ...config
    };

    this.app = express();
    this.server = null;
    this.agents = new Map(); // Registered agents
    this.queenAgent = null; // Queen Agent coordinator

    this.logger = this._createLogger();

    this._setupMiddleware();
    this._setupRoutes();

    this.logger.info('Agent Monitoring Dashboard created', {
      port: this.config.port,
      host: this.config.host
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
      defaultMeta: { service: 'agent-monitoring-dashboard' },
      transports: [
        new winston.transports.File({ filename: 'logs/dashboard-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/dashboard-combined.log' })
      ]
    });
  }

  /**
   * Setup Express middleware
   * @private
   */
  _setupMiddleware() {
    // Serve static files
    this.app.use(express.static(path.join(__dirname, 'public')));

    // Parse JSON bodies
    this.app.use(express.json());

    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));

    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  /**
   * Setup Express routes
   * @private
   */
  _setupRoutes() {
    // API routes
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    this.app.get('/api/agents', (req, res) => {
      const agents = this._getAgentStatuses();
      res.json({
        agents: agents,
        count: agents.length,
        timestamp: new Date().toISOString()
      });
    });

    this.app.get('/api/agents/:agentId', (req, res) => {
      const agentId = req.params.agentId;
      const agent = this.agents.get(agentId);

      if (!agent) {
        return res.status(404).json({
          error: 'Agent not found',
          agentId: agentId
        });
      }

      res.json({
        agent: this._getAgentStatus(agentId),
        timestamp: new Date().toISOString()
      });
    });

    this.app.get('/api/queen-agent', (req, res) => {
      if (!this.queenAgent) {
        return res.status(404).json({
          error: 'Queen Agent not registered'
        });
      }

      res.json({
        queenAgent: this._getQueenAgentStatus(),
        timestamp: new Date().toISOString()
      });
    });

    this.app.get('/api/metrics', (req, res) => {
      const metrics = this._getSystemMetrics();
      res.json({
        metrics: metrics,
        timestamp: new Date().toISOString()
      });
    });

    this.app.get('/api/alerts', (req, res) => {
      const alerts = this._getActiveAlerts();
      res.json({
        alerts: alerts,
        count: alerts.length,
        timestamp: new Date().toISOString()
      });
    });

    // Dashboard routes
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    this.app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.path
      });
    });

    // Error handler
    this.app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
      this.logger.error('Dashboard error:', err);
      res.status(500).json({
        error: 'Internal server error',
        message: err.message
      });
    });
  }

  /**
   * Register an agent for monitoring
   * @param {string} agentId - Unique identifier for the agent
   * @param {Object} agent - Agent instance
   */
  registerAgent(agentId, agent) {
    this.agents.set(agentId, agent);
    this.logger.info('Agent registered for monitoring', {
      agentId: agentId,
      agentType: agent.config?.type
    });
  }

  /**
   * Register Queen Agent coordinator
   * @param {Object} queenAgent - Queen Agent instance
   */
  registerQueenAgent(queenAgent) {
    this.queenAgent = queenAgent;
    this.logger.info('Queen Agent registered for monitoring', {
      agentId: queenAgent.config?.agentId
    });
  }

  /**
   * Get agent statuses
   * @returns {Array} Array of agent statuses
   * @private
   */
  _getAgentStatuses() {
    const statuses = [];
    for (const [agentId, agent] of this.agents) {
      statuses.push(this._getAgentStatus(agentId));
    }
    return statuses;
  }

  /**
   * Get specific agent status
   * @param {string} agentId - Agent identifier
   * @returns {Object} Agent status
   * @private
   */
  _getAgentStatus(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return {
        agentId: agentId,
        status: 'not-found',
        error: 'Agent not found'
      };
    }

    try {
      const status = agent.getStatus ? agent.getStatus() : {
        agentId: agentId,
        status: 'unknown',
        error: 'getStatus method not available'
      };

      // Add additional monitoring data
      return {
        ...status,
        lastSeen: new Date().toISOString(),
        monitoring: true
      };
    } catch (error) {
      return {
        agentId: agentId,
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Get Queen Agent status
   * @returns {Object} Queen Agent status
   * @private
   */
  _getQueenAgentStatus() {
    if (!this.queenAgent) {
      return {
        status: 'not-registered',
        error: 'Queen Agent not registered'
      };
    }

    try {
      return {
        agentId: this.queenAgent.config?.agentId,
        status: this.queenAgent.status || 'unknown',
        metrics: this.queenAgent.getMetrics ? this.queenAgent.getMetrics() : {},
        activeAlerts: this.queenAgent.getActiveAlerts ? this.queenAgent.getActiveAlerts() : [],
        registeredAgents: this.queenAgent.getAllAgents ? this.queenAgent.getAllAgents() : [],
        lastSeen: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Get system metrics
   * @returns {Object} System metrics
   * @private
   */
  _getSystemMetrics() {
    const agentMetrics = [];
    for (const [agentId, agent] of this.agents) {
      try {
        if (agent.getStatus) {
          const status = agent.getStatus();
          agentMetrics.push({
            agentId: agentId,
            type: status.type,
            tasksProcessed: status.metrics?.tasksProcessed || 0,
            errors: status.metrics?.errors || 0,
            averageProcessingTime: status.metrics?.averageProcessingTime || 0
          });
        }
      } catch (error) {
        agentMetrics.push({
          agentId: agentId,
          error: error.message
        });
      }
    }

    return {
      totalAgents: this.agents.size,
      agentMetrics: agentMetrics,
      queenAgentMetrics: this.queenAgent?.getMetrics ? this.queenAgent.getMetrics() : {},
      systemHealth: 'operational',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get active alerts
   * @returns {Array} Array of active alerts
   * @private
   */
  _getActiveAlerts() {
    if (!this.queenAgent || !this.queenAgent.getActiveAlerts) {
      return [];
    }

    try {
      return this.queenAgent.getActiveAlerts();
    } catch (error) {
      this.logger.error('Failed to get active alerts', {
        error: error.message
      });
      return [];
    }
  }

  /**
   * Start the monitoring dashboard
   * @returns {Promise<boolean>} True if started successfully
   */
  async start() {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.config.port, this.config.host, () => {
          this.logger.info('Agent Monitoring Dashboard started', {
            host: this.config.host,
            port: this.config.port
          });
          resolve(true);
        });

        this.server.on('error', (error) => {
          this.logger.error('Failed to start Agent Monitoring Dashboard', {
            error: error.message
          });
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop the monitoring dashboard
   * @returns {Promise<boolean>} True if stopped successfully
   */
  async stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.logger.info('Agent Monitoring Dashboard stopped');
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }
}

module.exports = AgentMonitoringDashboard;