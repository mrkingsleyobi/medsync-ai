/**
 * Alert Generation and Notification Controller Tests
 * Unit tests for the alert generation and notification controller
 */

const AlertGenerationController = require('../../src/controllers/alert-generation.controller.js');

// Mock the service
jest.mock('../../src/services/iot-wearable.service.js');

describe('AlertGenerationController', () => {
  let alertGenerationController;
  let mockAlertGenerationService;

  beforeEach(() => {
    alertGenerationController = new AlertGenerationController();
    mockAlertGenerationService = alertGenerationController.alertGenerationService;
    // Mock the logger
    alertGenerationController.logger = {
      error: jest.fn()
    };
  });

  describe('createAlert', () => {
    test('should create an alert successfully', () => {
      const req = {
        body: {
          alertData: {
            type: 'high_heart_rate',
            value: 120,
            threshold: { min: 60, max: 100 },
            severity: 'high'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        id: 'alert-123',
        type: 'high_heart_rate',
        value: 120,
        threshold: { min: 60, max: 100 },
        severity: 'high',
        createdAt: '2025-09-19T14:30:00Z',
        acknowledged: false,
        resolved: false
      };

      mockAlertGenerationService.createAlert.mockReturnValue(mockResult);

      alertGenerationController.createAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert created successfully',
        alert: mockResult
      });
    });

    test('should return 400 when alert data is not provided', () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      alertGenerationController.createAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert data is required'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        body: {
          alertData: {
            type: 'high_heart_rate',
            value: 120,
            threshold: { min: 60, max: 100 },
            severity: 'high'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAlertGenerationService.createAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      alertGenerationController.createAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create alert',
        message: 'Service error'
      });
    });
  });

  describe('getServiceStatus', () => {
    test('should return service status successfully', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        alerts: { enabled: true, activeAlerts: 1 }
      };

      mockAlertGenerationService.getServiceStatus.mockReturnValue(mockStatus);

      alertGenerationController.getServiceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAlertGenerationService.getServiceStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      alertGenerationController.getServiceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve service status',
        message: 'Service error'
      });
    });
  });

  describe('getAlertStatus', () => {
    test('should return alert status successfully', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        id: 'alert-123',
        type: 'high_heart_rate',
        severity: 'high',
        createdAt: '2025-09-19T14:30:00Z',
        acknowledged: false,
        resolved: false
      };

      mockAlertGenerationService.getAlertStatus.mockReturnValue(mockStatus);

      alertGenerationController.getAlertStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 400 when alert ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      alertGenerationController.getAlertStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
      });
    });

    test('should return 404 when alert is not found', () => {
      const req = {
        params: {
          alertId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAlertGenerationService.getAlertStatus.mockReturnValue(null);

      alertGenerationController.getAlertStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAlertGenerationService.getAlertStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      alertGenerationController.getAlertStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve alert status',
        message: 'Service error'
      });
    });
  });

  describe('acknowledgeAlert', () => {
    test('should acknowledge an alert successfully', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        id: 'alert-123',
        acknowledged: true,
        acknowledgedAt: '2025-09-19T14:30:01Z'
      };

      mockAlertGenerationService.acknowledgeAlert.mockReturnValue(mockResult);

      alertGenerationController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert acknowledged successfully',
        alert: mockResult
      });
    });

    test('should return 400 when alert ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      alertGenerationController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
      });
    });

    test('should return 404 when alert is not found', () => {
      const req = {
        params: {
          alertId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAlertGenerationService.acknowledgeAlert.mockReturnValue(null);

      alertGenerationController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAlertGenerationService.acknowledgeAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      alertGenerationController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to acknowledge alert',
        message: 'Service error'
      });
    });
  });

  describe('resolveAlert', () => {
    test('should resolve an alert successfully', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        id: 'alert-123',
        resolved: true,
        resolvedAt: '2025-09-19T14:30:01Z'
      };

      mockAlertGenerationService.resolveAlert.mockReturnValue(mockResult);

      alertGenerationController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert resolved successfully',
        alert: mockResult
      });
    });

    test('should return 400 when alert ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      alertGenerationController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
      });
    });

    test('should return 404 when alert is not found', () => {
      const req = {
        params: {
          alertId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAlertGenerationService.resolveAlert.mockReturnValue(null);

      alertGenerationController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAlertGenerationService.resolveAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      alertGenerationController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to resolve alert',
        message: 'Service error'
      });
    });
  });
});