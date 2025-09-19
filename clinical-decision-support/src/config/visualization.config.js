/**
 * Clinical Decision Support Visualization Configuration
 * Configuration for clinical decision support visualization components
 */

module.exports = {
  // Visualization engine settings
  engine: {
    name: 'Clinical Decision Support Visualization Engine',
    version: '1.0.0',
    description: 'Visualization engine for clinical decision support data',
    enabled: true,
    maxConcurrentVisualizations: 100,
    timeout: 30000 // 30 seconds
  },

  // Chart types configuration
  chartTypes: {
    barChart: {
      name: 'Bar Chart',
      description: 'Bar chart visualization for comparing data points',
      enabled: true,
      supportedDataTypes: ['recommendations', 'risk-assessment', 'treatment-effectiveness']
    },

    lineChart: {
      name: 'Line Chart',
      description: 'Line chart visualization for showing trends over time',
      enabled: true,
      supportedDataTypes: ['vital-signs', 'lab-results', 'patient-outcomes']
    },

    pieChart: {
      name: 'Pie Chart',
      description: 'Pie chart visualization for showing proportions',
      enabled: true,
      supportedDataTypes: ['condition-distribution', 'treatment-distribution', 'risk-distribution']
    },

    radarChart: {
      name: 'Radar Chart',
      description: 'Radar chart visualization for multi-dimensional data',
      enabled: true,
      supportedDataTypes: ['patient-profile', 'treatment-comparison', 'risk-factors']
    },

    heatmap: {
      name: 'Heatmap',
      description: 'Heatmap visualization for showing data density',
      enabled: true,
      supportedDataTypes: ['patient-population', 'treatment-outcomes', 'risk-correlation']
    },

    scatterPlot: {
      name: 'Scatter Plot',
      description: 'Scatter plot visualization for showing relationships',
      enabled: true,
      supportedDataTypes: ['patient-correlation', 'treatment-response', 'risk-factors']
    },

    treeMap: {
      name: 'Tree Map',
      description: 'Tree map visualization for hierarchical data',
      enabled: true,
      supportedDataTypes: ['condition-hierarchy', 'treatment-categories', 'department-structure']
    },

    networkDiagram: {
      name: 'Network Diagram',
      description: 'Network diagram visualization for relationships',
      enabled: true,
      supportedDataTypes: ['drug-interactions', 'condition-relationships', 'treatment-pathways']
    }
  },

  // Visualization components configuration
  components: {
    recommendationConfidence: {
      name: 'Recommendation Confidence Visualization',
      description: 'Visualization of recommendation confidence levels',
      chartType: 'barChart',
      dataType: 'recommendations',
      enabled: true,
      thresholds: {
        high: 0.9,
        medium: 0.7,
        low: 0.5
      }
    },

    riskAssessment: {
      name: 'Risk Assessment Visualization',
      description: 'Visualization of patient risk assessment',
      chartType: 'radarChart',
      dataType: 'risk-assessment',
      enabled: true,
      riskLevels: {
        critical: 90,
        high: 70,
        medium: 50,
        low: 30
      }
    },

    treatmentEffectiveness: {
      name: 'Treatment Effectiveness Visualization',
      description: 'Visualization of treatment effectiveness over time',
      chartType: 'lineChart',
      dataType: 'treatment-effectiveness',
      enabled: true,
      effectivenessLevels: {
        excellent: 90,
        good: 70,
        fair: 50,
        poor: 30
      }
    },

    conditionDistribution: {
      name: 'Condition Distribution Visualization',
      description: 'Visualization of condition distribution among patients',
      chartType: 'pieChart',
      dataType: 'condition-distribution',
      enabled: true
    },

    vitalSignsTrend: {
      name: 'Vital Signs Trend Visualization',
      description: 'Visualization of vital signs trends over time',
      chartType: 'lineChart',
      dataType: 'vital-signs',
      enabled: true
    },

    drugInteractionNetwork: {
      name: 'Drug Interaction Network Visualization',
      description: 'Visualization of drug interaction relationships',
      chartType: 'networkDiagram',
      dataType: 'drug-interactions',
      enabled: true
    },

    patientOutcomeCorrelation: {
      name: 'Patient Outcome Correlation Visualization',
      description: 'Visualization of patient outcome correlations',
      chartType: 'scatterPlot',
      dataType: 'patient-correlation',
      enabled: true
    },

    treatmentPathway: {
      name: 'Treatment Pathway Visualization',
      description: 'Visualization of treatment pathways and decisions',
      chartType: 'treeMap',
      dataType: 'treatment-pathways',
      enabled: true
    }
  },

  // Color schemes
  colorSchemes: {
    confidenceLevels: {
      high: '#4CAF50',    // Green
      medium: '#FFC107',  // Amber
      low: '#F44336'      // Red
    },

    riskLevels: {
      critical: '#F44336',  // Red
      high: '#FF9800',      // Orange
      medium: '#FFC107',    // Amber
      low: '#4CAF50'        // Green
    },

    treatmentEffectiveness: {
      excellent: '#4CAF50',  // Green
      good: '#8BC34A',       // Light Green
      fair: '#FFC107',       // Amber
      poor: '#F44336'        // Red
    },

    default: {
      primary: '#2196F3',    // Blue
      secondary: '#9C27B0',  // Purple
      accent: '#FF5722',     // Deep Orange
      neutral: '#607D8B'     // Blue Grey
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
    formats: ['png', 'jpg', 'pdf', 'svg'],
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