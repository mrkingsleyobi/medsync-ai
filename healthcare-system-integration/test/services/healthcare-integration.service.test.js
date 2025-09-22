/**
 * Healthcare Integration Service Tests
 * Unit tests for the healthcare integration service
 */

const HealthcareIntegrationService = require('../../src/services/healthcare-integration.service.js');

describe('HealthcareIntegrationService', () => {
  let healthcareIntegrationService;

  beforeEach(() => {
    // Set required environment variables for testing
    process.env.FHIR_CLIENT_ID = 'test-client-id';
    process.env.FHIR_CLIENT_SECRET = 'test-client-secret';
    healthcareIntegrationService = new HealthcareIntegrationService();
  });

  afterEach(() => {
    // Clear environment variables after each test
    delete process.env.FHIR_CLIENT_ID;
    delete process.env.FHIR_CLIENT_SECRET;
  });

  describe('integrateWithFhir', () => {
    test('should integrate with FHIR successfully', async () => {
      const options = {
        resourceTypes: ['Patient', 'Observation']
      };

      const result = await healthcareIntegrationService.integrateWithFhir(options);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.resources).toBeDefined();
      expect(Array.isArray(result.resources)).toBe(true);
      expect(result.recordCount).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when FHIR integration is not enabled', async () => {
      // Temporarily disable FHIR integration
      const originalEnabled = healthcareIntegrationService.config.fhir.enabled;
      healthcareIntegrationService.config.fhir.enabled = false;

      await expect(healthcareIntegrationService.integrateWithFhir({}))
        .rejects
        .toThrow('FHIR integration is not enabled');

      // Restore original setting
      healthcareIntegrationService.config.fhir.enabled = originalEnabled;
    });
  });

  describe('processHl7Messages', () => {
    test('should process HL7 messages successfully', async () => {
      const messages = [
        'MSH|^~\\&|SYSTEM1|FAC1|SYSTEM2|FAC2|20250919143000||ADT^A01|MSG00001|P|2.5',
        'PID|1||PAT12345^^^FAC1^MR||SMITH^JOHN^M||19800101|M|||123 MAIN ST^^ANYTOWN^ST^12345||(555)123-4567'
      ];

      const result = await healthcareIntegrationService.processHl7Messages(messages);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.processedMessages).toBe(messages.length);
      expect(result.successful).toBeGreaterThan(0);
      expect(result.failed).toBeGreaterThanOrEqual(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when messages array is not provided', async () => {
      await expect(healthcareIntegrationService.processHl7Messages())
        .rejects
        .toThrow('Messages array is required and cannot be empty');
    });

    test('should throw error when messages array is empty', async () => {
      await expect(healthcareIntegrationService.processHl7Messages([]))
        .rejects
        .toThrow('Messages array is required and cannot be empty');
    });
  });

  describe('integrateWithDicom', () => {
    test('should integrate with DICOM successfully', async () => {
      const options = {
        studyId: 'STUDY-20250919-001'
      };

      const result = await healthcareIntegrationService.integrateWithDicom(options);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.imagesProcessed).toBeGreaterThan(0);
      expect(result.storageUsed).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when DICOM integration is not enabled', async () => {
      // Temporarily disable DICOM integration
      const originalEnabled = healthcareIntegrationService.config.dicom.enabled;
      healthcareIntegrationService.config.dicom.enabled = false;

      await expect(healthcareIntegrationService.integrateWithDicom({}))
        .rejects
        .toThrow('DICOM integration is not enabled');

      // Restore original setting
      healthcareIntegrationService.config.dicom.enabled = originalEnabled;
    });
  });

  describe('synchronizeEhrData', () => {
    test('should synchronize EHR data successfully', async () => {
      const options = {
        fullSync: false
      };

      const result = await healthcareIntegrationService.synchronizeEhrData(options);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.recordsSynced).toBeGreaterThan(0);
      expect(result.conflictsResolved).toBeGreaterThanOrEqual(0);
      expect(result.errors).toBeGreaterThanOrEqual(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when EHR synchronization is not enabled', async () => {
      // Temporarily disable EHR sync
      const originalEnabled = healthcareIntegrationService.config.sync.enabled;
      healthcareIntegrationService.config.sync.enabled = false;

      await expect(healthcareIntegrationService.synchronizeEhrData({}))
        .rejects
        .toThrow('EHR synchronization is not enabled');

      // Restore original setting
      healthcareIntegrationService.config.sync.enabled = originalEnabled;
    });
  });

  describe('matchPatientRecords', () => {
    test('should match patient records successfully', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1980-01-01',
        gender: 'M'
      };

      const result = await healthcareIntegrationService.matchPatientRecords(patientData);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.matches).toBeDefined();
      expect(Array.isArray(result.matches)).toBe(true);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when patient data is not provided', async () => {
      await expect(healthcareIntegrationService.matchPatientRecords())
        .rejects
        .toThrow('Patient data with firstName and lastName is required');
    });

    test('should throw error when firstName is not provided', async () => {
      const patientData = {
        lastName: 'Smith'
      };

      await expect(healthcareIntegrationService.matchPatientRecords(patientData))
        .rejects
        .toThrow('Patient data with firstName and lastName is required');
    });

    test('should throw error when lastName is not provided', async () => {
      const patientData = {
        firstName: 'John'
      };

      await expect(healthcareIntegrationService.matchPatientRecords(patientData))
        .rejects
        .toThrow('Patient data with firstName and lastName is required');
    });

    test('should throw error when patient record matching is not enabled', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Smith'
      };

      // Temporarily disable patient matching
      const originalEnabled = healthcareIntegrationService.config.matching.enabled;
      healthcareIntegrationService.config.matching.enabled = false;

      await expect(healthcareIntegrationService.matchPatientRecords(patientData))
        .rejects
        .toThrow('Patient record matching is not enabled');

      // Restore original setting
      healthcareIntegrationService.config.matching.enabled = originalEnabled;
    });
  });

  describe('processMedicalImages', () => {
    test('should process medical images successfully', async () => {
      const images = [
        { id: 'IMG-001', type: 'CT', size: 125000000 },
        { id: 'IMG-002', type: 'MRI', size: 245000000 }
      ];

      const result = await healthcareIntegrationService.processMedicalImages(images);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.imagesProcessed).toBe(images.length);
      expect(result.thumbnailsGenerated).toBeGreaterThan(0);
      expect(result.annotationsCreated).toBeGreaterThanOrEqual(0);
      expect(result.aiAnalysisPerformed).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw error when images array is not provided', async () => {
      await expect(healthcareIntegrationService.processMedicalImages())
        .rejects
        .toThrow('Images array is required and cannot be empty');
    });

    test('should throw error when images array is empty', async () => {
      await expect(healthcareIntegrationService.processMedicalImages([]))
        .rejects
        .toThrow('Images array is required and cannot be empty');
    });

    test('should throw error when image processing is not enabled', async () => {
      const images = [{ id: 'IMG-001', type: 'CT' }];

      // Temporarily disable image processing
      const originalEnabled = healthcareIntegrationService.config.imageProcessing.enabled;
      healthcareIntegrationService.config.imageProcessing.enabled = false;

      await expect(healthcareIntegrationService.processMedicalImages(images))
        .rejects
        .toThrow('Image processing is not enabled');

      // Restore original setting
      healthcareIntegrationService.config.imageProcessing.enabled = originalEnabled;
    });
  });

  describe('getServiceStatus', () => {
    test('should return service status', () => {
      const status = healthcareIntegrationService.getServiceStatus();

      expect(status).toBeDefined();
      expect(status.fhir).toBeDefined();
      expect(status.hl7).toBeDefined();
      expect(status.dicom).toBeDefined();
      expect(status.sync).toBeDefined();
      expect(status.matching).toBeDefined();
      expect(status.imageProcessing).toBeDefined();
    });
  });

  describe('getFhirIntegrationStatus', () => {
    test('should return FHIR integration job status', async () => {
      // First create a FHIR integration job
      const result = await healthcareIntegrationService.integrateWithFhir({});

      const status = healthcareIntegrationService.getFhirIntegrationStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });
  });

  describe('getHl7ProcessingStatus', () => {
    test('should return HL7 processing job status', async () => {
      // First process some HL7 messages
      const messages = ['MSH|^~\\&|SYSTEM1|FAC1|SYSTEM2|FAC2|20250919143000||ADT^A01|MSG00001|P|2.5'];
      const result = await healthcareIntegrationService.processHl7Messages(messages);

      const status = healthcareIntegrationService.getHl7ProcessingStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });
  });

  describe('getDicomIntegrationStatus', () => {
    test('should return DICOM integration job status', async () => {
      // First integrate with DICOM
      const result = await healthcareIntegrationService.integrateWithDicom({});

      const status = healthcareIntegrationService.getDicomIntegrationStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });
  });

  describe('getSyncJobStatus', () => {
    test('should return synchronization job status', async () => {
      // First synchronize EHR data
      const result = await healthcareIntegrationService.synchronizeEhrData({});

      const status = healthcareIntegrationService.getSyncJobStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent job', () => {
      const status = healthcareIntegrationService.getSyncJobStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getMatchingJobStatus', () => {
    test('should return patient matching job status', async () => {
      // First match patient records
      const patientData = { firstName: 'John', lastName: 'Smith' };
      const result = await healthcareIntegrationService.matchPatientRecords(patientData);

      const status = healthcareIntegrationService.getMatchingJobStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent job', () => {
      const status = healthcareIntegrationService.getMatchingJobStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getImageProcessingStatus', () => {
    test('should return image processing job status', async () => {
      // First process medical images
      const images = [{ id: 'IMG-001', type: 'CT' }];
      const result = await healthcareIntegrationService.processMedicalImages(images);

      const status = healthcareIntegrationService.getImageProcessingStatus(result.jobId);

      expect(status).toBeDefined();
      expect(status.jobId).toBe(result.jobId);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent job', () => {
      const status = healthcareIntegrationService.getImageProcessingStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });
});