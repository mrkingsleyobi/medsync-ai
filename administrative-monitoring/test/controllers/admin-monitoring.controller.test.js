/**
 * Administrative & Monitoring Controller Tests
 * Unit tests for the administrative monitoring controller
 */

const AdminMonitoringController = require('../../src/controllers/admin-monitoring.controller.js');

// Mock the service
jest.mock('../../src/services/admin-monitoring.service.js');

describe('AdminMonitoringController', () => {
  let adminMonitoringController;
  let mockAdminMonitoringService;

  beforeEach(() => {
    adminMonitoringController = new AdminMonitoringController();
    mockAdminMonitoringService = adminMonitoringController.adminMonitoringService;
  });

  describe('generateDocumentation', () => {
    test('should generate documentation successfully', async () => {
      const req = {
        body: {
          formats: ['pdf', 'html'],
          services: ['patient-communication']
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'job-123',
        filesGenerated: ['doc.pdf', 'doc.html'],
        outputPath: './docs',
        processingTime: 2000
      };

      mockAdminMonitoringService.generateDocumentation.mockResolvedValue(mockResult);

      await adminMonitoringController.generateDocumentation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Documentation generated successfully',
        jobId: mockResult.jobId,
        filesGenerated: mockResult.filesGenerated,
        outputPath: mockResult.outputPath,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when formats are not provided', async () => {
      const req = {
        body: {
          services: ['patient-communication']
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await adminMonitoringController.generateDocumentation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Formats array is required'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          formats: ['pdf'],
          services: ['patient-communication']
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAdminMonitoringService.generateDocumentation.mockRejectedValue(new Error('Service error'));

      await adminMonitoringController.generateDocumentation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to generate documentation'
      });
    });
  });

  describe('scheduleTask', () => {
    test('should schedule a task successfully', async () => {
      const req = {
        body: {
          name: 'Test Task',
          schedule: '0 1 * * *',
          description: 'A test task'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockTask = {
        id: 'task-123',
        name: 'Test Task',
        schedule: '0 1 * * *',
        status: 'scheduled',
        nextRun: '2025-12-01T01:00:00Z'
      };

      mockAdminMonitoringService.scheduleTask.mockResolvedValue(mockTask);

      await adminMonitoringController.scheduleTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task scheduled successfully',
        taskId: mockTask.id,
        task: {
          id: mockTask.id,
          name: mockTask.name,
          schedule: mockTask.schedule,
          status: mockTask.status,
          nextRun: mockTask.nextRun
        }
      });
    });

    test('should return 400 when task name is not provided', async () => {
      const req = {
        body: {
          schedule: '0 1 * * *'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await adminMonitoringController.scheduleTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Task name is required'
      });
    });

    test('should return 400 when task schedule is not provided', async () => {
      const req = {
        body: {
          name: 'Test Task'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await adminMonitoringController.scheduleTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Task schedule is required'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          name: 'Test Task',
          schedule: '0 1 * * *'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAdminMonitoringService.scheduleTask.mockRejectedValue(new Error('Service error'));

      await adminMonitoringController.scheduleTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to schedule task'
      });
    });
  });

  describe('optimizeResourceAllocation', () => {
    test('should optimize resource allocation successfully', async () => {
      const req = { body: {} };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        optimizationId: 'opt-123',
        currentUsage: { cpu: 45, memory: 65, disk: 30 },
        recommendations: [{ service: 'patient-communication', action: 'scale_up' }],
        processingTime: 1500
      };

      mockAdminMonitoringService.optimizeResourceAllocation.mockResolvedValue(mockResult);

      await adminMonitoringController.optimizeResourceAllocation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Resource allocation optimized successfully',
        optimizationId: mockResult.optimizationId,
        currentUsage: mockResult.currentUsage,
        recommendations: mockResult.recommendations,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = { body: {} };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAdminMonitoringService.optimizeResourceAllocation.mockRejectedValue(new Error('Service error'));

      await adminMonitoringController.optimizeResourceAllocation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to optimize resource allocation'
      });
    });
  });

  describe('processBilling', () => {
    test('should process billing successfully', async () => {
      const req = {
        body: {
          customerId: 'CUST-12345',
          amount: 299.99,
          description: 'Monthly subscription'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        id: 'billing-123',
        status: 'completed',
        result: {
          invoiceId: 'INV-2025-12-001',
          amount: 299.99,
          currency: 'USD',
          dueDate: '2025-12-31'
        }
      };

      mockAdminMonitoringService.processBilling.mockResolvedValue(mockResult);

      await adminMonitoringController.processBilling(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Billing processed successfully',
        billingId: mockResult.id,
        status: mockResult.status,
        result: mockResult.result
      });
    });

    test('should return 400 when customer ID is not provided', async () => {
      const req = {
        body: {
          amount: 299.99
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await adminMonitoringController.processBilling(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Customer ID is required'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          customerId: 'CUST-12345',
          amount: 299.99
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAdminMonitoringService.processBilling.mockRejectedValue(new Error('Service error'));

      await adminMonitoringController.processBilling(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to process billing'
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
        documentation: { enabled: true, lastRun: '2025-12-01T01:00:00Z' },
        scheduling: { enabled: true, scheduledTasks: 5 }
      };

      mockAdminMonitoringService.getServiceStatus.mockReturnValue(mockStatus);

      adminMonitoringController.getServiceStatus(req, res);

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

      mockAdminMonitoringService.getServiceStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      adminMonitoringController.getServiceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve service status'
      });
    });
  });

  describe('getDocumentationJobStatus', () => {
    test('should return documentation job status successfully', () => {
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
        createdAt: '2025-12-01T00:00:00Z',
        completedAt: '2025-12-01T00:00:02Z'
      };

      mockAdminMonitoringService.getDocumentationJobStatus.mockReturnValue(mockStatus);

      adminMonitoringController.getDocumentationJobStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
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

      mockAdminMonitoringService.getDocumentationJobStatus.mockReturnValue(null);

      adminMonitoringController.getDocumentationJobStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Documentation job not found'
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

      adminMonitoringController.getDocumentationJobStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
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

      mockAdminMonitoringService.getDocumentationJobStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      adminMonitoringController.getDocumentationJobStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve documentation job status'
      });
    });
  });

  describe('getScheduledTasks', () => {
    test('should return scheduled tasks successfully', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockTasks = [
        {
          id: 'task-123',
          name: 'Test Task',
          status: 'scheduled',
          createdAt: '2025-12-01T00:00:00Z',
          nextRun: '2025-12-01T01:00:00Z',
          lastRun: null
        }
      ];

      mockAdminMonitoringService.getScheduledTasks.mockReturnValue(mockTasks);

      adminMonitoringController.getScheduledTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        tasks: mockTasks
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAdminMonitoringService.getScheduledTasks.mockImplementation(() => {
        throw new Error('Service error');
      });

      adminMonitoringController.getScheduledTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve scheduled tasks'
      });
    });
  });

  describe('getBillingRecords', () => {
    test('should return billing records successfully', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockRecords = [
        {
          id: 'billing-123',
          customerId: 'CUST-12345',
          status: 'completed',
          createdAt: '2025-12-01T00:00:00Z',
          processedAt: '2025-12-01T00:00:01Z',
          amount: 299.99
        }
      ];

      mockAdminMonitoringService.getBillingRecords.mockReturnValue(mockRecords);

      adminMonitoringController.getBillingRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        records: mockRecords
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAdminMonitoringService.getBillingRecords.mockImplementation(() => {
        throw new Error('Service error');
      });

      adminMonitoringController.getBillingRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve billing records'
      });
    });
  });

  describe('generateUsageReport', () => {
    test('should generate usage report successfully', async () => {
      const req = {
        body: {
          period: 'monthly',
          format: 'pdf'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        reportId: 'report-123',
        period: 'monthly',
        format: 'pdf',
        generatedAt: '2025-12-01T00:00:00Z',
        processingTime: 2500
      };

      mockAdminMonitoringService.generateUsageReport.mockResolvedValue(mockResult);

      await adminMonitoringController.generateUsageReport(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Usage report generated successfully',
        reportId: mockResult.reportId,
        period: mockResult.period,
        format: mockResult.format,
        generatedAt: mockResult.generatedAt,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          period: 'monthly',
          format: 'pdf'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAdminMonitoringService.generateUsageReport.mockRejectedValue(new Error('Service error'));

      await adminMonitoringController.generateUsageReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to generate usage report'
      });
    });
  });

  describe('getActiveAlerts', () => {
    test('should return active alerts successfully', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockAlerts = [
        {
          id: 'alert-123',
          type: 'high_cpu',
          message: 'CPU usage exceeded threshold',
          severity: 'high',
          createdAt: '2025-12-01T00:00:00Z',
          acknowledged: false
        }
      ];

      mockAdminMonitoringService.getActiveAlerts.mockReturnValue(mockAlerts);

      adminMonitoringController.getActiveAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        alerts: mockAlerts
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAdminMonitoringService.getActiveAlerts.mockImplementation(() => {
        throw new Error('Service error');
      });

      adminMonitoringController.getActiveAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve active alerts'
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
        acknowledgedAt: '2025-12-01T00:00:01Z'
      };

      mockAdminMonitoringService.acknowledgeAlert.mockReturnValue(mockResult);

      adminMonitoringController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert acknowledged successfully',
        alert: mockResult
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

      mockAdminMonitoringService.acknowledgeAlert.mockReturnValue(null);

      adminMonitoringController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found'
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

      adminMonitoringController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
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

      mockAdminMonitoringService.acknowledgeAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      adminMonitoringController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to acknowledge alert'
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
        resolvedAt: '2025-12-01T00:00:01Z'
      };

      mockAdminMonitoringService.resolveAlert.mockReturnValue(mockResult);

      adminMonitoringController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert resolved successfully',
        alert: mockResult
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

      mockAdminMonitoringService.resolveAlert.mockReturnValue(null);

      adminMonitoringController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found'
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

      adminMonitoringController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
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

      mockAdminMonitoringService.resolveAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      adminMonitoringController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to resolve alert'
      });
    });
  });
});