/**
 * Research Workflow Controller Tests
 * Tests for the research workflow controller
 */

const ResearchWorkflowController = require('../../src/workflows/research-workflow.controller.js');

// Mock the ResearchWorkflowService
jest.mock('../../src/workflows/research-workflow.service.js');

describe('Research Workflow Controller', () => {
  let researchWorkflowController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    researchWorkflowController = new ResearchWorkflowController();
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
    test('should execute a workflow', async () => {
      const workflowType = 'literatureReview';
      const inputData = { query: 'diabetes treatment' };
      const workflowResult = {
        workflowId: 'WORKFLOW-12345',
        status: 'completed',
        result: { documents: [] },
        executionTime: 1500
      };

      mockReq.body = { workflowType, inputData };

      // Mock the service method
      researchWorkflowController.researchWorkflowService.executeWorkflow.mockResolvedValue(workflowResult);

      await researchWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Research workflow executed successfully',
        workflowId: workflowResult.workflowId,
        status: workflowResult.status,
        result: workflowResult.result,
        executionTime: workflowResult.executionTime
      });
    });

    test('should return 400 if workflow type is missing', async () => {
      mockReq.body = { inputData: { query: 'diabetes treatment' } };

      await researchWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow type is required'
      });
    });

    test('should return 400 if input data is missing', async () => {
      mockReq.body = { workflowType: 'literatureReview' };

      await researchWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Input data is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const workflowType = 'literatureReview';
      const inputData = { query: 'diabetes treatment' };
      const errorMessage = 'Service error';

      mockReq.body = { workflowType, inputData };

      // Mock the service method to throw an error
      researchWorkflowController.researchWorkflowService.executeWorkflow.mockRejectedValue(new Error(errorMessage));

      await researchWorkflowController.executeWorkflow(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to execute research workflow',
        message: errorMessage
      });
    });
  });

  describe('getWorkflowStatus', () => {
    test('should retrieve workflow status', async () => {
      const workflowId = 'WORKFLOW-12345';
      const status = {
        workflowId: 'WORKFLOW-12345',
        type: 'literatureReview',
        status: 'completed'
      };

      mockReq.params = { workflowId };

      // Mock the service method
      researchWorkflowController.researchWorkflowService.getWorkflowStatus.mockReturnValue(status);

      await researchWorkflowController.getWorkflowStatus(mockReq, mockRes);

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
      researchWorkflowController.researchWorkflowService.getWorkflowStatus.mockReturnValue(null);

      await researchWorkflowController.getWorkflowStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow not found'
      });
    });

    test('should return 400 if workflow ID is missing', async () => {
      mockReq.params = {};

      await researchWorkflowController.getWorkflowStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const workflowId = 'WORKFLOW-12345';
      const errorMessage = 'Service error';

      mockReq.params = { workflowId };

      // Mock the service method to throw an error
      researchWorkflowController.researchWorkflowService.getWorkflowStatus.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await researchWorkflowController.getWorkflowStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve workflow status',
        message: errorMessage
      });
    });
  });

  describe('getAvailableWorkflows', () => {
    test('should retrieve available workflows', () => {
      const workflows = ['literatureReview', 'clinicalTrialMatching'];

      // Mock the service method
      researchWorkflowController.researchWorkflowService.getAvailableWorkflows.mockReturnValue(workflows);

      researchWorkflowController.getAvailableWorkflows(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        workflows: workflows
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      researchWorkflowController.researchWorkflowService.getAvailableWorkflows.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researchWorkflowController.getAvailableWorkflows(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve available workflows',
        message: errorMessage
      });
    });
  });

  describe('getWorkflowDefinition', () => {
    test('should retrieve workflow definition', () => {
      const workflowType = 'literatureReview';
      const definition = {
        name: 'Literature Review Workflow',
        steps: ['documentCollection', 'preprocessing']
      };

      mockReq.params = { workflowType };

      // Mock the service method
      researchWorkflowController.researchWorkflowService.getWorkflowDefinition.mockReturnValue(definition);

      researchWorkflowController.getWorkflowDefinition(mockReq, mockRes);

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
      researchWorkflowController.researchWorkflowService.getWorkflowDefinition.mockReturnValue(null);

      researchWorkflowController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow definition not found'
      });
    });

    test('should return 400 if workflow type is missing', () => {
      mockReq.params = {};

      researchWorkflowController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow type is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const workflowType = 'literatureReview';
      const errorMessage = 'Service error';

      mockReq.params = { workflowType };

      // Mock the service method to throw an error
      researchWorkflowController.researchWorkflowService.getWorkflowDefinition.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researchWorkflowController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve workflow definition',
        message: errorMessage
      });
    });
  });
});