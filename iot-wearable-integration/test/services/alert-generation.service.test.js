/**
 * Alert Generation and Notification Service Tests
 * Unit tests for the alert generation and notification service
 */

const AlertGenerationService = require('../../src/services/alert-generation.service.js');

describe('AlertGenerationService', () => {
  let alertGenerationService;

  beforeEach(() => {
    alertGenerationService = new AlertGenerationService();
  });

  describe('createAlert', () => {
    test('should create an alert successfully', () => {
      const alertData = {
        type: 'high_heart_rate',
        value: 120,
        threshold: { min: 60, max: 100 },
        severity: 'high'
      };

      const result = alertGenerationService.createAlert(alertData);

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
      const status = alertGenerationService.getServiceStatus();

      expect(status).toBeDefined();
      expect(status.alerts).toBeDefined();
      expect(typeof status.alerts.enabled).toBe('boolean');
      expect(typeof status.alerts.activeAlerts).toBe('number');
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

      const alert = alertGenerationService.createAlert(alertData);
      const status = alertGenerationService.getAlertStatus(alert.id);

      expect(status).toBeDefined();
      expect(status.id).toBe(alert.id);
      expect(status.type).toBe(alertData.type);
      expect(status.severity).toBe(alertData.severity);
      expect(status.acknowledged).toBe(false);
      expect(status.resolved).toBe(false);
    });

    test('should return null for non-existent alert', () => {
      const status = alertGenerationService.getAlertStatus('non-existent-id');
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

      const alert = alertGenerationService.createAlert(alertData);
      const result = alertGenerationService.acknowledgeAlert(alert.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(alert.id);
      expect(result.acknowledged).toBe(true);
      expect(result.acknowledgedAt).toBeDefined();
    });

    test('should return null for non-existent alert', () => {
      const result = alertGenerationService.acknowledgeAlert('non-existent-id');
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

      const alert = alertGenerationService.createAlert(alertData);
      const result = alertGenerationService.resolveAlert(alert.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(alert.id);
      expect(result.resolved).toBe(true);
      expect(result.resolvedAt).toBeDefined();
    });

    test('should return null for non-existent alert', () => {
      const result = alertGenerationService.resolveAlert('non-existent-id');
      expect(result).toBeNull();
    });
  });
});