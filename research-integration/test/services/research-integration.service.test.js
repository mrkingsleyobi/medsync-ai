/**
 * Research Integration Service Tests
 * Tests for the research integration service
 */

const ResearchIntegrationService = require('../../src/services/research-integration.service.js');

describe('Research Integration Service', () => {
  let researchIntegrationService;

  beforeEach(() => {
    researchIntegrationService = new ResearchIntegrationService();
  });

  describe('analyzeMedicalLiterature', () => {
    test('should analyze medical literature correctly', async () => {
      const documents = [
        { id: 'doc-1', content: 'Research paper about diabetes treatment' },
        { id: 'doc-2', content: 'Study on cardiovascular complications' }
      ];

      const result = await researchIntegrationService.analyzeMedicalLiterature(documents);

      expect(result).toBeDefined();
      expect(result.taskId).toBeDefined();
      expect(result.documentCount).toBe(2);
      expect(result.entities).toBeDefined();
      expect(result.topics).toBeDefined();
      expect(result.sentiment).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw an error for missing documents', async () => {
      await expect(researchIntegrationService.analyzeMedicalLiterature(null))
        .rejects
        .toThrow('Documents must be an array');
    });

    test('should throw an error for invalid documents format', async () => {
      await expect(researchIntegrationService.analyzeMedicalLiterature('invalid'))
        .rejects
        .toThrow('Documents must be an array');
    });
  });

  describe('matchClinicalTrials', () => {
    test('should match clinical trials correctly', async () => {
      const patientProfile = {
        patientId: 'PAT-12345',
        condition: 'diabetes',
        age: 45
      };

      const result = await researchIntegrationService.matchClinicalTrials(patientProfile);

      expect(result).toBeDefined();
      expect(result.taskId).toBeDefined();
      expect(result.patientId).toBe('PAT-12345');
      expect(result.trials).toBeDefined();
      expect(result.trials.length).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw an error for missing patient profile', async () => {
      await expect(researchIntegrationService.matchClinicalTrials(null))
        .rejects
        .toThrow('Patient profile is required');
    });
  });

  describe('trackResearchImpact', () => {
    test('should track research impact correctly', async () => {
      const researchId = 'RES-12345';

      const result = await researchIntegrationService.trackResearchImpact(researchId);

      expect(result).toBeDefined();
      expect(result.taskId).toBeDefined();
      expect(result.researchId).toBe(researchId);
      expect(result.metrics).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should throw an error for missing research ID', async () => {
      await expect(researchIntegrationService.trackResearchImpact(null))
        .rejects
        .toThrow('Research ID is required');
    });
  });

  describe('createCollaborativeResearchProject', () => {
    test('should create collaborative research project correctly', async () => {
      const projectData = {
        title: 'Diabetes Research Project',
        description: 'Study on diabetes treatment approaches',
        collaborators: ['researcher1@example.com', 'researcher2@example.com']
      };

      const project = await researchIntegrationService.createCollaborativeResearchProject(projectData);

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.title).toBe('Diabetes Research Project');
      expect(project.description).toBe('Study on diabetes treatment approaches');
      expect(project.collaborators).toEqual(['researcher1@example.com', 'researcher2@example.com']);
      expect(project.status).toBe('active');
    });

    test('should throw an error for missing project title', async () => {
      const projectData = {
        description: 'Study on diabetes treatment approaches'
      };

      await expect(researchIntegrationService.createCollaborativeResearchProject(projectData))
        .rejects
        .toThrow('Project title is required');
    });
  });

  describe('getResearchTaskStatus', () => {
    test('should retrieve research task status correctly', async () => {
      const documents = [{ id: 'doc-1', content: 'Research paper' }];
      const executionResult = await researchIntegrationService.analyzeMedicalLiterature(documents);

      const status = researchIntegrationService.getResearchTaskStatus(executionResult.taskId);

      expect(status).toBeDefined();
      expect(status.taskId).toBe(executionResult.taskId);
      expect(status.type).toBe('literature-analysis');
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent task', () => {
      const status = researchIntegrationService.getResearchTaskStatus('non-existent-task-id');
      expect(status).toBeNull();
    });
  });

  describe('getAvailableWorkflows', () => {
    test('should return available workflows', () => {
      const workflows = researchIntegrationService.getAvailableWorkflows();

      expect(workflows).toBeDefined();
      expect(Array.isArray(workflows)).toBe(true);
      expect(workflows).toContain('literatureReview');
      expect(workflows).toContain('clinicalTrialMatching');
      expect(workflows).toContain('researchImpactAnalysis');
    });
  });

  describe('getWorkflowDefinition', () => {
    test('should retrieve workflow definition correctly', () => {
      const definition = researchIntegrationService.getWorkflowDefinition('literatureReview');

      expect(definition).toBeDefined();
      expect(definition.name).toBe('Literature Review Workflow');
      expect(definition.steps).toBeDefined();
      expect(Array.isArray(definition.steps)).toBe(true);
    });

    test('should return null for non-existent workflow definition', () => {
      const definition = researchIntegrationService.getWorkflowDefinition('non-existent-workflow');
      expect(definition).toBeNull();
    });
  });
});