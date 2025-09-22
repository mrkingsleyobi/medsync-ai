/**
 * Healthcare System Integration Controller
 * Controller for handling healthcare system integration requests
 */

const HealthcareIntegrationService = require('../services/healthcare-integration.service.js');

class HealthcareIntegrationController {
  /**
   * Create a new Healthcare Integration Controller
   */
  constructor() {
    this.healthcareIntegrationService = new HealthcareIntegrationService();
  }

  /**
   * Integrate with FHIR API
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async integrateWithFhir(req, res) {
    try {
      const { options } = req.body;

      // Integrate with FHIR
      const result = await this.healthcareIntegrationService.integrateWithFhir(options);

      // Return result
      res.status(200).json({
        success: true,
        message: 'FHIR integration completed successfully',
        jobId: result.jobId,
        resources: result.resources,
        recordCount: result.recordCount,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('FHIR integration controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle specific errors with user-friendly messages
      if (error.message.includes('FHIR integration is not enabled')) {
        return res.status(400).json({
          error: 'FHIR integration is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to integrate with FHIR API',
        message: error.message
      });
    }
  }

  /**
   * Process HL7 messages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async processHl7Messages(req, res) {
    try {
      const { messages } = req.body;

      // Validate required fields
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
          error: 'Messages array is required'
        });
      }

      // Process HL7 messages
      const result = await this.healthcareIntegrationService.processHl7Messages(messages);

      // Return result
      res.status(200).json({
        success: true,
        message: 'HL7 messages processed successfully',
        jobId: result.jobId,
        processedMessages: result.processedMessages,
        successful: result.successful,
        failed: result.failed,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('HL7 message processing controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle validation errors with user-friendly messages
      if (error.message.includes('Messages array is required') || error.message.includes('cannot be empty')) {
        return res.status(400).json({
          error: 'Invalid messages format'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to process HL7 messages',
        message: error.message
      });
    }
  }

  /**
   * Integrate with DICOM
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async integrateWithDicom(req, res) {
    try {
      const { options } = req.body;

      // Integrate with DICOM
      const result = await this.healthcareIntegrationService.integrateWithDicom(options);

      // Return result
      res.status(200).json({
        success: true,
        message: 'DICOM integration completed successfully',
        jobId: result.jobId,
        imagesProcessed: result.imagesProcessed,
        storageUsed: result.storageUsed,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('DICOM integration controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle specific errors with user-friendly messages
      if (error.message.includes('DICOM integration is not enabled')) {
        return res.status(400).json({
          error: 'DICOM integration is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to integrate with DICOM',
        message: error.message
      });
    }
  }

  /**
   * Synchronize EHR data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async synchronizeEhrData(req, res) {
    try {
      const { options } = req.body;

      // Synchronize EHR data
      const result = await this.healthcareIntegrationService.synchronizeEhrData(options);

      // Return result
      res.status(200).json({
        success: true,
        message: 'EHR data synchronization completed successfully',
        jobId: result.jobId,
        recordsSynced: result.recordsSynced,
        conflictsResolved: result.conflictsResolved,
        errors: result.errors,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('EHR data synchronization controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle specific errors with user-friendly messages
      if (error.message.includes('EHR synchronization is not enabled')) {
        return res.status(400).json({
          error: 'EHR synchronization is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to synchronize EHR data',
        message: error.message
      });
    }
  }

  /**
   * Match patient records
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async matchPatientRecords(req, res) {
    try {
      const { patientData } = req.body;

      // Validate required fields
      if (!patientData) {
        return res.status(400).json({
          error: 'Patient data is required'
        });
      }

      if (!patientData.firstName || !patientData.lastName) {
        return res.status(400).json({
          error: 'Patient firstName and lastName are required'
        });
      }

      // Match patient records
      const result = await this.healthcareIntegrationService.matchPatientRecords(patientData);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Patient record matching completed successfully',
        jobId: result.jobId,
        matches: result.matches,
        bestMatch: result.bestMatch,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Patient record matching controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle validation errors with user-friendly messages
      if (error.message.includes('Patient data is required') || error.message.includes('firstName and lastName are required')) {
        return res.status(400).json({
          error: 'Invalid patient data provided'
        });
      }

      // Handle specific errors with user-friendly messages
      if (error.message.includes('Patient record matching is not enabled')) {
        return res.status(400).json({
          error: 'Patient record matching is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to match patient records',
        message: error.message
      });
    }
  }

  /**
   * Process medical images
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async processMedicalImages(req, res) {
    try {
      const { images } = req.body;

      // Validate required fields
      if (!images || !Array.isArray(images)) {
        return res.status(400).json({
          error: 'Images array is required'
        });
      }

      // Process medical images
      const result = await this.healthcareIntegrationService.processMedicalImages(images);

      // Return result
      res.status(200).json({
        success: true,
        message: 'Medical images processed successfully',
        jobId: result.jobId,
        imagesProcessed: result.imagesProcessed,
        thumbnailsGenerated: result.thumbnailsGenerated,
        annotationsCreated: result.annotationsCreated,
        aiAnalysisPerformed: result.aiAnalysisPerformed,
        processingTime: result.processingTime
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Medical image processing controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle validation errors with user-friendly messages
      if (error.message.includes('Images array is required') || error.message.includes('cannot be empty')) {
        return res.status(400).json({
          error: 'Invalid images format'
        });
      }

      // Handle specific errors with user-friendly messages
      if (error.message.includes('Image processing is not enabled')) {
        return res.status(400).json({
          error: 'Image processing is not enabled'
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to process medical images',
        message: error.message
      });
    }
  }

  /**
   * Get service status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getServiceStatus(req, res) {
    try {
      // Get service status
      const status = this.healthcareIntegrationService.getServiceStatus();

      // Return status
      res.status(200).json({
        success: true,
        status: status
      });
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Get service status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve service status',
        message: error.message
      });
    }
  }

  /**
   * Get FHIR integration job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getFhirIntegrationStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.healthcareIntegrationService.getFhirIntegrationStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'FHIR integration job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Get FHIR integration job status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve FHIR integration job status',
        message: error.message
      });
    }
  }

  /**
   * Get HL7 processing job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getHl7ProcessingStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.healthcareIntegrationService.getHl7ProcessingStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'HL7 processing job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Get HL7 processing job status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve HL7 processing job status',
        message: error.message
      });
    }
  }

  /**
   * Get DICOM integration job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getDicomIntegrationStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.healthcareIntegrationService.getDicomIntegrationStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'DICOM integration job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Get DICOM integration job status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve DICOM integration job status',
        message: error.message
      });
    }
  }

  /**
   * Get synchronization job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSyncJobStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.healthcareIntegrationService.getSyncJobStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Synchronization job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Get synchronization job status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve synchronization job status',
        message: error.message
      });
    }
  }

  /**
   * Get patient matching job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getMatchingJobStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.healthcareIntegrationService.getMatchingJobStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Patient matching job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Get patient matching job status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve patient matching job status',
        message: error.message
      });
    }
  }

  /**
   * Get image processing job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getImageProcessingStatus(req, res) {
    try {
      const { jobId } = req.params;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          error: 'Job ID is required'
        });
      }

      // Get job status
      const status = this.healthcareIntegrationService.getImageProcessingStatus(jobId);

      // Return status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Image processing job not found'
        });
      }
    } catch (error) {
      // Log the full error details server-side
      if (this.healthcareIntegrationService && this.healthcareIntegrationService.logger) {
        this.healthcareIntegrationService.logger.error('Get image processing job status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Return generic error message to client
      res.status(500).json({
        error: 'Failed to retrieve image processing job status',
        message: error.message
      });
    }
  }
}

module.exports = HealthcareIntegrationController;