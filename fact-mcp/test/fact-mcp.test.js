// MediSync Healthcare AI Platform - FACT MCP Tests
// Test suite for the FACT MCP knowledge retrieval system

const FACTMCP = require('../src/fact-mcp');

describe('FACT MCP Knowledge Retrieval System', () => {
  let factMCP;

  beforeEach(() => {
    factMCP = new FACTMCP({
      cacheSize: 100,
      cacheTTL: 60000, // 1 minute for testing
      cacheStrategy: 'lru'
    });
  });

  test('should initialize FACT MCP system', () => {
    expect(factMCP).toBeInstanceOf(FACTMCP);
    expect(factMCP.config.cacheSize).toBe(100);
    expect(factMCP.config.cacheTTL).toBe(60000);
    expect(factMCP.config.cacheStrategy).toBe('lru');
  });

  test('should retrieve medical knowledge by exact match', async () => {
    const result = await factMCP.retrieveKnowledge('hypertension');

    expect(result).toBeDefined();
    expect(result.query).toBe('hypertension');
    expect(result.results).toHaveLength(1);
    expect(result.results[0].id).toBe('hypertension');
    expect(result.results[0].name).toBe('Hypertension');
    expect(result.results[0].category).toBe('cardiovascular');
  });

  test('should retrieve medical knowledge by partial match', async () => {
    const result = await factMCP.retrieveKnowledge('diabetes');

    expect(result).toBeDefined();
    expect(result.results).toHaveLength(1);
    expect(result.results[0].id).toBe('diabetes');
    expect(result.results[0].name).toBe('Diabetes Mellitus');
  });

  test('should cache results for subsequent queries', async () => {
    // First query
    const result1 = await factMCP.retrieveKnowledge('hypertension');
    expect(result1.cached).toBe(false);

    // Second query (should be cached)
    const result2 = await factMCP.retrieveKnowledge('hypertension');
    expect(result2.cached).toBe(true);

    // Verify cache statistics
    const stats = factMCP.getCacheStats();
    expect(stats.size).toBeGreaterThan(0);
  });

  test('should add new knowledge to the knowledge base', () => {
    const newKnowledge = {
      name: 'Asthma',
      category: 'respiratory',
      description: 'A chronic inflammatory disease of the airways.',
      symptoms: ['wheezing', 'shortness of breath', 'chest tightness'],
      riskFactors: ['genetics', 'environmental_factors', 'allergies'],
      treatments: ['inhalers', 'bronchodilators', 'anti-inflammatory_medications']
    };

    factMCP.addKnowledge('asthma', newKnowledge);

    const stats = factMCP.getKnowledgeBaseStats();
    expect(stats.entryCount).toBe(4); // 3 existing + 1 new
  });

  test('should update existing knowledge', async () => {
    const updates = {
      description: 'Updated description for hypertension',
      confidence: 0.99
    };

    factMCP.updateKnowledge('hypertension', updates);

    const result = await factMCP.retrieveKnowledge('hypertension');
    expect(result.results[0].description).toBe('Updated description for hypertension');
    expect(result.results[0].confidence).toBe(0.99);
  });

  test('should remove knowledge from the knowledge base', () => {
    factMCP.removeKnowledge('hypertension');

    const stats = factMCP.getKnowledgeBaseStats();
    expect(stats.entryCount).toBe(2); // 3 existing - 1 removed
  });

  test('should log audit entries for knowledge retrieval', async () => {
    await factMCP.retrieveKnowledge('hypertension');

    const auditLog = factMCP.getAuditLog();
    expect(auditLog.length).toBeGreaterThan(0);

    const knowledgeRetrievalLogs = factMCP.getAuditLog({ action: 'knowledge_retrieval' });
    expect(knowledgeRetrievalLogs.length).toBeGreaterThan(0);
  });

  test('should clear cache when requested', async () => {
    // Add some entries to cache
    await factMCP.retrieveKnowledge('hypertension');
    await factMCP.retrieveKnowledge('diabetes');

    // Verify cache has entries
    const stats1 = factMCP.getCacheStats();
    expect(stats1.size).toBeGreaterThan(0);

    // Clear cache
    factMCP.clearCache();

    // Verify cache is empty
    const stats2 = factMCP.getCacheStats();
    expect(stats2.size).toBe(0);
  });

  test('should handle queries with no results', async () => {
    const result = await factMCP.retrieveKnowledge('nonexistent_condition');

    expect(result).toBeDefined();
    expect(result.query).toBe('nonexistent_condition');
    expect(result.results).toHaveLength(0);
  });

  test('should support LFU caching strategy', () => {
    const lfuMCP = new FACTMCP({
      cacheSize: 100,
      cacheTTL: 60000,
      cacheStrategy: 'lfu'
    });

    expect(lfuMCP.config.cacheStrategy).toBe('lfu');
  });

  test('should support adaptive caching strategy', () => {
    const adaptiveMCP = new FACTMCP({
      cacheSize: 100,
      cacheTTL: 60000,
      cacheStrategy: 'adaptive'
    });

    expect(adaptiveMCP.config.cacheStrategy).toBe('adaptive');
  });

  test('should provide detailed cache statistics', async () => {
    // Make some requests to generate cache stats
    await factMCP.retrieveKnowledge('hypertension');
    await factMCP.retrieveKnowledge('hypertension'); // Cache hit
    await factMCP.retrieveKnowledge('diabetes');

    const stats = factMCP.getCacheStats();
    expect(stats).toBeDefined();
    expect(stats.size).toBeGreaterThanOrEqual(0);
    expect(stats.maxSize).toBe(100);
    expect(stats.strategy).toBe('lru');
    expect(stats.totalRequests).toBeGreaterThanOrEqual(0);
    expect(stats.hitRate).toBeGreaterThanOrEqual(0);
  });

  test('should clear all cache data when requested', async () => {
    // Add some entries to cache
    await factMCP.retrieveKnowledge('hypertension');
    await factMCP.retrieveKnowledge('diabetes');

    // Verify cache has entries
    const stats1 = factMCP.getCacheStats();
    expect(stats1.size).toBeGreaterThan(0);

    // Clear cache
    factMCP.clearCache();

    // Verify cache and related data structures are empty
    const stats2 = factMCP.getCacheStats();
    expect(stats2.size).toBe(0);
    expect(stats2.hitStats).toBe(0);
    expect(stats2.missStats).toBe(0);
  });
});