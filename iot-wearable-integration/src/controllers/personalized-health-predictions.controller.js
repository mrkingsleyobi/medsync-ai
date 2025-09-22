/**
 * Personalized Health Predictions Controller
 * Controller for handling personalized health predictions requests
 */

const PersonalizedHealthPredictionsService = require('../services/personalized-health-predictions.service.js');

class PersonalizedHealthPredictionsController {
  /**
   * Create a new Personalized Health Predictions Controller
   */
  constructor() {
    this.personalizedHealthPredictionsService = new PersonalizedHealthPredictionsService();
  }

  /**
   * Generate personalized health predictions
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateHealthPredictions(req, res) {
    try {
      const { patientData } = req.body;

      // Validate required fields
      if (!patientData) {
        return res.status(400).json({
          error: 'Patient data is required'
        });
      }

      // Generate personalized health predictions
      const result = await this.personalizedHealthPredictionsService.generateHealthPredictions(patientData);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Personalized health predictions generated successfully',
        jobId: result.jobId,
        patientId: result.patientId,
        predictions: result.predictions,
        confidence: result.confidence,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.personalizedHealthPredictionsService && this.personalizedHealthPredictionsService.logger) {
        this.personalizedHealthPredictionsService.logger.error('Personalized health predictions generation controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle validation errors with user-friendly messages
      if (error.message.includes('Patient data is required')) {
        return res.status(400).json({
          error: 'Invalid patient data provided'
        });
      }

      // Handle specific errors with user-friendly messages
      if (error.message.includes('Personalized health prediction is not enabled')) {
        return res.status(400).json({
          error: 'Personalized health prediction is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to generate personalized health predictions'
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
      const status = this.personalizedHealthPredictionsService.getServiceStatus();

      // Return status
      res.status(200).json({
        success: true,
        status: status
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.personalizedHealthPredictionsService && this.personalizedHealthPredictionsService.logger) {
        this.personalizedHealthPredictionsService.logger.error('Get service status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve service status'
      });
    }
  }

  /**
   * Get prediction job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getPredictionStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.personalizedHealthPredictionsService.getPredictionStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Prediction job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      if (this.personalizedHealthPredictionsService && this.personalizedHealthPredictionsService.logger) {
        this.personalizedHealthPredictionsService.logger.error('Get prediction job status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve prediction job status'
      });
    }
  }
}

module.exports = PersonalizedHealthPredictionsController;