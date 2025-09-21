/**
 * IoT & Wearable Integration Service
 * Service for integrating with IoT devices and wearable technology
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/iot-wearable.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { cleanupOldEntries } = require('../../../src/utils/cleanup.util.js');

class IoTWearableService {
  /**
   * Create a new Wearable Device Integration Service
   * NOTE: This is a simulation implementation for demonstration purposes.
   * In a production environment, this would integrate with real wearable technology APIs.
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.wearableConnections = new Map();

    // Initialize services
    this._initializeServices();

    this.logger.info('Wearable Device Integration Service created', {
      service: 'wearable-device-service'
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
    // Initialize wearable device connections if enabled
    if (this.config.wearables.enabled) {
      this._initializeWearableConnections();
    }

    this.logger.info('Wearable device services initialized');
  }

  /**
   * Initialize wearable device connections
   * @private
   */
  _initializeWearableConnections() {
    // In a real implementation, this would initialize connections to wearable device APIs
    this.logger.info('Wearable device connections initialized');
  }


  /**
   * Integrate with wearable devices
   * @param {Object} options - Wearable integration options
   * @returns {Promise<Object>} Wearable integration result
   */
  async integrateWithWearables(options = {}) {
    const jobId = uuidv4();

    // Create wearable job record
    const job = {
      id: jobId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      options: options,
      result: null,
      error: null
    };

    this.wearableJobs = this.wearableJobs || new Map();
    this.wearableJobs.set(jobId, job);
    // Clean up old jobs if we have too many
    this._cleanupOldJobs(this.wearableJobs);

    try {
      if (!this.config.wearables.enabled) {
        throw new Error('Wearable device integration is not enabled');
      }

      this.logger.info('Starting wearable device integration', {
        jobId,
        options
      });

      // Start job
      job.status = 'running';
      job.startedAt = new Date().toISOString();

      // Simulate wearable device integration process
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = {
        jobId: jobId,
        devicesConnected: this._generateSampleDeviceList(),
        dataPoints: Math.floor(Math.random() * 1000) + 100,
        processingTime: 1500
      };

      // Complete job
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.result = result;

      this.logger.info('Wearable device integration completed', {
        jobId,
        devicesConnected: result.devicesConnected.length,
        dataPoints: result.dataPoints,
        processingTime: result.processingTime
      });

      return result;
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;

      this.logger.error('Wearable device integration failed', {
        jobId,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Generate sample device list
   * @returns {Array} Sample device list
   * @private
   */
  _generateSampleDeviceList() {
    const devices = [];
    const deviceTypes = Object.keys(this.config.wearables.supportedDevices);

    for (let i = 0; i < 5; i++) {
      const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      devices.push({
        id: `DEVICE-${Math.floor(Math.random() * 100000)}`,
        type: deviceType,
        model: `${deviceType}-Model-${Math.floor(Math.random() * 1000)}`,
        connected: true,
        lastSync: new Date().toISOString()
      });
    }

    return devices;
  }



  /**
   * Get service status
   * @returns {Object} Service status
   */
  getServiceStatus() {
    return {
      wearables: {
        enabled: this.config.wearables.enabled,
        devicesConnected: this.wearableConnections.size
      }
    };
  }

  /**
   * Get wearable integration job status
   * @param {string} jobId - Wearable integration job ID
   * @returns {Object|null} Job status or null if not found
   */
  getWearableIntegrationStatus(jobId) {
    if (!this.wearableJobs) {
      return null;
    }

    const job = this.wearableJobs.get(jobId);
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