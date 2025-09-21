/**
 * Workflow Configuration
 * Configuration for the research workflow engine
 */

module.exports = {
  // Workflow engine configuration
  engine: {
    name: 'Research Workflow Engine',
    version: '1.0.0',
    maxConcurrentWorkflows: 10,
    timeout: 300000 // 5 minutes
  },

  // Workflow definitions
  workflows: {
    literatureReview: {
      name: 'Literature Review',
      description: 'Automated literature review and analysis workflow',
      steps: ['documentCollection', 'preprocessing', 'entityExtraction', 'topicModeling', 'sentimentAnalysis', 'summarization', 'reportGeneration']
    },
    clinicalTrialMatching: {
      name: 'Clinical Trial Matching',
      description: 'Patient-to-trial matching workflow',
      steps: ['patientProfileAnalysis', 'trialDatabaseQuery', 'eligibilityMatching', 'ranking', 'recommendationGeneration']
    },
    researchImpactAnalysis: {
      name: 'Research Impact Analysis',
      description: 'Research impact and trend analysis workflow',
      steps: ['citationCollection', 'metricAggregation', 'trendAnalysis', 'impactScoring', 'reportGeneration']
    },
    collaborativeResearch: {
      name: 'Collaborative Research',
      description: 'Collaborative research project workflow',
      steps: ['projectSetup', 'collaboratorInvitation', 'documentSharing', 'realTimeCollaboration', 'versionControl', 'reviewAndApproval']
    }
  },

  // Workflow steps configuration
  steps: {
    // Literature Review Steps
    documentCollection: {
      name: 'Document Collection',
      description: 'Collect research documents from multiple sources',
      timeout: 60000,
      retryCount: 3
    },
    preprocessing: {
      name: 'Preprocessing',
      description: 'Text preprocessing and cleaning',
      timeout: 30000,
      retryCount: 2
    },
    entityExtraction: {
      name: 'Entity Extraction',
      description: 'Extract named entities from documents',
      timeout: 120000,
      retryCount: 2
    },
    topicModeling: {
      name: 'Topic Modeling',
      description: 'Identify and categorize document topics',
      timeout: 180000,
      retryCount: 1
    },
    sentimentAnalysis: {
      name: 'Sentiment Analysis',
      description: 'Analyze sentiment in research documents',
      timeout: 90000,
      retryCount: 2
    },
    summarization: {
      name: 'Summarization',
      description: 'Generate document summaries',
      timeout: 150000,
      retryCount: 2
    },
    reportGeneration: {
      name: 'Report Generation',
      description: 'Generate comprehensive analysis reports',
      timeout: 120000,
      retryCount: 1
    },

    // Clinical Trial Matching Steps
    patientProfileAnalysis: {
      name: 'Patient Profile Analysis',
      description: 'Analyze patient medical profile',
      timeout: 30000,
      retryCount: 2
    },
    trialDatabaseQuery: {
      name: 'Trial Database Query',
      description: 'Query clinical trial databases',
      timeout: 60000,
      retryCount: 3
    },
    eligibilityMatching: {
      name: 'Eligibility Matching',
      description: 'Match patient to trial eligibility criteria',
      timeout: 90000,
      retryCount: 2
    },
    ranking: {
      name: 'Ranking',
      description: 'Rank matching trials by relevance',
      timeout: 45000,
      retryCount: 1
    },
    recommendationGeneration: {
      name: 'Recommendation Generation',
      description: 'Generate trial recommendations',
      timeout: 30000,
      retryCount: 1
    },

    // Research Impact Analysis Steps
    citationCollection: {
      name: 'Citation Collection',
      description: 'Collect citation data for research papers',
      timeout: 120000,
      retryCount: 3
    },
    metricAggregation: {
      name: 'Metric Aggregation',
      description: 'Aggregate research metrics',
      timeout: 90000,
      retryCount: 1
    },
    trendAnalysis: {
      name: 'Trend Analysis',
      description: 'Analyze research trends over time',
      timeout: 150000,
      retryCount: 1
    },
    impactScoring: {
      name: 'Impact Scoring',
      description: 'Calculate research impact scores',
      timeout: 60000,
      retryCount: 2
    },

    // Collaborative Research Steps
    projectSetup: {
      name: 'Project Setup',
      description: 'Set up collaborative research project',
      timeout: 30000,
      retryCount: 1
    },
    collaboratorInvitation: {
      name: 'Collaborator Invitation',
      description: 'Invite collaborators to project',
      timeout: 30000,
      retryCount: 3
    },
    documentSharing: {
      name: 'Document Sharing',
      description: 'Share research documents with collaborators',
      timeout: 45000,
      retryCount: 2
    },
    realTimeCollaboration: {
      name: 'Real-time Collaboration',
      description: 'Enable real-time collaborative editing',
      timeout: 0, // No timeout for real-time collaboration
      retryCount: 0
    },
    versionControl: {
      name: 'Version Control',
      description: 'Manage document versions and changes',
      timeout: 60000,
      retryCount: 2
    },
    reviewAndApproval: {
      name: 'Review and Approval',
      description: 'Review and approve research changes',
      timeout: 90000,
      retryCount: 2
    }
  },

  // Execution configuration
  execution: {
    parallelSteps: true,
    maxRetries: 3,
    errorHandling: {
      strategy: 'retryThenFail',
      maxRetryDelay: 30000,
      notifyOnFailure: true
    }
  }
};