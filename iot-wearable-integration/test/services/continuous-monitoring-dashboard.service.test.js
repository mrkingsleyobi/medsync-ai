/**
 * Continuous Health Monitoring Dashboard Service Tests
 * Unit tests for the continuous health monitoring dashboard service
 */

const ContinuousMonitoringDashboardService = require('../../src/services/continuous-monitoring-dashboard.service.js');

describe('ContinuousMonitoringDashboardService', () => {
  let continuousMonitoringDashboardService;

  beforeEach(() => {
    continuousMonitoringDashboardService = new ContinuousMonitoringDashboardService();
  });

  describe('monitorRealTimeHealth', () => {
    test('should monitor real-time health data successfully', async () => {
      const options = {
        frequency: 10000
      };

      const result = await continuousMonitoringDashboardService.monitorRealTimeHealth(options);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.vitals).toBeDefined();
      expect(typeof result.vitals).toBe('object');
      expect(Array.isArray(result.alerts)).toBe(true);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when real-time health monitoring is not enabled', async () => {
      // Temporarily disable monitoring
      const originalEnabled = continuousMonitoringDashboardService.config.monitoring.enabled;
      continuousMonitoringDashboardService.config.monitoring.enabled = false;

      await expect(continuousMonitoringDashboardService.monitorRealTimeHealth({}))
        .rejects
        .toThrow('Real-time health monitoring is not enabled');

      // Restore original setting
      continuousMonitoringDashboardService.config.monitoring.enabled = originalEnabled;
    });
  });

  describe('createAlert', () => {
    test('should create an alert successfully', () => {
      const alertData = {
        type: 'high_heart_rate',
        value: 120,
        threshold: { min: 60, max: 100 },
        severity: 'high'
      };

      const result = continuousMonitoringDashboardService.createAlert(alertData);

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
      const status = continuousMonitoringDashboardService.getServiceStatus();

      expect(status).toBeDefined();
      expect(status.monitoring).toBeDefined();
      expect(status.alerts).toBeDefined();
      expect(typeof status.monitoring.enabled).toBe('boolean');
      expect(typeof status.alerts.enabled).toBe('boolean');
    });
  });

  describe('getMonitoringStatus', () => {
    test('should return monitoring job status', async () => {
      // First create a monitoring job
      const result = await continuousMonitoringDashboardService.monitorRealTimeHealth({});

      const status = continuousMonitoringDashboardService.getMonitoringStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent job', () => {
      const status = continuousMonitoringDashboardService.getMonitoringStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getAlertStatus', () => {
    test('should return alert status', () => {
      const alertData = {
        type: 'low_glucose',
        value: 65,
        threshold: { min: 70, max: 140 },
        severity: 'high'
      };

      const alert = continuousMonitoringDashboardService.createAlert(alertData);
      const status = continuousMonitoringDashboardService.getAlertStatus(alert.id);

      expect(status).toBeDefined();
      expect(status.id).toBe(alert.id);
      expect(status.type).toBe(alertData.type);
      expect(status.severity).toBe(alertData.severity);
      expect(status.acknowledged).toBe(false);
      expect(status.resolved).toBe(false);
    });

    test('should return null for non-existent alert', () => {
      const status = continuousMonitoringDashboardService.getAlertStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('acknowledgeAlert', () => {
    test('should acknowledge an alert successfully', () => {
      const alertData = {
        type: 'high_blood_pressure',
        value: { systolic: 160, diastolic: 100 },
        threshold: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
        severity: 'high'
      };

      const alert = continuousMonitoringDashboardService.createAlert(alertData);
      const result = continuousMonitoringDashboardService.acknowledgeAlert(alert.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(alert.id);
      expect(result.acknowledged).toBe(true);
      expect(result.acknowledgedAt).toBeDefined();
    });

    test('should return null for non-existent alert', () => {
      const result = continuousMonitoringDashboardService.acknowledgeAlert('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('resolveAlert', () => {
    test('should resolve an alert successfully', () => {
      const alertData = {
        type: 'irregular_heartbeat',
        value: 'arrhythmia_detected',
        threshold: 'normal_rhythm',
        severity: 'medium'
      };

      const alert = continuousMonitoringDashboardService.createAlert(alertData);
      const result = continuousMonitoringDashboardService.resolveAlert(alert.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(alert.id);
      expect(result.resolved).toBe(true);
      expect(result.resolvedAt).toBeDefined();
    });

    test('should return null for non-existent alert', () => {
      const result = continuousMonitoringDashboardService.resolveAlert('non-existent-id');
      expect(result).toBeNull();
    });
  });
});