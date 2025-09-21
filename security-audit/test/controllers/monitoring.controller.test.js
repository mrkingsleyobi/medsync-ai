# Monitoring Controller Tests for MediSync Healthcare AI Platform

## Overview

This file contains unit tests for the monitoring controller implementation.

## Tests

```javascript
const MonitoringController = require('../../src/controllers/monitoring.controller.js');

// Mock Express request and response objects
const mockRequest = (params = {}, body = {}, query = {}) => ({
  params,
  body,
  query
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('MonitoringController', () => {
  let monitoringController;

  beforeEach(() => {
    monitoringController = new MonitoringController();
  });

  afterEach(() => {
    // Clean up any intervals
    if (monitoringController.monitoringService.monitoringInterval) {
      clearInterval(monitoringController.monitoringService.monitoringInterval);
    }
  });

  describe('getMetrics', () => {
    test('should return security metrics', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await monitoringController.getMetrics(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        metrics: expect.objectContaining({
          totalEvents: expect.any(Number),
          securityEvents: expect.any(Number),
          errorEvents: expect.any(Number),
          warningEvents: expect.any(Number)
        })
      });
    });
  });

  describe('getAlerts', () => {
    test('should return recent alerts', async () => {
      const req = mockRequest({}, {}, { limit: '5' });
      const res = mockResponse();

      await monitoringController.getAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        alerts: expect.any(Array)
      });
    });

    test('should use default limit when not provided', async () => {
      const req = mockRequest({}, {}, {});
      const res = mockResponse();

      await monitoringController.getAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        alerts: expect.any(Array)
      });
    });
  });

  describe('getDashboard', () => {
    test('should return dashboard data', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await monitoringController.getDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        dashboard: expect.objectContaining({
          metrics: expect.any(Object),
          recentAlerts: expect.any(Array),
          eventsLastHour: expect.any(Array),
          topEventTypes: expect.any(Array)
        })
      });
    });
  });

  describe('resolveAlert', () => {
    test('should resolve existing alert', async () => {
      // Add an alert to resolve
      monitoringController.monitoringService._generateAlert({
        id: 'test-alert',
        type: 'TEST_ALERT',
        severity: 'warning',
        message: 'Test alert'
      });

      const req = mockRequest({ alertId: 'test-alert' });
      const res = mockResponse();

      await monitoringController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert resolved successfully'
      });
    });

    test('should return error for missing alertId', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await monitoringController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameter: alertId'
      });
    });

    test('should return error for non-existent alert', async () => {
      const req = mockRequest({ alertId: 'non-existent-alert' });
      const res = mockResponse();

      await monitoringController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found',
        message: 'Alert with ID non-existent-alert not found'
      });
    });
  });

  describe('monitorEvent', () => {
    test('should monitor event successfully', async () => {
      const req = mockRequest({}, { event: { type: 'test', severity: 'info' } });
      const res = mockResponse();

      await monitoringController.monitorEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event monitored successfully'
      });
    });

    test('should return error for missing event', async () => {
      const req = mockRequest({}, {});
      const res = mockResponse();

      await monitoringController.monitorEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: event'
      });
    });
  });

  describe('getHealth', () => {
    test('should return system health status', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await monitoringController.getHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        health: expect.objectContaining({
          status: 'healthy',
          timestamp: expect.any(String),
          uptime: expect.any(Number)
        })
      });
    });
  });
});