/**
 * Clinical Workflow Controller Tests
 * Tests for the clinical workflow controller
 */

const ClinicalWorkflowController = require('../../src/workflows/clinical-workflow.controller.js');

// Mock the ClinicalWorkflowService
jest.mock('../../src/workflows/clinical-workflow.service.js');

describe('Clinical Workflow Controller', () => {
  let clinicalWorkflowController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    clinicalWorkflowController = new ClinicalWorkflowController();
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('executeWorkflow', () => {
    test('should execute a clinical workflow', async () => {
      const workflowType = 'diagnosisSupport';
      const patientContext = {
        patientId: 'PAT-12345',
        symptoms: ['headache', 'blurred vision']
      };
      const workflowResult = {
        workflowId: 'WF-12345',
        status: 'completed',
        result: { recommendations: [] },
        executionTime: 150
      };

      mockReq.body = { workflowType, patientContext };

      // Mock the service method
      clinicalWorkflowController.clinicalWorkflowService.executeWorkflow.mockResolvedValue(workflowResult);

      await clinicalWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Clinical workflow executed successfully',
        workflowId: workflowResult.workflowId,
        status: workflowResult.status,
        result: workflowResult.result,
        executionTime: workflowResult.executionTime
      });
    });

    test('should return 400 if workflow type is missing', async () => {
      mockReq.body = {};

      await clinicalWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow type is required'
      });
    });

    test('should return 400 if patient context is missing', async () => {
      mockReq.body = { workflowType: 'diagnosisSupport' };

      await clinicalWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Patient context is required'
      });
    });

    test('should return 400 if patient ID is missing', async () => {
      mockReq.body = {
        workflowType: 'diagnosisSupport',
        patientContext: { symptoms: ['headache'] }
      };

      await clinicalWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Patient ID is required in patient context'
      });
    });

    test('should return 400 if service throws workflow type error', async () => {
      const workflowType = 'invalid-type';
      const patientContext = { patientId: 'PAT-12345' };
      const errorMessage = 'Workflow type \'invalid-type\' is not supported';

      mockReq.body = { workflowType, patientContext };

      // Mock the service method to throw an error
      clinicalWorkflowController.clinicalWorkflowService.executeWorkflow.mockRejectedValue(new Error(errorMessage));

      await clinicalWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws other error', async () => {
      const workflowType = 'diagnosisSupport';
      const patientContext = { patientId: 'PAT-12345' };
      const errorMessage = 'Internal service error';

      mockReq.body = { workflowType, patientContext };

      // Mock the service method to throw an error
      clinicalWorkflowController.clinicalWorkflowService.executeWorkflow.mockRejectedValue(new Error(errorMessage));

      await clinicalWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to execute clinical workflow',
        message: errorMessage
      });
    });
  });

  describe('getWorkflowStatus', () => {
    test('should retrieve workflow status', async () => {
      const workflowId = 'WF-12345';
      const status = {
        workflowId: 'WF-12345',
        type: 'diagnosisSupport',
        status: 'completed'
      };

      mockReq.params = { workflowId };

      // Mock the service method
      clinicalWorkflowController.clinicalWorkflowService.getWorkflowStatus.mockReturnValue(status);

      await clinicalWorkflowController.getWorkflowStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        status: status
      });
    });

    test('should return 404 if workflow is not found', async () => {
      const workflowId = 'NON-EXISTENT';

      mockReq.params = { workflowId };

      // Mock the service method to return null
      clinicalWorkflowController.clinicalWorkflowService.getWorkflowStatus.mockReturnValue(null);

      await clinicalWorkflowController.getWorkflowStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow not found'
      });
    });

    test('should return 400 if workflow ID is missing', async () => {
      mockReq.params = {};

      await clinicalWorkflowController.getWorkflowStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const workflowId = 'WF-12345';
      const errorMessage = 'Service error';

      mockReq.params = { workflowId };

      // Mock the service method to throw an error
      clinicalWorkflowController.clinicalWorkflowService.getWorkflowStatus.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await clinicalWorkflowController.getWorkflowStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve workflow status',
        message: errorMessage
      });
    });
  });

  describe('getAvailableWorkflows', () => {
    test('should retrieve available workflows', () => {
      const workflows = ['diagnosisSupport', 'treatmentRecommendation', 'riskAssessment'];

      // Mock the service method
      clinicalWorkflowController.clinicalWorkflowService.getAvailableWorkflows.mockReturnValue(workflows);

      clinicalWorkflowController.getAvailableWorkflows(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        workflows: workflows
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      clinicalWorkflowController.clinicalWorkflowService.getAvailableWorkflows.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      clinicalWorkflowController.getAvailableWorkflows(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve available workflows',
        message: errorMessage
      });
    });
  });

  describe('getWorkflowDefinition', () => {
    test('should retrieve workflow definition', () => {
      const workflowType = 'diagnosisSupport';
      const definition = {
        name: 'Diagnosis Support Workflow',
        steps: ['patientDataValidation', 'symptomAnalysis']
      };

      mockReq.params = { workflowType };

      // Mock the service method
      clinicalWorkflowController.clinicalWorkflowService.getWorkflowDefinition.mockReturnValue(definition);

      clinicalWorkflowController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        definition: definition
      });
    });

    test('should return 404 if workflow definition is not found', () => {
      const workflowType = 'non-existent-workflow';

      mockReq.params = { workflowType };

      // Mock the service method to return null
      clinicalWorkflowController.clinicalWorkflowService.getWorkflowDefinition.mockReturnValue(null);

      clinicalWorkflowController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow definition not found'
      });
    });

    test('should return 400 if workflow type is missing', () => {
      mockReq.params = {};

      clinicalWorkflowController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow type is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const workflowType = 'diagnosisSupport';
      const errorMessage = 'Service error';

      mockReq.params = { workflowType };

      // Mock the service method to throw an error
      clinicalWorkflowController.clinicalWorkflowService.getWorkflowDefinition.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      clinicalWorkflowController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve workflow definition',
        message: errorMessage
      });
    });
  });
});