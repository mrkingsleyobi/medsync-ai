// MediSync Healthcare AI Platform - Synaptic Neural Mesh Configuration
// This file contains the configuration for the distributed neural mesh infrastructure

/**
 * Neural Mesh Configuration
 * @typedef {Object} NeuralMeshConfig
 * @property {string} meshId - Unique identifier for the neural mesh
 * @property {string} version - Version of the neural mesh
 * @property {Object} nodes - Configuration for mesh nodes
 * @property {Object} security - Security configuration for the mesh
 * @property {Object} communication - Communication protocols configuration
 * @property {Object} loadBalancing - Load balancing configuration
 * @property {Object} monitoring - Monitoring and metrics configuration
 */

/**
 * @type {NeuralMeshConfig}
 */
const neuralMeshConfig = {
  meshId: 'medisync-neural-mesh-v1',
  version: '1.0.0',

  // Node configuration
  nodes: {
    // Default node configuration
    default: {
      type: 'worker',
      capabilities: ['ai-inference', 'data-processing'],
      maxConcurrentTasks: 10,
      memoryLimit: '4GB',
      cpuLimit: '2000m',
      healthCheckInterval: 30000, // 30 seconds
    },

    // Specialized node types
    specialized: {
      // Medical imaging analysis nodes
      imaging: {
        type: 'specialized',
        capabilities: ['medical-imaging', 'radiology-ai'],
        maxConcurrentTasks: 5,
        memoryLimit: '8GB',
        cpuLimit: '4000m',
        gpuRequired: true,
      },

      // Clinical NLP nodes
      nlp: {
        type: 'specialized',
        capabilities: ['clinical-nlp', 'text-analysis'],
        maxConcurrentTasks: 20,
        memoryLimit: '6GB',
        cpuLimit: '3000m',
      },

      // Research integration nodes
      research: {
        type: 'specialized',
        capabilities: ['literature-analysis', 'evidence-synthesis'],
        maxConcurrentTasks: 15,
        memoryLimit: '8GB',
        cpuLimit: '3500m',
      }
    }
  },

  // Security configuration
  security: {
    encryption: {
      algorithm: 'AES-256-GCM',
      keyRotationInterval: 3600000, // 1 hour
    },
    authentication: {
      method: 'jwt',
      tokenExpiration: 3600000, // 1 hour
    },
    privacy: {
      differentialPrivacy: {
        enabled: true,
        epsilon: 0.1,
      },
      homomorphicEncryption: {
        enabled: true,
      }
    },
    compliance: {
      hipaa: true,
      fda: true,
      gdpr: true,
    }
  },

  // Communication protocols
  communication: {
    protocol: 'grpc',
    compression: 'gzip',
    timeout: 30000, // 30 seconds
    retries: 3,
    circuitBreaker: {
      enabled: true,
      threshold: 5,
      timeout: 60000, // 1 minute
    }
  },

  // Load balancing
  loadBalancing: {
    strategy: 'weighted-round-robin',
    healthCheckInterval: 10000, // 10 seconds
    nodeWeight: {
      default: 1,
      imaging: 3,
      nlp: 2,
      research: 2,
    }
  },

  // Monitoring and metrics
  monitoring: {
    metricsCollection: true,
    logLevel: 'info',
    alerting: {
      enabled: true,
      thresholds: {
        cpuUsage: 80,
        memoryUsage: 85,
        responseTime: 5000, // 5 seconds
        errorRate: 5, // 5%
      }
    }
  },

  // Decision support configuration
  decisionSupport: {
    enabled: true,
    confidenceThreshold: 0.95,
    models: {
      diagnosisSupport: {
        enabled: true,
        confidenceThreshold: 0.95,
      },
      treatmentRecommendation: {
        enabled: true,
        confidenceThreshold: 0.90,
      },
      riskAssessment: {
        enabled: true,
        confidenceThreshold: 0.85,
      },
      drugInteraction: {
        enabled: true,
        confidenceThreshold: 0.95,
      },
      clinicalAlert: {
        enabled: true,
        confidenceThreshold: 0.99,
      }
    },
    clinicalGuidelines: {
      source: 'internal',
      updateInterval: 86400000, // 24 hours
    },
    alerting: {
      enabled: true,
      severityThreshold: 'medium',
    }
  }
};

module.exports = neuralMeshConfig;