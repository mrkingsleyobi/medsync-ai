/**
 * Alert Generation and Notification Service
 * Service for generating alerts and sending notifications
 */

const config = require('../config/iot-wearable.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const { cleanupOldEntries } = require('../../../src/utils/cleanup.util.js');

class AlertGenerationService {
  /**
   * Create a new Alert Generation and Notification Service
   * NOTE: This is a simulation implementation for demonstration purposes.
   * In a production environment, this would generate real alerts and send notifications.
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.alerts = new Map();

    // Initialize services
    this._initializeServices();

    this.logger.info('Alert Generation and Notification Service created', {
      service: 'alert-generation-service'
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
    // Clean up old alerts periodically if enabled
    if (this.config.alerts.enabled) {
      const runAlertCleanup = async () => {
        try {
          this._cleanupOldAlerts();
        } catch (error) {
          this.logger.error('Alert cleanup failed', {
            error: error.message,
            stack: error.stack
          });
        } finally {
          setTimeout(runAlertCleanup, this.config.alerts.cleanupFrequency || 3600000); // Default 1 hour
        }
      };
      runAlertCleanup();
    }

    this.logger.info('Alert generation services initialized');
  }













  /**
   * Generate alert
   * @param {Object} alertData - Alert data
   * @returns {Object} Created alert
   */
  createAlert(alertData) {
    try {
      const alertId = uuidv4();
      const alert = {
        id: alertId,
        ...alertData,
        createdAt: new Date().toISOString(),
        acknowledged: false,
        resolved: false,
        escalationLevel: 1
      };

      this.alerts.set(alertId, alert);

      this.logger.warn('Alert created', {
        alertId,
        type: alertData.type,
        severity: alertData.severity
      });

      // In a real implementation, this would trigger notifications
      // For simulation, we'll just log it
      this.logger.info('Alert notification would be sent', {
        alertId,
        channels: this.config.alerts.notificationMethods
      });

      return alert;
    } catch (error) {
      this.logger.error('Failed to create alert', {
        error: error.message
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
      alerts: {
        enabled: this.config.alerts.enabled,
        activeAlerts: Array.from(this.alerts.values())
          .filter(alert => !alert.resolved).length
      }
    };
  }




  /**
   * Get alert status
   * @param {string} alertId - Alert ID
   * @returns {Object|null} Alert status or null if not found
   */
  getAlertStatus(alertId) {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      return null;
    }

    return {
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      createdAt: alert.createdAt,
      acknowledged: alert.acknowledged,
      resolved: alert.resolved
    };
  }



  /**
   * Acknowledge an alert
   * @param {string} alertId - Alert ID
   * @returns {Object|null} Updated alert or null if not found
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      return null;
    }

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();

    this.logger.info('Alert acknowledged', {
      alertId
    });

    return {
      id: alert.id,
      acknowledged: alert.acknowledged,
      acknowledgedAt: alert.acknowledgedAt
    };
  }

  /**
   * Resolve an alert
   * @param {string} alertId - Alert ID
   * @returns {Object|null} Updated alert or null if not found
   */
  resolveAlert(alertId) {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      return null;
    }

    alert.resolved = true;
    alert.resolvedAt = new Date().toISOString();

    this.logger.info('Alert resolved', {
      alertId
    });

    return {
      id: alert.id,
      resolved: alert.resolved,
      resolvedAt: alert.resolvedAt
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

  /**
   * Clean up old alerts to prevent memory leaks
   * @private
   */
  _cleanupOldAlerts() {
    try {
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      const maxAlerts = 10000; // Maximum number of alerts to keep
      const now = Date.now();

      // If we have too many alerts, remove the oldest ones first
      if (this.alerts.size > maxAlerts) {
        const alerts = Array.from(this.alerts.entries())
          .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
          .slice(maxAlerts);

        for (const [key, alert] of alerts) {
          this.alerts.delete(key);
        }
      }

      // Remove alerts older than maxAge
      for (const [key, alert] of this.alerts.entries()) {
        if (alert.createdAt && (now - new Date(alert.createdAt).getTime()) > maxAge) {
          this.alerts.delete(key);
        }
      }
    } catch (error) {
      this.logger.error('Alert cleanup failed', {
        error: error.message,
        stack: error.stack
      });
    }
  }
}

module.exports = AlertGenerationService;