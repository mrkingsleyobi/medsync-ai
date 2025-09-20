const MonitoringService = require('../services/monitoring.service.js');

class MonitoringController {
  constructor() {
    this.monitoringService = new MonitoringService();
    // Start monitoring
    this.monitoringService.startMonitoring();
  }

  /**
   * Get security metrics endpoint
   * GET /api/monitoring/metrics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMetrics(req, res) {
    try {
      const metrics = this.monitoringService.getMetrics();

      res.status(200).json({
        success: true,
        metrics: metrics
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve metrics',
        message: error.message
      });
    }
  }

  /**
   * Get recent alerts endpoint
   * GET /api/monitoring/alerts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAlerts(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const alerts = this.monitoringService.getRecentAlerts(limit);

      res.status(200).json({
        success: true,
        alerts: alerts
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve alerts',
        message: error.message
      });
    }
  }

  /**
   * Get security dashboard data endpoint
   * GET /api/monitoring/dashboard
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDashboard(req, res) {
    try {
      const dashboardData = this.monitoringService.getDashboardData();

      res.status(200).json({
        success: true,
        dashboard: dashboardData
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve dashboard data',
        message: error.message
      });
    }
  }

  /**
   * Resolve alert endpoint
   * POST /api/monitoring/alerts/:alertId/resolve
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resolveAlert(req, res) {
    try {
      const { alertId } = req.params;

      if (!alertId) {
        return res.status(400).json({
          error: 'Missing required parameter: alertId'
        });
      }

      const resolved = this.monitoringService.resolveAlert(alertId);

      if (resolved) {
        res.status(200).json({
          success: true,
          message: 'Alert resolved successfully'
        });
      } else {
        res.status(404).json({
          error: 'Alert not found',
          message: `Alert with ID ${alertId} not found`
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Failed to resolve alert',
        message: error.message
      });
    }
  }

  /**
   * Monitor event endpoint
   * POST /api/monitoring/events
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async monitorEvent(req, res) {
    try {
      const { event } = req.body;

      if (!event) {
        return res.status(400).json({
          error: 'Missing required field: event'
        });
      }

      // Monitor the event
      this.monitoringService.monitorEvent(event);

      res.status(200).json({
        success: true,
        message: 'Event monitored successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to monitor event',
        message: error.message
      });
    }
  }

  /**
   * Get system health endpoint
   * GET /api/monitoring/health
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getHealth(req, res) {
    try {
      // In production, this would check actual system health
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      };

      res.status(200).json({
        success: true,
        health: health
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve health status',
        message: error.message
      });
    }
  }
}

module.exports = MonitoringController;