/**
 * Research Visualization Service Tests
 * Tests for the research visualization service
 */

const ResearchVisualizationService = require('../../src/visualization/research-visualization.service.js');

describe('Research Visualization Service', () => {
  let researchVisualizationService;

  beforeEach(() => {
    researchVisualizationService = new ResearchVisualizationService();
  });

  describe('generateVisualization', () => {
    test('should generate a visualization correctly', async () => {
      const componentType = 'citationNetwork';
      const data = {
        citations: [
          { paper: 'Paper A', citedBy: 'Paper B', count: 5 },
          { paper: 'Paper B', citedBy: 'Paper C', count: 3 }
        ]
      };

      const result = await researchVisualizationService.generateVisualization(componentType, data);

      expect(result).toBeDefined();
      expect(result.visualizationId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.componentType).toBe(componentType);
      expect(result.result).toBeDefined();
      expect(result.generationTime).toBeGreaterThan(0);
    });

    test('should throw an error for missing component type', async () => {
      const data = { citations: [] };

      await expect(researchVisualizationService.generateVisualization(null, data))
        .rejects
        .toThrow('Component type is required');
    });

    test('should throw an error for missing data', async () => {
      const componentType = 'citationNetwork';

      await expect(researchVisualizationService.generateVisualization(componentType, null))
        .rejects
        .toThrow('Data is required for visualization');
    });

    test('should throw an error for unsupported component type', async () => {
      const componentType = 'unsupported-component';
      const data = { citations: [] };

      await expect(researchVisualizationService.generateVisualization(componentType, data))
        .rejects
        .toThrow("Visualization component type 'unsupported-component' is not supported");
    });
  });

  describe('exportVisualization', () => {
    test('should export a visualization correctly', async () => {
      // First generate a visualization to export
      const componentType = 'citationNetwork';
      const data = { citations: [{ paper: 'Paper A', citedBy: 'Paper B' } ] };
      const generationResult = await researchVisualizationService.generateVisualization(componentType, data);

      const result = await researchVisualizationService.exportVisualization(generationResult.visualizationId, 'png');

      expect(result).toBeDefined();
      expect(result.visualizationId).toBe(generationResult.visualizationId);
      expect(result.format).toBe('png');
      expect(result.url).toBeDefined();
      expect(result.status).toBe('completed');
    });

    test('should throw an error for non-existent visualization', async () => {
      await expect(researchVisualizationService.exportVisualization('non-existent-id', 'png'))
        .rejects
        .toThrow('Visualization not found');
    });

    test('should throw an error for unsupported export format', async () => {
      // First generate a visualization to export
      const componentType = 'citationNetwork';
      const data = { citations: [{ paper: 'Paper A', citedBy: 'Paper B' } ] };
      const generationResult = await researchVisualizationService.generateVisualization(componentType, data);

      await expect(researchVisualizationService.exportVisualization(generationResult.visualizationId, 'unsupported-format'))
        .rejects
        .toThrow("Export format 'unsupported-format' is not supported");
    });
  });

  describe('getVisualizationStatus', () => {
    test('should retrieve visualization status correctly', async () => {
      const componentType = 'citationNetwork';
      const data = { citations: [{ paper: 'Paper A', citedBy: 'Paper B' } ] };
      const generationResult = await researchVisualizationService.generateVisualization(componentType, data);

      const status = researchVisualizationService.getVisualizationStatus(generationResult.visualizationId);

      expect(status).toBeDefined();
      expect(status.visualizationId).toBe(generationResult.visualizationId);
      expect(status.componentType).toBe(componentType);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent visualization', () => {
      const status = researchVisualizationService.getVisualizationStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getAvailableComponents', () => {
    test('should return available visualization components', () => {
      const components = researchVisualizationService.getAvailableComponents();

      expect(components).toBeDefined();
      expect(Array.isArray(components)).toBe(true);
      expect(components).toContain('citationNetwork');
      expect(components).toContain('researchTrends');
      expect(components).toContain('collaborationMap');
      expect(components).toContain('impactMetrics');
      expect(components).toContain('trialMatchingResults');
      expect(components).toContain('literatureEntities');
      expect(components).toContain('literatureTopics');
      expect(components).toContain('literatureSentiment');
    });
  });

  describe('getComponentConfiguration', () => {
    test('should retrieve component configuration correctly', () => {
      const configuration = researchVisualizationService.getComponentConfiguration('citationNetwork');

      expect(configuration).toBeDefined();
      expect(configuration.name).toBe('Citation Network Visualization');
      expect(configuration.description).toBeDefined();
    });

    test('should return null for non-existent component configuration', () => {
      const configuration = researchVisualizationService.getComponentConfiguration('non-existent-component');
      expect(configuration).toBeNull();
    });
  });
});