/**
 * Continuous Health Monitoring Dashboard Controller Tests
 * Unit tests for the continuous health monitoring dashboard controller
 */

const ContinuousMonitoringDashboardController = require('../../src/controllers/continuous-monitoring-dashboard.controller.js');

// Mock the service
jest.mock('../../src/services/continuous-monitoring-dashboard.service.js');

describe('ContinuousMonitoringDashboardController', () => {
  let continuousMonitoringDashboardController;
  let mockContinuousMonitoringDashboardService;

  beforeEach(() => {
    continuousMonitoringDashboardController = new ContinuousMonitoringDashboardController();
    mockContinuousMonitoringDashboardService = continuousMonitoringDashboardController.continuousMonitoringDashboardService;
    // Mock the logger
    continuousMonitoringDashboardController.logger = {
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
        jobId: 'job-123',
        vitals: { heartRate: 72 },
        alerts: [],
        processingTime: 1000
      };

      mockContinuousMonitoringDashboardService.monitorRealTimeHealth.mockResolvedValue(mockResult);

      await continuousMonitoringDashboardController.monitorRealTimeHealth(req, res);

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

      mockContinuousMonitoringDashboardService.monitorRealTimeHealth.mockRejectedValue(new Error('Real-time health monitoring is not enabled'));

      await continuousMonitoringDashboardController.monitorRealTimeHealth(req, res);

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

      mockContinuousMonitoringDashboardService.monitorRealTimeHealth.mockRejectedValue(new Error('Service error'));

      await continuousMonitoringDashboardController.monitorRealTimeHealth(req, res);

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

      mockContinuousMonitoringDashboardService.getServiceStatus.mockReturnValue(mockStatus);

      continuousMonitoringDashboardController.getServiceStatus(req, res);

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

      mockContinuousMonitoringDashboardService.getServiceStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      continuousMonitoringDashboardController.getServiceStatus(req, res);

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
          jobId: 'job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        startedAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:01Z'
      };

      mockContinuousMonitoringDashboardService.getMonitoringStatus.mockReturnValue(mockStatus);

      continuousMonitoringDashboardController.getMonitoringStatus(req, res);

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

      continuousMonitoringDashboardController.getMonitoringStatus(req, res);

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

      mockContinuousMonitoringDashboardService.getMonitoringStatus.mockReturnValue(null);

      continuousMonitoringDashboardController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Monitoring job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockContinuousMonitoringDashboardService.getMonitoringStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      continuousMonitoringDashboardController.getMonitoringStatus(req, res);

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

      mockContinuousMonitoringDashboardService.getAlertStatus.mockReturnValue(mockStatus);

      continuousMonitoringDashboardController.getAlertStatus(req, res);

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

      continuousMonitoringDashboardController.getAlertStatus(req, res);

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

      mockContinuousMonitoringDashboardService.getAlertStatus.mockReturnValue(null);

      continuousMonitoringDashboardController.getAlertStatus(req, res);

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

      mockContinuousMonitoringDashboardService.getAlertStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      continuousMonitoringDashboardController.getAlertStatus(req, res);

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

      mockContinuousMonitoringDashboardService.acknowledgeAlert.mockReturnValue(mockResult);

      continuousMonitoringDashboardController.acknowledgeAlert(req, res);

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

      continuousMonitoringDashboardController.acknowledgeAlert(req, res);

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

      mockContinuousMonitoringDashboardService.acknowledgeAlert.mockReturnValue(null);

      continuousMonitoringDashboardController.acknowledgeAlert(req, res);

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

      mockContinuousMonitoringDashboardService.acknowledgeAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      continuousMonitoringDashboardController.acknowledgeAlert(req, res);

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

      mockContinuousMonitoringDashboardService.resolveAlert.mockReturnValue(mockResult);

      continuousMonitoringDashboardController.resolveAlert(req, res);

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

      continuousMonitoringDashboardController.resolveAlert(req, res);

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

      mockContinuousMonitoringDashboardService.resolveAlert.mockReturnValue(null);

      continuousMonitoringDashboardController.resolveAlert(req, res);

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

      mockContinuousMonitoringDashboardService.resolveAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      continuousMonitoringDashboardController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to resolve alert',
        message: 'Service error'
      });
    });
  });
});