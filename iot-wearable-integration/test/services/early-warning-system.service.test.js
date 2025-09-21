/**
 * Early Warning System Service Tests
 * Unit tests for the early warning system service
 */

const EarlyWarningSystemService = require('../../src/services/early-warning-system.service.js');

describe('EarlyWarningSystemService', () => {
  let earlyWarningSystemService;

  beforeEach(() => {
    earlyWarningSystemService = new EarlyWarningSystemService();
  });

  describe('generateEarlyWarning', () => {
    test('should generate early warning successfully', async () => {
      const patientData = {
        patientId: 'patient-123',
        vitals: { heartRate: 72 }
      };

      const result = await earlyWarningSystemService.generateEarlyWarning(patientData);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.patientId).toBe(patientData.patientId);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when early warning system is not enabled', async () => {
      // Temporarily disable early warning system
      const originalEnabled = earlyWarningSystemService.config.earlyWarning.enabled;
      earlyWarningSystemService.config.earlyWarning.enabled = false;

      const patientData = {
        patientId: 'patient-123'
      };

      await expect(earlyWarningSystemService.generateEarlyWarning(patientData))
        .rejects
        .toThrow('Early warning system is not enabled');

      // Restore original setting
      earlyWarningSystemService.config.earlyWarning.enabled = originalEnabled;
    });

    test('should throw error when patient data is not provided', async () => {
      await expect(earlyWarningSystemService.generateEarlyWarning())
        .rejects
        .toThrow('Patient data is required for early warning generation');
    });
  });

  describe('getServiceStatus', () => {
    test('should return service status', () => {
      const status = earlyWarningSystemService.getServiceStatus();

      expect(status).toBeDefined();
      expect(status.earlyWarning).toBeDefined();
      expect(typeof status.earlyWarning.enabled).toBe('boolean');
      expect(typeof status.earlyWarning.activeWarnings).toBe('number');
    });
  });

  describe('getEarlyWarningStatus', () => {
    test('should return early warning status', async () => {
      // First create an early warning
      const patientData = {
        patientId: 'patient-123'
      };

      const result = await earlyWarningSystemService.generateEarlyWarning(patientData);
      const status = earlyWarningSystemService.getEarlyWarningStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.id).toBe(result.jobId);
      expect(status.patientId).toBe(patientData.patientId);
      expect(status.warnings).toBeDefined();
      expect(status.confidence).toBeDefined();
    });

    test('should return null for non-existent early warning', () => {
      const status = earlyWarningSystemService.getEarlyWarningStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('acknowledgeEarlyWarning', () => {
    test('should acknowledge an early warning successfully', async () => {
      // First create an early warning
      const patientData = {
        patientId: 'patient-123'
      };

      const result = await earlyWarningSystemService.generateEarlyWarning(patientData);
      const ackResult = earlyWarningSystemService.acknowledgeEarlyWarning(result.jobId);

      expect(ackResult).toBeDefined();
      expect(ackResult.id).toBe(result.jobId);
      expect(ackResult.acknowledged).toBe(true);
      expect(ackResult.acknowledgedAt).toBeDefined();
    });

    test('should return null for non-existent early warning', () => {
      const result = earlyWarningSystemService.acknowledgeEarlyWarning('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('resolveEarlyWarning', () => {
    test('should resolve an early warning successfully', async () => {
      // First create an early warning
      const patientData = {
        patientId: 'patient-123'
      };

      const result = await earlyWarningSystemService.generateEarlyWarning(patientData);
      const resolveResult = earlyWarningSystemService.resolveEarlyWarning(result.jobId);

      expect(resolveResult).toBeDefined();
      expect(resolveResult.id).toBe(result.jobId);
      expect(resolveResult.resolved).toBe(true);
      expect(resolveResult.resolvedAt).toBeDefined();
    });

    test('should return null for non-existent early warning', () => {
      const result = earlyWarningSystemService.resolveEarlyWarning('non-existent-id');
      expect(result).toBeNull();
    });
  });
});