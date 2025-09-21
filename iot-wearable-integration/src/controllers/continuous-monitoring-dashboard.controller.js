/**
 * Continuous Health Monitoring Dashboard Controller
 * Controller for handling continuous health monitoring dashboard requests
 */

const ContinuousMonitoringDashboardService = require('../services/continuous-monitoring-dashboard.service.js');

class ContinuousMonitoringDashboardController {
  /**
   * Create a new Continuous Health Monitoring Dashboard Controller
   */
  constructor() {
    this.continuousMonitoringDashboardService = new ContinuousMonitoringDashboardService();
    // Use the service's logger
    this.logger = this.continuousMonitoringDashboardService.logger;
  }


  /**
   * Monitor real-time health data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async monitorRealTimeHealth(req, res) {
    try {
      const { options } = req.body;

      // Monitor real-time health data
      const result = await this.continuousMonitoringDashboardService.monitorRealTimeHealth(options);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Real-time health monitoring completed successfully',
        jobId: result.jobId,
        vitals: result.vitals,
        alerts: result.alerts,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Real-time health monitoring controller error', {
        error: error.message,
        stack: error.stack
      });

      // Handle specific errors with user-friendly messages
      if (error.message.includes('Real-time health monitoring is not enabled')) {
        return res.status(400).json({
          error: 'Real-time health monitoring is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to monitor real-time health data',
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
      const status = this.continuousMonitoringDashboardService.getServiceStatus();

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
   * Get monitoring job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getMonitoringStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.continuousMonitoringDashboardService.getMonitoringStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Monitoring job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get monitoring job status controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve monitoring job status',
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
      const status = this.continuousMonitoringDashboardService.getAlertStatus(alertId);

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
      const result = this.continuousMonitoringDashboardService.acknowledgeAlert(alertId);

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
      const result = this.continuousMonitoringDashboardService.resolveAlert(alertId);

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

module.exports = ContinuousMonitoringDashboardController;