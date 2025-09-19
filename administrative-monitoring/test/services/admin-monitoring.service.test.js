/**
 * Administrative & Monitoring Service Tests
 * Unit tests for the administrative monitoring service
 */

const AdminMonitoringService = require('../../src/services/admin-monitoring.service.js');

describe('AdminMonitoringService', () => {
  let adminMonitoringService;

  beforeEach(() => {
    adminMonitoringService = new AdminMonitoringService();
  });

  describe('generateDocumentation', () => {
    test('should generate documentation successfully', async () => {
      const options = {
        formats: ['pdf', 'html'],
        services: ['patient-communication', 'clinical-decision']
      };

      const result = await adminMonitoringService.generateDocumentation(options);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.filesGenerated).toBeDefined();
      expect(Array.isArray(result.filesGenerated)).toBe(true);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when formats is not provided', async () => {
      const options = {
        services: ['patient-communication']
      };

      await expect(adminMonitoringService.generateDocumentation(options))
        .rejects
        .toThrow('formats must be an array');
    });
  });

  describe('scheduleTask', () => {
    test('should schedule a task successfully', async () => {
      const taskData = {
        name: 'Test Task',
        schedule: '0 1 * * *',
        description: 'A test task'
      };

      const result = await adminMonitoringService.scheduleTask(taskData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(taskData.name);
      expect(result.schedule).toBe(taskData.schedule);
      expect(result.status).toBe('scheduled');
    });

    test('should throw error when task name is not provided', async () => {
      const taskData = {
        schedule: '0 1 * * *'
      };

      await expect(adminMonitoringService.scheduleTask(taskData))
        .rejects
        .toThrow('Task name and schedule are required');
    });

    test('should throw error when task schedule is not provided', async () => {
      const taskData = {
        name: 'Test Task'
      };

      await expect(adminMonitoringService.scheduleTask(taskData))
        .rejects
        .toThrow('Task name and schedule are required');
    });
  });

  describe('optimizeResourceAllocation', () => {
    test('should optimize resource allocation successfully', async () => {
      const result = await adminMonitoringService.optimizeResourceAllocation();

      expect(result).toBeDefined();
      expect(result.optimizationId).toBeDefined();
      expect(result.currentUsage).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.processingTime).toBeGreaterThan(0);
    });
  });

  describe('processBilling', () => {
    test('should process billing successfully', async () => {
      const billingData = {
        customerId: 'CUST-12345',
        amount: 299.99,
        description: 'Monthly subscription'
      };

      const result = await adminMonitoringService.processBilling(billingData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.customerId).toBe(billingData.customerId);
      expect(result.amount).toBe(billingData.amount);
      expect(result.status).toBe('completed');
      expect(result.result).toBeDefined();
      expect(result.result.invoiceId).toBeDefined();
    });

    test('should throw error when customer ID is not provided', async () => {
      const billingData = {
        amount: 299.99
      };

      await expect(adminMonitoringService.processBilling(billingData))
        .rejects
        .toThrow('Customer ID is required for billing');
    });
  });

  describe('collectMonitoringData', () => {
    test('should collect monitoring data successfully', async () => {
      const result = await adminMonitoringService.collectMonitoringData();

      expect(result).toBeDefined();
      expect(result.collectionId).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.system).toBeDefined();
      expect(result.application).toBeDefined();
      expect(result.aiModels).toBeDefined();
    });
  });

  describe('collectAnalyticsData', () => {
    test('should collect analytics data successfully', async () => {
      const result = await adminMonitoringService.collectAnalyticsData();

      expect(result).toBeDefined();
      expect(result.collectionId).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.performance).toBeDefined();
      expect(result.userSatisfaction).toBeDefined();
      expect(result.aiAccuracy).toBeDefined();
      expect(result.resourceUtilization).toBeDefined();
    });
  });

  describe('generateUsageReport', () => {
    test('should generate usage report successfully', async () => {
      const options = {
        period: 'monthly',
        format: 'pdf'
      };

      const result = await adminMonitoringService.generateUsageReport(options);

      expect(result).toBeDefined();
      expect(result.reportId).toBeDefined();
      expect(result.period).toBe(options.period);
      expect(result.format).toBe(options.format);
      expect(result.generatedAt).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
    });
  });

  describe('getServiceStatus', () => {
    test('should return service status', () => {
      const status = adminMonitoringService.getServiceStatus();

      expect(status).toBeDefined();
      expect(status.documentation).toBeDefined();
      expect(status.scheduling).toBeDefined();
      expect(status.resourceAllocation).toBeDefined();
      expect(status.billing).toBeDefined();
      expect(status.monitoring).toBeDefined();
      expect(status.analytics).toBeDefined();
      expect(status.usageReporting).toBeDefined();
      expect(status.alerting).toBeDefined();
    });
  });

  describe('getDocumentationJobStatus', () => {
    test('should return documentation job status', async () => {
      // First create a documentation job
      const options = { formats: ['pdf'] };
      const jobResult = await adminMonitoringService.generateDocumentation(options);

      const status = adminMonitoringService.getDocumentationJobStatus(jobResult.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(jobResult.jobId);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent job', () => {
      const status = adminMonitoringService.getDocumentationJobStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getScheduledTasks', () => {
    test('should return scheduled tasks', async () => {
      // Schedule a task first
      const taskData = {
        name: 'Test Task',
        schedule: '0 1 * * *'
      };
      await adminMonitoringService.scheduleTask(taskData);

      const tasks = adminMonitoringService.getScheduledTasks();

      expect(tasks).toBeDefined();
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);
    });
  });

  describe('getBillingRecords', () => {
    test('should return billing records', async () => {
      // Process a billing record first
      const billingData = {
        customerId: 'CUST-12345',
        amount: 299.99
      };
      await adminMonitoringService.processBilling(billingData);

      const records = adminMonitoringService.getBillingRecords();

      expect(records).toBeDefined();
      expect(Array.isArray(records)).toBe(true);
      expect(records.length).toBeGreaterThan(0);
    });
  });

  describe('createAlert', () => {
    test('should create an alert successfully', () => {
      const alertData = {
        type: 'high_cpu',
        message: 'CPU usage exceeded threshold',
        severity: 'high'
      };

      const result = adminMonitoringService.createAlert(alertData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.type).toBe(alertData.type);
      expect(result.message).toBe(alertData.message);
      expect(result.severity).toBe(alertData.severity);
      expect(result.acknowledged).toBe(false);
      expect(result.resolved).toBe(false);
    });
  });

  describe('getActiveAlerts', () => {
    test('should return active alerts', () => {
      // Create an alert first
      const alertData = {
        type: 'high_memory',
        message: 'Memory usage exceeded threshold',
        severity: 'medium'
      };
      adminMonitoringService.createAlert(alertData);

      const alerts = adminMonitoringService.getActiveAlerts();

      expect(alerts).toBeDefined();
      expect(Array.isArray(alerts)).toBe(true);
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].type).toBe(alertData.type);
      expect(alerts[0].message).toBe(alertData.message);
    });
  });

  describe('acknowledgeAlert', () => {
    test('should acknowledge an alert successfully', () => {
      // Create an alert first
      const alertData = {
        type: 'high_disk',
        message: 'Disk usage exceeded threshold',
        severity: 'high'
      };
      const alert = adminMonitoringService.createAlert(alertData);

      const result = adminMonitoringService.acknowledgeAlert(alert.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(alert.id);
      expect(result.acknowledged).toBe(true);
      expect(result.acknowledgedAt).toBeDefined();
    });

    test('should return null for non-existent alert', () => {
      const result = adminMonitoringService.acknowledgeAlert('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('resolveAlert', () => {
    test('should resolve an alert successfully', () => {
      // Create an alert first
      const alertData = {
        type: 'slow_response',
        message: 'Response time exceeded threshold',
        severity: 'medium'
      };
      const alert = adminMonitoringService.createAlert(alertData);

      const result = adminMonitoringService.resolveAlert(alert.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(alert.id);
      expect(result.resolved).toBe(true);
      expect(result.resolvedAt).toBeDefined();
    });

    test('should return null for non-existent alert', () => {
      const result = adminMonitoringService.resolveAlert('non-existent-id');
      expect(result).toBeNull();
    });
  });
});