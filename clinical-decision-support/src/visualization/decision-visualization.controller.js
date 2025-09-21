/**
 * Decision Visualization Controller
 * Controller for handling decision visualization requests
 */

const DecisionVisualizationService = require('./decision-visualization.service.js');

class DecisionVisualizationController {
  /**
   * Create a new Decision Visualization Controller
   */
  constructor() {
    this.decisionVisualizationService = new DecisionVisualizationService();
  }

  /**
   * Generate a visualization
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateVisualization(req, res) {
    try {
      const { componentType, data, options } = req.body;

      // Validate required fields
      if (!componentType) {
        return res.status(400).json({
          error: 'Component type is required'
        });
      }

      if (!data) {
        return res.status(400).json({
          error: 'Data is required for visualization'
        });
      }

      // Generate visualization
      const result = await this.decisionVisualizationService.generateVisualization(componentType, data, options);

      // Return visualization result
      res.status(200).json({
        success: true,
        message: 'Visualization generated successfully',
        visualizationId: result.visualizationId,
        status: result.status,
        componentType: result.componentType,
        result: result.result,
        generationTime: result.generationTime
      });
    } catch (error) {
      if (this.decisionVisualizationService && this.decisionVisualizationService.logger) {
        this.decisionVisualizationService.logger.error('Generate visualization controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle specific error cases
      if (error.message.includes('Component type') || error.message.includes('Visualization component type')) {
        return res.status(400).json({
          error: error.message
        });
      }

      if (error.message.includes('Data is required')) {
        return res.status(400).json({
          error: error.message
        });
      }

      if (error.message.includes('Component type') || error.message.includes('Visualization component type')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to generate visualization',
        message: error.message
      });
    }
  }

  /**
   * Export a visualization
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportVisualization(req, res) {
    try {
      const { visualizationId } = req.params;
      const { format } = req.query;

      // Validate required fields
      if (!visualizationId) {
        return res.status(400).json({
          error: 'Visualization ID is required'
        });
      }

      // Export visualization
      const result = await this.decisionVisualizationService.exportVisualization(visualizationId, format);

      // Return export result
      res.status(200).json({
        success: true,
        message: 'Visualization exported successfully',
        visualizationId: result.visualizationId,
        format: result.format,
        url: result.url,
        status: result.status
      });
    } catch (error) {
      if (this.decisionVisualizationService && this.decisionVisualizationService.logger) {
        this.decisionVisualizationService.logger.error('Export visualization controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle specific error cases
      if (error.message.includes('Visualization not found')) {
        return res.status(404).json({
          error: error.message
        });
      }

      if (error.message.includes('Export format')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to export visualization',
        message: error.message
      });
    }
  }

  /**
   * Get visualization status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getVisualizationStatus(req, res) {
    try {
      const { visualizationId } = req.params;

      // Validate required fields
      if (!visualizationId) {
        return res.status(400).json({
          error: 'Visualization ID is required'
        });
      }

      // Get visualization status
      const status = this.decisionVisualizationService.getVisualizationStatus(visualizationId);

      // Return visualization status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Visualization not found'
        });
      }
    } catch (error) {
      if (this.decisionVisualizationService && this.decisionVisualizationService.logger) {
        this.decisionVisualizationService.logger.error('Get visualization status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve visualization status',
        message: error.message
      });
    }
  }

  /**
   * Get available visualization components
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAvailableComponents(req, res) {
    try {
      // Get available components
      const components = this.decisionVisualizationService.getAvailableComponents();

      // Return available components
      res.status(200).json({
        success: true,
        components: components
      });
    } catch (error) {
      if (this.decisionVisualizationService && this.decisionVisualizationService.logger) {
        this.decisionVisualizationService.logger.error('Get available components controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve available visualization components',
        message: error.message
      });
    }
  }

  /**
   * Get component configuration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getComponentConfiguration(req, res) {
    try {
      const { componentType } = req.params;

      // Validate required fields
      if (!componentType) {
        return res.status(400).json({
          error: 'Component type is required'
        });
      }

      // Get component configuration
      const configuration = this.decisionVisualizationService.getComponentConfiguration(componentType);

      // Return component configuration
      if (configuration) {
        res.status(200).json({
          success: true,
          configuration: configuration
        });
      } else {
        res.status(404).json({
          error: 'Component configuration not found'
        });
      }
    } catch (error) {
      if (this.decisionVisualizationService && this.decisionVisualizationService.logger) {
        this.decisionVisualizationService.logger.error('Get component configuration controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve component configuration',
        message: error.message
      });
    }
  }
}

module.exports = DecisionVisualizationController;