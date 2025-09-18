// MediSync Healthcare AI Platform - FACT MCP Tool Manager
// Manager for coordinating all FACT MCP tools

const PubMedTool = require('./pubmed-tool');
const CDCGuidelinesTool = require('./cdc-tool');
const ClinicalTrialsTool = require('./clinical-trials-tool');
const DrugInteractionTool = require('./drug-interaction-tool');

class ToolManager {
  /**
   * Create a new tool manager
   * @param {Object} config - Tool manager configuration
   */
  constructor(config = {}) {
    this.config = {
      maxConcurrentTools: config.maxConcurrentTools || 5,
      timeout: config.timeout || 30000, // 30 seconds
      ...config
    };

    this.tools = new Map();
    this.logger = console; // In a real implementation, this would be a proper logger

    // Initialize tools
    this._initializeTools();
  }

  /**
   * Initialize all tools
   * @private
   */
  _initializeTools() {
    // Initialize PubMed tool
    this.tools.set('pubmed', new PubMedTool({
      maxResults: 10
    }));

    // Initialize CDC Guidelines tool
    this.tools.set('cdc', new CDCGuidelinesTool({
      maxResults: 5
    }));

    // Initialize Clinical Trials tool
    this.tools.set('clinicaltrials', new ClinicalTrialsTool({
      maxResults: 10
    }));

    // Initialize Drug Interaction tool
    this.tools.set('druginteraction', new DrugInteractionTool({
      maxDrugs: 10
    }));

    this.logger.info('Tool manager initialized with tools:', Array.from(this.tools.keys()));
  }

  /**
   * Get available tools
   * @returns {Array} List of available tools
   */
  getAvailableTools() {
    return Array.from(this.tools.keys());
  }

  /**
   * Get tool metadata
   * @param {string} toolName - Name of the tool
   * @returns {Object|null} Tool metadata or null if not found
   */
  getToolMetadata(toolName) {
    const tool = this.tools.get(toolName);
    return tool ? tool.getMetadata() : null;
  }

  /**
   * Execute a specific tool
   * @param {string} toolName - Name of the tool to execute
   * @param {Object} params - Tool parameters
   * @returns {Promise<Object>} Tool execution result
   */
  async executeTool(toolName, params = {}) {
    const tool = this.tools.get(toolName);

    if (!tool) {
      throw new Error(`Tool '${toolName}' not found`);
    }

    if (!tool.config.enabled) {
      throw new Error(`Tool '${toolName}' is disabled`);
    }

    this.logger.info(`Executing tool: ${toolName}`, { params });

    // Execute tool with timeout
    return Promise.race([
      tool.execute(params),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Tool '${toolName}' timed out`)), this.config.timeout)
      )
    ]);
  }

  /**
   * Execute multiple tools in parallel
   * @param {Array} toolRequests - Array of tool requests [{tool, params}, ...]
   * @returns {Promise<Array>} Array of tool execution results
   */
  async executeMultipleTools(toolRequests = []) {
    if (!Array.isArray(toolRequests) || toolRequests.length === 0) {
      return [];
    }

    // Limit concurrent tool executions
    const limitedRequests = toolRequests.slice(0, this.config.maxConcurrentTools);

    // Execute tools in parallel
    const results = await Promise.allSettled(
      limitedRequests.map(request =>
        this.executeTool(request.tool, request.params)
      )
    );

    // Process results
    return results.map((result, index) => {
      const request = limitedRequests[index];
      if (result.status === 'fulfilled') {
        return {
          tool: request.tool,
          success: true,
          data: result.value
        };
      } else {
        return {
          tool: request.tool,
          success: false,
          error: result.reason.message
        };
      }
    });
  }

  /**
   * Execute tools based on query context
   * @param {string} query - User query
   * @param {Object} context - Query context
   * @returns {Promise<Array>} Array of relevant tool execution results
   */
  async executeContextualTools(query, context = {}) {
    const relevantTools = this._determineRelevantTools(query, context);

    if (relevantTools.length === 0) {
      return [];
    }

    // Execute relevant tools
    const toolRequests = relevantTools.map(tool => ({
      tool: tool.name,
      params: tool.params
    }));

    return await this.executeMultipleTools(toolRequests);
  }

  /**
   * Determine relevant tools based on query and context
   * @param {string} query - User query
   * @param {Object} context - Query context
   * @returns {Array} Array of relevant tools with parameters
   * @private
   */
  _determineRelevantTools(query, context = {}) {
    const relevantTools = [];
    const lowerQuery = query.toLowerCase();

    // Determine relevant tools based on query content
    if (lowerQuery.includes('study') || lowerQuery.includes('research') || lowerQuery.includes('literature')) {
      relevantTools.push({
        name: 'pubmed',
        params: { query: query, maxResults: 5 }
      });
    }

    if (lowerQuery.includes('guideline') || lowerQuery.includes('recommendation') || lowerQuery.includes('cdc')) {
      relevantTools.push({
        name: 'cdc',
        params: { topic: query, maxResults: 3 }
      });
    }

    if (lowerQuery.includes('trial') || lowerQuery.includes('clinical trial')) {
      relevantTools.push({
        name: 'clinicaltrials',
        params: { query: query, maxResults: 5 }
      });
    }

    if (lowerQuery.includes('drug') || lowerQuery.includes('medication') || lowerQuery.includes('interaction')) {
      // If we have a list of drugs in context, check interactions
      if (context.drugs && Array.isArray(context.drugs)) {
        relevantTools.push({
          name: 'druginteraction',
          params: { drugs: context.drugs }
        });
      }
    }

    // If no specific tools matched, use PubMed as default for general medical queries
    if (relevantTools.length === 0 &&
        (lowerQuery.includes('treatment') || lowerQuery.includes('condition') || lowerQuery.includes('disease'))) {
      relevantTools.push({
        name: 'pubmed',
        params: { query: query, maxResults: 3 }
      });
    }

    return relevantTools;
  }
}

module.exports = ToolManager;