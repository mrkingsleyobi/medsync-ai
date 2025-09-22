/**
 * Early Warning System Controller Tests
 * Unit tests for the early warning system controller
 */

const EarlyWarningSystemController = require('../../src/controllers/early-warning-system.controller.js');

// Mock the service
jest.mock('../../src/services/early-warning-system.service.js');

describe('EarlyWarningSystemController', () => {
  let earlyWarningSystemController;
  let mockEarlyWarningSystemService;

  beforeEach(() => {
    earlyWarningSystemController = new EarlyWarningSystemController();
    mockEarlyWarningSystemService = earlyWarningSystemController.earlyWarningSystemService;
    // Mock the logger
    earlyWarningSystemController.logger = {
      error: jest.fn()
    };
  });

  describe('generateEarlyWarning', () => {
    test('should generate early warning successfully', async () => {
      const req = {
        body: {
          patientData: {
            patientId: 'patient-123',
            vitals: { heartRate: 72 }
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'job-123',
        patientId: 'patient-123',
        warnings: [{ type: 'risk_of_fall', severity: 'medium' }],
        confidence: 0.85,
        processingTime: 1500
      };

      mockEarlyWarningSystemService.generateEarlyWarning.mockResolvedValue(mockResult);

      await earlyWarningSystemController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Early warning generated successfully',
        jobId: mockResult.jobId,
        patientId: mockResult.patientId,
        warnings: mockResult.warnings,
        confidence: mockResult.confidence,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when patient data is not provided', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await earlyWarningSystemController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient data is required'
      });
    });

    test('should return 400 when early warning system is not enabled', async () => {
      const req = {
        body: {
          patientData: {
            patientId: 'patient-123'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockEarlyWarningSystemService.generateEarlyWarning.mockRejectedValue(new Error('Early warning system is not enabled'));

      await earlyWarningSystemController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Early warning system is not enabled'
      });
    });

    test('should return 400 when patient data is required', async () => {
      const req = {
        body: {
          patientData: {
            patientId: 'patient-123'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockEarlyWarningSystemService.generateEarlyWarning.mockRejectedValue(new Error('Patient data is required for early warning generation'));

      await earlyWarningSystemController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient data is required for early warning generation'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          patientData: {
            patientId: 'patient-123'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockEarlyWarningSystemService.generateEarlyWarning.mockRejectedValue(new Error('Service error'));

      await earlyWarningSystemController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to generate early warning',
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
        earlyWarning: { enabled: true, activeWarnings: 1 }
      };

      mockEarlyWarningSystemService.getServiceStatus.mockReturnValue(mockStatus);

      earlyWarningSystemController.getServiceStatus(req, res);

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

      mockEarlyWarningSystemService.getServiceStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      earlyWarningSystemController.getServiceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve service status',
        message: 'Service error'
      });
    });
  });

  describe('getEarlyWarningStatus', () => {
    test('should return early warning status successfully', () => {
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
        id: 'job-123',
        patientId: 'patient-123',
        warnings: [{ type: 'risk_of_fall', severity: 'medium' }],
        confidence: 0.85,
        createdAt: '2025-09-19T14:30:00Z'
      };

      mockEarlyWarningSystemService.getEarlyWarningStatus.mockReturnValue(mockStatus);

      earlyWarningSystemController.getEarlyWarningStatus(req, res);

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

      earlyWarningSystemController.getEarlyWarningStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when early warning is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockEarlyWarningSystemService.getEarlyWarningStatus.mockReturnValue(null);

      earlyWarningSystemController.getEarlyWarningStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Early warning not found'
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

      mockEarlyWarningSystemService.getEarlyWarningStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      earlyWarningSystemController.getEarlyWarningStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve early warning status',
        message: 'Service error'
      });
    });
  });

  describe('acknowledgeEarlyWarning', () => {
    test('should acknowledge an early warning successfully', () => {
      const req = {
        params: {
          jobId: 'job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        id: 'job-123',
        acknowledged: true,
        acknowledgedAt: '2025-09-19T14:30:01Z'
      };

      mockEarlyWarningSystemService.acknowledgeEarlyWarning.mockReturnValue(mockResult);

      earlyWarningSystemController.acknowledgeEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Early warning acknowledged successfully',
        warning: mockResult
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

      earlyWarningSystemController.acknowledgeEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when early warning is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockEarlyWarningSystemService.acknowledgeEarlyWarning.mockReturnValue(null);

      earlyWarningSystemController.acknowledgeEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Early warning not found'
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

      mockEarlyWarningSystemService.acknowledgeEarlyWarning.mockImplementation(() => {
        throw new Error('Service error');
      });

      earlyWarningSystemController.acknowledgeEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to acknowledge early warning',
        message: 'Service error'
      });
    });
  });

  describe('resolveEarlyWarning', () => {
    test('should resolve an early warning successfully', () => {
      const req = {
        params: {
          jobId: 'job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        id: 'job-123',
        resolved: true,
        resolvedAt: '2025-09-19T14:30:01Z'
      };

      mockEarlyWarningSystemService.resolveEarlyWarning.mockReturnValue(mockResult);

      earlyWarningSystemController.resolveEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Early warning resolved successfully',
        warning: mockResult
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

      earlyWarningSystemController.resolveEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when early warning is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockEarlyWarningSystemService.resolveEarlyWarning.mockReturnValue(null);

      earlyWarningSystemController.resolveEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Early warning not found'
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

      mockEarlyWarningSystemService.resolveEarlyWarning.mockImplementation(() => {
        throw new Error('Service error');
      });

      earlyWarningSystemController.resolveEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to resolve early warning',
        message: 'Service error'
      });
    });
  });
});