/**
 * Clinical Decision Support Configuration
 * Configuration for the clinical decision support system
 */

module.exports = {
  // Decision support service settings
  service: {
    name: 'Clinical Decision Support Service',
    version: '1.0.0',
    description: 'Real-time AI-powered clinical decision support for healthcare providers',
    enabled: true,
    maxConcurrentRequests: 100,
    timeout: 30000 // 30 seconds
  },

  // Decision models configuration
  models: {
    diagnosisSupport: {
      name: 'Diagnosis Support Model',
      description: 'Provides differential diagnosis recommendations',
      version: '1.0.0',
      confidenceThreshold: 0.95,
      enabled: true
    },
    treatmentRecommendation: {
      name: 'Treatment Recommendation Model',
      description: 'Provides evidence-based treatment recommendations',
      version: '1.0.0',
      confidenceThreshold: 0.90,
      enabled: true
    },
    riskAssessment: {
      name: 'Risk Assessment Model',
      description: 'Assesses patient risk for various conditions',
      version: '1.0.0',
      confidenceThreshold: 0.85,
      enabled: true
    },
    drugInteraction: {
      name: 'Drug Interaction Model',
      description: 'Identifies potential drug interactions',
      version: '1.0.0',
      confidenceThreshold: 0.95,
      enabled: true
    },
    clinicalAlert: {
      name: 'Clinical Alert Model',
      description: 'Generates clinical alerts for critical conditions',
      version: '1.0.0',
      confidenceThreshold: 0.99,
      enabled: true
    }
  },

  // Clinical guidelines
  guidelines: {
    hypertension: {
      condition: 'hypertension',
      guidelines: [
        'First-line treatment: ACE inhibitors or ARBs',
        'Target BP: <130/80 mmHg for high-risk patients',
        'Lifestyle modifications: Diet, exercise, weight loss'
      ],
      evidenceLevel: 'A'
    },
    diabetes: {
      condition: 'diabetes',
      guidelines: [
        'HbA1c target: <7% for most patients',
        'First-line treatment: Metformin',
        'Regular monitoring of kidney function'
      ],
      evidenceLevel: 'A'
    },
    heartFailure: {
      condition: 'heart-failure',
      guidelines: [
        'ACE inhibitors and beta-blockers as first-line',
        'Diuretics for fluid management',
        'Regular monitoring of weight and symptoms'
      ],
      evidenceLevel: 'A'
    }
  },

  // Alert settings
  alerts: {
    critical: {
      severity: 'critical',
      priority: 1,
      requiresImmediateAttention: true,
      escalationTime: 300000 // 5 minutes
    },
    high: {
      severity: 'high',
      priority: 2,
      requiresAttention: true,
      escalationTime: 900000 // 15 minutes
    },
    medium: {
      severity: 'medium',
      priority: 3,
      requiresMonitoring: true,
      escalationTime: 3600000 // 1 hour
    },
    low: {
      severity: 'low',
      priority: 4,
      informational: true,
      escalationTime: 86400000 // 24 hours
    }
  },

  // Storage settings
  storage: {
    decisionHistory: {
      enabled: true,
      retentionDays: 365,
      maxSize: 10000
    },
    alerts: {
      enabled: true,
      retentionDays: 90,
      maxSize: 5000
    }
  },

  // Security settings
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM'
    },
    auditLogging: {
      enabled: true,
      retentionDays: 365
    },
    accessControl: {
      enabled: true,
      roleBasedAccess: true
    }
  },

  // Compliance settings
  compliance: {
    hipaa: {
      enabled: true,
      dataEncryption: true,
      auditLogging: true
    },
    gdpr: {
      enabled: true,
      dataProtection: true,
      consentManagement: true
    }
  }
};