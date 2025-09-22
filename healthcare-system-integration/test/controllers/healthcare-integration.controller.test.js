/**
 * Healthcare Integration Controller Tests
 * Unit tests for the healthcare integration controller
 */

const HealthcareIntegrationController = require('../../src/controllers/healthcare-integration.controller.js');

// Mock the service
jest.mock('../../src/services/healthcare-integration.service.js');

describe('HealthcareIntegrationController', () => {
  let healthcareIntegrationController;
  let mockHealthcareIntegrationService;

  beforeEach(() => {
    healthcareIntegrationController = new HealthcareIntegrationController();
    mockHealthcareIntegrationService = healthcareIntegrationController.healthcareIntegrationService;
  });

  describe('integrateWithFhir', () => {
    test('should integrate with FHIR successfully', async () => {
      const req = {
        body: {
          options: { resourceTypes: ['Patient', 'Observation'] }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'fhir-job-123',
        resources: [{ resourceType: 'Patient' }, { resourceType: 'Observation' }],
        recordCount: 1247,
        processingTime: 1500
      };

      mockHealthcareIntegrationService.integrateWithFhir.mockResolvedValue(mockResult);

      await healthcareIntegrationController.integrateWithFhir(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'FHIR integration completed successfully',
        jobId: mockResult.jobId,
        resources: mockResult.resources,
        recordCount: mockResult.recordCount,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when FHIR integration is not enabled', async () => {
      const req = {
        body: {
          options: { resourceTypes: ['Patient'] }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.integrateWithFhir.mockRejectedValue(new Error('FHIR integration is not enabled'));

      await healthcareIntegrationController.integrateWithFhir(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'FHIR integration is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          options: { resourceTypes: ['Patient'] }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.integrateWithFhir.mockRejectedValue(new Error('Service error'));

      await healthcareIntegrationController.integrateWithFhir(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to integrate with FHIR API'
      });
    });
  });

  describe('processHl7Messages', () => {
    test('should process HL7 messages successfully', async () => {
      const req = {
        body: {
          messages: [
            'MSH|^~\\&|SYSTEM1|FAC1|SYSTEM2|FAC2|20250919143000||ADT^A01|MSG00001|P|2.5'
          ]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'hl7-job-123',
        processedMessages: 1,
        successful: 1,
        failed: 0,
        processingTime: 2000
      };

      mockHealthcareIntegrationService.processHl7Messages.mockResolvedValue(mockResult);

      await healthcareIntegrationController.processHl7Messages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'HL7 messages processed successfully',
        jobId: mockResult.jobId,
        processedMessages: mockResult.processedMessages,
        successful: mockResult.successful,
        failed: mockResult.failed,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when messages array is not provided', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await healthcareIntegrationController.processHl7Messages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Messages array is required'
      });
    });

    test('should return 400 when messages is not an array', async () => {
      const req = {
        body: {
          messages: 'not-an-array'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await healthcareIntegrationController.processHl7Messages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Messages array is required'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          messages: ['MSH|^~\\&|SYSTEM1|FAC1|SYSTEM2|FAC2|20250919143000||ADT^A01|MSG00001|P|2.5']
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.processHl7Messages.mockRejectedValue(new Error('Service error'));

      await healthcareIntegrationController.processHl7Messages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to process HL7 messages'
      });
    });
  });

  describe('integrateWithDicom', () => {
    test('should integrate with DICOM successfully', async () => {
      const req = {
        body: {
          options: { studyId: 'STUDY-20250919-001' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'dicom-job-123',
        imagesProcessed: 156,
        storageUsed: 842,
        processingTime: 2500
      };

      mockHealthcareIntegrationService.integrateWithDicom.mockResolvedValue(mockResult);

      await healthcareIntegrationController.integrateWithDicom(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'DICOM integration completed successfully',
        jobId: mockResult.jobId,
        imagesProcessed: mockResult.imagesProcessed,
        storageUsed: mockResult.storageUsed,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when DICOM integration is not enabled', async () => {
      const req = {
        body: {
          options: { studyId: 'STUDY-20250919-001' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.integrateWithDicom.mockRejectedValue(new Error('DICOM integration is not enabled'));

      await healthcareIntegrationController.integrateWithDicom(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'DICOM integration is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          options: { studyId: 'STUDY-20250919-001' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.integrateWithDicom.mockRejectedValue(new Error('Service error'));

      await healthcareIntegrationController.integrateWithDicom(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to integrate with DICOM'
      });
    });
  });

  describe('synchronizeEhrData', () => {
    test('should synchronize EHR data successfully', async () => {
      const req = {
        body: {
          options: { fullSync: false }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'sync-job-123',
        recordsSynced: 1247,
        conflictsResolved: 3,
        errors: 0,
        processingTime: 3000
      };

      mockHealthcareIntegrationService.synchronizeEhrData.mockResolvedValue(mockResult);

      await healthcareIntegrationController.synchronizeEhrData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'EHR data synchronization completed successfully',
        jobId: mockResult.jobId,
        recordsSynced: mockResult.recordsSynced,
        conflictsResolved: mockResult.conflictsResolved,
        errors: mockResult.errors,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when EHR synchronization is not enabled', async () => {
      const req = {
        body: {
          options: { fullSync: false }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.synchronizeEhrData.mockRejectedValue(new Error('EHR synchronization is not enabled'));

      await healthcareIntegrationController.synchronizeEhrData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'EHR synchronization is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          options: { fullSync: false }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.synchronizeEhrData.mockRejectedValue(new Error('Service error'));

      await healthcareIntegrationController.synchronizeEhrData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to synchronize EHR data'
      });
    });
  });

  describe('matchPatientRecords', () => {
    test('should match patient records successfully', async () => {
      const req = {
        body: {
          patientData: {
            firstName: 'John',
            lastName: 'Smith',
            dateOfBirth: '1980-01-01'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'matching-job-123',
        matches: [
          {
            patientId: 'PAT-12345',
            confidence: 0.96,
            fieldsMatched: ['firstName', 'lastName', 'dateOfBirth']
          }
        ],
        bestMatch: {
          patientId: 'PAT-12345',
          confidence: 0.96,
          fieldsMatched: ['firstName', 'lastName', 'dateOfBirth']
        },
        processingTime: 1000
      };

      mockHealthcareIntegrationService.matchPatientRecords.mockResolvedValue(mockResult);

      await healthcareIntegrationController.matchPatientRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Patient record matching completed successfully',
        jobId: mockResult.jobId,
        matches: mockResult.matches,
        bestMatch: mockResult.bestMatch,
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

      await healthcareIntegrationController.matchPatientRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient data is required'
      });
    });

    test('should return 400 when firstName is not provided', async () => {
      const req = {
        body: {
          patientData: {
            lastName: 'Smith'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await healthcareIntegrationController.matchPatientRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient firstName and lastName are required'
      });
    });

    test('should return 400 when lastName is not provided', async () => {
      const req = {
        body: {
          patientData: {
            firstName: 'John'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await healthcareIntegrationController.matchPatientRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient firstName and lastName are required'
      });
    });

    test('should return 400 when patient record matching is not enabled', async () => {
      const req = {
        body: {
          patientData: {
            firstName: 'John',
            lastName: 'Smith'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.matchPatientRecords.mockRejectedValue(new Error('Patient record matching is not enabled'));

      await healthcareIntegrationController.matchPatientRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient record matching is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          patientData: {
            firstName: 'John',
            lastName: 'Smith'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.matchPatientRecords.mockRejectedValue(new Error('Service error'));

      await healthcareIntegrationController.matchPatientRecords(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to match patient records'
      });
    });
  });

  describe('processMedicalImages', () => {
    test('should process medical images successfully', async () => {
      const req = {
        body: {
          images: [
            { id: 'IMG-001', type: 'CT', size: 125000000 },
            { id: 'IMG-002', type: 'MRI', size: 245000000 }
          ]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'imaging-job-123',
        imagesProcessed: 2,
        thumbnailsGenerated: 2,
        annotationsCreated: 2,
        aiAnalysisPerformed: 2,
        processingTime: 2000
      };

      mockHealthcareIntegrationService.processMedicalImages.mockResolvedValue(mockResult);

      await healthcareIntegrationController.processMedicalImages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Medical images processed successfully',
        jobId: mockResult.jobId,
        imagesProcessed: mockResult.imagesProcessed,
        thumbnailsGenerated: mockResult.thumbnailsGenerated,
        annotationsCreated: mockResult.annotationsCreated,
        aiAnalysisPerformed: mockResult.aiAnalysisPerformed,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when images array is not provided', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await healthcareIntegrationController.processMedicalImages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Images array is required'
      });
    });

    test('should return 400 when images is not an array', async () => {
      const req = {
        body: {
          images: 'not-an-array'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await healthcareIntegrationController.processMedicalImages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Images array is required'
      });
    });

    test('should return 400 when image processing is not enabled', async () => {
      const req = {
        body: {
          images: [{ id: 'IMG-001', type: 'CT' }]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.processMedicalImages.mockRejectedValue(new Error('Image processing is not enabled'));

      await healthcareIntegrationController.processMedicalImages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Image processing is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          images: [{ id: 'IMG-001', type: 'CT' }]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.processMedicalImages.mockRejectedValue(new Error('Service error'));

      await healthcareIntegrationController.processMedicalImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to process medical images'
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
        fhir: { enabled: true, lastIntegration: '2025-09-19T14:30:00Z' },
        hl7: { enabled: true, messagesProcessed: 892 }
      };

      mockHealthcareIntegrationService.getServiceStatus.mockReturnValue(mockStatus);

      healthcareIntegrationController.getServiceStatus(req, res);

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

      mockHealthcareIntegrationService.getServiceStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthcareIntegrationController.getServiceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve service status'
      });
    });
  });

  describe('getFhirIntegrationStatus', () => {
    test('should return FHIR integration job status successfully', () => {
      const req = {
        params: {
          jobId: 'fhir-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'fhir-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:01Z',
        recordCount: 1247
      };

      mockHealthcareIntegrationService.getFhirIntegrationStatus.mockReturnValue(mockStatus);

      healthcareIntegrationController.getFhirIntegrationStatus(req, res);

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

      healthcareIntegrationController.getFhirIntegrationStatus(req, res);

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

      mockHealthcareIntegrationService.getFhirIntegrationStatus.mockReturnValue(null);

      healthcareIntegrationController.getFhirIntegrationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'FHIR integration job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'fhir-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.getFhirIntegrationStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthcareIntegrationController.getFhirIntegrationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve FHIR integration job status'
      });
    });
  });

  describe('getHl7ProcessingStatus', () => {
    test('should return HL7 processing job status successfully', () => {
      const req = {
        params: {
          jobId: 'hl7-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'hl7-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:02Z',
        processedMessages: 1,
        successful: 1,
        failed: 0
      };

      mockHealthcareIntegrationService.getHl7ProcessingStatus.mockReturnValue(mockStatus);

      healthcareIntegrationController.getHl7ProcessingStatus(req, res);

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

      healthcareIntegrationController.getHl7ProcessingStatus(req, res);

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

      mockHealthcareIntegrationService.getHl7ProcessingStatus.mockReturnValue(null);

      healthcareIntegrationController.getHl7ProcessingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'HL7 processing job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'hl7-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.getHl7ProcessingStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthcareIntegrationController.getHl7ProcessingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve HL7 processing job status'
      });
    });
  });

  describe('getDicomIntegrationStatus', () => {
    test('should return DICOM integration job status successfully', () => {
      const req = {
        params: {
          jobId: 'dicom-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'dicom-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:02Z',
        imagesProcessed: 156,
        storageUsed: 842
      };

      mockHealthcareIntegrationService.getDicomIntegrationStatus.mockReturnValue(mockStatus);

      healthcareIntegrationController.getDicomIntegrationStatus(req, res);

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

      healthcareIntegrationController.getDicomIntegrationStatus(req, res);

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

      mockHealthcareIntegrationService.getDicomIntegrationStatus.mockReturnValue(null);

      healthcareIntegrationController.getDicomIntegrationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'DICOM integration job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'dicom-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.getDicomIntegrationStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthcareIntegrationController.getDicomIntegrationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve DICOM integration job status'
      });
    });
  });

  describe('getSyncJobStatus', () => {
    test('should return synchronization job status successfully', () => {
      const req = {
        params: {
          jobId: 'sync-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'sync-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        startedAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:32:15Z'
      };

      mockHealthcareIntegrationService.getSyncJobStatus.mockReturnValue(mockStatus);

      healthcareIntegrationController.getSyncJobStatus(req, res);

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

      healthcareIntegrationController.getSyncJobStatus(req, res);

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

      mockHealthcareIntegrationService.getSyncJobStatus.mockReturnValue(null);

      healthcareIntegrationController.getSyncJobStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Synchronization job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'sync-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.getSyncJobStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthcareIntegrationController.getSyncJobStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve synchronization job status'
      });
    });
  });

  describe('getMatchingJobStatus', () => {
    test('should return patient matching job status successfully', () => {
      const req = {
        params: {
          jobId: 'matching-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'matching-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        startedAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:01Z'
      };

      mockHealthcareIntegrationService.getMatchingJobStatus.mockReturnValue(mockStatus);

      healthcareIntegrationController.getMatchingJobStatus(req, res);

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

      healthcareIntegrationController.getMatchingJobStatus(req, res);

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

      mockHealthcareIntegrationService.getMatchingJobStatus.mockReturnValue(null);

      healthcareIntegrationController.getMatchingJobStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient matching job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'matching-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.getMatchingJobStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthcareIntegrationController.getMatchingJobStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve patient matching job status'
      });
    });
  });

  describe('getImageProcessingStatus', () => {
    test('should return image processing job status successfully', () => {
      const req = {
        params: {
          jobId: 'imaging-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'imaging-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        startedAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:02Z'
      };

      mockHealthcareIntegrationService.getImageProcessingStatus.mockReturnValue(mockStatus);

      healthcareIntegrationController.getImageProcessingStatus(req, res);

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

      healthcareIntegrationController.getImageProcessingStatus(req, res);

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

      mockHealthcareIntegrationService.getImageProcessingStatus.mockReturnValue(null);

      healthcareIntegrationController.getImageProcessingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Image processing job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'imaging-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockHealthcareIntegrationService.getImageProcessingStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      healthcareIntegrationController.getImageProcessingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve image processing job status'
      });
    });
  });
});