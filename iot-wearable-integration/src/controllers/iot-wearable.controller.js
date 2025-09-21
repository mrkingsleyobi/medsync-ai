/**
 * IoT & Wearable Integration Controller
 * Controller for handling IoT and wearable integration requests
 */

const IoTWearableService = require('../services/iot-wearable.service.js');

class IoTWearableController {
  /**
   * Create a new IoT & Wearable Integration Controller
   */
  constructor() {
    this.iotWearableService = new IoTWearableService();
    // Use the service's logger
    this.logger = this.iotWearableService.logger;
  }

  /**
   * Integrate with wearable devices
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async integrateWithWearables(req, res) {
    try {
      const { options } = req.body;

      // Integrate with wearable devices
      const result = await this.iotWearableService.integrateWithWearables(options);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Wearable device integration completed successfully',
        jobId: result.jobId,
        devicesConnected: result.devicesConnected,
        dataPoints: result.dataPoints,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Wearable device integration controller error', {
        error: error.message,
        stack: error.stack
      });

      // Handle specific errors with user-friendly messages
      if (error.message.includes('Wearable device integration is not enabled')) {
        return res.status(400).json({
          error: 'Wearable device integration is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to integrate with wearable devices'
      });
      });
    }
  }

  /**
   * Process IoT sensor data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async processSensorData(req, res) {
    try {
      const { sensorData } = req.body;

      // Validate required fields
      if (!sensorData || !Array.isArray(sensorData)) {
        return res.status(400).json({
          error: 'Sensor data array is required'
        });
      }

      // Process IoT sensor data
      const result = await this.iotWearableService.processSensorData(sensorData);

      // Return result
      res.status(200).json({
        success: true,
        message: 'IoT sensor data processed successfully',
        jobId: result.jobId,
        processedDataPoints: result.processedDataPoints,
        anomaliesDetected: result.anomaliesDetected,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('IoT sensor data processing controller error', {
        error: error.message,
        stack: error.stack
      });

      // Handle validation errors with user-friendly messages
      if (error.message.includes('Sensor data array is required') || error.message.includes('cannot be empty')) {
        return res.status(400).json({
          error: 'Invalid sensor data format'
        });
      }

      // Handle specific errors with user-friendly messages
      if (error.message.includes('IoT sensor integration is not enabled')) {
        return res.status(400).json({
          error: 'IoT sensor integration is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to process IoT sensor data'
      });
      });
    }
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
      const result = await this.iotWearableService.monitorRealTimeHealth(options);

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
        error: 'Failed to monitor real-time health data'
      });
      });
    }
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
      const result = await this.iotWearableService.generateEarlyWarning(patientData);

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
      this.logger.error('Early warning generation controller error', {
        error: error.message,
        stack: error.stack
      });

      // Handle validation errors with user-friendly messages
      if (error.message.includes('Patient data is required')) {
        return res.status(400).json({
          error: 'Invalid patient data provided'
        });
      }

      // Handle specific errors with user-friendly messages
      if (error.message.includes('Early warning system is not enabled')) {
        return res.status(400).json({
          error: 'Early warning system is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to generate early warning'
      });
      });
    }
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
      const result = await this.iotWearableService.generatePopulationAnalytics(options);

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
      this.logger.error('Population health analytics generation controller error', {
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
      });
    }
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
      const result = await this.iotWearableService.generateHealthPredictions(patientData);

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
      this.logger.error('Personalized health predictions generation controller error', {
        error: error.message,
        stack: error.stack
      });

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
      const status = this.iotWearableService.getServiceStatus();

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
      });
    }
  }

  /**
   * Get wearable integration job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getWearableIntegrationStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.iotWearableService.getWearableIntegrationStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Wearable integration job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get wearable integration job status controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve wearable integration job status'
      });
      });
    }
  }

  /**
   * Get sensor data processing job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSensorDataProcessingStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.iotWearableService.getSensorDataProcessingStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Sensor data processing job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      this.logger.error('Get sensor data processing job status controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve sensor data processing job status'
      });
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
      const status = this.iotWearableService.getMonitoringStatus(jobId);

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
        error: 'Failed to retrieve monitoring job status'
      });
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
      const status = this.iotWearableService.getAlertStatus(alertId);

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
        error: 'Failed to retrieve alert status'
      });
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
      const status = this.iotWearableService.getPredictionStatus(jobId);

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
      this.logger.error('Get prediction job status controller error', {
        error: error.message,
        stack: error.stack
      });

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve prediction job status'
      });
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

      // Get job status
      const status = this.iotWearableService.getAnalyticsStatus(jobId);

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
      const result = this.iotWearableService.acknowledgeAlert(alertId);

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
        error: 'Failed to acknowledge alert'
      });
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
      const result = this.iotWearableService.resolveAlert(alertId);

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
        error: 'Failed to resolve alert'
      });
      });
    }
  }
}

module.exports = IoTWearableController;