/**
 * Visualization Configuration
 * Configuration for the research visualization engine
 */

module.exports = {
  // Visualization engine configuration
  engine: {
    name: 'Research Visualization Engine',
    version: '1.0.0',
    maxConcurrentVisualizations: 5,
    timeout: 120000 // 2 minutes
  },

  // Chart types configuration
  chartTypes: {
    bar: {
      name: 'Bar Chart',
      description: 'Bar chart for categorical data visualization',
      supported: true,
      maxDataPoints: 1000
    },
    line: {
      name: 'Line Chart',
      description: 'Line chart for time series data visualization',
      supported: true,
      maxDataPoints: 5000
    },
    pie: {
      name: 'Pie Chart',
      description: 'Pie chart for proportional data visualization',
      supported: true,
      maxSlices: 20
    },
    scatter: {
      name: 'Scatter Plot',
      description: 'Scatter plot for correlation analysis',
      supported: true,
      maxDataPoints: 10000
    },
    heatmap: {
      name: 'Heatmap',
      description: 'Heatmap for density and correlation visualization',
      supported: true,
      maxSize: 10000
    },
    tree: {
      name: 'Tree Diagram',
      description: 'Tree diagram for hierarchical data visualization',
      supported: true,
      maxNodes: 1000
    },
    network: {
      name: 'Network Graph',
      description: 'Network graph for relationship visualization',
      supported: true,
      maxNodes: 500
    },
    timeline: {
      name: 'Timeline',
      description: 'Timeline for temporal data visualization',
      supported: true,
      maxEvents: 1000
    },
    citationNetwork: {
      name: 'Citation Network',
      description: 'Network visualization of citation relationships',
      supported: true,
      maxNodes: 1000
    },
    researchTrends: {
      name: 'Research Trends',
      description: 'Trend analysis visualization for research topics',
      supported: true,
      maxDataPoints: 5000
    },
    collaborationMap: {
      name: 'Collaboration Map',
      description: 'Geographic collaboration network visualization',
      supported: true,
      maxNodes: 500
    },
    impactMetrics: {
      name: 'Impact Metrics',
      description: 'Research impact metrics visualization',
      supported: true,
      maxDataPoints: 1000
    },
    trialMatchingResults: {
      name: 'Trial Matching Results',
      description: 'Clinical trial matching results visualization',
      supported: true,
      maxResults: 100
    },
    literatureEntities: {
      name: 'Literature Entities',
      description: 'Named entity extraction visualization',
      supported: true,
      maxEntities: 1000
    },
    literatureTopics: {
      name: 'Literature Topics',
      description: 'Topic modeling visualization',
      supported: true,
      maxTopics: 50
    },
    literatureSentiment: {
      name: 'Literature Sentiment',
      description: 'Sentiment analysis visualization',
      supported: true,
      maxDataPoints: 2000
    }
  },

  // Visualization components
  components: {
    citationNetwork: {
      name: 'Citation Network',
      description: 'Network visualization of citation relationships',
      supported: true,
      maxNodes: 1000
    },
    researchTrends: {
      name: 'Research Trends',
      description: 'Trend analysis visualization for research topics',
      supported: true,
      maxDataPoints: 5000
    },
    collaborationMap: {
      name: 'Collaboration Map',
      description: 'Geographic collaboration network visualization',
      supported: true,
      maxNodes: 500
    },
    impactMetrics: {
      name: 'Impact Metrics',
      description: 'Research impact metrics visualization',
      supported: true,
      maxDataPoints: 1000
    },
    trialMatchingResults: {
      name: 'Trial Matching Results',
      description: 'Clinical trial matching results visualization',
      supported: true,
      maxResults: 100
    },
    literatureEntities: {
      name: 'Literature Entities',
      description: 'Named entity extraction visualization',
      supported: true,
      maxEntities: 1000
    },
    literatureTopics: {
      name: 'Literature Topics',
      description: 'Topic modeling visualization',
      supported: true,
      maxTopics: 50
    },
    literatureSentiment: {
      name: 'Literature Sentiment',
      description: 'Sentiment analysis visualization',
      supported: true,
      maxDataPoints: 2000
    }
  },

  // Color schemes
  colorSchemes: {
    citationNetwork: {
      primary: '#3498db',
      secondary: '#2980b9',
      highlight: '#e74c3c',
      background: '#ffffff'
    },
    researchTrends: {
      primary: '#2ecc71',
      secondary: '#27ae60',
      highlight: '#f39c12',
      background: '#ffffff'
    },
    collaborationMap: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      highlight: '#3498db',
      background: '#ffffff'
    },
    impactMetrics: {
      primary: '#e67e22',
      secondary: '#d35400',
      highlight: '#f1c40f',
      background: '#ffffff'
    },
    trialMatchingResults: {
      primary: '#1abc9c',
      secondary: '#16a085',
      highlight: '#3498db',
      background: '#ffffff'
    },
    literatureEntities: {
      primary: '#e74c3c',
      secondary: '#c0392b',
      highlight: '#f39c12',
      background: '#ffffff'
    },
    literatureTopics: {
      primary: '#34495e',
      secondary: '#2c3e50',
      highlight: '#95a5a6',
      background: '#ffffff'
    },
    literatureSentiment: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      highlight: '#e74c3c',
      background: '#ffffff'
    }
  },

  // Chart settings
  chartSettings: {
    responsive: true,
    animations: true,
    showTooltips: true,
    showLegend: true,
    defaultWidth: 800,
    defaultHeight: 600
  },

  // Export configuration
  export: {
    enabled: true,
    formats: ['png', 'svg', 'pdf', 'json'],
    defaultFormat: 'png',
    quality: 'high',
    maxFileSize: 10485760 // 10MB
  },

  // Visualization themes
  themes: {
    light: {
      name: 'Light Theme',
      description: 'Light color scheme for visualization',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      gridColor: '#e0e0e0'
    },
    dark: {
      name: 'Dark Theme',
      description: 'Dark color scheme for visualization',
      backgroundColor: '#1e1e1e',
      textColor: '#ffffff',
      gridColor: '#444444'
    },
    medical: {
      name: 'Medical Theme',
      description: 'Medical color scheme for healthcare visualization',
      backgroundColor: '#f8f9fa',
      textColor: '#212529',
      primaryColor: '#007bff',
      secondaryColor: '#28a745'
    }
  },

  // Export formats
  exportFormats: {
    png: {
      name: 'PNG',
      description: 'Portable Network Graphics format',
      quality: 'high',
      supported: true
    },
    svg: {
      name: 'SVG',
      description: 'Scalable Vector Graphics format',
      quality: 'vector',
      supported: true
    },
    pdf: {
      name: 'PDF',
      description: 'Portable Document Format',
      quality: 'print',
      supported: true
    },
    json: {
      name: 'JSON',
      description: 'JavaScript Object Notation data format',
      quality: 'data',
      supported: true
    }
  },

  // Performance settings
  performance: {
    maxRenderTime: 30000, // 30 seconds
    enableWebGL: true,
    enableCaching: true,
    maxCacheSize: 100
  },

  // Interactivity settings
  interactivity: {
    tooltips: true,
    zoom: true,
    pan: true,
    selection: true,
    animations: true,
    animationDuration: 1000
  }
};