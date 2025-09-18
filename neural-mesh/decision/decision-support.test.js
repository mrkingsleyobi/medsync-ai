// MediSync Healthcare AI Platform - Decision Support Tests
// This file contains tests for the decision support manager implementation

const DecisionSupportManager = require('./decision-support-manager.js');

// Mock neural mesh for testing
class MockNeuralMesh {
  constructor() {
    // Mock implementation
  }
}

describe('Decision Support Manager Tests', () => {
  let decisionSupportManager;
  let mockNeuralMesh;

  beforeEach(() => {
    mockNeuralMesh = new MockNeuralMesh();
    decisionSupportManager = new DecisionSupportManager(mockNeuralMesh);
  });

  test('should initialize decision support manager with default configuration', () => {
    expect(decisionSupportManager).toBeDefined();
    expect(decisionSupportManager.decisionModels.size).toBeGreaterThan(0);
    expect(decisionSupportManager.clinicalGuidelines.size).toBeGreaterThan(0);
  });

  test('should generate diagnosis support decision correctly', async () => {
    const patientContext = {
      patientId: 'PAT-12345',
      symptoms: ['headache', 'blurred vision']
    };

    const decisionConfig = {
      decisionType: 'diagnosis-support'
    };

    const result = await decisionSupportManager.generateDecisionSupport(patientContext, decisionConfig);

    expect(result).toBeDefined();
    expect(result.decisionId).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  test('should generate treatment recommendation decision correctly', async () => {
    const patientContext = {
      patientId: 'PAT-12345',
      condition: 'hypertension'
    };

    const decisionConfig = {
      decisionType: 'treatment-recommendation'
    };

    const result = await decisionSupportManager.generateDecisionSupport(patientContext, decisionConfig);

    expect(result).toBeDefined();
    expect(result.decisionId).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  test('should generate risk assessment decision correctly', async () => {
    const patientContext = {
      patientId: 'PAT-12345',
      vitalSigns: {
        bloodPressure: '160/100',
        heartRate: 85
      },
      riskFactors: ['smoking', 'family-history']
    };

    const decisionConfig = {
      decisionType: 'risk-assessment'
    };

    const result = await decisionSupportManager.generateDecisionSupport(patientContext, decisionConfig);

    expect(result).toBeDefined();
    expect(result.decisionId).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  test('should generate drug interaction decision correctly', async () => {
    const patientContext = {
      patientId: 'PAT-12345',
      medications: ['warfarin', 'aspirin']
    };

    const decisionConfig = {
      decisionType: 'drug-interaction'
    };

    const result = await decisionSupportManager.generateDecisionSupport(patientContext, decisionConfig);

    expect(result).toBeDefined();
    expect(result.decisionId).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.alerts.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.9);
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  test('should generate clinical alert decision correctly', async () => {
    const patientContext = {
      patientId: 'PAT-12345',
      vitalSigns: {
        bloodPressure: '190/110',
        heartRate: 160
      }
    };

    const decisionConfig = {
      decisionType: 'clinical-alert'
    };

    const result = await decisionSupportManager.generateDecisionSupport(patientContext, decisionConfig);

    expect(result).toBeDefined();
    expect(result.decisionId).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.alerts.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.9);
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  test('should register custom decision model correctly', () => {
    const customModel = {
      name: 'Custom Test Model',
      description: 'A custom test model for decision support',
      version: '1.0.0',
      confidenceThreshold: 0.8,
      process: async (patientContext, config) => {
        return {
          recommendations: [{ condition: 'test-condition', likelihood: 0.85, recommendation: 'Test recommendation', priority: 'medium' }],
          alerts: [],
          confidence: 0.85,
          evidence: ['Test evidence']
        };
      }
    };

    decisionSupportManager.registerDecisionModel('custom-test-model', customModel);

    const availableModels = decisionSupportManager.getAvailableDecisionModels();
    expect(availableModels).toContain('custom-test-model');
  });

  test('should track decision history correctly', async () => {
    const patientContext = {
      patientId: 'PAT-12345',
      symptoms: ['headache', 'blurred vision']
    };

    const decisionConfig = {
      decisionType: 'diagnosis-support'
    };

    // Generate a decision
    await decisionSupportManager.generateDecisionSupport(patientContext, decisionConfig);

    // Check decision history
    const history = decisionSupportManager.getDecisionHistory('PAT-12345');
    expect(history.length).toBe(1);
    expect(history[0].patientId).toBe('PAT-12345');
    expect(history[0].status).toBe('completed');
    expect(history[0].recommendations.length).toBeGreaterThan(0);
  });

  test('should generate and manage alerts correctly', async () => {
    const patientContext = {
      patientId: 'PAT-12345',
      vitalSigns: {
        bloodPressure: '190/110'
      }
    };

    const decisionConfig = {
      decisionType: 'clinical-alert'
    };

    // Generate a decision that should create an alert
    await decisionSupportManager.generateDecisionSupport(patientContext, decisionConfig);

    // Check active alerts
    const activeAlerts = decisionSupportManager.getActiveAlerts();
    expect(activeAlerts.length).toBeGreaterThan(0);
    expect(activeAlerts[0].patientId).toBe('PAT-12345');
    expect(activeAlerts[0].severity).toBe('critical');

    // Acknowledge the alert
    const alertId = activeAlerts[0].alertId;
    const acknowledged = decisionSupportManager.acknowledgeAlert(alertId);
    expect(acknowledged).toBe(true);

    // Check that the alert is no longer active
    const updatedActiveAlerts = decisionSupportManager.getActiveAlerts();
    expect(updatedActiveAlerts.length).toBe(0);
  });

  test('should retrieve clinical guidelines correctly', () => {
    const hypertensionGuidelines = decisionSupportManager.getClinicalGuidelines('hypertension');
    expect(hypertensionGuidelines).toBeDefined();
    expect(hypertensionGuidelines.condition).toBe('hypertension');
    expect(hypertensionGuidelines.guidelines.length).toBeGreaterThan(0);
    expect(hypertensionGuidelines.evidenceLevel).toBe('A');

    const nonExistentGuidelines = decisionSupportManager.getClinicalGuidelines('non-existent-condition');
    expect(nonExistentGuidelines).toBeNull();
  });

  test('should handle edge cases gracefully', async () => {
    // Test with empty patient context
    const emptyContext = {
      patientId: 'PAT-12345'
    };

    const result = await decisionSupportManager.generateDecisionSupport(emptyContext, {});
    expect(result).toBeDefined();
    expect(result.status).toBe('completed');

    // Test with invalid decision type
    const invalidContext = {
      patientId: 'PAT-12345'
    };

    const invalidConfig = {
      decisionType: 'invalid-decision-type'
    };

    await expect(decisionSupportManager.generateDecisionSupport(invalidContext, invalidConfig))
      .rejects
      .toThrow('No decision model available for type: invalid-decision-type');
  });
});