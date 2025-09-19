/**
 * Administrative & Monitoring Controller
 * Controller for handling administrative and monitoring requests
 */

const AdminMonitoringService = require('./admin-monitoring.service.js');

class AdminMonitoringController {
  /**
   * Create a new Administrative & Monitoring Controller
   */
  constructor() {
    this.adminMonitoringService = new AdminMonitoringService();
  }

  /**
   * Generate documentation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateDocumentation(req, res) {
    try {
      const { formats, services } = req.body;

      // Validate required fields
      if (!formats || !Array.isArray(formats)) {
        return res.status(400).json({
          error: 'Formats array is required'
        });
      }

      // Generate documentation
      const result = await this.adminMonitoringService.generateDocumentation({
        formats,
        services
      });

      // Return result
      res.status(200).json({
        success: true,
        message: 'Documentation generated successfully',
        jobId: result.jobId,
        filesGenerated: result.filesGenerated,
        outputPath: result.outputPath,
        processingTime: result.processingTime
      });
    } catch (error) {
      console.error('Generate documentation controller error', {
        error: error.message
      });

      // Handle validation errors
      if (error.message.includes('Formats') || error.message.includes('required')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to generate documentation',
        message: error.message
      });
    }
  }

  /**
   * Schedule a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async scheduleTask(req, res) {
    try {
      const taskData = req.body;

      // Validate required fields
      if (!taskData.name) {
        return res.status(400).json({
          error: 'Task name is required'
        });
      }

      if (!taskData.schedule) {
        return res.status(400).json({
          error: 'Task schedule is required'
        });
      }

      // Schedule task
      const task = await this.adminMonitoringService.scheduleTask(taskData);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Task scheduled successfully',
        taskId: task.id,
        task: {
          id: task.id,
          name: task.name,
          schedule: task.schedule,
          status: task.status,
          nextRun: task.nextRun
        }
      });
    } catch (error) {
      console.error('Schedule task controller error', {
        error: error.message
      });

      // Handle validation errors
      if (error.message.includes('Task') || error.message.includes('required')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to schedule task',
        message: error.message
      });
    }
  }

  /**
   * Optimize resource allocation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async optimizeResourceAllocation(req, res) {
    try {
      // Optimize resource allocation
      const result = await this.adminMonitoringService.optimizeResourceAllocation();

      // Return result
      res.status(200).json({
        success: true,
        message: 'Resource allocation optimized successfully',
        optimizationId: result.optimizationId,
        currentUsage: result.currentUsage,
        recommendations: result.recommendations,
        processingTime: result.processingTime
      });
    } catch (error) {
      console.error('Optimize resource allocation controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to optimize resource allocation',
        message: error.message
      });
    }
  }

  /**
   * Process billing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async processBilling(req, res) {
    try {
      const billingData = req.body;

      // Validate required fields
      if (!billingData.customerId) {
        return res.status(400).json({
          error: 'Customer ID is required'
        });
      }

      // Process billing
      const result = await this.adminMonitoringService.processBilling(billingData);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Billing processed successfully',
        billingId: result.id,
        status: result.status,
        result: result.result
      });
    } catch (error) {
      console.error('Process billing controller error', {
        error: error.message
      });

      // Handle validation errors
      if (error.message.includes('Customer ID') || error.message.includes('required')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to process billing',
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
      const status = this.adminMonitoringService.getServiceStatus();

      // Return status
      res.status(200).json({
        success: true,
        status: status
      });
    } catch (error) {
      console.error('Get service status controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve service status',
        message: error.message
      });
    }
  }

  /**
   * Get documentation job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getDocumentationJobStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.adminMonitoringService.getDocumentationJobStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Documentation job not found'
        });
      }
    } catch (error) {
      console.error('Get documentation job status controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve documentation job status',
        message: error.message
      });
    }
  }

  /**
   * Get scheduled tasks
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getScheduledTasks(req, res) {
    try {
      // Get scheduled tasks
      const tasks = this.adminMonitoringService.getScheduledTasks();

      // Return tasks
      res.status(200).json({
        success: true,
        tasks: tasks
      });
    } catch (error) {
      console.error('Get scheduled tasks controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve scheduled tasks',
        message: error.message
      });
    }
  }

  /**
   * Get billing records
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getBillingRecords(req, res) {
    try {
      // Get billing records
      const records = this.adminMonitoringService.getBillingRecords();

      // Return records
      res.status(200).json({
        success: true,
        records: records
      });
    } catch (error) {
      console.error('Get billing records controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve billing records',
        message: error.message
      });
    }
  }

  /**
   * Generate usage report
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateUsageReport(req, res) {
    try {
      const { period, format } = req.body;

      // Generate usage report
      const result = await this.adminMonitoringService.generateUsageReport({
        period,
        format
      });

      // Return result
      res.status(200).json({
        success: true,
        message: 'Usage report generated successfully',
        reportId: result.reportId,
        period: result.period,
        format: result.format,
        generatedAt: result.generatedAt,
        processingTime: result.processingTime
      });
    } catch (error) {
      console.error('Generate usage report controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to generate usage report',
        message: error.message
      });
    }
  }

  /**
   * Get active alerts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getActiveAlerts(req, res) {
    try {
      // Get active alerts
      const alerts = this.adminMonitoringService.getActiveAlerts();

      // Return alerts
      res.status(200).json({
        success: true,
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
      const result = this.adminMonitoringService.acknowledgeAlert(alertId);

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
      const result = this.adminMonitoringService.resolveAlert(alertId);

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
      console.error('Resolve alert controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to resolve alert',
        message: error.message
      });
    }
  }
}

module.exports = AdminMonitoringController;