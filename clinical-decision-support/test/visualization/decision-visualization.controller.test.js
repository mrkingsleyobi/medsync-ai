/**
 * Decision Visualization Controller Tests
 * Tests for the decision visualization controller
 */

const DecisionVisualizationController = require('../../src/visualization/decision-visualization.controller.js');

// Mock the DecisionVisualizationService
jest.mock('../../src/visualization/decision-visualization.service.js');

describe('Decision Visualization Controller', () => {
  let decisionVisualizationController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    decisionVisualizationController = new DecisionVisualizationController();
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

  describe('generateVisualization', () => {
    test('should generate a visualization', async () => {
      const componentType = 'recommendationConfidence';
      const data = { recommendations: [{ condition: 'hypertension', likelihood: 0.92 }] };
      const visualizationResult = {
        visualizationId: 'VIS-12345',
        status: 'completed',
        componentType: 'recommendationConfidence',
        result: { type: 'bar', data: {} },
        generationTime: 150
      };

      mockReq.body = { componentType, data };

      // Mock the service method
      decisionVisualizationController.decisionVisualizationService.generateVisualization.mockResolvedValue(visualizationResult);

      await decisionVisualizationController.generateVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Visualization generated successfully',
        visualizationId: visualizationResult.visualizationId,
        status: visualizationResult.status,
        componentType: visualizationResult.componentType,
        result: visualizationResult.result,
        generationTime: visualizationResult.generationTime
      });
    });

    test('should return 400 if component type is missing', async () => {
      mockReq.body = { data: {} };

      await decisionVisualizationController.generateVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Component type is required'
      });
    });

    test('should return 400 if data is missing', async () => {
      mockReq.body = { componentType: 'recommendationConfidence' };

      await decisionVisualizationController.generateVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Data is required for visualization'
      });
    });

    test('should return 400 if service throws component type error', async () => {
      const componentType = 'invalid-component';
      const data = { recommendations: [] };
      const errorMessage = 'Visualization component type \'invalid-component\' is not supported';

      mockReq.body = { componentType, data };

      // Mock the service method to throw an error
      decisionVisualizationController.decisionVisualizationService.generateVisualization.mockRejectedValue(new Error(errorMessage));

      await decisionVisualizationController.generateVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws other error', async () => {
      const componentType = 'recommendationConfidence';
      const data = { recommendations: [] };
      const errorMessage = 'Internal service error';

      mockReq.body = { componentType, data };

      // Mock the service method to throw an error
      decisionVisualizationController.decisionVisualizationService.generateVisualization.mockRejectedValue(new Error(errorMessage));

      await decisionVisualizationController.generateVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to generate visualization',
        message: errorMessage
      });
    });
  });

  describe('exportVisualization', () => {
    test('should export a visualization', async () => {
      const visualizationId = 'VIS-12345';
      const format = 'png';
      const exportResult = {
        visualizationId: 'VIS-12345',
        format: 'png',
        url: 'https://medisync.example.com/visualizations/VIS-12345.png',
        status: 'completed'
      };

      mockReq.params = { visualizationId };
      mockReq.query = { format };

      // Mock the service method
      decisionVisualizationController.decisionVisualizationService.exportVisualization.mockResolvedValue(exportResult);

      await decisionVisualizationController.exportVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Visualization exported successfully',
        visualizationId: exportResult.visualizationId,
        format: exportResult.format,
        url: exportResult.url,
        status: exportResult.status
      });
    });

    test('should return 404 if visualization is not found', async () => {
      const visualizationId = 'NON-EXISTENT';
      const format = 'png';
      const errorMessage = 'Visualization not found';

      mockReq.params = { visualizationId };
      mockReq.query = { format };

      // Mock the service method to throw an error
      decisionVisualizationController.decisionVisualizationService.exportVisualization.mockRejectedValue(new Error(errorMessage));

      await decisionVisualizationController.exportVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 400 if export format is not supported', async () => {
      const visualizationId = 'VIS-12345';
      const format = 'unsupported';
      const errorMessage = 'Export format \'unsupported\' is not supported';

      mockReq.params = { visualizationId };
      mockReq.query = { format };

      // Mock the service method to throw an error
      decisionVisualizationController.decisionVisualizationService.exportVisualization.mockRejectedValue(new Error(errorMessage));

      await decisionVisualizationController.exportVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 400 if visualization ID is missing', async () => {
      mockReq.params = {};

      await decisionVisualizationController.exportVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Visualization ID is required'
      });
    });

    test('should return 500 if service throws other error', async () => {
      const visualizationId = 'VIS-12345';
      const format = 'png';
      const errorMessage = 'Internal service error';

      mockReq.params = { visualizationId };
      mockReq.query = { format };

      // Mock the service method to throw an error
      decisionVisualizationController.decisionVisualizationService.exportVisualization.mockRejectedValue(new Error(errorMessage));

      await decisionVisualizationController.exportVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to export visualization',
        message: errorMessage
      });
    });
  });

  describe('getVisualizationStatus', () => {
    test('should retrieve visualization status', async () => {
      const visualizationId = 'VIS-12345';
      const status = {
        visualizationId: 'VIS-12345',
        componentType: 'recommendationConfidence',
        status: 'completed'
      };

      mockReq.params = { visualizationId };

      // Mock the service method
      decisionVisualizationController.decisionVisualizationService.getVisualizationStatus.mockReturnValue(status);

      await decisionVisualizationController.getVisualizationStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        status: status
      });
    });

    test('should return 404 if visualization is not found', async () => {
      const visualizationId = 'NON-EXISTENT';

      mockReq.params = { visualizationId };

      // Mock the service method to return null
      decisionVisualizationController.decisionVisualizationService.getVisualizationStatus.mockReturnValue(null);

      await decisionVisualizationController.getVisualizationStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Visualization not found'
      });
    });

    test('should return 400 if visualization ID is missing', async () => {
      mockReq.params = {};

      await decisionVisualizationController.getVisualizationStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Visualization ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const visualizationId = 'VIS-12345';
      const errorMessage = 'Service error';

      mockReq.params = { visualizationId };

      // Mock the service method to throw an error
      decisionVisualizationController.decisionVisualizationService.getVisualizationStatus.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await decisionVisualizationController.getVisualizationStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve visualization status',
        message: errorMessage
      });
    });
  });

  describe('getAvailableComponents', () => {
    test('should retrieve available visualization components', () => {
      const components = ['recommendationConfidence', 'riskAssessment', 'treatmentEffectiveness'];

      // Mock the service method
      decisionVisualizationController.decisionVisualizationService.getAvailableComponents.mockReturnValue(components);

      decisionVisualizationController.getAvailableComponents(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        components: components
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      decisionVisualizationController.decisionVisualizationService.getAvailableComponents.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      decisionVisualizationController.getAvailableComponents(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve available visualization components',
        message: errorMessage
      });
    });
  });

  describe('getComponentConfiguration', () => {
    test('should retrieve component configuration', () => {
      const componentType = 'recommendationConfidence';
      const configuration = {
        name: 'Recommendation Confidence Visualization',
        chartType: 'barChart'
      };

      mockReq.params = { componentType };

      // Mock the service method
      decisionVisualizationController.decisionVisualizationService.getComponentConfiguration.mockReturnValue(configuration);

      decisionVisualizationController.getComponentConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        configuration: configuration
      });
    });

    test('should return 404 if component configuration is not found', () => {
      const componentType = 'non-existent-component';

      mockReq.params = { componentType };

      // Mock the service method to return null
      decisionVisualizationController.decisionVisualizationService.getComponentConfiguration.mockReturnValue(null);

      decisionVisualizationController.getComponentConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Component configuration not found'
      });
    });

    test('should return 400 if component type is missing', () => {
      mockReq.params = {};

      decisionVisualizationController.getComponentConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Component type is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const componentType = 'recommendationConfidence';
      const errorMessage = 'Service error';

      mockReq.params = { componentType };

      // Mock the service method to throw an error
      decisionVisualizationController.decisionVisualizationService.getComponentConfiguration.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      decisionVisualizationController.getComponentConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve component configuration',
        message: errorMessage
      });
    });
  });
});