/**
 * Monitoring Service Configuration
 * Configuration for the system monitoring dashboard
 */

const config = {
  // Monitoring service settings
  service: {
    enabled: true,
    refreshInterval: 5000, // 5 seconds in milliseconds
    dataRetention: 2592000000, // 30 days in milliseconds
    maxDataPoints: 1000,
    alertSuppression: true
  },

  // System metrics settings
  systemMetrics: {
    enabled: true,
    collectionInterval: 5000, // 5 seconds in milliseconds
    metrics: {
      cpu: {
        enabled: true,
        threshold: 85,
        alertSeverity: 'high'
      },
      memory: {
        enabled: true,
        threshold: 85,
        alertSeverity: 'high'
      },
      disk: {
        enabled: true,
        threshold: 90,
        alertSeverity: 'high'
      },
      network: {
        enabled: true,
        threshold: 95,
        alertSeverity: 'medium'
      }
    }
  },

  // Application metrics settings
  applicationMetrics: {
    enabled: true,
    collectionInterval: 10000, // 10 seconds in milliseconds
    metrics: {
      responseTime: {
        enabled: true,
        threshold: 2000, // milliseconds
        alertSeverity: 'medium'
      },
      errorRate: {
        enabled: true,
        threshold: 5, // percentage
        alertSeverity: 'high'
      },
      throughput: {
        enabled: true,
        threshold: 1000, // requests per minute
        alertSeverity: 'medium'
      }
    }
  },

  // Database metrics settings
  databaseMetrics: {
    enabled: true,
    collectionInterval: 30000, // 30 seconds in milliseconds
    metrics: {
      connectionCount: {
        enabled: true,
        threshold: 90,
        alertSeverity: 'high'
      },
      queryResponseTime: {
        enabled: true,
        threshold: 1000, // milliseconds
        alertSeverity: 'medium'
      },
      slowQueries: {
        enabled: true,
        threshold: 10, // queries per minute
        alertSeverity: 'medium'
      }
    }
  },

  // AI Model metrics settings
  aiModelMetrics: {
    enabled: true,
    collectionInterval: 60000, // 1 minute in milliseconds
    metrics: {
      accuracy: {
        enabled: true,
        threshold: 90, // percentage
        alertSeverity: 'medium'
      },
      latency: {
        enabled: true,
        threshold: 1000, // milliseconds
        alertSeverity: 'medium'
      },
      utilization: {
        enabled: true,
        threshold: 95, // percentage
        alertSeverity: 'high'
      }
    }
  },

  // User activity metrics settings
  userActivityMetrics: {
    enabled: true,
    collectionInterval: 60000, // 1 minute in milliseconds
    metrics: {
      activeUsers: {
        enabled: true,
        threshold: 1000, // concurrent users
        alertSeverity: 'medium'
      },
      loginFailures: {
        enabled: true,
        threshold: 50, // failures per hour
        alertSeverity: 'high'
      },
      apiUsage: {
        enabled: true,
        threshold: 10000, // requests per hour
        alertSeverity: 'medium'
      }
    }
  },

  // Alerting settings
  alerting: {
    enabled: true,
    notificationMethods: ['email', 'sms', 'push', 'webhook'],
    escalationPolicy: {
      level1: { time: 5, channels: ['email'] }, // 5 minutes
      level2: { time: 15, channels: ['email', 'sms'] }, // 15 minutes
      level3: { time: 30, channels: ['email', 'sms', 'push'] } // 30 minutes
    },
    alertCategories: {
      critical: { priority: 1, requiresAcknowledgment: true },
      high: { priority: 2, requiresAcknowledgment: true },
      medium: { priority: 3, requiresAcknowledgment: false },
      low: { priority: 4, requiresAcknowledgment: false }
    },
    suppression: {
      enabled: true,
      window: 3600000, // 1 hour in milliseconds
      maxAlerts: 10
    }
  },

  // Dashboard settings
  dashboard: {
    enabled: true,
    refreshInterval: 10000, // 10 seconds in milliseconds
    charts: {
      performance: {
        enabled: true,
        type: 'line',
        dataPoints: 50
      },
      resourceUsage: {
        enabled: true,
        type: 'bar'
      },
      userActivity: {
        enabled: true,
        type: 'area'
      },
      errorRate: {
        enabled: true,
        type: 'line'
      }
    },
    defaultView: 'overview'
  },

  // Integration settings
  integrations: {
    slack: {
      enabled: false,
      webhookUrl: null
    },
    pagerDuty: {
      enabled: false,
      apiKey: null
    },
    datadog: {
      enabled: false,
      apiKey: null
    },
    newRelic: {
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