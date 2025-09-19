/**
 * Research Workflow Configuration
 * Configuration for research workflow management
 */

module.exports = {
  // Workflow engine settings
  engine: {
    name: 'Research Workflow Engine',
    version: '1.0.0',
    description: 'Workflow engine for research processes',
    enabled: true,
    maxConcurrentWorkflows: 50,
    timeout: 60000 // 60 seconds
  },

  // Workflow definitions
  workflows: {
    literatureReview: {
      name: 'Literature Review Workflow',
      description: 'Workflow for conducting systematic literature reviews',
      version: '1.0.0',
      steps: [
        'documentCollection',
        'preprocessing',
        'entityExtraction',
        'topicModeling',
        'sentimentAnalysis',
        'summarization',
        'reportGeneration'
      ],
      enabled: true,
      timeout: 30000 // 30 seconds
    },

    clinicalTrialMatching: {
      name: 'Clinical Trial Matching Workflow',
      description: 'Workflow for matching patients to clinical trials',
      version: '1.0.0',
      steps: [
        'patientProfileAnalysis',
        'trialDatabaseQuery',
        'eligibilityMatching',
        'ranking',
        'recommendationGeneration'
      ],
      enabled: true,
      timeout: 30000 // 30 seconds
    },

    researchImpactAnalysis: {
      name: 'Research Impact Analysis Workflow',
      description: 'Workflow for analyzing research impact metrics',
      version: '1.0.0',
      steps: [
        'citationCollection',
        'metricAggregation',
        'trendAnalysis',
        'impactScoring',
        'reportGeneration'
      ],
      enabled: true,
      timeout: 25000 // 25 seconds
    },

    collaborativeResearch: {
      name: 'Collaborative Research Workflow',
      description: 'Workflow for managing collaborative research projects',
      version: '1.0.0',
      steps: [
        'projectSetup',
        'collaboratorInvitation',
        'documentSharing',
        'realTimeCollaboration',
        'versionControl',
        'reviewAndApproval'
      ],
      enabled: true,
      timeout: 20000 // 20 seconds
    }
  },

  // Workflow steps configuration
  steps: {
    documentCollection: {
      name: 'Document Collection',
      description: 'Collect research documents from various sources',
      timeout: 5000,
      requiredInputs: ['sources', 'searchTerms']
    },

    preprocessing: {
      name: 'Document Preprocessing',
      description: 'Preprocess documents for analysis',
      timeout: 3000,
      requiredInputs: ['documents']
    },

    entityExtraction: {
      name: 'Entity Extraction',
      description: 'Extract medical entities from documents',
      timeout: 4000,
      requiredInputs: ['documents']
    },

    topicModeling: {
      name: 'Topic Modeling',
      description: 'Identify topics in research documents',
      timeout: 5000,
      requiredInputs: ['documents']
    },

    sentimentAnalysis: {
      name: 'Sentiment Analysis',
      description: 'Analyze sentiment in research documents',
      timeout: 3000,
      requiredInputs: ['documents']
    },

    summarization: {
      name: 'Document Summarization',
      description: 'Generate summaries of research documents',
      timeout: 4000,
      requiredInputs: ['documents']
    },

    reportGeneration: {
      name: 'Report Generation',
      description: 'Generate comprehensive analysis reports',
      timeout: 3000,
      requiredInputs: ['analysisResults']
    },

    patientProfileAnalysis: {
      name: 'Patient Profile Analysis',
      description: 'Analyze patient profile for trial matching',
      timeout: 2000,
      requiredInputs: ['patientProfile']
    },

    trialDatabaseQuery: {
      name: 'Trial Database Query',
      description: 'Query clinical trial databases',
      timeout: 5000,
      requiredInputs: ['condition', 'criteria']
    },

    eligibilityMatching: {
      name: 'Eligibility Matching',
      description: 'Match patient to trial eligibility criteria',
      timeout: 3000,
      requiredInputs: ['patientData', 'trialCriteria']
    },

    ranking: {
      name: 'Trial Ranking',
      description: 'Rank matching trials by suitability',
      timeout: 2000,
      requiredInputs: ['matches']
    },

    recommendationGeneration: {
      name: 'Recommendation Generation',
      description: 'Generate trial recommendations',
      timeout: 2000,
      requiredInputs: ['rankedTrials']
    },

    citationCollection: {
      name: 'Citation Collection',
      description: 'Collect citations for research work',
      timeout: 5000,
      requiredInputs: ['researchId']
    },

    metricAggregation: {
      name: 'Metric Aggregation',
      description: 'Aggregate research impact metrics',
      timeout: 3000,
      requiredInputs: ['citations', 'downloads', 'mentions']
    },

    trendAnalysis: {
      name: 'Trend Analysis',
      description: 'Analyze research impact trends',
      timeout: 4000,
      requiredInputs: ['metrics']
    },

    impactScoring: {
      name: 'Impact Scoring',
      description: 'Calculate research impact scores',
      timeout: 2000,
      requiredInputs: ['trends']
    },

    projectSetup: {
      name: 'Project Setup',
      description: 'Set up collaborative research project',
      timeout: 2000,
      requiredInputs: ['projectData']
    },

    collaboratorInvitation: {
      name: 'Collaborator Invitation',
      description: 'Invite collaborators to research project',
      timeout: 2000,
      requiredInputs: ['collaborators', 'projectId']
    },

    documentSharing: {
      name: 'Document Sharing',
      description: 'Share documents among collaborators',
      timeout: 3000,
      requiredInputs: ['documents', 'projectId']
    },

    realTimeCollaboration: {
      name: 'Real-time Collaboration',
      description: 'Enable real-time collaborative editing',
      timeout: 1000,
      requiredInputs: ['documentId']
    },

    versionControl: {
      name: 'Version Control',
      description: 'Manage document versions',
      timeout: 2000,
      requiredInputs: ['documentId']
    },

    reviewAndApproval: {
      name: 'Review and Approval',
      description: 'Review and approve research outputs',
      timeout: 3000,
      requiredInputs: ['documentId']
    }
  },

  // Workflow execution settings
  execution: {
    parallelSteps: true,
    maxRetries: 3,
    retryDelay: 1000,
    errorHandling: {
      strategy: 'fail-fast',
      logErrors: true,
      notifyOnFailure: true
    }
  },

  // Workflow monitoring settings
  monitoring: {
    enabled: true,
    logLevel: 'info',
    metricsCollection: true,
    performanceTracking: true,
    auditLogging: true
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