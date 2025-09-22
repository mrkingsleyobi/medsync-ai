/**
 * Clinical Decision Support Service Tests
 * Tests for the clinical decision support service
 */

const ClinicalDecisionSupportService = require('../../src/services/decision-support.service.js');

describe('Clinical Decision Support Service', () => {
  let decisionSupportService;

  beforeEach(() => {
    decisionSupportService = new ClinicalDecisionSupportService();
  });

  describe('generateDecisionSupport', () => {
    test('should generate diagnosis support decision correctly', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        symptoms: ['blurred_vision', 'increased_thirst', 'frequent_urination']
      };

      const decisionConfig = {
        decisionType: 'diagnosis-support'
      };

      const result = await decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      expect(result).toBeDefined();
      expect(result.decisionId).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should generate treatment recommendation decision correctly', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        conditions: ['hypertension']
      };

      const decisionConfig = {
        decisionType: 'treatment-recommendation'
      };

      const result = await decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      expect(result).toBeDefined();
      expect(result.decisionId).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should generate risk assessment decision correctly', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        vitalSigns: {
          bloodPressure: { systolic: 160, diastolic: 100 },
          heartRate: 85
        },
        riskFactors: ['smoking', 'family_history']
      };

      const decisionConfig = {
        decisionType: 'risk-assessment'
      };

      const result = await decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      expect(result).toBeDefined();
      expect(result.decisionId).toBeDefined();
      expect(result.alerts.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should generate drug interaction decision correctly', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        medications: [
          { name: 'warfarin', dosage: '5mg' },
          { name: 'aspirin', dosage: '81mg' }
        ]
      };

      const decisionConfig = {
        decisionType: 'drug-interaction'
      };

      const result = await decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      expect(result).toBeDefined();
      expect(result.decisionId).toBeDefined();
      expect(result.alerts.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    });

    test('should generate clinical alert decision correctly', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        vitalSigns: {
          bloodPressure: { systolic: 190, diastolic: 110 },
          heartRate: 160
        }
      };

      const decisionConfig = {
        decisionType: 'clinical-alert'
      };

      const result = await decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      expect(result).toBeDefined();
      expect(result.decisionId).toBeDefined();
      expect(result.alerts.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    });

    test('should throw an error for missing patient context', async () => {
      await expect(decisionSupportService.generateDecisionSupport(null))
        .rejects
        .toThrow('Patient context is required');
    });

    test('should throw an error for missing patient ID', async () => {
      const patientContext = {
        symptoms: ['headache']
      };

      await expect(decisionSupportService.generateDecisionSupport(patientContext))
        .rejects
        .toThrow('Patient context with patientId is required');
    });

    test('should throw an error for invalid decision type', async () => {
      const patientContext = {
        patientId: 'PAT-12345'
      };

      const decisionConfig = {
        decisionType: 'invalid-decision-type'
      };

      await expect(decisionSupportService.generateDecisionSupport(patientContext, decisionConfig))
        .rejects
        .toThrow('No decision model available for type: invalid-decision-type');
    });
  });

  describe('getDecisionHistory', () => {
    test('should track decision history correctly', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        symptoms: ['blurred_vision', 'increased_thirst', 'frequent_urination']
      };

      const decisionConfig = {
        decisionType: 'diagnosis-support'
      };

      // Generate a decision
      await decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      // Check decision history
      const history = decisionSupportService.getDecisionHistory('PAT-12345');
      expect(history.length).toBe(1);
      expect(history[0].patientId).toBe('PAT-12345');
      expect(history[0].recommendations.length).toBeGreaterThan(0);
    });

    test('should return empty array for patient with no decisions', () => {
      const history = decisionSupportService.getDecisionHistory('PAT-99999');
      expect(history).toEqual([]);
    });
  });

  describe('getActiveAlerts', () => {
    test('should generate and manage alerts correctly', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        vitalSigns: {
          bloodPressure: { systolic: 190, diastolic: 110 }
        }
      };

      const decisionConfig = {
        decisionType: 'clinical-alert'
      };

      // Generate a decision that should create an alert
      await decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      // Check active alerts
      const activeAlerts = decisionSupportService.getActiveAlerts();
      expect(activeAlerts.length).toBeGreaterThan(0);
      expect(activeAlerts[0].patientId).toBe('PAT-12345');
      expect(activeAlerts[0].priority).toBe('critical');
    });

    test('should return empty array when no active alerts', () => {
      // Acknowledge any existing alerts
      const activeAlerts = decisionSupportService.getActiveAlerts();
      activeAlerts.forEach(alert => {
        decisionSupportService.acknowledgeAlert(alert.alertId);
      });

      // Check that there are no active alerts
      const updatedActiveAlerts = decisionSupportService.getActiveAlerts();
      expect(updatedActiveAlerts).toEqual([]);
    });
  });

  describe('acknowledgeAlert', () => {
    test('should acknowledge an alert correctly', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        vitalSigns: {
          bloodPressure: { systolic: 190, diastolic: 110 }
        }
      };

      const decisionConfig = {
        decisionType: 'clinical-alert'
      };

      // Generate a decision that should create an alert
      await decisionSupportService.generateDecisionSupport(patientContext, decisionConfig);

      // Check active alerts
      const activeAlerts = decisionSupportService.getActiveAlerts();
      expect(activeAlerts.length).toBeGreaterThan(0);

      // Acknowledge the alert
      const alertId = activeAlerts[0].alertId;
      const acknowledged = decisionSupportService.acknowledgeAlert(alertId);
      expect(acknowledged).toBe(true);

      // Check that the alert is no longer active
      const updatedActiveAlerts = decisionSupportService.getActiveAlerts();
      expect(updatedActiveAlerts.length).toBe(0);
    });

    test('should return false for non-existent alert', () => {
      const acknowledged = decisionSupportService.acknowledgeAlert('non-existent-alert-id');
      expect(acknowledged).toBe(false);
    });
  });

  describe('getAvailableDecisionModels', () => {
    test('should return available decision models', () => {
      const models = decisionSupportService.getAvailableDecisionModels();
      expect(models.some(model => model.type === 'diagnosis-support')).toBe(true);
      expect(models.some(model => model.type === 'treatment-recommendation')).toBe(true);
      expect(models.some(model => model.type === 'risk-assessment')).toBe(true);
      expect(models.some(model => model.type === 'drug-interaction')).toBe(true);
      expect(models.some(model => model.type === 'clinical-alert')).toBe(true);
    });
  });

  describe('getClinicalGuidelines', () => {
    test('should retrieve clinical guidelines correctly', () => {
      const hypertensionGuidelines = decisionSupportService.getClinicalGuidelines('hypertension');
      expect(hypertensionGuidelines).toBeDefined();
      expect(hypertensionGuidelines.condition).toBe('hypertension');
      expect(hypertensionGuidelines.evidenceLevel).toBe('A');

      const diabetesGuidelines = decisionSupportService.getClinicalGuidelines('diabetes');
      expect(diabetesGuidelines).toBeDefined();
      expect(diabetesGuidelines.condition).toBe('diabetes');
      expect(diabetesGuidelines.evidenceLevel).toBe('A');
    });

    test('should return null for non-existent guidelines', () => {
      const nonExistentGuidelines = decisionSupportService.getClinicalGuidelines('non-existent-condition');
      expect(nonExistentGuidelines).toBeNull();
    });
  });

  describe('registerDecisionModel', () => {
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

      decisionSupportService.registerDecisionModel('custom-test-model', customModel);

      const availableModels = decisionSupportService.getAvailableDecisionModels();
      expect(availableModels.some(model => model.type === 'custom-test-model')).toBe(true);
    });

    test('should throw an error for invalid decision model registration', () => {
      expect(() => {
        decisionSupportService.registerDecisionModel(null, {});
      }).toThrow('Type and model are required');

      expect(() => {
        decisionSupportService.registerDecisionModel('test-model', null);
      }).toThrow('Type and model are required');

      expect(() => {
        decisionSupportService.registerDecisionModel('test-model', {});
      }).toThrow('Model must have a process function');
    });
  });
});