/**
 * IoT & Wearable Integration Configuration
 * Configuration for IoT and wearable device integration services
 */

const config = {
  // Wearable device integration settings
  wearables: {
    enabled: true,
    supportedDevices: {
      fitbit: {
        enabled: true,
        apiVersion: '1.0',
        dataTypes: ['heartRate', 'steps', 'sleep', 'calories', 'activity']
      },
      appleWatch: {
        enabled: true,
        apiVersion: '2.0',
        dataTypes: ['heartRate', 'ecg', 'bloodOxygen', 'steps', 'sleep']
      },
      garmin: {
        enabled: true,
        apiVersion: '1.5',
        dataTypes: ['heartRate', 'steps', 'sleep', 'stress', 'hydration']
      },
      whoop: {
        enabled: true,
        apiVersion: '3.0',
        dataTypes: ['heartRate', 'hrv', 'sleep', 'strain', 'recovery']
      },
      oura: {
        enabled: true,
        apiVersion: '2.0',
        dataTypes: ['heartRate', 'temperature', 'sleep', 'activity', 'readiness']
      }
    },
    dataCollection: {
      frequency: 300000, // 5 minutes in milliseconds
      batchSize: 100,
      retryAttempts: 3,
      timeout: 30000 // 30 seconds
    },
    authentication: {
      oauth2: true,
      tokenRefresh: 86400000, // 24 hours in milliseconds
      encryption: 'AES-256-GCM'
    }
  },

  // IoT sensor integration settings
  sensors: {
    enabled: true,
    supportedSensors: {
      bloodPressure: {
        enabled: true,
        protocol: 'Bluetooth',
        dataTypes: ['systolic', 'diastolic', 'pulse']
      },
      glucose: {
        enabled: true,
        protocol: 'Bluetooth',
        dataTypes: ['glucoseLevel', 'trend']
      },
      weight: {
        enabled: true,
        protocol: 'WiFi',
        dataTypes: ['weight', 'bodyFat', 'bmi']
      },
      temperature: {
        enabled: true,
        protocol: 'Bluetooth',
        dataTypes: ['temperature']
      },
      ecg: {
        enabled: true,
        protocol: 'Bluetooth',
        dataTypes: ['ecgWaveform', 'heartRate']
      }
    },
    dataCollection: {
      frequency: 60000, // 1 minute in milliseconds
      batchSize: 50,
      retryAttempts: 3,
      timeout: 15000 // 15 seconds
    },
    gateway: {
      enabled: true,
      protocol: 'MQTT',
      brokerUrl: process.env.MQTT_BROKER_URL || 'mqtts://secure-iot-broker.medisync.com',
      port: process.env.MQTT_BROKER_PORT || 8883,
      qos: 1
    }
  },

  // Real-time monitoring settings
  monitoring: {
    enabled: true,
    frequency: 10000, // 10 seconds in milliseconds
    dataRetention: 2592000000, // 30 days in milliseconds
    metrics: {
      heartRate: {
        enabled: true,
        normalRange: { min: 60, max: 100 },
        criticalThreshold: { min: 40, max: 140 }
      },
      bloodPressure: {
        enabled: true,
        normalRange: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
        criticalThreshold: { systolic: { min: 70, max: 200 }, diastolic: { min: 40, max: 120 } }
      },
      glucose: {
        enabled: true,
        normalRange: { min: 70, max: 140 }, // mg/dL
        criticalThreshold: { min: 50, max: 300 } // mg/dL
      },
      temperature: {
        enabled: true,
        normalRange: { min: 97.0, max: 99.5 }, // Fahrenheit
        criticalThreshold: { min: 95.0, max: 104.0 } // Fahrenheit
      },
      activity: {
        enabled: true,
        thresholds: {
          sedentary: 5000, // steps per day
          active: 10000, // steps per day
          veryActive: 15000 // steps per day
        }
      }
    }
  },

  // Alert generation settings
  alerts: {
    enabled: true,
    notificationMethods: ['push', 'sms', 'email'],
    escalationPolicy: {
      level1: { time: 5, channels: ['push'] }, // 5 minutes
      level2: { time: 15, channels: ['push', 'sms'] }, // 15 minutes
      level3: { time: 30, channels: ['push', 'sms', 'email'] } // 30 minutes
    },
    categories: {
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

  // Continuous health monitoring dashboard settings
  dashboard: {
    enabled: true,
    refreshInterval: 5000, // 5 seconds in milliseconds
    defaultView: 'overview',
    widgets: {
      vitals: true,
      trends: true,
      alerts: true,
      activity: true,
      sleep: true
    }
  },

  // Early warning system settings
  earlyWarning: {
    enabled: true,
    algorithms: {
      anomalyDetection: true,
      trendAnalysis: true,
      patternRecognition: true
    },
    predictionWindow: 86400000, // 24 hours in milliseconds
    confidenceThreshold: 0.8
  },

  // Population health analytics settings
  populationAnalytics: {
    enabled: true,
    aggregation: {
      frequency: 3600000, // 1 hour in milliseconds
      metrics: ['heartRate', 'bloodPressure', 'glucose', 'activity', 'sleep']
    },
    benchmarks: {
      heartRate: { min: 60, max: 100 },
      bloodPressure: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
      glucose: { min: 70, max: 140 },
      steps: { daily: 10000 },
      sleep: { hours: 7 }
    }
  },

  // Personalized health prediction settings
  healthPrediction: {
    enabled: true,
    models: {
      diseaseRisk: true,
      wellnessScore: true,
      interventionEffectiveness: true
    },
    dataSources: ['wearables', 'sensors', 'ehr', 'labResults'],
    updateFrequency: 86400000, // 24 hours in milliseconds
    confidenceThreshold: 0.75
  },

  // Security and compliance settings
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM',
      keyLength: 256,
      ivLength: 12
    },
    audit: {
      enabled: true,
      logLevel: 'info',
      retention: 31536000000 // 1 year in milliseconds
    },
    compliance: {
      hipaa: true,
      gdpr: true,
      fda: true
    }
  },

  // Performance settings
  performance: {
    caching: {
      enabled: true,
      ttl: 300000, // 5 minutes in milliseconds
      maxSize: 10000
    },
    concurrency: {
      maxWorkers: 10,
      queueSize: 1000
    }
  }
};

module.exports = config;