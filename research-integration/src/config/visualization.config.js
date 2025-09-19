/**
 * Research Visualization Configuration
 * Configuration for research data visualization tools
 */

module.exports = {
  // Visualization engine settings
  engine: {
    name: 'Research Visualization Engine',
    version: '1.0.0',
    description: 'Visualization engine for research data',
    enabled: true,
    maxConcurrentVisualizations: 100,
    timeout: 30000 // 30 seconds
  },

  // Chart types configuration
  chartTypes: {
    citationNetwork: {
      name: 'Citation Network',
      description: 'Network visualization of citation relationships',
      enabled: true,
      supportedDataTypes: ['citations', 'references', 'collaborations']
    },

    researchTrends: {
      name: 'Research Trends',
      description: 'Line chart visualization of research trends over time',
      enabled: true,
      supportedDataTypes: ['publications', 'citations', 'funding']
    },

    collaborationMap: {
      name: 'Collaboration Map',
      description: 'Geographic visualization of research collaborations',
      enabled: true,
      supportedDataTypes: ['collaborators', 'institutions', 'countries']
    },

    impactMetrics: {
      name: 'Impact Metrics',
      description: 'Bar chart visualization of research impact metrics',
      enabled: true,
      supportedDataTypes: ['citations', 'downloads', 'mentions', 'altmetric']
    },

    trialMatchingResults: {
      name: 'Trial Matching Results',
      description: 'Visualization of clinical trial matching results',
      enabled: true,
      supportedDataTypes: ['eligibility', 'ranking', 'recommendations']
    },

    literatureAnalysis: {
      name: 'Literature Analysis',
      description: 'Visualization of literature analysis results',
      enabled: true,
      supportedDataTypes: ['entities', 'topics', 'sentiment']
    },

    researchProjectTimeline: {
      name: 'Research Project Timeline',
      description: 'Timeline visualization of research project milestones',
      enabled: true,
      supportedDataTypes: ['milestones', 'deliverables', 'phases']
    },

    researcherNetwork: {
      name: 'Researcher Network',
      description: 'Network visualization of researcher collaborations',
      enabled: true,
      supportedDataTypes: ['collaborations', 'coauthors', 'institutions']
    }
  },

  // Visualization components configuration
  components: {
    citationNetwork: {
      name: 'Citation Network Visualization',
      description: 'Visualization of citation relationships between research papers',
      chartType: 'citationNetwork',
      dataType: 'citations',
      enabled: true
    },

    researchTrends: {
      name: 'Research Trends Visualization',
      description: 'Visualization of research trends over time',
      chartType: 'researchTrends',
      dataType: 'publications',
      enabled: true
    },

    collaborationMap: {
      name: 'Collaboration Map Visualization',
      description: 'Geographic visualization of research collaborations',
      chartType: 'collaborationMap',
      dataType: 'collaborators',
      enabled: true
    },

    impactMetrics: {
      name: 'Impact Metrics Visualization',
      description: 'Visualization of research impact metrics',
      chartType: 'impactMetrics',
      dataType: 'citations',
      enabled: true
    },

    trialMatchingResults: {
      name: 'Trial Matching Results Visualization',
      description: 'Visualization of clinical trial matching results',
      chartType: 'trialMatchingResults',
      dataType: 'eligibility',
      enabled: true
    },

    literatureEntities: {
      name: 'Literature Entities Visualization',
      description: 'Visualization of entities extracted from literature',
      chartType: 'literatureAnalysis',
      dataType: 'entities',
      enabled: true
    },

    literatureTopics: {
      name: 'Literature Topics Visualization',
      description: 'Visualization of topics identified in literature',
      chartType: 'literatureAnalysis',
      dataType: 'topics',
      enabled: true
    },

    literatureSentiment: {
      name: 'Literature Sentiment Visualization',
      description: 'Visualization of sentiment in literature',
      chartType: 'literatureAnalysis',
      dataType: 'sentiment',
      enabled: true
    }
  },

  // Color schemes
  colorSchemes: {
    citationNetwork: {
      node: '#3498db',
      edge: '#95a5a6',
      highlight: '#e74c3c'
    },

    researchTrends: {
      line: '#3498db',
      fill: '#e3f2fd',
      point: '#2980b9'
    },

    collaborationMap: {
      marker: '#27ae60',
      connection: '#f39c12',
      highlight: '#e74c3c'
    },

    impactMetrics: {
      bar: '#9b59b6',
      highlight: '#8e44ad'
    },

    trialMatching: {
      high: '#27ae60',
      medium: '#f39c12',
      low: '#e74c3c'
    },

    literatureAnalysis: {
      entities: '#3498db',
      topics: '#9b59b6',
      sentiment: {
        positive: '#27ae60',
        neutral: '#f39c12',
        negative: '#e74c3c'
      }
    },

    default: {
      primary: '#3498db',
      secondary: '#2c3e50',
      accent: '#e74c3c',
      neutral: '#95a5a6'
    }
  },

  // Chart settings
  chartSettings: {
    responsive: true,
    animations: true,
    animationDuration: 1000,
    showTooltips: true,
    showLegend: true,
    showGrid: true,
    showAxisLabels: true,
    fontSize: 12,
    fontFamily: 'Segoe UI, sans-serif'
  },

  // Export settings
  export: {
    enabled: true,
    formats: ['png', 'jpg', 'pdf', 'svg', 'csv', 'json'],
    quality: 'high',
    maxWidth: 1920,
    maxHeight: 1080
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