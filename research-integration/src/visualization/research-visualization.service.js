/**
 * Research Visualization Service
 * Service for creating visualizations of research data
 */

const config = require('../config/visualization.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

class ResearchVisualizationService {
  /**
   * Create a new Research Visualization Service
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.visualizations = new Map();
    this.chartTypes = config.chartTypes;
    this.components = config.components;
    this.colorSchemes = config.colorSchemes;

    this.logger.info('Research Visualization Service created', {
      service: 'research-visualization-service'
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
      defaultMeta: { service: 'research-visualization-service' },
      transports: [
        new winston.transports.File({ filename: 'logs/research-visualization-service-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/research-visualization-service-combined.log' })
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
      case 'citations':
        return this._generateCitationVisualization(visualization.data);

      case 'publications':
        return this._generateTrendVisualization(visualization.data);

      case 'collaborators':
        return this._generateCollaborationVisualization(visualization.data);

      case 'entities':
        return this._generateEntityVisualization(visualization.data);

      case 'topics':
        return this._generateTopicVisualization(visualization.data);

      case 'sentiment':
        return this._generateSentimentVisualization(visualization.data);

      case 'eligibility':
        return this._generateTrialMatchingVisualization(visualization.data);

      default:
        return this._generateGenericVisualization(visualization.data);
    }
  }

  /**
   * Generate citation network visualization
   * @param {Object} data - Citation data
   * @returns {Object} Visualization data
   * @private
   */
  _generateCitationVisualization(data) {
    const citations = data.citations || [];
    const nodes = [];
    const links = [];

    // Create nodes for each paper
    const papers = new Set();
    citations.forEach(citation => {
      if (citation.paper) papers.add(citation.paper);
      if (citation.citedBy) papers.add(citation.citedBy);
    });

    Array.from(papers).forEach((paper, index) => {
      nodes.push({
        id: paper,
        label: paper,
        size: 20,
        color: this.colorSchemes.citationNetwork.node
      });
    });

    // Create links for citations
    citations.forEach(citation => {
      if (citation.paper && citation.citedBy) {
        links.push({
          source: citation.paper,
          target: citation.citedBy,
          value: citation.count || 1,
          color: this.colorSchemes.citationNetwork.edge
        });
      }
    });

    return {
      type: 'network',
      data: {
        nodes: nodes,
        links: links
      },
      options: {
        title: 'Citation Network',
        colorScheme: this.colorSchemes.citationNetwork
      }
    };
  }

  /**
   * Generate research trend visualization
   * @param {Object} data - Trend data
   * @returns {Object} Visualization data
   * @private
   */
  _generateTrendVisualization(data) {
    const trends = data.trends || [];
    const timePoints = data.timePoints || [];

    const datasets = trends.map(trend => ({
      label: trend.name || 'Trend',
      data: trend.values || [],
      borderColor: this.colorSchemes.researchTrends.line,
      backgroundColor: this.colorSchemes.researchTrends.fill,
      pointBackgroundColor: this.colorSchemes.researchTrends.point
    }));

    const chartData = {
      labels: timePoints,
      datasets: datasets
    };

    return {
      type: 'line',
      data: chartData,
      options: {
        title: 'Research Trends',
        xAxisLabel: 'Time',
        yAxisLabel: 'Count',
        colorScheme: this.colorSchemes.researchTrends
      }
    };
  }

  /**
   * Generate collaboration map visualization
   * @param {Object} data - Collaboration data
   * @returns {Object} Visualization data
   * @private
   */
  _generateCollaborationVisualization(data) {
    const collaborators = data.collaborators || [];
    const locations = data.locations || [];

    const markers = locations.map(location => ({
      lat: location.latitude || 0,
      lng: location.longitude || 0,
      title: location.name || 'Location',
      size: location.collaboratorCount || 10,
      color: this.colorSchemes.collaborationMap.marker
    }));

    const connections = [];
    for (let i = 0; i < markers.length - 1; i++) {
      connections.push({
        source: { lat: markers[i].lat, lng: markers[i].lng },
        target: { lat: markers[i + 1].lat, lng: markers[i + 1].lng },
        color: this.colorSchemes.collaborationMap.connection
      });
    }

    return {
      type: 'map',
      data: {
        markers: markers,
        connections: connections
      },
      options: {
        title: 'Research Collaboration Map',
        colorScheme: this.colorSchemes.collaborationMap
      }
    };
  }

  /**
   * Generate entity visualization
   * @param {Object} data - Entity data
   * @returns {Object} Visualization data
   * @private
   */
  _generateEntityVisualization(data) {
    const entities = data.entities || [];
    const chartData = {
      labels: entities.map(entity => entity.type || 'Unknown'),
      datasets: [
        {
          label: 'Entity Count',
          data: entities.map(entity => entity.count || 1),
          backgroundColor: this.colorSchemes.literatureAnalysis.entities
        }
      ]
    };

    return {
      type: 'bar',
      data: chartData,
      options: {
        title: 'Literature Entities',
        xAxisLabel: 'Entity Type',
        yAxisLabel: 'Count',
        colorScheme: this.colorSchemes.literatureAnalysis
      }
    };
  }

  /**
   * Generate topic visualization
   * @param {Object} data - Topic data
   * @returns {Object} Visualization data
   * @private
   */
  _generateTopicVisualization(data) {
    const topics = data.topics || [];
    const chartData = {
      labels: topics.map(topic => topic.label || 'Topic'),
      datasets: [
        {
          label: 'Topic Relevance',
          data: topics.map(topic => topic.relevance || 0),
          backgroundColor: this.colorSchemes.literatureAnalysis.topics
        }
      ]
    };

    return {
      type: 'radar',
      data: chartData,
      options: {
        title: 'Literature Topics',
        colorScheme: this.colorSchemes.literatureAnalysis
      }
    };
  }

  /**
   * Generate sentiment visualization
   * @param {Object} data - Sentiment data
   * @returns {Object} Visualization data
   * @private
   */
  _generateSentimentVisualization(data) {
    const sentiment = data.sentiment || { positive: 0, neutral: 0, negative: 0 };
    const chartData = {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          data: [sentiment.positive, sentiment.neutral, sentiment.negative],
          backgroundColor: [
            this.colorSchemes.literatureAnalysis.sentiment.positive,
            this.colorSchemes.literatureAnalysis.sentiment.neutral,
            this.colorSchemes.literatureAnalysis.sentiment.negative
          ]
        }
      ]
    };

    return {
      type: 'pie',
      data: chartData,
      options: {
        title: 'Literature Sentiment',
        colorScheme: this.colorSchemes.literatureAnalysis.sentiment
      }
    };
  }

  /**
   * Generate trial matching visualization
   * @param {Object} data - Trial matching data
   * @returns {Object} Visualization data
   * @private
   */
  _generateTrialMatchingVisualization(data) {
    const trials = data.trials || [];
    const chartData = {
      labels: trials.map(trial => trial.title || 'Trial'),
      datasets: [
        {
          label: 'Eligibility Score',
          data: trials.map(trial => trial.eligibilityScore || 0),
          backgroundColor: trials.map(trial => {
            const score = trial.eligibilityScore || 0;
            if (score >= 0.8) return this.colorSchemes.trialMatching.high;
            if (score >= 0.6) return this.colorSchemes.trialMatching.medium;
            return this.colorSchemes.trialMatching.low;
          })
        }
      ]
    };

    return {
      type: 'bar',
      data: chartData,
      options: {
        title: 'Clinical Trial Matching Results',
        xAxisLabel: 'Trials',
        yAxisLabel: 'Eligibility Score',
        colorScheme: this.colorSchemes.trialMatching
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
        title: 'Generic Visualization',
        colorScheme: this.colorSchemes.default
      }
    };
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

module.exports = ResearchVisualizationService;