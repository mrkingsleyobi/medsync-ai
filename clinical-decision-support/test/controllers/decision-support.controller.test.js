/**
 * Clinical Decision Support Controller Tests
 * Tests for the clinical decision support controller
 */

const ClinicalDecisionSupportController = require('../../src/controllers/decision-support.controller.js');

// Mock the ClinicalDecisionSupportService
jest.mock('../../src/services/decision-support.service.js');

describe('Clinical Decision Support Controller', () => {
  let clinicalDecisionSupportController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    clinicalDecisionSupportController = new ClinicalDecisionSupportController();
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

  describe('generateDecisionSupport', () => {
    test('should generate clinical decision support', async () => {
      const patientContext = {
        patientId: 'PAT-12345',
        symptoms: ['headache', 'blurred vision']
      };
      const decisionConfig = {
        decisionType: 'diagnosis-support'
      };
      const decisionResult = {
        decisionId: 'DEC-12345',
        recommendations: [{ condition: 'hypertension', likelihood: 0.85 }],
        alerts: [],
        confidence: 0.85,
        evidence: ['Evidence 1'],
        processingTime: 150
      };

      mockReq.body = { patientContext, decisionConfig };

      // Mock the service method
      clinicalDecisionSupportController.decisionSupportService.generateDecisionSupport.mockResolvedValue(decisionResult);

      await clinicalDecisionSupportController.generateDecisionSupport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Clinical decision support generated successfully',
        decisionId: decisionResult.decisionId,
        recommendations: decisionResult.recommendations,
        alerts: decisionResult.alerts,
        confidence: decisionResult.confidence,
        evidence: decisionResult.evidence,
        processingTime: decisionResult.processingTime
      });
    });

    test('should return 400 if patient context is missing', async () => {
      mockReq.body = {};

      await clinicalDecisionSupportController.generateDecisionSupport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Patient context is required'
      });
    });

    test('should return 400 if patient ID is missing', async () => {
      mockReq.body = { patientContext: { symptoms: ['headache'] } };

      await clinicalDecisionSupportController.generateDecisionSupport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Patient ID is required in patient context'
      });
    });

    test('should return 400 if service throws patient context error', async () => {
      const patientContext = { patientId: 'PAT-12345' };
      const errorMessage = 'Patient context with patientId is required';
      const expectedClientError = 'Invalid patient context provided';

      mockReq.body = { patientContext };

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.generateDecisionSupport.mockRejectedValue(new Error(errorMessage));

      await clinicalDecisionSupportController.generateDecisionSupport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expectedClientError
      });
    });

    test('should return 400 if service throws decision model error', async () => {
      const patientContext = { patientId: 'PAT-12345' };
      const decisionConfig = { decisionType: 'invalid-type' };
      const errorMessage = 'No decision model available for type: invalid-type';
      const expectedClientError = 'Invalid decision model type requested';

      mockReq.body = { patientContext, decisionConfig };

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.generateDecisionSupport.mockRejectedValue(new Error(errorMessage));

      await clinicalDecisionSupportController.generateDecisionSupport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expectedClientError
      });
    });

    test('should return 500 if service throws other error', async () => {
      const patientContext = { patientId: 'PAT-12345' };
      const decisionConfig = { decisionType: 'diagnosis-support' };
      const errorMessage = 'Internal service error';

      mockReq.body = { patientContext, decisionConfig };

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.generateDecisionSupport.mockRejectedValue(new Error(errorMessage));

      await clinicalDecisionSupportController.generateDecisionSupport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to generate clinical decision support',
        message: errorMessage
      });
    });
  });

  describe('getDecisionHistory', () => {
    test('should retrieve decision history for a patient', async () => {
      const patientId = 'PAT-12345';
      const history = [
        {
          decisionId: 'DEC-12345',
          patientId: 'PAT-12345',
          status: 'completed',
          createdAt: '2023-01-01T00:00:00Z',
          completedAt: '2023-01-01T00:00:01Z',
          recommendations: [{ condition: 'hypertension', likelihood: 0.85 }],
          confidence: 0.85
        }
      ];

      mockReq.params = { patientId };

      // Mock the service method
      clinicalDecisionSupportController.decisionSupportService.getDecisionHistory.mockReturnValue(history);

      await clinicalDecisionSupportController.getDecisionHistory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: history.length,
        history: history
      });
    });

    test('should return 400 if patient ID is missing', async () => {
      mockReq.params = {};

      await clinicalDecisionSupportController.getDecisionHistory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Patient ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const patientId = 'PAT-12345';
      const errorMessage = 'Service error';

      mockReq.params = { patientId };

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.getDecisionHistory.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await clinicalDecisionSupportController.getDecisionHistory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve decision history',
        message: errorMessage
      });
    });
  });

  describe('getActiveAlerts', () => {
    test('should retrieve active alerts', async () => {
      const alerts = [
        {
          alertId: 'ALERT-12345',
          patientId: 'PAT-12345',
          type: 'decision-support',
          severity: 'high',
          message: 'High blood pressure detected',
          createdAt: '2023-01-01T00:00:00Z'
        }
      ];

      // Mock the service method
      clinicalDecisionSupportController.decisionSupportService.getActiveAlerts.mockReturnValue(alerts);

      await clinicalDecisionSupportController.getActiveAlerts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: alerts.length,
        alerts: alerts
      });
    });

    test('should return 500 if service throws an error', async () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.getActiveAlerts.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await clinicalDecisionSupportController.getActiveAlerts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve active alerts',
        message: errorMessage
      });
    });
  });

  describe('acknowledgeAlert', () => {
    test('should acknowledge an alert successfully', async () => {
      const alertId = 'ALERT-12345';

      mockReq.params = { alertId };

      // Mock the service method
      clinicalDecisionSupportController.decisionSupportService.acknowledgeAlert.mockReturnValue(true);

      await clinicalDecisionSupportController.acknowledgeAlert(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert acknowledged successfully'
      });
    });

    test('should return 404 if alert is not found', async () => {
      const alertId = 'NON-EXISTENT';

      mockReq.params = { alertId };

      // Mock the service method
      clinicalDecisionSupportController.decisionSupportService.acknowledgeAlert.mockReturnValue(false);

      await clinicalDecisionSupportController.acknowledgeAlert(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Alert not found'
      });
    });

    test('should return 400 if alert ID is missing', async () => {
      mockReq.params = {};

      await clinicalDecisionSupportController.acknowledgeAlert(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const alertId = 'ALERT-12345';
      const errorMessage = 'Service error';

      mockReq.params = { alertId };

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.acknowledgeAlert.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await clinicalDecisionSupportController.acknowledgeAlert(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to acknowledge alert',
        message: errorMessage
      });
    });
  });

  describe('getAvailableDecisionModels', () => {
    test('should retrieve available decision models', () => {
      const models = ['diagnosis-support', 'treatment-recommendation', 'risk-assessment'];

      // Mock the service method
      clinicalDecisionSupportController.decisionSupportService.getAvailableDecisionModels.mockReturnValue(models);

      clinicalDecisionSupportController.getAvailableDecisionModels(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        models: models
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.getAvailableDecisionModels.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      clinicalDecisionSupportController.getAvailableDecisionModels(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve available decision models',
        message: errorMessage
      });
    });
  });

  describe('getClinicalGuidelines', () => {
    test('should retrieve clinical guidelines for a condition', () => {
      const condition = 'hypertension';
      const guidelines = {
        condition: 'hypertension',
        guidelines: ['First-line treatment: ACE inhibitors or ARBs'],
        evidenceLevel: 'A'
      };

      mockReq.params = { condition };

      // Mock the service method
      clinicalDecisionSupportController.decisionSupportService.getClinicalGuidelines.mockReturnValue(guidelines);

      clinicalDecisionSupportController.getClinicalGuidelines(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        guidelines: guidelines
      });
    });

    test('should return 404 if guidelines are not found', () => {
      const condition = 'non-existent-condition';

      mockReq.params = { condition };

      // Mock the service method to return null
      clinicalDecisionSupportController.decisionSupportService.getClinicalGuidelines.mockReturnValue(null);

      clinicalDecisionSupportController.getClinicalGuidelines(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Clinical guidelines not found for the specified condition'
      });
    });

    test('should return 400 if condition is missing', () => {
      mockReq.params = {};

      clinicalDecisionSupportController.getClinicalGuidelines(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Condition is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const condition = 'hypertension';
      const errorMessage = 'Service error';

      mockReq.params = { condition };

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.getClinicalGuidelines.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      clinicalDecisionSupportController.getClinicalGuidelines(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve clinical guidelines',
        message: errorMessage
      });
    });
  });

  describe('registerCustomDecisionModel', () => {
    test('should register a custom decision model', async () => {
      const type = 'custom-model';
      const model = {
        name: 'Custom Model',
        description: 'A custom decision model',
        version: '1.0.0',
        confidenceThreshold: 0.8,
        process: jest.fn()
      };

      mockReq.body = { type, model };

      // Mock the service method
      clinicalDecisionSupportController.decisionSupportService.registerDecisionModel.mockReturnValue();

      await clinicalDecisionSupportController.registerCustomDecisionModel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Custom decision model registered successfully'
      });
    });

    test('should return 400 if type is missing', async () => {
      const model = {
        name: 'Custom Model',
        description: 'A custom decision model',
        version: '1.0.0',
        confidenceThreshold: 0.8,
        process: jest.fn()
      };

      mockReq.body = { model };

      await clinicalDecisionSupportController.registerCustomDecisionModel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Type and model are required'
      });
    });

    test('should return 400 if model is missing', async () => {
      const type = 'custom-model';

      mockReq.body = { type };

      await clinicalDecisionSupportController.registerCustomDecisionModel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Type and model are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const type = 'custom-model';
      const model = {
        name: 'Custom Model',
        description: 'A custom decision model',
        version: '1.0.0',
        confidenceThreshold: 0.8,
        process: jest.fn()
      };
      const errorMessage = 'Service error';

      mockReq.body = { type, model };

      // Mock the service method to throw an error
      clinicalDecisionSupportController.decisionSupportService.registerDecisionModel.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await clinicalDecisionSupportController.registerCustomDecisionModel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to register custom decision model',
        message: errorMessage
      });
    });
  });
});