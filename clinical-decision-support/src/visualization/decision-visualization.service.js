/**
 * Decision Visualization Service
 * Service for creating visualizations of clinical decision support data
 */

const config = require('../config/visualization.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

class DecisionVisualizationService {
  /**
   * Create a new Decision Visualization Service
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.visualizations = new Map();
    this.chartTypes = config.chartTypes;
    this.components = config.components;
    this.colorSchemes = config.colorSchemes;

    this.logger.info('Decision Visualization Service created', {
      service: 'decision-visualization-service'
    });
  }

  /**
   * Create logger instance
   * @returns {Object} Winston logger instance
   */
  _createLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'decision-visualization-service' },
      transports: [
        new winston.transports.File({ filename: 'logs/decision-visualization-service-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/decision-visualization-service-combined.log' })
      ]
    });
  }

  /**
   * Generate a visualization
   * @param {string} componentType - Type of visualization component
   * @param {Object} data - Data to visualize
   * @param {Object} options - Visualization options
   * @returns {Promise<Object>} Visualization result
   */
  async generateVisualization(componentType, data, options = {}) {
    try {
      // Validate input
      if (!componentType) {
        throw new Error('Component type is required');
      }

      if (!data) {
        throw new Error('Data is required for visualization');
      }

      const visualizationId = uuidv4();
      this.logger.info('Generating visualization', {
        visualizationId,
        componentType
      });

      // Create visualization record
      const visualization = {
        id: visualizationId,
        componentType: componentType,
        data: data,
        options: options,
        status: 'pending',
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        result: null,
        error: null
      };

      this.visualizations.set(visualizationId, visualization);

      // Validate component type
      const component = this.components[componentType];
      if (!component) {
        throw new Error(`Visualization component type '${componentType}' is not supported`);
      }

      // Start visualization generation
      visualization.status = 'generating';
      visualization.startedAt = new Date().toISOString();

      // Generate visualization
      const result = await this._generateVisualizationData(visualization, component);

      // Complete visualization
      visualization.completedAt = new Date().toISOString();
      visualization.status = 'completed';
      visualization.result = result;

      this.logger.info('Visualization generated successfully', {
        visualizationId,
        componentType,
        generationTime: new Date(visualization.completedAt).getTime() - new Date(visualization.startedAt).getTime()
      });

      return {
        visualizationId: visualization.id,
        status: visualization.status,
        componentType: visualization.componentType,
        result: visualization.result,
        generationTime: new Date(visualization.completedAt).getTime() - new Date(visualization.startedAt).getTime()
      };
    } catch (error) {
      this.logger.error('Failed to generate visualization', {
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Generate visualization data
   * @param {Object} visualization - Visualization record
   * @param {Object} component - Component configuration
   * @returns {Promise<Object>} Visualization data
   * @private
   */
  async _generateVisualizationData(visualization, component) {
    this.logger.info('Generating visualization data', {
      visualizationId: visualization.id,
      componentType: component.name
    });

    // Simulate data processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

    // Generate visualization based on component type
    switch (component.dataType) {
      case 'recommendations':
        return this._generateRecommendationVisualization(visualization.data);

      case 'risk-assessment':
        return this._generateRiskAssessmentVisualization(visualization.data);

      case 'treatment-effectiveness':
        return this._generateTreatmentEffectivenessVisualization(visualization.data);

      case 'condition-distribution':
        return this._generateConditionDistributionVisualization(visualization.data);

      case 'vital-signs':
        return this._generateVitalSignsVisualization(visualization.data);

      case 'drug-interactions':
        return this._generateDrugInteractionVisualization(visualization.data);

      case 'patient-correlation':
        return this._generatePatientCorrelationVisualization(visualization.data);

      case 'treatment-pathways':
        return this._generateTreatmentPathwayVisualization(visualization.data);

      default:
        return this._generateGenericVisualization(visualization.data);
    }
  }

  /**
   * Generate recommendation confidence visualization
   * @param {Object} data - Recommendation data
   * @returns {Object} Visualization data
   * @private
   */
  _generateRecommendationVisualization(data) {
    const recommendations = data.recommendations || [];
    const chartData = {
      labels: recommendations.map(rec => rec.condition || rec.treatment || 'Unknown'),
      datasets: [
        {
          label: 'Confidence Level',
          data: recommendations.map(rec => rec.confidence || rec.likelihood || 0),
          backgroundColor: recommendations.map(rec => {
            const confidence = rec.confidence || rec.likelihood || 0;
            if (confidence >= 0.9) return this.colorSchemes.confidenceLevels.high;
            if (confidence >= 0.7) return this.colorSchemes.confidenceLevels.medium;
            return this.colorSchemes.confidenceLevels.low;
          })
        }
      ]
    };

    return {
      type: 'bar',
      data: chartData,
      options: {
        title: 'Recommendation Confidence Levels',
        xAxisLabel: 'Recommendations',
        yAxisLabel: 'Confidence Level',
        thresholds: this.components.recommendationConfidence.thresholds
      }
    };
  }

  /**
   * Generate risk assessment visualization
   * @param {Object} data - Risk assessment data
   * @returns {Object} Visualization data
   * @private
   */
  _generateRiskAssessmentVisualization(data) {
    const riskFactors = data.riskFactors || [];
    const chartData = {
      labels: riskFactors.map(factor => factor.name || factor.type || 'Unknown'),
      datasets: [
        {
          label: 'Risk Score',
          data: riskFactors.map(factor => factor.score || factor.level || 0),
          backgroundColor: riskFactors.map(factor => {
            const score = factor.score || factor.level || 0;
            if (score >= 90) return this.colorSchemes.riskLevels.critical;
            if (score >= 70) return this.colorSchemes.riskLevels.high;
            if (score >= 50) return this.colorSchemes.riskLevels.medium;
            return this.colorSchemes.riskLevels.low;
          })
        }
      ]
    };

    return {
      type: 'radar',
      data: chartData,
      options: {
        title: 'Patient Risk Assessment',
        thresholds: this.components.riskAssessment.riskLevels
      }
    };
  }

  /**
   * Generate treatment effectiveness visualization
   * @param {Object} data - Treatment data
   * @returns {Object} Visualization data
   * @private
   */
  _generateTreatmentEffectivenessVisualization(data) {
    const treatments = data.treatments || [];
    const timePoints = data.timePoints || [];

    const datasets = treatments.map(treatment => ({
      label: treatment.name || 'Unknown Treatment',
      data: treatment.effectiveness || [],
      borderColor: this.colorSchemes.default.primary,
      backgroundColor: 'rgba(33, 150, 243, 0.1)'
    }));

    const chartData = {
      labels: timePoints,
      datasets: datasets
    };

    return {
      type: 'line',
      data: chartData,
      options: {
        title: 'Treatment Effectiveness Over Time',
        xAxisLabel: 'Time',
        yAxisLabel: 'Effectiveness Score',
        thresholds: this.components.treatmentEffectiveness.effectivenessLevels
      }
    };
  }

  /**
   * Generate condition distribution visualization
   * @param {Object} data - Condition data
   * @returns {Object} Visualization data
   * @private
   */
  _generateConditionDistributionVisualization(data) {
    const conditions = data.conditions || [];
    const chartData = {
      labels: conditions.map(condition => condition.name || 'Unknown'),
      datasets: [
        {
          data: conditions.map(condition => condition.count || condition.percentage || 0),
          backgroundColor: [
            this.colorSchemes.default.primary,
            this.colorSchemes.default.secondary,
            this.colorSchemes.default.accent,
            this.colorSchemes.default.neutral,
            '#E91E63',
            '#00BCD4',
            '#CDDC39',
            '#FF9800'
          ]
        }
      ]
    };

    return {
      type: 'pie',
      data: chartData,
      options: {
        title: 'Condition Distribution'
      }
    };
  }

  /**
   * Generate vital signs visualization
   * @param {Object} data - Vital signs data
   * @returns {Object} Visualization data
   * @private
   */
  _generateVitalSignsVisualization(data) {
    const vitalSigns = data.vitalSigns || [];
    const timePoints = data.timePoints || [];

    const datasets = vitalSigns.map(sign => ({
      label: sign.name || 'Unknown Vital Sign',
      data: sign.values || [],
      borderColor: this._getColorForVitalSign(sign.name),
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }));

    const chartData = {
      labels: timePoints,
      datasets: datasets
    };

    return {
      type: 'line',
      data: chartData,
      options: {
        title: 'Vital Signs Trend',
        xAxisLabel: 'Time',
        yAxisLabel: 'Value'
      }
    };
  }

  /**
   * Generate drug interaction visualization
   * @param {Object} data - Drug interaction data
   * @returns {Object} Visualization data
   * @private
   */
  _generateDrugInteractionVisualization(data) {
    const interactions = data.interactions || [];
    const nodes = [];
    const links = [];

    // Create nodes for each drug
    const drugs = new Set();
    interactions.forEach(interaction => {
      if (interaction.drugs) {
        interaction.drugs.forEach(drug => drugs.add(drug));
      }
    });

    Array.from(drugs).forEach((drug, index) => {
      nodes.push({
        id: drug,
        label: drug,
        size: 20,
        color: this._getColorForDrug(drug)
      });
    });

    // Create links for interactions
    interactions.forEach(interaction => {
      if (interaction.drugs && interaction.drugs.length >= 2) {
        for (let i = 0; i < interaction.drugs.length - 1; i++) {
          links.push({
            source: interaction.drugs[i],
            target: interaction.drugs[i + 1],
            value: interaction.severity === 'high' ? 10 : interaction.severity === 'medium' ? 5 : 2,
            color: interaction.severity === 'high' ?
              this.colorSchemes.riskLevels.critical :
              interaction.severity === 'medium' ?
              this.colorSchemes.riskLevels.high :
              this.colorSchemes.riskLevels.medium
          });
        }
      }
    });

    return {
      type: 'network',
      data: {
        nodes: nodes,
        links: links
      },
      options: {
        title: 'Drug Interaction Network'
      }
    };
  }

  /**
   * Generate patient correlation visualization
   * @param {Object} data - Patient correlation data
   * @returns {Object} Visualization data
   * @private
   */
  _generatePatientCorrelationVisualization(data) {
    const correlations = data.correlations || [];
    const chartData = {
      datasets: [
        {
          label: 'Patient Correlations',
          data: correlations.map(correlation => ({
            x: correlation.factor1 || 0,
            y: correlation.factor2 || 0,
            r: (correlation.strength || 0) * 10
          })),
          backgroundColor: 'rgba(33, 150, 243, 0.5)'
        }
      ]
    };

    return {
      type: 'scatter',
      data: chartData,
      options: {
        title: 'Patient Outcome Correlations',
        xAxisLabel: 'Factor 1',
        yAxisLabel: 'Factor 2'
      }
    };
  }

  /**
   * Generate treatment pathway visualization
   * @param {Object} data - Treatment pathway data
   * @returns {Object} Visualization data
   * @private
   */
  _generateTreatmentPathwayVisualization(data) {
    const pathways = data.pathways || [];
    const chartData = {
      labels: pathways.map(pathway => pathway.name || 'Unknown Pathway'),
      datasets: [
        {
          label: 'Pathway Steps',
          data: pathways.map(pathway => pathway.steps?.length || 0),
          backgroundColor: this.colorSchemes.default.primary
        }
      ]
    };

    return {
      type: 'treemap',
      data: chartData,
      options: {
        title: 'Treatment Pathways'
      }
    };
  }

  /**
   * Generate generic visualization
   * @param {Object} data - Generic data
   * @returns {Object} Visualization data
   * @private
   */
  _generateGenericVisualization(data) {
    return {
      type: 'bar',
      data: {
        labels: ['Data Point 1', 'Data Point 2', 'Data Point 3'],
        datasets: [
          {
            label: 'Generic Data',
            data: [10, 20, 30],
            backgroundColor: this.colorSchemes.default.primary
          }
        ]
      },
      options: {
        title: 'Generic Visualization'
      }
    };
  }

  /**
   * Get color for vital sign
   * @param {string} vitalSign - Vital sign name
   * @returns {string} Color code
   * @private
   */
  _getColorForVitalSign(vitalSign) {
    switch (vitalSign?.toLowerCase()) {
      case 'blood pressure':
        return '#F44336';
      case 'heart rate':
        return '#E91E63';
      case 'temperature':
        return '#FF9800';
      case 'oxygen saturation':
        return '#4CAF50';
      default:
        return this.colorSchemes.default.primary;
    }
  }

  /**
   * Get color for drug
   * @param {string} drug - Drug name
   * @returns {string} Color code
   * @private
   */
  _getColorForDrug(drug) {
    const colors = [
      '#2196F3', '#E91E63', '#FF9800', '#4CAF50',
      '#9C27B0', '#00BCD4', '#FF5722', '#CDDC39'
    ];

    // Generate consistent color based on drug name
    let hash = 0;
    for (let i = 0; i < drug.length; i++) {
      hash = drug.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * Export visualization
   * @param {string} visualizationId - Visualization identifier
   * @param {string} format - Export format
   * @returns {Promise<Object>} Export result
   */
  async exportVisualization(visualizationId, format = 'png') {
    try {
      const visualization = this.visualizations.get(visualizationId);
      if (!visualization) {
        throw new Error('Visualization not found');
      }

      if (!this.config.export.enabled) {
        throw new Error('Export functionality is disabled');
      }

      if (!this.config.export.formats.includes(format)) {
        throw new Error(`Export format '${format}' is not supported`);
      }

      this.logger.info('Exporting visualization', {
        visualizationId,
        format
      });

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500));

      return {
        visualizationId,
        format,
        url: `https://medisync.example.com/visualizations/${visualizationId}.${format}`,
        status: 'completed'
      };
    } catch (error) {
      this.logger.error('Failed to export visualization', {
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Get visualization status
   * @param {string} visualizationId - Visualization identifier
   * @returns {Object|null} Visualization status or null if not found
   */
  getVisualizationStatus(visualizationId) {
    const visualization = this.visualizations.get(visualizationId);
    if (!visualization) {
      return null;
    }

    return {
      visualizationId: visualization.id,
      componentType: visualization.componentType,
      status: visualization.status,
      createdAt: visualization.createdAt,
      startedAt: visualization.startedAt,
      completedAt: visualization.completedAt
    };
  }

  /**
   * Get available visualization components
   * @returns {Array} Array of available visualization components
   */
  getAvailableComponents() {
    return Object.keys(this.components);
  }

  /**
   * Get component configuration
   * @param {string} componentType - Component type
   * @returns {Object|null} Component configuration or null if not found
   */
  getComponentConfiguration(componentType) {
    return this.components[componentType] || null;
  }
}

module.exports = DecisionVisualizationService;