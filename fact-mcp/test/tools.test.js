// MediSync Healthcare AI Platform - FACT MCP Tools Tests
// Test suite for the FACT MCP tool-based data retrieval mechanisms

const ToolManager = require('../src/tools/tool-manager');
const PubMedTool = require('../src/tools/pubmed-tool');
const CDCGuidelinesTool = require('../src/tools/cdc-tool');
const ClinicalTrialsTool = require('../src/tools/clinical-trials-tool');
const DrugInteractionTool = require('../src/tools/drug-interaction-tool');

describe('FACT MCP Tool-Based Data Retrieval', () => {
  let toolManager;

  beforeEach(() => {
    toolManager = new ToolManager();
  });

  test('should initialize tool manager with all tools', () => {
    expect(toolManager).toBeInstanceOf(ToolManager);
    expect(toolManager.getAvailableTools()).toHaveLength(4);
    expect(toolManager.getAvailableTools()).toEqual(
      expect.arrayContaining(['pubmed', 'cdc', 'clinicaltrials', 'druginteraction'])
    );
  });

  test('should get tool metadata', () => {
    const pubmedMetadata = toolManager.getToolMetadata('pubmed');
    expect(pubmedMetadata).toBeDefined();
    expect(pubmedMetadata.name).toBe('PubMedTool');
    expect(pubmedMetadata.enabled).toBe(true);

    const invalidMetadata = toolManager.getToolMetadata('invalid');
    expect(invalidMetadata).toBeNull();
  });

  test('should execute PubMed tool', async () => {
    const result = await toolManager.executeTool('pubmed', {
      query: 'hypertension treatment',
      maxResults: 5
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.tool).toBe('PubMedTool');
    expect(result.results).toHaveLength(2);
  });

  test('should execute CDC Guidelines tool', async () => {
    const result = await toolManager.executeTool('cdc', {
      topic: 'hypertension',
      maxResults: 3
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.tool).toBe('CDCGuidelinesTool');
    expect(result.results).toHaveLength(1);
  });

  test('should execute Clinical Trials tool', async () => {
    const result = await toolManager.executeTool('clinicaltrials', {
      condition: 'diabetes',
      maxResults: 5
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.tool).toBe('ClinicalTrialsTool');
    expect(result.results).toHaveLength(1);
  });

  test('should execute Drug Interaction tool', async () => {
    const result = await toolManager.executeTool('druginteraction', {
      drugs: ['warfarin', 'aspirin']
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.tool).toBe('DrugInteractionTool');
    expect(result.results).toBeDefined();
    expect(result.results.interactions).toHaveLength(1);
  });

  test('should handle invalid tool execution', async () => {
    await expect(toolManager.executeTool('invalid', {}))
      .rejects
      .toThrow("Tool 'invalid' not found");
  });

  test('should execute multiple tools in parallel', async () => {
    const toolRequests = [
      { tool: 'pubmed', params: { query: 'diabetes treatment', maxResults: 2 } },
      { tool: 'cdc', params: { topic: 'diabetes', maxResults: 1 } }
    ];

    const results = await toolManager.executeMultipleTools(toolRequests);

    expect(results).toHaveLength(2);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(true);
    expect(results[0].tool).toBe('pubmed');
    expect(results[1].tool).toBe('cdc');
  });

  test('should execute contextual tools based on query', async () => {
    const results = await toolManager.executeContextualTools(
      'What are the latest hypertension treatment guidelines?',
      {}
    );

    expect(results).toBeDefined();
    // Should execute both PubMed and CDC tools for this query
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  test('should handle drug interaction checking in contextual tools', async () => {
    const results = await toolManager.executeContextualTools(
      'Check interactions between these medications',
      { drugs: ['warfarin', 'ibuprofen'] }
    );

    expect(results).toBeDefined();
    // Should execute drug interaction tool
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  test('should validate tool parameters', () => {
    const pubmedTool = new PubMedTool();
    expect(pubmedTool.validateParams({ query: 'test' })).toBe(true);
    expect(pubmedTool.validateParams({})).toBe(false);

    const drugTool = new DrugInteractionTool();
    expect(drugTool.validateParams({ drugs: ['warfarin', 'aspirin'] })).toBe(true);
    expect(drugTool.validateParams({ drugs: ['warfarin'] })).toBe(false); // Need at least 2 drugs
    expect(drugTool.validateParams({})).toBe(false);
  });
});