/**
 * IoT & Wearable Integration Service Tests
 * Unit tests for the IoT and wearable integration service
 */

const IoTWearableService = require('../../src/services/iot-wearable.service.js');

describe('IoTWearableService', () => {
  let iotWearableService;

  beforeEach(() => {
    iotWearableService = new IoTWearableService();
  });

  describe('integrateWithWearables', () => {
    test('should integrate with wearable devices successfully', async () => {
      const options = {
        deviceTypes: ['fitbit', 'appleWatch']
      };

      const result = await iotWearableService.integrateWithWearables(options);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.devicesConnected).toBeDefined();
      expect(Array.isArray(result.devicesConnected)).toBe(true);
      expect(result.dataPoints).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when wearable device integration is not enabled', async () => {
      // Temporarily disable wearable integration
      const originalEnabled = iotWearableService.config.wearables.enabled;
      iotWearableService.config.wearables.enabled = false;

      await expect(iotWearableService.integrateWithWearables({}))
        .rejects
        .toThrow('Wearable device integration is not enabled');

      // Restore original setting
      iotWearableService.config.wearables.enabled = originalEnabled;
    });
  });

  describe('processSensorData', () => {
    test('should process IoT sensor data successfully', async () => {
      const sensorData = [
        { type: 'heartRate', value: 72, timestamp: new Date().toISOString() },
        { type: 'bloodPressure', value: { systolic: 118, diastolic: 76 }, timestamp: new Date().toISOString() }
      ];

      const result = await iotWearableService.processSensorData(sensorData);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.processedDataPoints).toBe(sensorData.length);
      expect(result.anomaliesDetected).toBeGreaterThanOrEqual(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when sensor data array is not provided', async () => {
      await expect(iotWearableService.processSensorData())
        .rejects
        .toThrow('Sensor data array is required and cannot be empty');
    });

    test('should throw error when sensor data array is empty', async () => {
      await expect(iotWearableService.processSensorData([]))
        .rejects
        .toThrow('Sensor data array is required and cannot be empty');
    });

    test('should throw error when IoT sensor integration is not enabled', async () => {
      const sensorData = [{ type: 'heartRate', value: 72 }];

      // Temporarily disable sensor integration
      const originalEnabled = iotWearableService.config.sensors.enabled;
      iotWearableService.config.sensors.enabled = false;

      await expect(iotWearableService.processSensorData(sensorData))
        .rejects
        .toThrow('IoT sensor integration is not enabled');

      // Restore original setting
      iotWearableService.config.sensors.enabled = originalEnabled;
    });
  });

  describe('monitorRealTimeHealth', () => {
    test('should monitor real-time health data successfully', async () => {
      const options = {
        frequency: 10000
      };

      const result = await iotWearableService.monitorRealTimeHealth(options);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.vitals).toBeDefined();
      expect(result.alerts).toBeDefined();
      expect(Array.isArray(result.alerts)).toBe(true);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when real-time health monitoring is not enabled', async () => {
      // Temporarily disable monitoring
      const originalEnabled = iotWearableService.config.monitoring.enabled;
      iotWearableService.config.monitoring.enabled = false;

      await expect(iotWearableService.monitorRealTimeHealth({}))
        .rejects
        .toThrow('Real-time health monitoring is not enabled');

      // Restore original setting
      iotWearableService.config.monitoring.enabled = originalEnabled;
    });
  });

  describe('generateEarlyWarning', () => {
    test('should generate early warning successfully', async () => {
      const patientData = {
        patientId: 'PAT-12345',
        vitals: { heartRate: 72, bloodPressure: { systolic: 118, diastolic: 76 } }
      };

      const result = await iotWearableService.generateEarlyWarning(patientData);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.patientId).toBe(patientData.patientId);
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when patient data is not provided', async () => {
      await expect(iotWearableService.generateEarlyWarning())
        .rejects
        .toThrow('Patient data is required for early warning generation');
    });

    test('should throw error when early warning system is not enabled', async () => {
      const patientData = { patientId: 'PAT-12345' };

      // Temporarily disable early warning system
      const originalEnabled = iotWearableService.config.earlyWarning.enabled;
      iotWearableService.config.earlyWarning.enabled = false;

      await expect(iotWearableService.generateEarlyWarning(patientData))
        .rejects
        .toThrow('Early warning system is not enabled');

      // Restore original setting
      iotWearableService.config.earlyWarning.enabled = originalEnabled;
    });
  });

  describe('generatePopulationAnalytics', () => {
    test('should generate population health analytics successfully', async () => {
      const options = {
        aggregationPeriod: 'daily'
      };

      const result = await iotWearableService.generatePopulationAnalytics(options);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.populationMetrics).toBeDefined();
      expect(result.benchmarks).toBeDefined();
      expect(result.outliers).toBeGreaterThanOrEqual(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when population health analytics is not enabled', async () => {
      // Temporarily disable population analytics
      const originalEnabled = iotWearableService.config.populationAnalytics.enabled;
      iotWearableService.config.populationAnalytics.enabled = false;

      await expect(iotWearableService.generatePopulationAnalytics({}))
        .rejects
        .toThrow('Population health analytics is not enabled');

      // Restore original setting
      iotWearableService.config.populationAnalytics.enabled = originalEnabled;
    });
  });

  describe('generateHealthPredictions', () => {
    test('should generate personalized health predictions successfully', async () => {
      const patientData = {
        patientId: 'PAT-12345',
        vitals: { heartRate: 72, bloodPressure: { systolic: 118, diastolic: 76 } }
      };

      const result = await iotWearableService.generateHealthPredictions(patientData);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.patientId).toBe(patientData.patientId);
      expect(result.predictions).toBeDefined();
      expect(Array.isArray(result.predictions)).toBe(true);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when patient data is not provided', async () => {
      await expect(iotWearableService.generateHealthPredictions())
        .rejects
        .toThrow('Patient data is required for health prediction generation');
    });

    test('should throw error when personalized health prediction is not enabled', async () => {
      const patientData = { patientId: 'PAT-12345' };

      // Temporarily disable health prediction
      const originalEnabled = iotWearableService.config.healthPrediction.enabled;
      iotWearableService.config.healthPrediction.enabled = false;

      await expect(iotWearableService.generateHealthPredictions(patientData))
        .rejects
        .toThrow('Personalized health prediction is not enabled');

      // Restore original setting
      iotWearableService.config.healthPrediction.enabled = originalEnabled;
    });
  });

  describe('createAlert', () => {
    test('should create an alert successfully', () => {
      const alertData = {
        type: 'high_heart_rate',
        value: 140,
        threshold: { min: 60, max: 100 },
        severity: 'high'
      };

      const result = iotWearableService.createAlert(alertData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.type).toBe(alertData.type);
      expect(result.value).toBe(alertData.value);
      expect(result.severity).toBe(alertData.severity);
      expect(result.acknowledged).toBe(false);
      expect(result.resolved).toBe(false);
    });
  });

  describe('getServiceStatus', () => {
    test('should return service status', () => {
      const status = iotWearableService.getServiceStatus();

      expect(status).toBeDefined();
      expect(status.wearables).toBeDefined();
      expect(status.sensors).toBeDefined();
      expect(status.monitoring).toBeDefined();
      expect(status.alerts).toBeDefined();
      expect(status.predictions).toBeDefined();
      expect(status.analytics).toBeDefined();
    });
  });

  describe('getWearableIntegrationStatus', () => {
    test('should return wearable integration job status', async () => {
      // First create a wearable integration job
      const result = await iotWearableService.integrateWithWearables({});

      const status = iotWearableService.getWearableIntegrationStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });
  });

  describe('getSensorDataProcessingStatus', () => {
    test('should return sensor data processing job status', async () => {
      // First process some sensor data
      const sensorData = [{ type: 'heartRate', value: 72 }];
      const result = await iotWearableService.processSensorData(sensorData);

      const status = iotWearableService.getSensorDataProcessingStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });
  });

  describe('getMonitoringStatus', () => {
    test('should return monitoring job status', async () => {
      // First monitor real-time health
      const result = await iotWearableService.monitorRealTimeHealth({});

      const status = iotWearableService.getMonitoringStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent job', () => {
      const status = iotWearableService.getMonitoringStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getAlertStatus', () => {
    test('should return alert status', () => {
      // First create an alert
      const alertData = {
        type: 'low_glucose',
        value: 45,
        threshold: { min: 70, max: 140 },
        severity: 'high'
      };
      const alert = iotWearableService.createAlert(alertData);

      const status = iotWearableService.getAlertStatus(alert.id);

      expect(status).toBeDefined();
      expect(status.id).toBe(alert.id);
      expect(status.type).toBe(alertData.type);
      expect(status.severity).toBe(alertData.severity);
      expect(status.acknowledged).toBe(false);
      expect(status.resolved).toBe(false);
    });

    test('should return null for non-existent alert', () => {
      const status = iotWearableService.getAlertStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getPredictionStatus', () => {
    test('should return prediction job status', async () => {
      // First generate health predictions
      const patientData = { patientId: 'PAT-12345' };
      const result = await iotWearableService.generateHealthPredictions(patientData);

      const status = iotWearableService.getPredictionStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent job', () => {
      const status = iotWearableService.getPredictionStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getAnalyticsStatus', () => {
    test('should return analytics job status', async () => {
      // First generate population analytics
      const result = await iotWearableService.generatePopulationAnalytics({});

      const status = iotWearableService.getAnalyticsStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });
  });

  describe('acknowledgeAlert', () => {
    test('should acknowledge an alert successfully', () => {
      // First create an alert
      const alertData = {
        type: 'high_blood_pressure',
        value: { systolic: 185, diastolic: 95 },
        threshold: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
        severity: 'high'
      };
      const alert = iotWearableService.createAlert(alertData);

      const result = iotWearableService.acknowledgeAlert(alert.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(alert.id);
      expect(result.acknowledged).toBe(true);
      expect(result.acknowledgedAt).toBeDefined();
    });

    test('should return null for non-existent alert', () => {
      const result = iotWearableService.acknowledgeAlert('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('resolveAlert', () => {
    test('should resolve an alert successfully', () => {
      // First create an alert
      const alertData = {
        type: 'irregular_heartbeat',
        value: 'arrhythmic',
        severity: 'medium'
      };
      const alert = iotWearableService.createAlert(alertData);

      const result = iotWearableService.resolveAlert(alert.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(alert.id);
      expect(result.resolved).toBe(true);
      expect(result.resolvedAt).toBeDefined();
    });

    test('should return null for non-existent alert', () => {
      const result = iotWearableService.resolveAlert('non-existent-id');
      expect(result).toBeNull();
    });
  });
});