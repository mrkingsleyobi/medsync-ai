# Monitoring Service Tests for MediSync Healthcare AI Platform

## Overview

This file contains unit tests for the monitoring service implementation.

## Tests

```javascript
const MonitoringService = require('../../src/services/monitoring.service.js');

describe('MonitoringService', () => {
  let monitoringService;

  beforeEach(() => {
    monitoringService = new MonitoringService();
  });

  afterEach(() => {
    // Clean up any intervals
    if (monitoringService.monitoringInterval) {
      clearInterval(monitoringService.monitoringInterval);
    }
  });

  describe('monitorEvent', () => {
    test('should monitor security events correctly', () => {
      const event = {
        type: 'test_event',
        severity: 'info',
        message: 'Test event'
      };

      monitoringService.monitorEvent(event);

      expect(monitoringService.metrics.totalEvents).toBe(1);
    });

    test('should increment error metrics for error events', () => {
      const event = {
        type: 'error_event',
        severity: 'error',
        message: 'Error event'
      };

      monitoringService.monitorEvent(event);

      expect(monitoringService.metrics.totalEvents).toBe(1);
      expect(monitoringService.metrics.errorEvents).toBe(1);
    });

    test('should increment security metrics for security events', () => {
      const event = {
        type: 'security_event',
        severity: 'security',
        message: 'Security event'
      };

      monitoringService.monitorEvent(event);

      expect(monitoringService.metrics.totalEvents).toBe(1);
      expect(monitoringService.metrics.securityEvents).toBe(1);
    });
  });

  describe('getMetrics', () => {
    test('should return correct metrics', () => {
      // Add some events
      monitoringService.monitorEvent({ type: 'test1', severity: 'info' });
      monitoringService.monitorEvent({ type: 'test2', severity: 'error' });
      monitoringService.monitorEvent({ type: 'test3', severity: 'security' });

      const metrics = monitoringService.getMetrics();

      expect(metrics.totalEvents).toBe(3);
      expect(metrics.errorEvents).toBe(1);
      expect(metrics.securityEvents).toBe(1);
      expect(metrics.activeAlerts).toBe(0); // No alerts generated for info events
      expect(metrics.totalAlerts).toBe(0);
    });
  });

  describe('getRecentAlerts', () => {
    test('should return recent alerts', () => {
      // Mock the _generateAlert method to add alerts
      monitoringService._generateAlert({
        id: 'alert1',
        type: 'TEST_ALERT',
        severity: 'warning',
        message: 'Test alert 1'
      });

      monitoringService._generateAlert({
        id: 'alert2',
        type: 'TEST_ALERT',
        severity: 'warning',
        message: 'Test alert 2'
      });

      const alerts = monitoringService.getRecentAlerts();

      expect(alerts).toHaveLength(2);
      expect(alerts[0].message).toBe('Test alert 2'); // Most recent first
      expect(alerts[1].message).toBe('Test alert 1');
    });
  });

  describe('resolveAlert', () => {
    test('should resolve existing alert', () => {
      // Add an alert
      monitoringService._generateAlert({
        id: 'test-alert',
        type: 'TEST_ALERT',
        severity: 'warning',
        message: 'Test alert'
      });

      const resolved = monitoringService.resolveAlert('test-alert');

      expect(resolved).toBe(true);
      const alerts = monitoringService.getRecentAlerts();
      expect(alerts[0].resolved).toBe(true);
    });

    test('should return false for non-existent alert', () => {
      const resolved = monitoringService.resolveAlert('non-existent-alert');

      expect(resolved).toBe(false);
    });
  });

  describe('getDashboardData', () => {
    test('should return dashboard data', () => {
      // Add some data
      monitoringService.monitorEvent({ type: 'test', severity: 'info' });
      monitoringService._generateAlert({
        type: 'TEST_ALERT',
        severity: 'warning',
        message: 'Test alert'
      });

      const dashboardData = monitoringService.getDashboardData();

      expect(dashboardData.metrics).toBeDefined();
      expect(dashboardData.recentAlerts).toBeDefined();
      expect(dashboardData.eventsLastHour).toBeDefined();
      expect(dashboardData.topEventTypes).toBeDefined();
    });
  });

  describe('alert generation', () => {
    test('should generate alert for high severity events', () => {
      const event = {
        type: 'critical_error',
        severity: 'error',
        message: 'Critical error'
      };

      monitoringService.monitorEvent(event);

      const alerts = monitoringService.getRecentAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('HIGH_SEVERITY_EVENT');
    });

    test('should generate alert for multiple failed logins', () => {
      const event = {
        type: 'failed_login',
        severity: 'warning',
        message: 'Failed login',
        userId: 'user123',
        count: 5
      };

      monitoringService.monitorEvent(event);

      const alerts = monitoringService.getRecentAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('MULTIPLE_FAILED_LOGINS');
    });

    test('should generate alert for sensitive data access', () => {
      const event = {
        type: 'data_access',
        severity: 'info',
        message: 'Data access',
        dataType: 'medical_records',
        sensitiveData: true
      };

      monitoringService.monitorEvent(event);

      const alerts = monitoringService.getRecentAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('SENSITIVE_DATA_ACCESS');
    });

    test('should generate alert for brute force attempts', () => {
      const event = {
        type: 'brute_force_attempt',
        severity: 'security',
        message: 'Brute force attempt'
      };

      monitoringService.monitorEvent(event);

      const alerts = monitoringService.getRecentAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('BRUTE_FORCE_ATTACK');
    });
  });
});