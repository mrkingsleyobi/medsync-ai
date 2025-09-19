/**
 * Research Visualization Controller Tests
 * Tests for the research visualization controller
 */

const ResearchVisualizationController = require('../../src/visualization/research-visualization.controller.js');

// Mock the ResearchVisualizationService
jest.mock('../../src/visualization/research-visualization.service.js');

describe('Research Visualization Controller', () => {
  let researchVisualizationController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    researchVisualizationController = new ResearchVisualizationController();
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
      const componentType = 'citationNetwork';
      const data = { citations: [{ paper: 'Paper A', citedBy: 'Paper B' }] };
      const visualizationResult = {
        visualizationId: 'VIS-12345',
        status: 'completed',
        componentType: 'citationNetwork',
        result: { type: 'network', data: {} },
        generationTime: 1500
      };

      mockReq.body = { componentType, data };

      // Mock the service method
      researchVisualizationController.researchVisualizationService.generateVisualization.mockResolvedValue(visualizationResult);

      await researchVisualizationController.generateVisualization(mockReq, mockRes);

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
      mockReq.body = { data: { citations: [] } };

      await researchVisualizationController.generateVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Component type is required'
      });
    });

    test('should return 400 if data is missing', async () => {
      mockReq.body = { componentType: 'citationNetwork' };

      await researchVisualizationController.generateVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Data is required for visualization'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const componentType = 'citationNetwork';
      const data = { citations: [{ paper: 'Paper A', citedBy: 'Paper B' }] };
      const errorMessage = 'Service error';

      mockReq.body = { componentType, data };

      // Mock the service method to throw an error
      researchVisualizationController.researchVisualizationService.generateVisualization.mockRejectedValue(new Error(errorMessage));

      await researchVisualizationController.generateVisualization(mockReq, mockRes);

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
      researchVisualizationController.researchVisualizationService.exportVisualization.mockResolvedValue(exportResult);

      await researchVisualizationController.exportVisualization(mockReq, mockRes);

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

    test('should return 400 if visualization ID is missing', async () => {
      mockReq.params = {};

      await researchVisualizationController.exportVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Visualization ID is required'
      });
    });

    test('should return 404 if visualization is not found', async () => {
      const visualizationId = 'NON-EXISTENT';
      const errorMessage = 'Visualization not found';

      mockReq.params = { visualizationId };

      // Mock the service method to throw an error
      researchVisualizationController.researchVisualizationService.exportVisualization.mockRejectedValue(new Error(errorMessage));

      await researchVisualizationController.exportVisualization(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws an error', async () => {
      const visualizationId = 'VIS-12345';
      const errorMessage = 'Service error';

      mockReq.params = { visualizationId };

      // Mock the service method to throw an error
      researchVisualizationController.researchVisualizationService.exportVisualization.mockRejectedValue(new Error(errorMessage));

      await researchVisualizationController.exportVisualization(mockReq, mockRes);

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
        componentType: 'citationNetwork',
        status: 'completed'
      };

      mockReq.params = { visualizationId };

      // Mock the service method
      researchVisualizationController.researchVisualizationService.getVisualizationStatus.mockReturnValue(status);

      await researchVisualizationController.getVisualizationStatus(mockReq, mockRes);

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
      researchVisualizationController.researchVisualizationService.getVisualizationStatus.mockReturnValue(null);

      await researchVisualizationController.getVisualizationStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Visualization not found'
      });
    });

    test('should return 400 if visualization ID is missing', async () => {
      mockReq.params = {};

      await researchVisualizationController.getVisualizationStatus(mockReq, mockRes);

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
      researchVisualizationController.researchVisualizationService.getVisualizationStatus.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await researchVisualizationController.getVisualizationStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve visualization status',
        message: errorMessage
      });
    });
  });

  describe('getAvailableComponents', () => {
    test('should retrieve available components', () => {
      const components = ['citationNetwork', 'researchTrends'];

      // Mock the service method
      researchVisualizationController.researchVisualizationService.getAvailableComponents.mockReturnValue(components);

      researchVisualizationController.getAvailableComponents(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        components: components
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      researchVisualizationController.researchVisualizationService.getAvailableComponents.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researchVisualizationController.getAvailableComponents(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve available visualization components',
        message: errorMessage
      });
    });
  });

  describe('getComponentConfiguration', () => {
    test('should retrieve component configuration', () => {
      const componentType = 'citationNetwork';
      const configuration = {
        name: 'Citation Network',
        description: 'Visualization of citation relationships between papers'
      };

      mockReq.params = { componentType };

      // Mock the service method
      researchVisualizationController.researchVisualizationService.getComponentConfiguration.mockReturnValue(configuration);

      researchVisualizationController.getComponentConfiguration(mockReq, mockRes);

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
      researchVisualizationController.researchVisualizationService.getComponentConfiguration.mockReturnValue(null);

      researchVisualizationController.getComponentConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Component configuration not found'
      });
    });

    test('should return 400 if component type is missing', () => {
      mockReq.params = {};

      researchVisualizationController.getComponentConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Component type is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const componentType = 'citationNetwork';
      const errorMessage = 'Service error';

      mockReq.params = { componentType };

      // Mock the service method to throw an error
      researchVisualizationController.researchVisualizationService.getComponentConfiguration.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researchVisualizationController.getComponentConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve component configuration',
        message: errorMessage
      });
    });
  });
});