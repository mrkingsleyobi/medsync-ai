/**
 * Analytics Service Configuration
 * Configuration for the performance analytics system
 */

const config = {
  // Analytics service settings
  service: {
    enabled: true,
    collectionInterval: 300000, // 5 minutes in milliseconds
    dataRetention: 31536000000, // 1 year in milliseconds
    reporting: {
      daily: true,
      weekly: true,
      monthly: true,
      custom: true
    }
  },

  // Performance metrics settings
  performance: {
    enabled: true,
    metrics: {
      responseTime: {
        enabled: true,
        percentiles: [50, 95, 99],
        thresholds: {
          excellent: 500, // milliseconds
          good: 1000, // milliseconds
          acceptable: 2000, // milliseconds
          poor: 5000 // milliseconds
        }
      },
      throughput: {
        enabled: true,
        unit: 'requests_per_second',
        thresholds: {
          excellent: 1000,
          good: 500,
          acceptable: 100,
          poor: 10
        }
      },
      errorRate: {
        enabled: true,
        unit: 'percentage',
        thresholds: {
          excellent: 0.1,
          good: 0.5,
          acceptable: 1.0,
          poor: 5.0
        }
      }
    }
  },

  // User satisfaction metrics settings
  userSatisfaction: {
    enabled: true,
    metrics: {
      csat: {
        enabled: true,
        scale: 5, // 5-point scale
        thresholds: {
          excellent: 4.5,
          good: 4.0,
          acceptable: 3.5,
          poor: 3.0
        }
      },
      nps: {
        enabled: true,
        scale: 10, // 10-point scale
        thresholds: {
          excellent: 70,
          good: 50,
          acceptable: 30,
          poor: 0
        }
      },
      feedbackCount: {
        enabled: true,
        dailyTarget: 100,
        weeklyTarget: 500
      }
    }
  },

  // AI accuracy metrics settings
  aiAccuracy: {
    enabled: true,
    metrics: {
      overall: {
        enabled: true,
        thresholds: {
          excellent: 95,
          good: 90,
          acceptable: 85,
          poor: 80
        }
      },
      byService: {
        'patient-communication': {
          enabled: true,
          thresholds: {
            excellent: 95,
            good: 90,
            acceptable: 85,
            poor: 80
          }
        },
        'clinical-decision': {
          enabled: true,
          thresholds: {
            excellent: 98,
            good: 95,
            acceptable: 90,
            poor: 85
          }
        },
        'research-integration': {
          enabled: true,
          thresholds: {
            excellent: 92,
            good: 88,
            acceptable: 85,
            poor: 80
          }
        }
      }
    }
  },

  // Resource utilization metrics settings
  resourceUtilization: {
    enabled: true,
    metrics: {
      cpu: {
        enabled: true,
        thresholds: {
          excellent: 50,
          good: 70,
          acceptable: 85,
          poor: 95
        }
      },
      memory: {
        enabled: true,
        thresholds: {
          excellent: 60,
          good: 75,
          acceptable: 85,
          poor: 95
        }
      },
      storage: {
        enabled: true,
        thresholds: {
          excellent: 50,
          good: 70,
          acceptable: 85,
          poor: 95
        }
      },
      network: {
        enabled: true,
        thresholds: {
          excellent: 50,
          good: 70,
          acceptable: 85,
          poor: 95
        }
      }
    }
  },

  // Feature adoption metrics settings
  featureAdoption: {
    enabled: true,
    metrics: {
      overall: {
        enabled: true,
        target: 80 // percentage
      },
      byFeature: {
        'patient-communication': {
          enabled: true,
          target: 85
        },
        'clinical-decision': {
          enabled: true,
          target: 90
        },
        'research-integration': {
          enabled: true,
          target: 75
        }
      }
    }
  },

  // Reporting settings
  reporting: {
    enabled: true,
    formats: ['pdf', 'csv', 'json', 'html'],
    templates: {
      executive: 'templates/executive-report.hbs',
      technical: 'templates/technical-report.hbs',
      compliance: 'templates/compliance-report.hbs'
    },
    schedules: {
      daily: '0 9 * * *', // 9 AM daily
      weekly: '0 9 * * 1', // 9 AM every Monday
      monthly: '0 9 1 * *' // 9 AM on first day of month
    },
    retention: 31536000000 // 1 year in milliseconds
  },

  // Benchmarking settings
  benchmarking: {
    enabled: true,
    industryStandards: {
      healthcare: {
        responseTime: 2000, // milliseconds
        errorRate: 1.0, // percentage
        uptime: 99.9 // percentage
      },
      aiPlatforms: {
        accuracy: 90, // percentage
        latency: 1000 // milliseconds
      }
    },
    comparisons: {
      quarterly: true,
      yearly: true
    }
  },

  // Integration settings
  integrations: {
    googleAnalytics: {
      enabled: false,
      trackingId: null
    },
    mixpanel: {
      enabled: false,
      apiKey: null
    },
    amplitude: {
      enabled: false,
      apiKey: null
    }
  },

  // Security settings
  security: {
    auditLogging: true,
    dataEncryption: true,
    accessControl: true,
    compliance: {
      hipaa: true,
      gdpr: true,
      sox: false
    }
  }
};

module.exports = config;