// MediSync Healthcare AI Platform - FACT MCP Knowledge Retrieval System
// This file implements the deterministic medical knowledge retrieval system

const winston = require('winston');
const crypto = require('crypto');
const ToolManager = require('./tools/tool-manager');
const SecurityManager = require('./security/security-manager');

/**
 * FACT MCP (Fast Accurate Clinical Text - Model Coordination Protocol) Class
 * Deterministic medical knowledge retrieval system for MediSync
 */
class FACTMCP {
  /**
   * Create a new FACT MCP instance
   * @param {Object} config - Configuration for the FACT MCP system
   */
  constructor(config = {}) {
    this.config = {
      cacheSize: config.cacheSize || 1000,
      cacheTTL: config.cacheTTL || 3600000, // 1 hour in milliseconds
      cacheStrategy: config.cacheStrategy || 'lru', // lru, lfu, adaptive
      cacheWarming: config.cacheWarming || false,
      maxRetries: config.maxRetries || 3,
      timeout: config.timeout || 5000, // 5 seconds
      ...config
    };

    this.cache = new Map();
    this.cacheAccessLog = new Map();
    this.cacheFrequency = new Map(); // For LFU caching
    this.cacheHitStats = new Map(); // For adaptive TTL
    this.cacheMissStats = new Map(); // For adaptive TTL
    this.auditLog = [];
    this.logger = this._createLogger();
    this.knowledgeBase = new Map();

    // Initialize the system
    this._initializeKnowledgeBase();

    // Initialize tool manager
    this.toolManager = new ToolManager();

    // Initialize security manager
    this.securityManager = new SecurityManager();

    // Initialize cache warming if enabled
    if (this.config.cacheWarming) {
      this._warmCache();
    }

    this.logger.info('FACT MCP initialized', {
      cacheSize: this.config.cacheSize,
      cacheTTL: this.config.cacheTTL,
      cacheStrategy: this.config.cacheStrategy,
      cacheWarming: this.config.cacheWarming,
      tools: this.toolManager.getAvailableTools()
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
      defaultMeta: { service: 'fact-mcp' },
      transports: [
        new winston.transports.File({ filename: 'logs/fact-mcp-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/fact-mcp-combined.log' })
      ]
    });
  }

  /**
   * Warm the cache with frequently accessed medical knowledge
   * @private
   */
  _warmCache() {
    // In a real implementation, this would load frequently accessed medical knowledge
    // For this implementation, we'll warm with sample medical conditions
    const frequentQueries = ['hypertension', 'diabetes', 'myocardial_infarction'];

    for (const query of frequentQueries) {
      if (this.knowledgeBase.has(query)) {
        const results = [this.knowledgeBase.get(query)];
        this._cacheResult(query, results);
        this.logger.info('Cache warmed for query', { query });
      }
    }
  }

  /**
   * Initialize the knowledge base with medical information
   * @private
   */
  _initializeKnowledgeBase() {
    // In a real implementation, this would load from a comprehensive medical knowledge base
    // For this implementation, we'll populate with sample medical knowledge

    // Sample medical conditions and their information
    this.knowledgeBase.set('hypertension', {
      id: 'hypertension',
      name: 'Hypertension',
      category: 'cardiovascular',
      description: 'A chronic medical condition in which the blood pressure in the arteries is persistently elevated.',
      symptoms: ['headache', 'shortness of breath', 'nosebleeds', 'dizziness'],
      riskFactors: ['age', 'obesity', 'smoking', 'diabetes', 'family_history'],
      treatments: ['lifestyle_changes', 'medications', 'blood_pressure_monitoring'],
      icd10: 'I10',
      confidence: 0.95
    });

    this.knowledgeBase.set('diabetes', {
      id: 'diabetes',
      name: 'Diabetes Mellitus',
      category: 'endocrine',
      description: 'A group of metabolic disorders characterized by a high blood sugar level over a prolonged period.',
      symptoms: ['increased_thirst', 'frequent_urination', 'blurred_vision', 'fatigue'],
      riskFactors: ['obesity', 'family_history', 'physical_inactivity', 'age'],
      treatments: ['insulin_therapy', 'oral_medications', 'diet_control', 'exercise'],
      icd10: 'E11',
      confidence: 0.92
    });

    this.knowledgeBase.set('myocardial_infarction', {
      id: 'myocardial_infarction',
      name: 'Myocardial Infarction',
      category: 'cardiovascular',
      description: 'Commonly known as a heart attack, occurs when blood flow decreases or stops to a part of the heart, causing damage to the heart muscle.',
      symptoms: ['chest_pain', 'shortness_of_breath', 'nausea', 'cold_sweat'],
      riskFactors: ['smoking', 'high_blood_pressure', 'diabetes', 'high_cholesterol'],
      treatments: ['emergency_care', 'medications', 'angioplasty', 'bypass_surgery'],
      icd10: 'I21',
      confidence: 0.98
    });

    this.logger.info('Knowledge base initialized', {
      entryCount: this.knowledgeBase.size
    });
  }

  /**
   * Retrieve external medical data using tools
   * @param {string} query - Query to search for external medical data
   * @param {Object} context - Context for the query
   * @returns {Promise<Object>} External medical data
   */
  async retrieveExternalData(query, context = {}) {
    try {
      this.logger.info('Retrieving external medical data', {
        query,
        context
      });

      // Use tool manager to execute contextual tools
      const results = await this.toolManager.executeContextualTools(query, context);

      // Apply security and audit logging
      this._logAuditEntry('external_data_retrieval', {
        query,
        toolCount: results.length,
        successfulTools: results.filter(r => r.success).length
      });

      return {
        query,
        results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Failed to retrieve external medical data', {
        query,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Execute a specific tool
   * @param {string} toolName - Name of the tool to execute
   * @param {Object} params - Tool parameters
   * @returns {Promise<Object>} Tool execution result
   */
  async executeTool(toolName, params = {}) {
    try {
      this.logger.info('Executing tool', {
        toolName,
        params
      });

      const result = await this.toolManager.executeTool(toolName, params);

      // Apply security and audit logging
      this._logAuditEntry('tool_execution', {
        toolName,
        success: result.success,
        hasError: !!result.error
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to execute tool', {
        toolName,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Retrieve medical knowledge based on query
   * @param {string} query - Query to search for medical knowledge
   * @param {Object} options - Options for the query
   * @returns {Promise<Object>} Medical knowledge entry
   */
  async retrieveKnowledge(query, options = {}) {
    try {
      this.logger.info('Retrieving medical knowledge', {
        query,
        options
      });

      // Check cache first
      const cachedResult = this._checkCache(query);
      if (cachedResult) {
        this.logger.info('Cache hit for knowledge retrieval', {
          query
        });
        return cachedResult;
      }

      // Process query and search knowledge base
      const processedQuery = this._processQuery(query);
      const results = this._searchKnowledgeBase(processedQuery, options);

      // Apply security and audit logging
      this._logAuditEntry('knowledge_retrieval', {
        query,
        resultCount: results.length,
        confidence: results.length > 0 ? results[0].confidence : 0
      });

      // Cache the results
      this._cacheResult(query, results);

      return {
        query,
        results,
        timestamp: new Date().toISOString(),
        cached: false
      };
    } catch (error) {
      this.logger.error('Failed to retrieve medical knowledge', {
        query,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Process query for knowledge retrieval
   * @param {string} query - Raw query string
   * @returns {string} Processed query
   * @private
   */
  _processQuery(query) {
    // Normalize and clean the query
    return query.toLowerCase().trim();
  }

  /**
   * Search knowledge base for relevant information
   * @param {string} query - Processed query
   * @param {Object} options - Search options
   * @returns {Array} Matching knowledge entries
   * @private
   */
  _searchKnowledgeBase(query, options) {
    const results = [];

    // Search for exact matches first
    if (this.knowledgeBase.has(query)) {
      results.push(this.knowledgeBase.get(query));
    }

    // Search for partial matches
    for (const [key, value] of this.knowledgeBase.entries()) {
      if (key.includes(query) ||
          (value.name && value.name.toLowerCase().includes(query)) ||
          (value.description && value.description.toLowerCase().includes(query))) {
        // Check if we already have this result
        if (!results.some(result => result.id === value.id)) {
          results.push(value);
        }
      }
    }

    // Sort by confidence
    results.sort((a, b) => b.confidence - a.confidence);

    // Apply limit if specified
    if (options.limit) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Check cache for existing results
   * @param {string} query - Query to check
   * @returns {Object|null} Cached result or null
   * @private
   */
  _checkCache(query) {
    const cacheKey = this._generateCacheKey(query);
    const cachedEntry = this.cache.get(cacheKey);

    if (cachedEntry) {
      const now = Date.now();
      const ttl = this._getAdaptiveTTL(cacheKey);

      if (now - cachedEntry.timestamp < ttl) {
        // Update access log and hit stats
        this.cacheAccessLog.set(cacheKey, now);
        this._updateCacheHitStats(cacheKey);
        this._updateCacheFrequency(cacheKey);
        return {
          ...cachedEntry.data,
          cached: true
        };
      } else {
        // Remove expired entry
        this.cache.delete(cacheKey);
        this.cacheAccessLog.delete(cacheKey);
        this.cacheFrequency.delete(cacheKey);
        this._updateCacheMissStats(cacheKey);
      }
    } else {
      // Update miss stats for non-existent entries
      if (cacheKey) {
        this._updateCacheMissStats(cacheKey);
      }
    }

    return null;
  }

  /**
   * Get adaptive TTL based on cache performance
   * @param {string} cacheKey - Cache key to calculate TTL for
   * @returns {number} Adaptive TTL in milliseconds
   * @private
   */
  _getAdaptiveTTL(cacheKey) {
    // Base TTL from config
    let ttl = this.config.cacheTTL;

    // Adjust TTL based on hit/miss ratio
    const hits = this.cacheHitStats.get(cacheKey) || 0;
    const misses = this.cacheMissStats.get(cacheKey) || 0;

    if (hits + misses > 0) {
      const hitRatio = hits / (hits + misses);

      // Increase TTL for frequently hit entries, decrease for rarely hit ones
      if (hitRatio > 0.8) {
        ttl *= 2; // Double TTL for high hit ratio entries
      } else if (hitRatio < 0.2) {
        ttl *= 0.5; // Halve TTL for low hit ratio entries
      }
    }

    return ttl;
  }

  /**
   * Update cache hit statistics
   * @param {string} cacheKey - Cache key to update stats for
   * @private
   */
  _updateCacheHitStats(cacheKey) {
    const currentHits = this.cacheHitStats.get(cacheKey) || 0;
    this.cacheHitStats.set(cacheKey, currentHits + 1);
  }

  /**
   * Update cache miss statistics
   * @param {string} cacheKey - Cache key to update stats for
   * @private
   */
  _updateCacheMissStats(cacheKey) {
    const currentMisses = this.cacheMissStats.get(cacheKey) || 0;
    this.cacheMissStats.set(cacheKey, currentMisses + 1);
  }

  /**
   * Update cache access frequency for LFU strategy
   * @param {string} cacheKey - Cache key to update frequency for
   * @private
   */
  _updateCacheFrequency(cacheKey) {
    const currentFreq = this.cacheFrequency.get(cacheKey) || 0;
    this.cacheFrequency.set(cacheKey, currentFreq + 1);
  }

  /**
   * Cache result for future queries
   * @param {string} query - Original query
   * @param {Object} result - Result to cache
   * @private
   */
  _cacheResult(query, result) {
    // Check if we need to evict old entries
    if (this.cache.size >= this.config.cacheSize) {
      this._evictCacheEntries();
    }

    const cacheKey = this._generateCacheKey(query);
    const cacheEntry = {
      data: {
        query,
        results: result,
        timestamp: new Date().toISOString(),
        cached: false
      },
      timestamp: Date.now()
    };

    this.cache.set(cacheKey, cacheEntry);
    this.cacheAccessLog.set(cacheKey, Date.now());
    // Initialize frequency for LFU strategy
    if (!this.cacheFrequency.has(cacheKey)) {
      this.cacheFrequency.set(cacheKey, 1);
    }
  }

  /**
   * Generate cache key for query
   * @param {string} query - Query string
   * @returns {string} Cache key
   * @private
   */
  _generateCacheKey(query) {
    return crypto.createHash('sha256').update(query).digest('hex');
  }

  /**
   * Evict cache entries using configured strategy
   * @private
   */
  _evictCacheEntries() {
    let keyToEvict = null;

    switch (this.config.cacheStrategy) {
      case 'lfu': // Least Frequently Used
        keyToEvict = this._findLFUEntry();
        break;
      case 'adaptive': // Adaptive strategy based on hit/miss ratio
        keyToEvict = this._findAdaptiveEntry();
        break;
      case 'lru':
      default: // Least Recently Used (default)
        keyToEvict = this._findLRUEntry();
        break;
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.cacheAccessLog.delete(keyToEvict);
      this.cacheFrequency.delete(keyToEvict);
      this.cacheHitStats.delete(keyToEvict);
      this.cacheMissStats.delete(keyToEvict);
      this.logger.info('Evicted cache entry', {
        cacheKey: keyToEvict,
        strategy: this.config.cacheStrategy
      });
    }
  }

  /**
   * Find the least recently used cache entry
   * @returns {string|null} Key of LRU entry or null
   * @private
   */
  _findLRUEntry() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, timestamp] of this.cacheAccessLog.entries()) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Find the least frequently used cache entry
   * @returns {string|null} Key of LFU entry or null
   * @private
   */
  _findLFUEntry() {
    let leastFrequentKey = null;
    let lowestFrequency = Infinity;

    for (const [key, frequency] of this.cacheFrequency.entries()) {
      if (this.cache.has(key) && frequency < lowestFrequency) {
        lowestFrequency = frequency;
        leastFrequentKey = key;
      }
    }

    // Fallback to LRU if no frequency data
    if (!leastFrequentKey) {
      leastFrequentKey = this._findLRUEntry();
    }

    return leastFrequentKey;
  }

  /**
   * Find cache entry to evict using adaptive strategy based on hit/miss ratio
   * @returns {string|null} Key of entry to evict or null
   * @private
   */
  _findAdaptiveEntry() {
    let worstPerformingKey = null;
    let worstHitRatio = Infinity;

    for (const key of this.cache.keys()) {
      const hits = this.cacheHitStats.get(key) || 0;
      const misses = this.cacheMissStats.get(key) || 0;
      const total = hits + misses;

      if (total > 0) {
        const hitRatio = hits / total;
        if (hitRatio < worstHitRatio) {
          worstHitRatio = hitRatio;
          worstPerformingKey = key;
        }
      }
    }

    // Fallback to LFU if no hit/miss data
    if (!worstPerformingKey) {
      worstPerformingKey = this._findLFUEntry();
    }

    // Final fallback to LRU
    if (!worstPerformingKey) {
      worstPerformingKey = this._findLRUEntry();
    }

    return worstPerformingKey;
  }

  /**
   * Log audit entry for security and compliance
   * @param {string} action - Action performed
   * @param {Object} details - Details of the action
   * @private
   */
  _logAuditEntry(action, details) {
    // Use security manager for enhanced audit logging
    const sanitizedDetails = this.securityManager.sanitizeForLogging(details);
    this.securityManager.logAuditEntry(action, sanitizedDetails, 'system', 'unknown');

    // Maintain backward compatibility with existing audit log
    const auditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details: sanitizedDetails,
      userId: 'system'
    };

    this.auditLog.push(auditEntry);

    // Keep only the most recent audit entries
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }

    this.logger.info('Audit log entry created', {
      action,
      entryId: auditEntry.id
    });
  }

  /**
   * Get audit log entries
   * @param {Object} filter - Filter options
   * @returns {Array} Audit log entries
   */
  getAuditLog(filter = {}) {
    // Try to get entries from security manager first (enhanced audit log)
    try {
      return this.securityManager.getAuditLog(filter);
    } catch (error) {
      // Fallback to original audit log if security manager fails
      this.logger.warn('Failed to retrieve from security manager audit log, using fallback', {
        error: error.message
      });

      let filteredLog = this.auditLog;

      if (filter.action) {
        filteredLog = filteredLog.filter(entry => entry.action === filter.action);
      }

      if (filter.startDate) {
        filteredLog = filteredLog.filter(entry => new Date(entry.timestamp) >= new Date(filter.startDate));
      }

      if (filter.endDate) {
        filteredLog = filteredLog.filter(entry => new Date(entry.timestamp) <= new Date(filter.endDate));
      }

      return filteredLog;
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    // Calculate hit/miss ratios
    let totalHits = 0;
    let totalMisses = 0;

    for (const hits of this.cacheHitStats.values()) {
      totalHits += hits;
    }

    for (const misses of this.cacheMissStats.values()) {
      totalMisses += misses;
    }

    const totalRequests = totalHits + totalMisses;
    const hitRate = totalRequests > 0 ? totalHits / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.cacheSize,
      strategy: this.config.cacheStrategy,
      hitRate,
      totalHits,
      totalMisses,
      totalRequests,
      frequencyData: this.cacheFrequency.size,
      hitStats: this.cacheHitStats.size,
      missStats: this.cacheMissStats.size
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.cacheAccessLog.clear();
    this.cacheFrequency.clear();
    this.cacheHitStats.clear();
    this.cacheMissStats.clear();
    this.logger.info('Cache cleared');
  }

  /**
   * Add new knowledge to the knowledge base
   * @param {string} id - Unique identifier for the knowledge
   * @param {Object} knowledge - Knowledge entry to add
   */
  addKnowledge(id, knowledge) {
    this.knowledgeBase.set(id, {
      id,
      ...knowledge,
      confidence: knowledge.confidence || 0.9
    });

    this.logger.info('Knowledge entry added', {
      id,
      name: knowledge.name
    });
  }

  /**
   * Update existing knowledge in the knowledge base
   * @param {string} id - Unique identifier for the knowledge
   * @param {Object} updates - Updates to apply
   */
  updateKnowledge(id, updates) {
    const existing = this.knowledgeBase.get(id);
    if (existing) {
      this.knowledgeBase.set(id, {
        ...existing,
        ...updates
      });

      this.logger.info('Knowledge entry updated', {
        id
      });
    }
  }

  /**
   * Remove knowledge from the knowledge base
   * @param {string} id - Unique identifier for the knowledge
   */
  removeKnowledge(id) {
    const result = this.knowledgeBase.delete(id);
    if (result) {
      this.logger.info('Knowledge entry removed', {
        id
      });
    }
  }

  /**
   * Get security statistics
   * @returns {Object} Security statistics
   */
  getSecurityStats() {
    return this.securityManager.getStatistics();
  }

  /**
   * Get knowledge base statistics
   * @returns {Object} Knowledge base statistics
   */
  getKnowledgeBaseStats() {
    return {
      entryCount: this.knowledgeBase.size,
      categories: Array.from(this.knowledgeBase.values())
        .map(entry => entry.category)
        .filter((value, index, self) => self.indexOf(value) === index)
    };
  }
}

module.exports = FACTMCP;