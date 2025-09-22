/**
 * Population Health Analytics Controller
 * Controller for handling population health analytics requests
 */

const PopulationHealthAnalyticsService = require('../services/population-health-analytics.service.js');

class PopulationHealthAnalyticsController {
  /**
   * Create a new Population Health Analytics Controller
   */
  constructor() {
    this.populationHealthAnalyticsService = new PopulationHealthAnalyticsService();
    // Use the service's logger
    this.logger = this.populationHealthAnalyticsService.logger;
  }


  /**
   * Generate population health analytics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generatePopulationAnalytics(req, res) {
    try {
      const { options } = req.body;

      // Generate population health analytics
      const result = await this.populationHealthAnalyticsService.generatePopulationAnalytics(options);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Population health analytics generated successfully',
        jobId: result.jobId,
        populationMetrics: result.populationMetrics,
        benchmarks: result.benchmarks,
        outliers: result.outliers,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Generate population health analytics controller error', {
        error: error.message,
        stack: error.stack
      });

      // Handle specific errors with user-friendly messages
      if (error.message.includes('Population health analytics is not enabled')) {
        return res.status(400).json({
          error: 'Population health analytics is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to generate population health analytics'
      });
    }
  }


  /**
   * Get service status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getServiceStatus(req, res) {
    try {
      // Get service status
      const status = this.populationHealthAnalyticsService.getServiceStatus();

      // Return status
      res.status(200).json({
        success: true,
        status: status
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get service status controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve service status'
      });
    }
  }

  /**
   * Get analytics job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAnalyticsStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get analytics job status
      const status = this.populationHealthAnalyticsService.getAnalyticsStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Analytics job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get analytics job status controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve analytics job status'
      });
    }
  }
}

module.exports = PopulationHealthAnalyticsController;