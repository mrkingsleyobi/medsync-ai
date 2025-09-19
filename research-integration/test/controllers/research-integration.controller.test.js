/**
 * Research Integration Controller Tests
 * Tests for the research integration controller
 */

const ResearchIntegrationController = require('../../src/controllers/research-integration.controller.js');

// Mock the ResearchIntegrationService
jest.mock('../../src/services/research-integration.service.js');

describe('Research Integration Controller', () => {
  let researchIntegrationController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    researchIntegrationController = new ResearchIntegrationController();
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

  describe('analyzeMedicalLiterature', () => {
    test('should analyze medical literature', async () => {
      const documents = [
        { id: 'doc-1', content: 'Research paper about diabetes treatment' }
      ];
      const analysisResult = {
        taskId: 'TASK-12345',
        documentCount: 1,
        entities: [{ id: 'ent-1', type: 'disease', text: 'Diabetes' }],
        topics: [{ id: 'topic-1', label: 'Diabetes Treatment' }],
        sentiment: { positive: 0.7, neutral: 0.2, negative: 0.1 },
        summary: 'Summary of research papers',
        processingTime: 1500
      };

      mockReq.body = { documents };

      // Mock the service method
      researchIntegrationController.researchIntegrationService.analyzeMedicalLiterature.mockResolvedValue(analysisResult);

      await researchIntegrationController.analyzeMedicalLiterature(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Medical literature analysis completed successfully',
        taskId: analysisResult.taskId,
        documentCount: analysisResult.documentCount,
        entities: analysisResult.entities,
        topics: analysisResult.topics,
        sentiment: analysisResult.sentiment,
        summary: analysisResult.summary,
        processingTime: analysisResult.processingTime
      });
    });

    test('should return 400 if documents are missing', async () => {
      mockReq.body = {};

      await researchIntegrationController.analyzeMedicalLiterature(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Documents are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const documents = [{ id: 'doc-1', content: 'Research paper' }];
      const errorMessage = 'Service error';

      mockReq.body = { documents };

      // Mock the service method to throw an error
      researchIntegrationController.researchIntegrationService.analyzeMedicalLiterature.mockRejectedValue(new Error(errorMessage));

      await researchIntegrationController.analyzeMedicalLiterature(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to analyze medical literature',
        message: errorMessage
      });
    });
  });

  describe('matchClinicalTrials', () => {
    test('should match clinical trials', async () => {
      const patientProfile = {
        patientId: 'PAT-12345',
        condition: 'diabetes'
      };
      const matchingResult = {
        taskId: 'TASK-12345',
        patientId: 'PAT-12345',
        trials: [
          {
            id: 'trial-1',
            title: 'Diabetes Drug Trial',
            eligibilityScore: 0.92
          }
        ],
        processingTime: 1200
      };

      mockReq.body = { patientProfile };

      // Mock the service method
      researchIntegrationController.researchIntegrationService.matchClinicalTrials.mockResolvedValue(matchingResult);

      await researchIntegrationController.matchClinicalTrials(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Clinical trial matching completed successfully',
        taskId: matchingResult.taskId,
        patientId: matchingResult.patientId,
        trials: matchingResult.trials,
        processingTime: matchingResult.processingTime
      });
    });

    test('should return 400 if patient profile is missing', async () => {
      mockReq.body = {};

      await researchIntegrationController.matchClinicalTrials(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Patient profile is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const patientProfile = { patientId: 'PAT-12345' };
      const errorMessage = 'Service error';

      mockReq.body = { patientProfile };

      // Mock the service method to throw an error
      researchIntegrationController.researchIntegrationService.matchClinicalTrials.mockRejectedValue(new Error(errorMessage));

      await researchIntegrationController.matchClinicalTrials(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to match clinical trials',
        message: errorMessage
      });
    });
  });

  describe('trackResearchImpact', () => {
    test('should track research impact', async () => {
      const researchId = 'RES-12345';
      const trackingResult = {
        taskId: 'TASK-12345',
        researchId: 'RES-12345',
        metrics: {
          citations: 142,
          downloads: 847
        },
        processingTime: 800
      };

      mockReq.body = { researchId };

      // Mock the service method
      researchIntegrationController.researchIntegrationService.trackResearchImpact.mockResolvedValue(trackingResult);

      await researchIntegrationController.trackResearchImpact(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Research impact tracking completed successfully',
        taskId: trackingResult.taskId,
        researchId: trackingResult.researchId,
        metrics: trackingResult.metrics,
        processingTime: trackingResult.processingTime
      });
    });

    test('should return 400 if research ID is missing', async () => {
      mockReq.body = {};

      await researchIntegrationController.trackResearchImpact(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Research ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const researchId = 'RES-12345';
      const errorMessage = 'Service error';

      mockReq.body = { researchId };

      // Mock the service method to throw an error
      researchIntegrationController.researchIntegrationService.trackResearchImpact.mockRejectedValue(new Error(errorMessage));

      await researchIntegrationController.trackResearchImpact(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to track research impact',
        message: errorMessage
      });
    });
  });

  describe('createCollaborativeResearchProject', () => {
    test('should create collaborative research project', async () => {
      const projectData = {
        title: 'Diabetes Research Project',
        description: 'Study on diabetes treatment approaches'
      };
      const project = {
        id: 'PROJ-12345',
        title: 'Diabetes Research Project',
        description: 'Study on diabetes treatment approaches',
        status: 'active'
      };

      mockReq.body = { projectData };

      // Mock the service method
      researchIntegrationController.researchIntegrationService.createCollaborativeResearchProject.mockResolvedValue(project);

      await researchIntegrationController.createCollaborativeResearchProject(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Collaborative research project created successfully',
        project: project
      });
    });

    test('should return 400 if project title is missing', async () => {
      mockReq.body = { projectData: { description: 'Project description' } };

      await researchIntegrationController.createCollaborativeResearchProject(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Project title is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const projectData = { title: 'Diabetes Research Project' };
      const errorMessage = 'Service error';

      mockReq.body = { projectData };

      // Mock the service method to throw an error
      researchIntegrationController.researchIntegrationService.createCollaborativeResearchProject.mockRejectedValue(new Error(errorMessage));

      await researchIntegrationController.createCollaborativeResearchProject(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to create collaborative research project',
        message: errorMessage
      });
    });
  });

  describe('getResearchTaskStatus', () => {
    test('should retrieve research task status', async () => {
      const taskId = 'TASK-12345';
      const status = {
        taskId: 'TASK-12345',
        type: 'literature-analysis',
        status: 'completed'
      };

      mockReq.params = { taskId };

      // Mock the service method
      researchIntegrationController.researchIntegrationService.getResearchTaskStatus.mockReturnValue(status);

      await researchIntegrationController.getResearchTaskStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        status: status
      });
    });

    test('should return 404 if task is not found', async () => {
      const taskId = 'NON-EXISTENT';

      mockReq.params = { taskId };

      // Mock the service method to return null
      researchIntegrationController.researchIntegrationService.getResearchTaskStatus.mockReturnValue(null);

      await researchIntegrationController.getResearchTaskStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Research task not found'
      });
    });

    test('should return 400 if task ID is missing', async () => {
      mockReq.params = {};

      await researchIntegrationController.getResearchTaskStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Task ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const taskId = 'TASK-12345';
      const errorMessage = 'Service error';

      mockReq.params = { taskId };

      // Mock the service method to throw an error
      researchIntegrationController.researchIntegrationService.getResearchTaskStatus.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await researchIntegrationController.getResearchTaskStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve research task status',
        message: errorMessage
      });
    });
  });

  describe('getAvailableWorkflows', () => {
    test('should retrieve available workflows', () => {
      const workflows = ['literatureReview', 'clinicalTrialMatching'];

      // Mock the service method
      researchIntegrationController.researchIntegrationService.getAvailableWorkflows.mockReturnValue(workflows);

      researchIntegrationController.getAvailableWorkflows(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        workflows: workflows
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      researchIntegrationController.researchIntegrationService.getAvailableWorkflows.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researchIntegrationController.getAvailableWorkflows(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve available research workflows',
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
      researchIntegrationController.researchIntegrationService.getWorkflowDefinition.mockReturnValue(definition);

      researchIntegrationController.getWorkflowDefinition(mockReq, mockRes);

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
      researchIntegrationController.researchIntegrationService.getWorkflowDefinition.mockReturnValue(null);

      researchIntegrationController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Workflow definition not found'
      });
    });

    test('should return 400 if workflow type is missing', () => {
      mockReq.params = {};

      researchIntegrationController.getWorkflowDefinition(mockReq, mockRes);

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
      researchIntegrationController.researchIntegrationService.getWorkflowDefinition.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researchIntegrationController.getWorkflowDefinition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve workflow definition',
        message: errorMessage
      });
    });
  });
});