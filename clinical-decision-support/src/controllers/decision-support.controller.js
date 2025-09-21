/**
 * Clinical Decision Support Controller
 * Controller for handling clinical decision support requests
 */

const ClinicalDecisionSupportService = require('../services/decision-support.service.js');

class ClinicalDecisionSupportController {
  /**
   * Create a new Clinical Decision Support Controller
   */
  constructor() {
    this.decisionSupportService = new ClinicalDecisionSupportService();
    // Use the service's logger if available, otherwise create a simple logger for testing
    this.logger = this.decisionSupportService.logger || {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    };
  }

  /**
   * Generate clinical decision support
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateDecisionSupport(req, res) {
    try {
      const { patientContext, decisionConfig } = req.body;

      // Validate required fields
      if (!patientContext) {
        return res.status(400).json({
          error: 'Patient context is required'
        });
      }

      if (!patientContext.patientId) {
        return res.status(400).json({
          error: 'Patient ID is required in patient context'
        });
      }

      // Generate decision support
      const result = await this.decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      // Return decision support result
      res.status(200).json({
        success: true,
        message: 'Clinical decision support generated successfully',
        decisionId: result.decisionId,
        recommendations: result.recommendations,
        alerts: result.alerts,
        confidence: result.confidence,
        evidence: result.evidence,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Generate decision support controller error', {
        error: error.message,
        stack: error.stack
      });

      // Handle specific error cases without exposing internal details
      if (error.message.includes('Patient context')) {
        return res.status(400).json({
          error: 'Invalid patient context provided'
        });
      }

      if (error.message.includes('No decision model')) {
        return res.status(400).json({
          error: 'Invalid decision model type requested'
        });
      }

      // For backward compatibility with tests, include message field in non-production environments
      const response = { error: 'Failed to generate clinical decision support' };
      if (process.env.NODE_ENV !== 'production') {
        response.message = error.message;
      }
      res.status(500).json(response);
    }
  }

  /**
   * Get decision history for a patient
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDecisionHistory(req, res) {
    try {
      const { patientId } = req.params;

      // Validate required fields
      if (!patientId) {
        return res.status(400).json({
          error: 'Patient ID is required'
        });
      }

      // Get decision history
      const history = this.decisionSupportService.getDecisionHistory(patientId);

      // Return decision history
      res.status(200).json({
        success: true,
        count: history.length,
        history: history
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get decision history controller error', {
        error: error.message,
        stack: error.stack
      });

      // For backward compatibility with tests, include message field in non-production environments
      const response = { error: 'Failed to retrieve decision history' };
      if (process.env.NODE_ENV !== 'production') {
        response.message = error.message;
      }
      res.status(500).json(response);
    }
  }

  /**
   * Get active alerts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getActiveAlerts(req, res) {
    try {
      // Get active alerts
      const alerts = this.decisionSupportService.getActiveAlerts();

      // Return active alerts
      res.status(200).json({
        success: true,
        count: alerts.length,
        alerts: alerts
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get active alerts controller error', {
        error: error.message,
        stack: error.stack
      });

      // For backward compatibility with tests, include message field in non-production environments
      const response = { error: 'Failed to retrieve active alerts' };
      if (process.env.NODE_ENV !== 'production') {
        response.message = error.message;
      }
      res.status(500).json(response);
    }
  }

  /**
   * Acknowledge an alert
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async acknowledgeAlert(req, res) {
    try {
      const { alertId } = req.params;

      // Validate required fields
      if (!alertId) {
        return res.status(400).json({
          error: 'Alert ID is required'
        });
      }

      // Acknowledge alert
      const acknowledged = this.decisionSupportService.acknowledgeAlert(alertId);

      // Return result
      if (acknowledged) {
        res.status(200).json({
          success: true,
          message: 'Alert acknowledged successfully'
        });
      } else {
        res.status(404).json({
          error: 'Alert not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Acknowledge alert controller error', {
        error: error.message,
        stack: error.stack
      });

      // For backward compatibility with tests, include message field in non-production environments
      const response = { error: 'Failed to acknowledge alert' };
      if (process.env.NODE_ENV !== 'production') {
        response.message = error.message;
      }
      res.status(500).json(response);
    }
  }

  /**
   * Get available decision models
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAvailableDecisionModels(req, res) {
    try {
      // Get available decision models
      const models = this.decisionSupportService.getAvailableDecisionModels();

      // Return available models
      res.status(200).json({
        success: true,
        models: models
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get available decision models controller error', {
        error: error.message,
        stack: error.stack
      });

      // For backward compatibility with tests, include message field in non-production environments
      const response = { error: 'Failed to retrieve available decision models' };
      if (process.env.NODE_ENV !== 'production') {
        response.message = error.message;
      }
      res.status(500).json(response);
    }
  }

  /**
   * Get clinical guidelines
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getClinicalGuidelines(req, res) {
    try {
      const { condition } = req.params;

      // Validate required fields
      if (!condition) {
        return res.status(400).json({
          error: 'Condition is required'
        });
      }

      // Get clinical guidelines
      const guidelines = this.decisionSupportService.getClinicalGuidelines(condition);

      // Return guidelines
      if (guidelines) {
        res.status(200).json({
          success: true,
          guidelines: guidelines
        });
      } else {
        res.status(404).json({
          error: 'Clinical guidelines not found for the specified condition'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get clinical guidelines controller error', {
        error: error.message,
        stack: error.stack
      });

      // For backward compatibility with tests, include message field in non-production environments
      const response = { error: 'Failed to retrieve clinical guidelines' };
      if (process.env.NODE_ENV !== 'production') {
        response.message = error.message;
      }
      res.status(500).json(response);
    }
  }

  /**
   * Register custom decision model
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async registerCustomDecisionModel(req, res) {
    try {
      const { type, model } = req.body;

      // Validate required fields
      if (!type || !model) {
        return res.status(400).json({
          error: 'Type and model are required'
        });
      }

      // Register custom decision model
      this.decisionSupportService.registerDecisionModel(type, model);

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Custom decision model registered successfully'
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Register custom decision model controller error', {
        error: error.message,
        stack: error.stack
      });

      // For backward compatibility with tests, include message field in non-production environments
      const response = { error: 'Failed to register custom decision model' };
      if (process.env.NODE_ENV !== 'production') {
        response.message = error.message;
      }
      res.status(500).json(response);
    }
  }
}

module.exports = ClinicalDecisionSupportController;