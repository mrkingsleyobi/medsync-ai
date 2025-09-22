/**
 * Performance Monitoring Configuration
 * Configuration for performance monitoring and metrics collection
 */

// Metrics Collection Configuration
const metricsConfig = {
  // Collection intervals (in seconds)
  collectionIntervals: {
    realTime: 1,      // 1 second for critical metrics
    frequent: 5,      // 5 seconds for important metrics
    periodic: 30,     // 30 seconds for general metrics
    infrequent: 300   // 5 minutes for system-level metrics
  },

  // Metrics retention (in days)
  retention: {
    realTime: 1,      // 1 day
    frequent: 7,      // 1 week
    periodic: 30,     // 1 month
    infrequent: 365   // 1 year
  },

  // Database configuration
  database: {
    type: 'timeseries', // timeseries, relational, nosql
    host: 'localhost',
    port: 8086, // InfluxDB default port
    database: 'medisync_performance',
    username: 'medisync_monitor',
    password: 'monitor_password_123', // In production, use environment variables
    retentionPolicy: 'autogen'
  },

  // Alerting configuration
  alerting: {
    enabled: true,
    // Thresholds for different metrics
    thresholds: {
      responseTime: {
        critical: 1000,   // 1 second
        warning: 500,     // 500 milliseconds
        info: 250         // 250 milliseconds
      },
      errorRate: {
        critical: 5.0,    // 5%
        warning: 1.0,     // 1%
        info: 0.1         // 0.1%
      },
      cpuUsage: {
        critical: 90,     // 90%
        warning: 75,      // 75%
        info: 60          // 60%
      },
      memoryUsage: {
        critical: 85,     // 85%
        warning: 70,      // 70%
        info: 55          // 55%
      },
      diskUsage: {
        critical: 90,     // 90%
        warning: 75,      // 75%
        info: 60          // 60%
      },
      throughput: {
        critical: 50,     // 50 requests/second minimum
        warning: 100,     // 100 requests/second minimum
        info: 200         // 200 requests/second minimum
      }
    }
  }
};

// Real-time Monitoring Configuration
const realTimeMonitoringConfig = {
  // WebSocket configuration
  websocket: {
    enabled: true,
    port: 8081,
    path: '/performance-monitoring',
    maxConnections: 1000,
    heartbeatInterval: 30 // seconds
  },

  // Dashboard configuration
  dashboard: {
    enabled: true,
    port: 8082,
    refreshInterval: 5, // seconds
    maxHistory: 3600    // 1 hour of data
  },

  // Metrics to monitor in real-time
  realTimeMetrics: [
    'response_time',
    'error_rate',
    'throughput',
    'concurrent_users',
    'cpu_usage',
    'memory_usage',
    'disk_io',
    'network_io'
  ]
};

// Service-Specific Monitoring Configuration
const serviceMonitoringConfig = {
  // Patient Communication Service
  patientCommunication: {
    enabled: true,
    metrics: [
      'login_response_time',
      'document_simplification_time',
      'voice_transcription_accuracy',
      'notification_delivery_time',
      'personalization_quality'
    ],
    thresholds: {
      login_response_time: { critical: 2000, warning: 1000, info: 500 },
      document_simplification_time: { critical: 5000, warning: 3000, info: 1500 }
    }
  },

  // Clinical Decision Support Service
  clinicalDecisionSupport: {
    enabled: true,
    metrics: [
      'diagnosis_accuracy',
      'recommendation_response_time',
      'risk_assessment_time',
      'model_inference_time',
      'explanation_generation_time'
    ],
    thresholds: {
      diagnosis_accuracy: { critical: 85, warning: 90, info: 95 },
      recommendation_response_time: { critical: 3000, warning: 2000, info: 1000 }
    }
  },

  // Research Integration Service
  researchIntegration: {
    enabled: true,
    metrics: [
      'literature_analysis_time',
      'trial_matching_accuracy',
      'impact_tracking_completeness',
      'collaboration_response_time'
    ],
    thresholds: {
      literature_analysis_time: { critical: 10000, warning: 5000, info: 2500 },
      trial_matching_accuracy: { critical: 80, warning: 85, info: 90 }
    }
  },

  // IoT & Wearable Integration Service
  iotWearableIntegration: {
    enabled: true,
    metrics: [
      'device_connection_time',
      'sensor_data_processing_time',
      'real_time_monitoring_latency',
      'early_warning_accuracy',
      'population_analytics_time'
    ],
    thresholds: {
      device_connection_time: { critical: 5000, warning: 3000, info: 1500 },
      sensor_data_processing_time: { critical: 1000, warning: 500, info: 250 }
    }
  },

  // Healthcare System Integration Service
  healthcareSystemIntegration: {
    enabled: true,
    metrics: [
      'fhir_sync_time',
      'hl7_processing_time',
      'dicom_integration_time',
      'ehr_sync_accuracy',
      'patient_matching_precision'
    ],
    thresholds: {
      fhir_sync_time: { critical: 30000, warning: 15000, info: 7500 },
      hl7_processing_time: { critical: 5000, warning: 3000, info: 1500 }
    }
  },

  // Administrative Monitoring Service
  administrativeMonitoring: {
    enabled: true,
    metrics: [
      'user_management_response_time',
      'system_metrics_collection_time',
      'log_retrieval_time',
      'report_generation_time',
      'alert_notification_time'
    ],
    thresholds: {
      user_management_response_time: { critical: 2000, warning: 1000, info: 500 },
      report_generation_time: { critical: 60000, warning: 30000, info: 15000 }
    }
  },

  // Security Audit Service
  securityAudit: {
    enabled: true,
    metrics: [
      'encryption_time',
      'decryption_time',
      'hashing_time',
      'validation_time',
      'event_logging_time'
    ],
    thresholds: {
      encryption_time: { critical: 1000, warning: 500, info: 250 },
      decryption_time: { critical: 1000, warning: 500, info: 250 }
    }
  }
};

// Auto-scaling Configuration
const autoScalingConfig = {
  // Horizontal auto-scaling
  horizontal: {
    enabled: true,
    // Minimum and maximum instances
    minInstances: 1,
    maxInstances: 50,
    // Scale-up conditions
    scaleUp: {
      cpuThreshold: 75,        // 75% CPU usage
      memoryThreshold: 70,     // 70% memory usage
      queueLength: 100,        // 100 requests in queue
      responseTime: 500        // 500ms response time
    },
    // Scale-down conditions
    scaleDown: {
      cpuThreshold: 30,        // 30% CPU usage
      memoryThreshold: 25,     // 25% memory usage
      cooldownPeriod: 300      // 5 minutes cooldown
    }
  },

  // Vertical auto-scaling
  vertical: {
    enabled: true,
    // Resource limits
    cpu: {
      minCores: 1,
      maxCores: 16
    },
    memory: {
      minGB: 1,
      maxGB: 64
    },
    // Scaling triggers
    triggers: {
      cpuThreshold: 85,        // 85% CPU usage
      memoryThreshold: 80,     // 80% memory usage
      responseTime: 1000       // 1000ms response time
    }
  },

  // Predictive auto-scaling
  predictive: {
    enabled: true,
    // Machine learning model for prediction
    model: {
      type: 'time_series_forecasting',
      lookAhead: 3600,         // 1 hour prediction
      confidenceThreshold: 0.8  // 80% confidence
    }
  }
};

// Health Checks Configuration
const healthChecksConfig = {
  // Service health checks
  services: {
    enabled: true,
    interval: 30, // seconds
    timeout: 5,   // seconds
    retries: 3
  },

  // Database health checks
  database: {
    enabled: true,
    interval: 60, // seconds
    timeout: 10,  // seconds
    retries: 2
  },

  // External API health checks
  externalApis: {
    enabled: true,
    interval: 120, // seconds
    timeout: 30,   // seconds
    retries: 1
  },

  // Infrastructure health checks
  infrastructure: {
    enabled: true,
    interval: 300, // seconds (5 minutes)
    timeout: 60,   // seconds
    retries: 1
  }
};

// Export configuration
module.exports = {
  metricsConfig,
  realTimeMonitoringConfig,
  serviceMonitoringConfig,
  autoScalingConfig,
  healthChecksConfig
};