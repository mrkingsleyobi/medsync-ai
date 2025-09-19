/**
 * Clinical Workflow Service Tests
 * Tests for the clinical workflow service
 */

const ClinicalWorkflowService = require('../../src/workflows/clinical-workflow.service.js');

describe('Clinical Workflow Service', () => {
  let clinicalWorkflowService;

  beforeEach(() => {
    clinicalWorkflowService = new ClinicalWorkflowService();
  });

  describe('executeWorkflow', () => {
    test('should execute diagnosis support workflow correctly', async () => {
      const workflowType = 'diagnosisSupport';
      const patientContext = {
        patientId: 'PAT-12345',
        symptoms: ['headache', 'blurred vision']
      };

      const result = await clinicalWorkflowService.executeWorkflow(workflowType, patientContext);

      expect(result).toBeDefined();
      expect(result.workflowId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.result).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should execute treatment recommendation workflow correctly', async () => {
      const workflowType = 'treatmentRecommendation';
      const patientContext = {
        patientId: 'PAT-12345',
        condition: 'hypertension'
      };

      const result = await clinicalWorkflowService.executeWorkflow(workflowType, patientContext);

      expect(result).toBeDefined();
      expect(result.workflowId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.result).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should execute risk assessment workflow correctly', async () => {
      const workflowType = 'riskAssessment';
      const patientContext = {
        patientId: 'PAT-12345',
        riskFactors: ['smoking', 'family-history']
      };

      const result = await clinicalWorkflowService.executeWorkflow(workflowType, patientContext);

      expect(result).toBeDefined();
      expect(result.workflowId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.result).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should execute drug interaction workflow correctly', async () => {
      const workflowType = 'drugInteraction';
      const patientContext = {
        patientId: 'PAT-12345',
        medications: ['warfarin', 'aspirin']
      };

      const result = await clinicalWorkflowService.executeWorkflow(workflowType, patientContext);

      expect(result).toBeDefined();
      expect(result.workflowId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.result).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should execute clinical alert workflow correctly', async () => {
      const workflowType = 'clinicalAlert';
      const patientContext = {
        patientId: 'PAT-12345',
        vitalSigns: {
          bloodPressure: '190/110'
        }
      };

      const result = await clinicalWorkflowService.executeWorkflow(workflowType, patientContext);

      expect(result).toBeDefined();
      expect(result.workflowId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.result).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should throw an error for missing workflow type', async () => {
      const patientContext = {
        patientId: 'PAT-12345'
      };

      await expect(clinicalWorkflowService.executeWorkflow(null, patientContext))
        .rejects
        .toThrow('Workflow type is required');
    });

    test('should throw an error for missing patient context', async () => {
      const workflowType = 'diagnosisSupport';

      await expect(clinicalWorkflowService.executeWorkflow(workflowType, null))
        .rejects
        .toThrow('Patient context with patientId is required');
    });

    test('should throw an error for missing patient ID', async () => {
      const workflowType = 'diagnosisSupport';
      const patientContext = {
        symptoms: ['headache']
      };

      await expect(clinicalWorkflowService.executeWorkflow(workflowType, patientContext))
        .rejects
        .toThrow('Patient context with patientId is required');
    });

    test('should throw an error for unsupported workflow type', async () => {
      const workflowType = 'unsupported-workflow';
      const patientContext = {
        patientId: 'PAT-12345'
      };

      await expect(clinicalWorkflowService.executeWorkflow(workflowType, patientContext))
        .rejects
        .toThrow('Workflow type \'unsupported-workflow\' is not supported');
    });
  });

  describe('getWorkflowStatus', () => {
    test('should retrieve workflow status correctly', async () => {
      const workflowType = 'diagnosisSupport';
      const patientContext = {
        patientId: 'PAT-12345',
        symptoms: ['headache', 'blurred vision']
      };

      // Execute a workflow first
      const executionResult = await clinicalWorkflowService.executeWorkflow(workflowType, patientContext);

      // Check workflow status
      const status = clinicalWorkflowService.getWorkflowStatus(executionResult.workflowId);

      expect(status).toBeDefined();
      expect(status.workflowId).toBe(executionResult.workflowId);
      expect(status.type).toBe(workflowType);
      expect(status.status).toBe('completed');
      expect(status.steps.length).toBeGreaterThan(0);
    });

    test('should return null for non-existent workflow', () => {
      const status = clinicalWorkflowService.getWorkflowStatus('non-existent-workflow-id');
      expect(status).toBeNull();
    });
  });

  describe('getAvailableWorkflows', () => {
    test('should return available workflows', () => {
      const workflows = clinicalWorkflowService.getAvailableWorkflows();

      expect(workflows).toBeDefined();
      expect(Array.isArray(workflows)).toBe(true);
      expect(workflows).toContain('diagnosisSupport');
      expect(workflows).toContain('treatmentRecommendation');
      expect(workflows).toContain('riskAssessment');
      expect(workflows).toContain('drugInteraction');
      expect(workflows).toContain('clinicalAlert');
    });
  });

  describe('getWorkflowDefinition', () => {
    test('should retrieve workflow definition correctly', () => {
      const definition = clinicalWorkflowService.getWorkflowDefinition('diagnosisSupport');

      expect(definition).toBeDefined();
      expect(definition.name).toBe('Diagnosis Support Workflow');
      expect(definition.steps.length).toBeGreaterThan(0);
    });

    test('should return null for non-existent workflow definition', () => {
      const definition = clinicalWorkflowService.getWorkflowDefinition('non-existent-workflow');
      expect(definition).toBeNull();
    });
  });
});