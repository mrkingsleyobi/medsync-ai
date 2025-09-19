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
      console.error('Generate decision support controller error', {
        error: error.message
      });

      // Handle specific error cases
      if (error.message.includes('Patient context')) {
        return res.status(400).json({
          error: error.message
        });
      }

      if (error.message.includes('No decision model')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to generate clinical decision support',
        message: error.message
      });
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
      console.error('Get decision history controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve decision history',
        message: error.message
      });
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
      console.error('Get active alerts controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve active alerts',
        message: error.message
      });
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
      console.error('Acknowledge alert controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to acknowledge alert',
        message: error.message
      });
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
      console.error('Get available decision models controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve available decision models',
        message: error.message
      });
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
      console.error('Get clinical guidelines controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve clinical guidelines',
        message: error.message
      });
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
      console.error('Register custom decision model controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to register custom decision model',
        message: error.message
      });
    }
  }
}

module.exports = ClinicalDecisionSupportController;