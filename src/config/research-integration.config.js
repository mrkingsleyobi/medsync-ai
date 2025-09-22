/**
 * Research Integration Configuration
 * Configuration for research integration services
 */

module.exports = {
  // Literature analysis configuration
  literatureAnalysis: {
    enabled: true,
    defaultSources: ['PubMed', 'arXiv', 'IEEE Xplore'],
    analysisDepth: 'standard',
    entityTypes: ['PERSON', 'ORG', 'GPE', 'DATE', 'MONEY'],
    topicModeling: true,
    sentimentAnalysis: true,
    maxConcurrentRequests: 5,
    requestTimeout: 30000,
    sources: {
      pubmed: {
        enabled: true,
        baseUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
        maxResults: 1000,
        rateLimit: 3 // requests per second
      },
      arxiv: {
        enabled: true,
        baseUrl: 'http://export.arxiv.org/api/',
        maxResults: 1000,
        rateLimit: 1 // requests per second
      },
      ieee: {
        enabled: false, // Disabled by default
        baseUrl: 'https://ieeexploreapi.ieee.org/api/v1/',
        maxResults: 500,
        rateLimit: 1 // requests per second
      }
    },
    processing: {
      maxBatchSize: 50,
      entityExtraction: {
        enabled: true,
        model: 'en_core_web_sm'
      },
      sentimentAnalysis: {
        enabled: true,
        model: 'vader'
      },
      topicModeling: {
        enabled: true,
        algorithm: 'lda',
        numTopics: 10
      }
    }
  },

  // Clinical trial matching configuration
  clinicalTrialMatching: {
    enabled: true,
    matchingThreshold: 0.8,
    trialDatabases: ['clinicaltrials.gov', 'euclinicaltrials.eu'],
    notificationMethods: ['email', 'inApp'],
    maxConcurrentRequests: 3,
    requestTimeout: 45000,
    autoRefresh: true,
    refreshInterval: 300
  },

  // Research impact configuration
  researchImpact: {
    enabled: true,
    trackedMetrics: ['citations', 'downloads', 'social_mentions', 'usage_statistics'],
    trackingPeriods: ['30_days', '90_days', '1_year'],
    reportFrequency: 'weekly',
    visualizationType: 'dashboard'
  },

  // Collaborative research configuration
  collaborativeResearch: {
    enabled: true,
    collaborationNotifications: true,
    defaultPermissions: 'team',
    fileSharing: true,
    realTimeCollaboration: true,
    versionControl: true
  },

  // Researcher collaboration configuration
  collaboration: {
    enabled: true,
    maxProjectMembers: 50,
    fileSharing: {
      enabled: true,
      maxFileSize: 104857600, // 100MB
      supportedTypes: ['pdf', 'doc', 'docx', 'txt', 'md', 'csv', 'xls', 'xlsx']
    },
    realTimeEditing: {
      enabled: true,
      maxConcurrentEditors: 10
    },
    versionControl: {
      enabled: true,
      autoCommit: true,
      commitInterval: 300000 // 5 minutes
    }
  },

  // Research impact analysis configuration
  impactAnalysis: {
    enabled: true,
    metrics: {
      citationBased: {
        enabled: true,
        sources: ['google-scholar', 'crossref', 'pubmed']
      },
      usageBased: {
        enabled: true,
        metrics: ['downloads', 'views', 'shares']
      },
      socialMedia: {
        enabled: true,
        platforms: ['twitter', 'facebook', 'linkedin']
      }
    },
    analysisPeriod: {
      shortTerm: 90, // days
      mediumTerm: 365, // days
      longTerm: 1095 // days (3 years)
    }
  },

  // Clinical trial integration configuration
  clinicalTrials: {
    enabled: true,
    sources: {
      clinicaltrialsGov: {
        enabled: true,
        baseUrl: 'https://clinicaltrials.gov/api/',
        maxResults: 1000
      },
      euClinicalTrials: {
        enabled: true,
        baseUrl: 'https://www.clinicaltrialsregister.eu/ctr-search/rest/',
        maxResults: 1000
      }
    },
    matching: {
      algorithm: 'hybrid',
      maxMatches: 50,
      includeHistorical: true,
      historicalPeriod: 365 // days
    }
  },

  // Research recommendation configuration
  recommendations: {
    enabled: true,
    algorithms: {
      contentBased: {
        enabled: true,
        weight: 0.4
      },
      collaborative: {
        enabled: true,
        weight: 0.3
      },
      citationBased: {
        enabled: true,
        weight: 0.2
      },
      trendBased: {
        enabled: true,
        weight: 0.1
      }
    },
    maxRecommendations: 20,
    updateFrequency: 86400000 // 24 hours
  },

  // Security and compliance
  security: {
    encryption: true,
    accessControl: true,
    auditLogging: true,
    compliance: {
      hipaa: true,
      gdpr: true
    }
  },

  // Rate limiting configuration
  rateLimiting: {
    enabled: true,
    requestsPerHour: 1000,
    requestsPerMinute: 50
  },

  // Performance settings
  performance: {
    maxConcurrentOperations: 10,
    cacheEnabled: true,
    cacheTTL: 3600000, // 1 hour
    requestTimeout: 60000 // 1 minute
  }
};
