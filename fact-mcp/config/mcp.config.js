// MediSync Healthcare AI Platform - FACT MCP Configuration
// Configuration file for the FACT MCP knowledge retrieval system

const mcpConfig = {
  // System configuration
  system: {
    name: 'FACT-MCP',
    version: '1.0.0',
    description: 'Fast Accurate Clinical Text - Model Coordination Protocol'
  },

  // Cache configuration
  cache: {
    maxSize: 10000,
    ttl: 3600000, // 1 hour in milliseconds
    evictionStrategy: 'lru', // Least Recently Used
    strategies: ['lru', 'lfu', 'adaptive'], // Available caching strategies
    warming: true // Enable cache warming
  },

  // Security configuration
  security: {
    encryption: {
      enabled: true,
      algorithm: 'aes-256-gcm'
    },
    audit: {
      enabled: true,
      logLevel: 'info',
      retentionDays: 90
    },
    accessControl: {
      enabled: true,
      authenticationRequired: true
    }
  },

  // Knowledge base configuration
  knowledgeBase: {
    sources: [
      {
        type: 'internal',
        name: 'MediSync Medical Knowledge Base',
        priority: 1
      },
      {
        type: 'external',
        name: 'PubMed Central',
        priority: 2,
        endpoint: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'
      },
      {
        type: 'external',
        name: 'CDC Guidelines',
        priority: 3,
        endpoint: 'https://www.cdc.gov/'
      }
    ],
    updateFrequency: 'daily',
    validationRequired: true
  },

  // Performance configuration
  performance: {
    maxRetries: 3,
    timeout: 10000, // 10 seconds
    concurrencyLimit: 10,
    requestThrottling: {
      enabled: true,
      maxRequestsPerSecond: 100
    }
  },

  // Logging configuration
  logging: {
    level: 'info',
    format: 'json',
    outputs: [
      {
        type: 'file',
        path: 'logs/fact-mcp-combined.log',
        level: 'info'
      },
      {
        type: 'file',
        path: 'logs/fact-mcp-error.log',
        level: 'error'
      }
    ]
  },

  // Compliance configuration
  compliance: {
    hipaa: {
      enabled: true,
      dataEncryption: true,
      auditLogging: true
    },
    fda: {
      enabled: true,
      validationRequired: true,
      evidenceTracking: true
    },
    gdpr: {
      enabled: true,
      dataMinimization: true,
      rightToErasure: true
    }
  }
};

module.exports = mcpConfig;