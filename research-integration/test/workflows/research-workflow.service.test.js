/**
 * Research Workflow Service Tests
 * Tests for the research workflow service
 */

const ResearchWorkflowService = require('../../src/workflows/research-workflow.service.js');

describe('Research Workflow Service', () => {
  let researchWorkflowService;

  beforeEach(() => {
    researchWorkflowService = new ResearchWorkflowService();
  });

  describe('executeWorkflow', () => {
    test('should execute a workflow correctly', async () => {
      const workflowType = 'literatureReview';
      const inputData = {
        sources: ['pubmed', 'ieee'],
        searchTerms: ['diabetes treatment'],
        documents: [
          { id: 'doc1', content: 'Research paper about diabetes treatment' },
          { id: 'doc2', content: 'Study on cardiovascular complications' }
        ],
        analysisResults: {
          entities: [{ type: 'disease', text: 'diabetes' }],
          topics: [{ label: 'treatment' }],
          sentiment: { positive: 0.7 }
        }
      };

      const result = await researchWorkflowService.executeWorkflow(workflowType, inputData);

      expect(result).toBeDefined();
      expect(result.workflowId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.result).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should throw an error for missing workflow type', async () => {
      const inputData = { searchTerms: ['diabetes treatment'] };

      await expect(researchWorkflowService.executeWorkflow(null, inputData))
        .rejects
        .toThrow('Workflow type is required');
    });

    test('should throw an error for missing input data', async () => {
      const workflowType = 'literatureReview';

      await expect(researchWorkflowService.executeWorkflow(workflowType, null))
        .rejects
        .toThrow('Input data is required');
    });

    test('should throw an error for unsupported workflow type', async () => {
      const workflowType = 'unsupported-workflow';
      const inputData = { searchTerms: ['diabetes treatment'] };

      await expect(researchWorkflowService.executeWorkflow(workflowType, inputData))
        .rejects
        .toThrow("Workflow type 'unsupported-workflow' is not supported");
    });
  });

  describe('getWorkflowStatus', () => {
    test('should retrieve workflow status correctly', async () => {
      const workflowType = 'literatureReview';
      const inputData = {
        sources: ['pubmed', 'ieee'],
        searchTerms: ['diabetes treatment'],
        documents: [
          { id: 'doc1', content: 'Research paper about diabetes treatment' },
          { id: 'doc2', content: 'Study on cardiovascular complications' }
        ],
        analysisResults: {
          entities: [{ type: 'disease', text: 'diabetes' }],
          topics: [{ label: 'treatment' }],
          sentiment: { positive: 0.7 }
        }
      };
      const executionResult = await researchWorkflowService.executeWorkflow(workflowType, inputData);

      const status = researchWorkflowService.getWorkflowStatus(executionResult.workflowId);

      expect(status).toBeDefined();
      expect(status.workflowId).toBe(executionResult.workflowId);
      expect(status.type).toBe(workflowType);
      expect(status.status).toBe('completed');
      expect(status.steps).toBeDefined();
      expect(Array.isArray(status.steps)).toBe(true);
    });

    test('should return null for non-existent workflow', () => {
      const status = researchWorkflowService.getWorkflowStatus('non-existent-workflow-id');
      expect(status).toBeNull();
    });
  });

  describe('getAvailableWorkflows', () => {
    test('should return available workflows', () => {
      const workflows = researchWorkflowService.getAvailableWorkflows();

      expect(workflows).toBeDefined();
      expect(Array.isArray(workflows)).toBe(true);
      expect(workflows).toContain('literatureReview');
      expect(workflows).toContain('clinicalTrialMatching');
      expect(workflows).toContain('researchImpactAnalysis');
      expect(workflows).toContain('collaborativeResearch');
    });
  });

  describe('getWorkflowDefinition', () => {
    test('should retrieve workflow definition correctly', () => {
      const definition = researchWorkflowService.getWorkflowDefinition('literatureReview');

      expect(definition).toBeDefined();
      expect(definition.name).toBe('Literature Review Workflow');
      expect(definition.steps).toBeDefined();
      expect(Array.isArray(definition.steps)).toBe(true);
    });

    test('should return null for non-existent workflow definition', () => {
      const definition = researchWorkflowService.getWorkflowDefinition('non-existent-workflow');
      expect(definition).toBeNull();
    });
  });
});