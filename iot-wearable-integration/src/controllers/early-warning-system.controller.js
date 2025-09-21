/**
 * Early Warning System Controller
 * Controller for handling early warning system requests
 */

const EarlyWarningSystemService = require('../services/early-warning-system.service.js');

class EarlyWarningSystemController {
  /**
   * Create a new Early Warning System Controller
   */
  constructor() {
    this.earlyWarningSystemService = new EarlyWarningSystemService();
    // Use the service's logger
    this.logger = this.earlyWarningSystemService.logger;
  }


  /**
   * Generate early warning
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateEarlyWarning(req, res) {
    try {
      const { patientData } = req.body;

      // Validate required fields
      if (!patientData) {
        return res.status(400).json({
          error: 'Patient data is required'
        });
      }

      // Generate early warning
      const result = await this.earlyWarningSystemService.generateEarlyWarning(patientData);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Early warning generated successfully',
        jobId: result.jobId,
        patientId: result.patientId,
        warnings: result.warnings,
        confidence: result.confidence,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Generate early warning controller error', {
        error: error.message,
        stack: error.stack
      });

      // Handle specific errors with user-friendly messages
      if (error.message.includes('Early warning system is not enabled')) {
        return res.status(400).json({
          error: 'Early warning system is not enabled'
        });
      }

      if (error.message.includes('Patient data is required')) {
        return res.status(400).json({
          error: 'Patient data is required for early warning generation'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to generate early warning',
        message: error.message
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
      const status = this.earlyWarningSystemService.getServiceStatus();

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
        error: 'Failed to retrieve service status',
        message: error.message
      });
    }
  }

  /**
   * Get early warning status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getEarlyWarningStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get early warning status
      const status = this.earlyWarningSystemService.getEarlyWarningStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Early warning not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get early warning status controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve early warning status',
        message: error.message
      });
    }
  }

  /**
   * Acknowledge an early warning
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  acknowledgeEarlyWarning(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Acknowledge early warning
      const result = this.earlyWarningSystemService.acknowledgeEarlyWarning(jobId);

      // Return result
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Early warning acknowledged successfully',
          warning: result
        });
      } else {
        res.status(404).json({
          error: 'Early warning not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Acknowledge early warning controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to acknowledge early warning',
        message: error.message
      });
    }
  }

  /**
   * Resolve an early warning
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  resolveEarlyWarning(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Resolve early warning
      const result = this.earlyWarningSystemService.resolveEarlyWarning(jobId);

      // Return result
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Early warning resolved successfully',
          warning: result
        });
      } else {
        res.status(404).json({
          error: 'Early warning not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Resolve early warning controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to resolve early warning',
        message: error.message
      });
    }
  }
}

module.exports = EarlyWarningSystemController;