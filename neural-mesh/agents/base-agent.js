// MediSync Healthcare AI Platform - Base Agent Template
// This file implements the base template for all specialized agents

const winston = require('winston');

/**
 * Base Agent Class
 * Foundation class for all specialized agents in the MediSync platform
 */
class BaseAgent {
  /**
   * Create a new Base Agent
   * @param {Object} config - Agent configuration
   */
  constructor(config = {}) {
    this.config = {
      agentId: config.agentId || `agent-${Date.now()}`,
      type: config.type || 'generic',
      capabilities: config.capabilities || [],
      version: config.version || '1.0.0',
      ...config
    };

    this.status = 'initialized';
    this.createdAt = new Date().toISOString();
    this.lastActivity = this.createdAt;
    this.metrics = {
      tasksProcessed: 0,
      errors: 0,
      averageProcessingTime: 0
    };

    this.logger = this._createLogger();

    this.logger.info('Base Agent initialized', {
      agentId: this.config.agentId,
      type: this.config.type,
      capabilities: this.config.capabilities
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
      defaultMeta: { service: 'agent', agentId: this.config.agentId },
      transports: [
        new winston.transports.File({ filename: `logs/agent-${this.config.agentId}-error.log`, level: 'error' }),
        new winston.transports.File({ filename: `logs/agent-${this.config.agentId}-combined.log` })
      ]
    });
  }

  /**
   * Initialize the agent
   * @returns {Promise<boolean>} True if initialization successful
   */
  async initialize() {
    try {
      this.status = 'initializing';
      this.logger.info('Agent initializing', {
        agentId: this.config.agentId,
        type: this.config.type
      });

      // Perform any initialization tasks specific to the agent type
      await this._performInitialization();

      this.status = 'active';
      this.lastActivity = new Date().toISOString();

      this.logger.info('Agent initialized successfully', {
        agentId: this.config.agentId,
        type: this.config.type
      });

      return true;
    } catch (error) {
      this.status = 'error';
      this.logger.error('Agent initialization failed', {
        agentId: this.config.agentId,
        type: this.config.type,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Perform agent-specific initialization tasks
   * Should be overridden by subclasses
   * @private
   */
  async _performInitialization() {
    // Base implementation does nothing
    // Subclasses should override this method
  }

  /**
   * Process a task
   * @param {Object} task - Task to process
   * @returns {Promise<Object>} Processing result
   */
  async processTask(task) {
    try {
      const startTime = Date.now();
      this.status = 'processing';
      this.lastActivity = new Date().toISOString();

      this.logger.info('Processing task', {
        agentId: this.config.agentId,
        taskId: task.id,
        taskType: task.type
      });

      // Process the task
      const result = await this._processTaskImplementation(task);

      // Update metrics
      const processingTime = Date.now() - startTime;
      this._updateMetrics(processingTime, false);

      this.status = 'active';
      this.lastActivity = new Date().toISOString();

      this.logger.info('Task processed successfully', {
        agentId: this.config.agentId,
        taskId: task.id,
        processingTime: processingTime
      });

      return {
        taskId: task.id,
        agentId: this.config.agentId,
        status: 'completed',
        result: result,
        processingTime: processingTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.status = 'error';
      this._updateMetrics(0, true);

      this.logger.error('Task processing failed', {
        agentId: this.config.agentId,
        taskId: task.id,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Process task implementation
   * Should be overridden by subclasses
   * @param {Object} task - Task to process
   * @returns {Promise<Object>} Processing result
   * @private
   */
  async _processTaskImplementation(task) {
    // Base implementation throws an error
    // Subclasses must override this method
    throw new Error('Task processing not implemented for this agent type');
  }

  /**
   * Update agent metrics
   * @param {number} processingTime - Time taken to process task
   * @param {boolean} isError - Whether the task resulted in an error
   * @private
   */
  _updateMetrics(processingTime, isError) {
    this.metrics.tasksProcessed++;

    if (isError) {
      this.metrics.errors++;
    } else {
      // Update average processing time
      const totalTime = this.metrics.averageProcessingTime * (this.metrics.tasksProcessed - 1) + processingTime;
      this.metrics.averageProcessingTime = totalTime / this.metrics.tasksProcessed;
    }
  }

  /**
   * Get agent status
   * @returns {Object} Agent status information
   */
  getStatus() {
    return {
      agentId: this.config.agentId,
      type: this.config.type,
      status: this.status,
      createdAt: this.createdAt,
      lastActivity: this.lastActivity,
      metrics: { ...this.metrics },
      capabilities: [...this.config.capabilities]
    };
  }

  /**
   * Shutdown the agent
   * @returns {Promise<boolean>} True if shutdown successful
   */
  async shutdown() {
    try {
      this.status = 'shutting-down';
      this.logger.info('Agent shutting down', {
        agentId: this.config.agentId,
        type: this.config.type
      });

      // Perform any cleanup tasks
      await this._performShutdown();

      this.status = 'shutdown';
      this.logger.info('Agent shutdown complete', {
        agentId: this.config.agentId,
        type: this.config.type
      });

      return true;
    } catch (error) {
      this.status = 'error';
      this.logger.error('Agent shutdown failed', {
        agentId: this.config.agentId,
        type: this.config.type,
        error: error.message,
        stack: error.stack
      });

      return false;
    }
  }

  /**
   * Perform agent-specific shutdown tasks
   * Should be overridden by subclasses
   * @private
   */
  async _performShutdown() {
    // Base implementation does nothing
    // Subclasses should override this method
  }
}

module.exports = BaseAgent;