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
   * Create a new IoT & Wearable Integration Service
   * NOTE: This is a simulation implementation for demonstration purposes.
   * In a production environment, this would integrate with real IoT devices,
   * wearable technology APIs, and sensor networks.
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.wearableConnections = new Map();
    this.sensorConnections = new Map();
    this.monitoringData = new Map();
    this.alerts = new Map();
    this.predictions = new Map();
    this.analytics = new Map();

    // Initialize services
    this._initializeServices();

    this.logger.info('IoT & Wearable Integration Service created', {
      service: 'iot-wearable-service'
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

    // Initialize IoT sensor connections if enabled
    if (this.config.sensors.enabled) {
      this._initializeSensorConnections();
    }

    // Start monitoring if enabled
    if (this.config.monitoring.enabled) {
      const runMonitoring = async () => {
        try {
          await this._collectMonitoringData();
          // Clean up old jobs periodically
          this._cleanupOldMonitoringJobs();
          // Clean up old alerts periodically
          this._cleanupOldAlerts();
        } catch (error) {
          this.logger.error('Monitoring data collection failed', {
            error: error.message,
            stack: error.stack
          });
        } finally {
          setTimeout(runMonitoring, this.config.monitoring.frequency);
        }
      };
      runMonitoring();
    }

    // Start analytics if enabled
    if (this.config.populationAnalytics.enabled) {
      const runAnalytics = async () => {
        try {
          await this._collectAnalyticsData();
          // Clean up old analytics data periodically
          this._cleanupOldAnalyticsData();
        } catch (error) {
          this.logger.error('Analytics data collection failed', {
            error: error.message,
            stack: error.stack
          });
        } finally {
          setTimeout(runAnalytics, this.config.populationAnalytics.aggregation.frequency);
        }
      };
      runAnalytics();
    }

    // Start health prediction if enabled
    if (this.config.healthPrediction.enabled) {
      const runPredictions = async () => {
        try {
          await this._generateHealthPredictions();
          // Clean up old predictions periodically
          this._cleanupOldPredictions();
        } catch (error) {
          this.logger.error('Health prediction generation failed', {
            error: error.message,
            stack: error.stack
          });
        } finally {
          setTimeout(runPredictions, this.config.healthPrediction.updateFrequency);
        }
      };
      runPredictions();
    }

    this.logger.info('IoT & wearable services initialized');
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
   * Initialize IoT sensor connections
   * @private
   */
  _initializeSensorConnections() {
    // In a real implementation, this would initialize connections to IoT sensors
    this.logger.info('IoT sensor connections initialized');
  }

  /**
   * Collect monitoring data
   * @private
   */
  async _collectMonitoringData() {
    try {
      this.logger.debug('Collecting monitoring data');

      // In a real implementation, this would collect data from devices and sensors
      await new Promise(resolve => setTimeout(resolve, 500));

      this.logger.debug('Monitoring data collection completed');
    } catch (error) {
      this.logger.error('Monitoring data collection failed', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Clean up old monitoring jobs to prevent memory leaks
   * @private
   */
  _cleanupOldMonitoringJobs() {
    try {
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      const now = Date.now();

      for (const [key, job] of this.monitoringData.entries()) {
        if (job.createdAt && (now - new Date(job.createdAt).getTime()) > maxAge) {
          this.monitoringData.delete(key);
        }
      }
    } catch (error) {
      this.logger.error('Monitoring job cleanup failed', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Collect analytics data
   * @private
   */
  async _collectAnalyticsData() {
    try {
      this.logger.debug('Collecting analytics data');

      // In a real implementation, this would aggregate population health data
      await new Promise(resolve => setTimeout(resolve, 800));

      this.logger.debug('Analytics data collection completed');
    } catch (error) {
      this.logger.error('Analytics data collection failed', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Generate health predictions
   * @private
   */
  async _generateHealthPredictions() {
    try {
      this.logger.debug('Generating health predictions');

      // In a real implementation, this would run predictive models
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.logger.debug('Health predictions generated');
    } catch (error) {
      this.logger.error('Health prediction generation failed', {
        error: error.message,
        stack: error.stack
      });
    }
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
   * Monitor real-time health data
   * @param {Object} options - Monitoring options
   * @returns {Promise<Object>} Real-time monitoring result
   */
  async monitorRealTimeHealth(options = {}) {
    try {
      if (!this.config.monitoring.enabled) {
        throw new Error('Real-time health monitoring is not enabled');
      }

      const jobId = uuidv4();
      this.logger.info('Starting real-time health monitoring', {
        jobId,
        options
      });

      // Create monitoring job record
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

      this.monitoringData.set(jobId, job);

      // Start job
      job.status = 'running';
      job.startedAt = new Date().toISOString();

      // Simulate real-time monitoring
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate sample monitoring data
      const vitals = this._generateSampleVitals();

      // Check for alerts
      const alerts = this._checkVitalsForAlerts(vitals);

      // Complete job
      job.completedAt = new Date().toISOString();
      job.status = 'completed';
      job.result = {
        jobId: jobId,
        vitals: vitals,
        alerts: alerts,
        processingTime: 1000
      };

      // Create alerts if any were detected
      if (alerts.length > 0) {
        alerts.forEach(alert => {
          this.createAlert(alert);
        });
      }

      this.logger.info('Real-time health monitoring completed', {
        jobId,
        vitals: Object.keys(vitals).length,
        alerts: alerts.length,
        processingTime: job.result.processingTime
      });

      return job.result;
    } catch (error) {
      this.logger.error('Real-time health monitoring failed', {
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Generate sample vitals data
   * @returns {Object} Sample vitals data
   * @private
   */
  _generateSampleVitals() {
    return {
      heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
      bloodPressure: {
        systolic: Math.floor(Math.random() * 30) + 90, // 90-120 mmHg
        diastolic: Math.floor(Math.random() * 20) + 60 // 60-80 mmHg
      },
      glucose: Math.floor(Math.random() * 70) + 70, // 70-140 mg/dL
      temperature: (Math.random() * 2.5 + 97.0).toFixed(1), // 97.0-99.5 °F
      steps: Math.floor(Math.random() * 5000) + 1000 // 1000-6000 steps
    };
  }

  /**
   * Check vitals for alerts
   * @param {Object} vitals - Vitals data
   * @returns {Array} Alerts if any thresholds are exceeded
   * @private
   */
  _checkVitalsForAlerts(vitals) {
    const alerts = [];
    const thresholds = this.config.monitoring.metrics;

    // Check heart rate
    if (vitals.heartRate < thresholds.heartRate.criticalThreshold.min ||
        vitals.heartRate > thresholds.heartRate.criticalThreshold.max) {
      alerts.push({
        type: 'abnormal_heart_rate',
        value: vitals.heartRate,
        threshold: thresholds.heartRate.criticalThreshold,
        severity: 'high'
      });
    }

    // Check blood pressure
    if (vitals.bloodPressure.systolic < thresholds.bloodPressure.criticalThreshold.systolic.min ||
        vitals.bloodPressure.systolic > thresholds.bloodPressure.criticalThreshold.systolic.max ||
        vitals.bloodPressure.diastolic < thresholds.bloodPressure.criticalThreshold.diastolic.min ||
        vitals.bloodPressure.diastolic > thresholds.bloodPressure.criticalThreshold.diastolic.max) {
      alerts.push({
        type: 'abnormal_blood_pressure',
        value: vitals.bloodPressure,
        threshold: thresholds.bloodPressure.criticalThreshold,
        severity: 'high'
      });
    }

    // Check glucose
    if (vitals.glucose < thresholds.glucose.criticalThreshold.min ||
        vitals.glucose > thresholds.glucose.criticalThreshold.max) {
      alerts.push({
        type: 'abnormal_glucose',
        value: vitals.glucose,
        threshold: thresholds.glucose.criticalThreshold,
        severity: 'high'
      });
    }

    // Check temperature
    if (vitals.temperature < thresholds.temperature.criticalThreshold.min ||
        vitals.temperature > thresholds.temperature.criticalThreshold.max) {
      alerts.push({
        type: 'abnormal_temperature',
        value: vitals.temperature,
        threshold: thresholds.temperature.criticalThreshold,
        severity: 'high'
      });
    }

    return alerts;
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
   * Generate population health analytics
   * @param {Object} options - Analytics options
   * @returns {Promise<Object>} Population health analytics result
   */
  async generatePopulationAnalytics(options = {}) {
    const jobId = uuidv4();

    // Create analytics job record
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

    this.analyticsJobs = this.analyticsJobs || new Map();
    this.analyticsJobs.set(jobId, job);
    // Clean up old jobs if we have too many
    this._cleanupOldJobs(this.analyticsJobs);

    try {
      if (!this.config.populationAnalytics.enabled) {
        throw new Error('Population health analytics is not enabled');
      }

      this.logger.info('Generating population health analytics', {
        jobId,
        options
      });

      // Start job
      job.status = 'running';
      job.startedAt = new Date().toISOString();

      // Simulate population analytics generation
      await new Promise(resolve => setTimeout(resolve, 2500));

      const result = {
        jobId: jobId,
        populationMetrics: this._generateSamplePopulationMetrics(),
        benchmarks: this.config.populationAnalytics.benchmarks,
        outliers: Math.floor(Math.random() * 100) + 10,
        processingTime: 2500
      };

      // Complete job
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.result = result;

      this.logger.info('Population health analytics generation completed', {
        jobId,
        metrics: Object.keys(result.populationMetrics).length,
        outliers: result.outliers,
        processingTime: result.processingTime
      });

      return result;
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;

      this.logger.error('Population health analytics generation failed', {
        jobId,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Generate sample population metrics
   * @returns {Object} Sample population metrics
   * @private
   */
  _generateSamplePopulationMetrics() {
    return {
      totalPatients: Math.floor(Math.random() * 10000) + 1000,
      averageHeartRate: Math.floor(Math.random() * 10) + 75,
      averageBloodPressure: {
        systolic: Math.floor(Math.random() * 10) + 115,
        diastolic: Math.floor(Math.random() * 8) + 75
      },
      averageGlucose: Math.floor(Math.random() * 20) + 95,
      averageSteps: Math.floor(Math.random() * 2000) + 8000,
      averageSleep: (Math.random() * 1 + 6.5).toFixed(1),
      chronicConditions: {
        hypertension: Math.floor(Math.random() * 30) + 20, // percentage
        diabetes: Math.floor(Math.random() * 15) + 10, // percentage
        heartDisease: Math.floor(Math.random() * 10) + 5 // percentage
      }
    };
  }

  /**
   * Generate personalized health predictions
   * @param {Object} patientData - Patient data for predictions
   * @returns {Promise<Object>} Personalized health predictions result
   */
  async generateHealthPredictions(patientData) {
    try {
      if (!this.config.healthPrediction.enabled) {
        throw new Error('Personalized health prediction is not enabled');
      }

      if (!patientData) {
        throw new Error('Patient data is required for health prediction generation');
      }

      const jobId = uuidv4();
      this.logger.info('Generating personalized health predictions', {
        jobId,
        patientId: patientData.patientId
      });

      // Create prediction job record
      const job = {
        id: jobId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        patientId: patientData.patientId,
        result: null,
        error: null
      };

      this.predictions.set(jobId, job);

      // Start job
      job.status = 'running';
      job.startedAt = new Date().toISOString();

      // Simulate health prediction generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Complete job
      job.completedAt = new Date().toISOString();
      job.status = 'completed';
      job.result = {
        jobId: jobId,
        patientId: patientData.patientId,
        predictions: this._generateSamplePredictions(),
        confidence: Math.random() * 0.25 + 0.75, // 75-100% confidence
        processingTime: 2000
      };

      this.logger.info('Personalized health predictions generation completed', {
        jobId,
        predictions: job.result.predictions.length,
        confidence: job.result.confidence,
        processingTime: job.result.processingTime
      });

      return job.result;
    } catch (error) {
      this.logger.error('Personalized health predictions generation failed', {
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Generate sample predictions
   * @returns {Array} Sample predictions
   * @private
   */
  _generateSamplePredictions() {
    const predictions = [];
    const predictionTypes = [
      'risk_of_readmission',
      'risk_of_complication',
      'response_to_treatment',
      'disease_progression',
      'wellness_score'
    ];

    for (let i = 0; i < 3; i++) {
      predictions.push({
        type: predictionTypes[Math.floor(Math.random() * predictionTypes.length)],
        probability: Math.random(),
        timeframe: ['30_days', '90_days', '1_year'][Math.floor(Math.random() * 3)],
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        factors: [
          'Age',
          'Medical history',
          'Current vitals',
          'Lifestyle factors'
        ]
      });
    }

    return predictions;
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
      },
      sensors: {
        enabled: this.config.sensors.enabled,
        sensorsConnected: this.sensorConnections.size
      },
      monitoring: {
        enabled: this.config.monitoring.enabled,
        activeMonitoring: Array.from(this.monitoringData.values())
          .filter(job => job.status === 'running').length
      },
      alerts: {
        enabled: this.config.alerts.enabled,
        activeAlerts: Array.from(this.alerts.values())
          .filter(alert => !alert.resolved).length
      },
      predictions: {
        enabled: this.config.healthPrediction.enabled,
        predictionsGenerated: this.predictions.size
      },
      analytics: {
        enabled: this.config.populationAnalytics.enabled,
        analyticsGenerated: this.analytics.size
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
   * Get monitoring job status
   * @param {string} jobId - Monitoring job ID
   * @returns {Object|null} Job status or null if not found
   */
  getMonitoringStatus(jobId) {
    const job = this.monitoringData.get(jobId);
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
   * Get prediction job status
   * @param {string} jobId - Prediction job ID
   * @returns {Object|null} Job status or null if not found
   */
  getPredictionStatus(jobId) {
    const job = this.predictions.get(jobId);
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
   * Get analytics job status
   * @param {string} jobId - Analytics job ID
   * @returns {Object|null} Job status or null if not found
   */
  getAnalyticsStatus(jobId) {
    if (!this.analyticsJobs) {
      return null;
    }

    const job = this.analyticsJobs.get(jobId);
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

module.exports = IoTWearableService;