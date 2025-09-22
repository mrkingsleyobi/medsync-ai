/**
 * IoT & Wearable Integration Service
 * Service for integrating with IoT devices and wearable technology
 */

const config = require('../config/iot-wearable.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const { cleanupOldEntries } = require('../../../src/utils/cleanup.util.js');

class IoTWearableService {
  /**
   * Create a new IoT Sensor Integration Service
   * NOTE: This is a simulation implementation for demonstration purposes.
   * In a production environment, this would integrate with real IoT sensor APIs.
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.sensorConnections = new Map();

    // Initialize services
    this._initializeServices();

    this.logger.info('IoT Sensor Integration Service created', {
      service: 'iot-sensor-service'
    });
  }

  /**
   * Create logger instance
   * @returns {Object} Winston logger instance
   */
  _createLogger() {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'iot-wearable-service' },
      transports: [
        new winston.transports.File({
          filename: path.join(logsDir, 'iot-wearable-service-error.log'),
          level: 'error',
          maxsize: 10000000, // 10MB
          maxFiles: 5
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'iot-wearable-service-combined.log'),
          maxsize: 10000000, // 10MB
          maxFiles: 5
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
              return `${timestamp} [${level}] ${service || 'iot-wearable-service'}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            })
          )
        })
      ]
    });
  }

  /**
   * Initialize services
   * @private
   */
  _initializeServices() {
    // Initialize IoT sensor connections if enabled
    if (this.config.sensors.enabled) {
      this._initializeSensorConnections();
    }

    this.logger.info('IoT sensor services initialized');
  }

  /**
   * Initialize IoT sensor connections
   * @private
   */
  _initializeSensorConnections() {
    // In a real implementation, this would initialize connections to IoT sensors
    this.logger.info('IoT sensor connections initialized');
  }

  /**
   * Process IoT sensor data
   * @param {Array} sensorData - Sensor data to process
   * @returns {Promise<Object>} Sensor data processing result
   */
  async processSensorData(sensorData = []) {
    const jobId = uuidv4();

    // Create sensor job record
    const job = {
      id: jobId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      sensorData: sensorData,
      result: null,
      error: null
    };

    this.sensorJobs = this.sensorJobs || new Map();
    this.sensorJobs.set(jobId, job);
    // Clean up old jobs if we have too many
    this._cleanupOldJobs(this.sensorJobs);

    try {
      if (!this.config.sensors.enabled) {
        throw new Error('IoT sensor integration is not enabled');
      }

      if (!Array.isArray(sensorData) || sensorData.length === 0) {
        throw new Error('Sensor data array is required and cannot be empty');
      }

      this.logger.info('Processing IoT sensor data', {
        jobId,
        dataPoints: sensorData.length
      });

      // Start job
      job.status = 'running';
      job.startedAt = new Date().toISOString();

      // Simulate sensor data processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = {
        jobId: jobId,
        processedDataPoints: sensorData.length,
        anomaliesDetected: Math.floor(sensorData.length * 0.05), // 5% anomaly rate
        processingTime: 2000
      };

      // Complete job
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.result = result;

      this.logger.info('IoT sensor data processing completed', {
        jobId,
        processedDataPoints: result.processedDataPoints,
        anomaliesDetected: result.anomaliesDetected,
        processingTime: result.processingTime
      });

      return result;
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;

      this.logger.error('IoT sensor data processing failed', {
        jobId,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }


  /**
   * Get service status
   * @returns {Object} Service status
   */
  getServiceStatus() {
    return {
      sensors: {
        enabled: this.config.sensors.enabled,
        sensorsConnected: this.sensorConnections.size
      }
    };
  }

  /**
   * Get sensor data processing job status
   * @param {string} jobId - Sensor data processing job ID
   * @returns {Object|null} Job status or null if not found
   */
  getSensorDataProcessingStatus(jobId) {
    if (!this.sensorJobs) {
      return null;
    }

    const job = this.sensorJobs.get(jobId);
    if (!job) {
      return null;
    }

    return {
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt
    };
  }

  /**
   * Clean up old jobs to prevent memory leaks
   * @param {Map} jobMap - The job Map to clean up
   * @private
   */
  _cleanupOldJobs(jobMap) {
    try {
      const stats = cleanupOldEntries(jobMap, {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        maxEntries: 1000
      });

      if (stats.totalRemoved > 0) {
        this.logger.debug('Job cleanup completed', {
          removedByAge: stats.removedByAge,
          removedByCount: stats.removedByCount,
          totalRemoved: stats.totalRemoved
        });
      }
    } catch (error) {
      this.logger.error('Job cleanup failed', {
        error: error.message,
        stack: error.stack
      });
    }
  }
}

module.exports = IoTWearableService;