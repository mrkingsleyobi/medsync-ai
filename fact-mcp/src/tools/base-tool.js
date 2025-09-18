// MediSync Healthcare AI Platform - FACT MCP Tool Base Class
// Base class for all FACT MCP tools

class BaseTool {
  /**
   * Create a new tool
   * @param {Object} config - Tool configuration
   */
  constructor(config = {}) {
    this.config = {
      name: config.name || 'BaseTool',
      description: config.description || 'Base tool for FACT MCP',
      version: config.version || '1.0.0',
      enabled: config.enabled !== undefined ? config.enabled : true,
      ...config
    };

    this.logger = console; // In a real implementation, this would be a proper logger
  }

  /**
   * Execute the tool
   * @param {Object} params - Tool parameters
   * @returns {Promise<Object>} Tool result
   */
  async execute(params = {}) {
    throw new Error('Execute method must be implemented by subclass');
  }

  /**
   * Validate tool parameters
   * @param {Object} params - Tool parameters to validate
   * @returns {boolean} True if parameters are valid
   */
  validateParams(params = {}) {
    // Base implementation - subclasses should override
    return true;
  }

  /**
   * Get tool metadata
   * @returns {Object} Tool metadata
   */
  getMetadata() {
    return {
      name: this.config.name,
      description: this.config.description,
      version: this.config.version,
      enabled: this.config.enabled
    };
  }
}

module.exports = BaseTool;