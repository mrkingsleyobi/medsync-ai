/**
 * Early Warning System Service
 * Service for early warning system functionality
 */

const config = require('../config/iot-wearable.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

class EarlyWarningSystemService {
  /**
   * Create a new Early Warning System Service
   * NOTE: This is a simulation implementation for demonstration purposes.
   * In a production environment, this would integrate with real early warning systems.
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.warnings = new Map();

    // Initialize services
    this._initializeServices();

    this.logger.info('Early Warning System Service created', {
      service: 'early-warning-system-service'
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
      defaultMeta: { service: 'early-warning-system-service' },
      transports: [
        new winston.transports.File({
          filename: path.join(logsDir, 'early-warning-system-service-error.log'),
          level: 'error',
          maxsize: 10000000, // 10MB
          maxFiles: 5
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'early-warning-system-service-combined.log'),
          maxsize: 10000000, // 10MB
          maxFiles: 5
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
              return `${timestamp} [${level}] ${service || 'early-warning-system-service'}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
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
    // Clean up old warnings periodically if enabled
    if (this.config.earlyWarning.enabled) {
      const runWarningCleanup = async () => {
        try {
          this._cleanupOldWarnings();
        } catch (error) {
          this.logger.error('Warning cleanup failed', {
            error: error.message,
            stack: error.stack
          });
        } finally {
          setTimeout(runWarningCleanup, this.config.earlyWarning.cleanupFrequency || 3600000); // Default 1 hour
        }
      };
      runWarningCleanup();
    }

    this.logger.info('Early warning system services initialized');
  }

  /**
   * Generate early warning
   * @param {Object} patientData - Patient data for early warning
   * @returns {Promise<Object>} Early warning result
   */
  async generateEarlyWarning(patientData) {
    try {
      if (!this.config.earlyWarning.enabled) {
        throw new Error('Early warning system is not enabled');
      }

      if (!patientData) {
        throw new Error('Patient data is required for early warning generation');
      }

      const jobId = uuidv4();
      this.logger.info('Generating early warning', {
        jobId,
        patientId: patientData.patientId
      });

      // Simulate early warning generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = {
        jobId: jobId,
        patientId: patientData.patientId,
        warnings: this._generateSampleWarnings(),
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        processingTime: 1500
      };

      // Store warning
      this.warnings.set(jobId, {
        id: jobId,
        ...result,
        createdAt: new Date().toISOString()
      });

      this.logger.info('Early warning generation completed', {
        jobId,
        warnings: result.warnings.length,
        confidence: result.confidence,
        processingTime: result.processingTime
      });

      return result;
    } catch (error) {
      this.logger.error('Early warning generation failed', {
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Generate sample warnings
   * @returns {Array} Sample warnings
   * @private
   */
  _generateSampleWarnings() {
    const warnings = [];
    const warningTypes = [
      'risk_of_fall',
      'risk_of_infection',
      'risk_of_dehydration',
      'risk_of_malnutrition',
      'risk_of_deterioration'
    ];

    const warningCount = Math.floor(Math.random() * 3) + 1; // 1-3 warnings

    for (let i = 0; i < warningCount; i++) {
      warnings.push({
        type: warningTypes[Math.floor(Math.random() * warningTypes.length)],
        description: 'Potential health risk detected based on current vitals and trends',
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        recommendations: [
          'Monitor vital signs more frequently',
          'Consult with healthcare provider',
          'Adjust medication as needed'
        ]
      });
    }

    return warnings;
  }

  /**
   * Get service status
   * @returns {Object} Service status
   */
  getServiceStatus() {
    return {
      earlyWarning: {
        enabled: this.config.earlyWarning.enabled,
        activeWarnings: this.warnings.size
      }
    };
  }

  /**
   * Get early warning status
   * @param {string} jobId - Early warning job ID
   * @returns {Object|null} Early warning status or null if not found
   */
  getEarlyWarningStatus(jobId) {
    const warning = this.warnings.get(jobId);
    if (!warning) {
      return null;
    }

    return {
      id: warning.id,
      patientId: warning.patientId,
      warnings: warning.warnings,
      confidence: warning.confidence,
      createdAt: warning.createdAt
    };
  }

  /**
   * Acknowledge an early warning
   * @param {string} jobId - Early warning job ID
   * @returns {Object|null} Updated early warning or null if not found
   */
  acknowledgeEarlyWarning(jobId) {
    const warning = this.warnings.get(jobId);
    if (!warning) {
      return null;
    }

    warning.acknowledged = true;
    warning.acknowledgedAt = new Date().toISOString();

    this.logger.info('Early warning acknowledged', {
      jobId
    });

    return {
      id: warning.id,
      acknowledged: warning.acknowledged,
      acknowledgedAt: warning.acknowledgedAt
    };
  }

  /**
   * Resolve an early warning
   * @param {string} jobId - Early warning job ID
   * @returns {Object|null} Updated early warning or null if not found
   */
  resolveEarlyWarning(jobId) {
    const warning = this.warnings.get(jobId);
    if (!warning) {
      return null;
    }

    warning.resolved = true;
    warning.resolvedAt = new Date().toISOString();

    this.logger.info('Early warning resolved', {
      jobId
    });

    return {
      id: warning.id,
      resolved: warning.resolved,
      resolvedAt: warning.resolvedAt
    };
  }

  /**
   * Clean up old warnings to prevent memory leaks
   * @private
   */
  _cleanupOldWarnings() {
    try {
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      const maxWarnings = 10000; // Maximum number of warnings to keep
      const now = Date.now();

      // If we have too many warnings, remove the oldest ones first
      if (this.warnings.size > maxWarnings) {
        const warnings = Array.from(this.warnings.entries())
          .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
          .slice(maxWarnings);

        for (const [key, warning] of warnings) {
          this.warnings.delete(key);
        }
      }

      // Remove warnings older than maxAge
      for (const [key, warning] of this.warnings.entries()) {
        if (warning.createdAt && (now - new Date(warning.createdAt).getTime()) > maxAge) {
          this.warnings.delete(key);
        }
      }
    } catch (error) {
      this.logger.error('Warning cleanup failed', {
        error: error.message,
        stack: error.stack
      });
    }
  }
}

module.exports = EarlyWarningSystemService;