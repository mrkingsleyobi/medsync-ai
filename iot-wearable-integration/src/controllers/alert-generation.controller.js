/**
 * Alert Generation and Notification Controller
 * Controller for handling alert generation and notification requests
 */

const AlertGenerationService = require('../services/iot-wearable.service.js');

class AlertGenerationController {
  /**
   * Create a new Alert Generation and Notification Controller
   */
  constructor() {
    this.alertGenerationService = new AlertGenerationService();
    // Use the service's logger
    this.logger = this.alertGenerationService.logger;
  }


  /**
   * Create an alert
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createAlert(req, res) {
    try {
      const { alertData } = req.body;

      // Validate required fields
      if (!alertData) {
        return res.status(400).json({
          error: 'Alert data is required'
        });
      }

      // Create alert
      const result = this.alertGenerationService.createAlert(alertData);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Alert created successfully',
        alert: result
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Create alert controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to create alert',
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
      const status = this.alertGenerationService.getServiceStatus();

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
   * Get alert status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAlertStatus(req, res) {
    try {
      const { alertId } = req.params;

      // Validate required fields
      if (!alertId) {
        return res.status(400).json({
          error: 'Alert ID is required'
        });
      }

      // Get alert status
      const status = this.alertGenerationService.getAlertStatus(alertId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Alert not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get alert status controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve alert status',
        message: error.message
      });
    }
  }

  /**
   * Acknowledge an alert
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  acknowledgeAlert(req, res) {
    try {
      const { alertId } = req.params;

      // Validate required fields
      if (!alertId) {
        return res.status(400).json({
          error: 'Alert ID is required'
        });
      }

      // Acknowledge alert
      const result = this.alertGenerationService.acknowledgeAlert(alertId);

      // Return result
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Alert acknowledged successfully',
          alert: result
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

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to acknowledge alert',
        message: error.message
      });
    }
  }

  /**
   * Resolve an alert
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  resolveAlert(req, res) {
    try {
      const { alertId } = req.params;

      // Validate required fields
      if (!alertId) {
        return res.status(400).json({
          error: 'Alert ID is required'
        });
      }

      // Resolve alert
      const result = this.alertGenerationService.resolveAlert(alertId);

      // Return result
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Alert resolved successfully',
          alert: result
        });
      } else {
        res.status(404).json({
          error: 'Alert not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Resolve alert controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to resolve alert',
        message: error.message
      });
    }
  }
}

module.exports = AlertGenerationController;