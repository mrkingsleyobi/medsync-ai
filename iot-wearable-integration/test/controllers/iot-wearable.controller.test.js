/**
 * Real-time Health Monitoring Controller Tests
 * Unit tests for the real-time health monitoring controller
 */

const HealthMonitoringController = require('../../src/controllers/iot-wearable.controller.js');

// Mock the service
jest.mock('../../src/services/iot-wearable.service.js');

describe('HealthMonitoringController', () => {
  let healthMonitoringController;
  let mockHealthMonitoringService;

  beforeEach(() => {
    healthMonitoringController = new HealthMonitoringController();
    mockHealthMonitoringService = healthMonitoringController.healthMonitoringService;
    // Mock the logger
    healthMonitoringController.logger = {
      error: jest.fn()
    };
  });

  describe('monitorRealTimeHealth', () => {
    test('should monitor real-time health data successfully', async () => {
      const req = {
        body: {
          options: { frequency: 10000 }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'monitoring-job-123',
        vitals: { heartRate: 72, bloodPressure: { systolic: 118, diastolic: 76 } },
        alerts: [],
        processingTime: 1000
      };

      mockHealthMonitoringService.monitorRealTimeHealth.mockResolvedValue(mockResult);

      await healthMonitoringController.monitorRealTimeHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Real-time health monitoring completed successfully',
        jobId: mockResult.jobId,
        vitals: mockResult.vitals,
        alerts: mockResult.alerts,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when real-time health monitoring is not enabled', async () => {
      const req = {
        body: {
          options: { frequency: 10000 }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthMonitoringService.monitorRealTimeHealth.mockRejectedValue(new Error('Real-time health monitoring is not enabled'));

      await healthMonitoringController.monitorRealTimeHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Real-time health monitoring is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          options: { frequency: 10000 }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthMonitoringService.monitorRealTimeHealth.mockRejectedValue(new Error('Service error'));

      await healthMonitoringController.monitorRealTimeHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to monitor real-time health data',
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
        monitoring: { enabled: true, activeMonitoring: 1 },
        alerts: { enabled: true, activeAlerts: 0 }
      };

      mockHealthMonitoringService.getServiceStatus.mockReturnValue(mockStatus);

      healthMonitoringController.getServiceStatus(req, res);

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

      mockHealthMonitoringService.getServiceStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthMonitoringController.getServiceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve service status',
        message: 'Service error'
      });
    });
  });

  describe('getMonitoringStatus', () => {
    test('should return monitoring job status successfully', () => {
      const req = {
        params: {
          jobId: 'monitoring-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'monitoring-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        startedAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:01Z'
      };

      mockHealthMonitoringService.getMonitoringStatus.mockReturnValue(mockStatus);

      healthMonitoringController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 400 when job ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      healthMonitoringController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when job is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthMonitoringService.getMonitoringStatus.mockReturnValue(null);

      healthMonitoringController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Monitoring job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'monitoring-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthMonitoringService.getMonitoringStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthMonitoringController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve monitoring job status',
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

      mockHealthMonitoringService.getAlertStatus.mockReturnValue(mockStatus);

      healthMonitoringController.getAlertStatus(req, res);

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

      healthMonitoringController.getAlertStatus(req, res);

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

      mockHealthMonitoringService.getAlertStatus.mockReturnValue(null);

      healthMonitoringController.getAlertStatus(req, res);

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

      mockHealthMonitoringService.getAlertStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthMonitoringController.getAlertStatus(req, res);

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

      mockHealthMonitoringService.acknowledgeAlert.mockReturnValue(mockResult);

      healthMonitoringController.acknowledgeAlert(req, res);

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

      healthMonitoringController.acknowledgeAlert(req, res);

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

      mockHealthMonitoringService.acknowledgeAlert.mockReturnValue(null);

      healthMonitoringController.acknowledgeAlert(req, res);

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

      mockHealthMonitoringService.acknowledgeAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthMonitoringController.acknowledgeAlert(req, res);

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

      mockHealthMonitoringService.resolveAlert.mockReturnValue(mockResult);

      healthMonitoringController.resolveAlert(req, res);

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

      healthMonitoringController.resolveAlert(req, res);

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

      mockHealthMonitoringService.resolveAlert.mockReturnValue(null);

      healthMonitoringController.resolveAlert(req, res);

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

      mockHealthMonitoringService.resolveAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthMonitoringController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to resolve alert',
        message: 'Service error'
      });
    });
  });
});