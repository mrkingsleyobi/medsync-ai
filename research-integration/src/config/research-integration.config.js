/**
 * Research Integration Configuration
 * Configuration for research integration services
 */

module.exports = {
  // Research integration settings
  integration: {
    name: 'Research Integration Service',
    version: '1.0.0',
    description: 'Service for integrating medical research capabilities',
    enabled: true,
    maxConcurrentResearchTasks: 50,
    timeout: 60000 // 60 seconds
  },

  // Literature analysis settings
  literatureAnalysis: {
    name: 'Literature Analysis',
    description: 'Settings for medical literature analysis',
    enabled: true,
    maxDocumentsPerAnalysis: 1000,
    supportedFormats: ['pdf', 'txt', 'xml', 'json'],
    analysisModels: {
      entityExtraction: 'medical-entity-extractor-v1',
      sentimentAnalysis: 'medical-sentiment-analyzer-v1',
      topicModeling: 'medical-topic-modeler-v1',
      summarization: 'medical-summarizer-v1'
    }
  },

  // Clinical trial matching settings
  clinicalTrialMatching: {
    name: 'Clinical Trial Matching',
    description: 'Settings for clinical trial matching service',
    enabled: true,
    matchingThreshold: 0.8,
    maxTrialsPerMatch: 50,
    trialDatabases: [
      'clinicaltrials.gov',
      'who.int/trialsearch',
      'euctr.europa.eu',
      'jrct.niph.go.jp'
    ]
  },

  // Research impact tracking settings
  researchImpact: {
    name: 'Research Impact Tracking',
    description: 'Settings for tracking research impact',
    enabled: true,
    metrics: {
      citations: true,
      downloads: true,
      socialMediaMentions: true,
      clinicalAdoption: true,
      patientOutcomes: true
    },
    trackingPeriods: {
      shortTerm: 30, // days
      mediumTerm: 180, // days
      longTerm: 365 // days
    }
  },

  // Collaborative research settings
  collaborativeResearch: {
    name: 'Collaborative Research',
    description: 'Settings for collaborative research environment',
    enabled: true,
    maxCollaboratorsPerProject: 50,
    fileSharing: {
      maxFileSize: 100 * 1024 * 1024, // 100MB
      supportedFormats: ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png', 'csv']
    },
    realTimeCollaboration: {
      enabled: true,
      maxParticipants: 25
    }
  },

  // Research workflow settings
  workflows: {
    name: 'Research Workflows',
    description: 'Settings for research workflow management',
    enabled: true,
    workflowTypes: {
      literatureReview: {
        name: 'Literature Review Workflow',
        steps: [
          'documentCollection',
          'preprocessing',
          'entityExtraction',
          'topicModeling',
          'sentimentAnalysis',
          'summarization',
          'reportGeneration'
        ]
      },
      clinicalTrialMatching: {
        name: 'Clinical Trial Matching Workflow',
        steps: [
          'patientProfileAnalysis',
          'trialDatabaseQuery',
          'eligibilityMatching',
          'ranking',
          'recommendationGeneration'
        ]
      },
      researchImpactAnalysis: {
        name: 'Research Impact Analysis Workflow',
        steps: [
          'citationCollection',
          'metricAggregation',
          'trendAnalysis',
          'impactScoring',
          'reportGeneration'
        ]
      }
    }
  },

  // Research visualization settings
  visualization: {
    name: 'Research Visualization',
    description: 'Settings for research data visualization',
    enabled: true,
    chartTypes: [
      'citationNetwork',
      'researchTrends',
      'collaborationMap',
      'impactMetrics',
      'trialMatchingResults'
    ],
    exportFormats: ['png', 'jpg', 'pdf', 'svg', 'csv', 'json']
  },

  // Researcher preference settings
  preferences: {
    name: 'Researcher Preferences',
    description: 'Settings for researcher preference management',
    enabled: true,
    preferenceCategories: [
      'literatureAnalysis',
      'clinicalTrialMatching',
      'researchImpact',
      'collaborativeResearch',
      'notifications'
    ]
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