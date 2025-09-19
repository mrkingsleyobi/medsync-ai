/**
 * Decision Visualization Service Tests
 * Tests for the decision visualization service
 */

const DecisionVisualizationService = require('../../src/visualization/decision-visualization.service.js');

describe('Decision Visualization Service', () => {
  let decisionVisualizationService;

  beforeEach(() => {
    decisionVisualizationService = new DecisionVisualizationService();
  });

  describe('generateVisualization', () => {
    test('should generate recommendation confidence visualization correctly', async () => {
      const componentType = 'recommendationConfidence';
      const data = {
        recommendations: [
          { condition: 'hypertension', likelihood: 0.92 },
          { condition: 'diabetes', likelihood: 0.78 },
          { treatment: 'ACE inhibitors', confidence: 0.85 }
        ]
      };

      const result = await decisionVisualizationService.generateVisualization(componentType, data);

      expect(result).toBeDefined();
      expect(result.visualizationId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.componentType).toBe(componentType);
      expect(result.result).toBeDefined();
      expect(result.result.type).toBe('bar');
      expect(result.generationTime).toBeGreaterThan(0);
    });

    test('should generate risk assessment visualization correctly', async () => {
      const componentType = 'riskAssessment';
      const data = {
        riskFactors: [
          { name: 'hypertension', score: 85 },
          { name: 'diabetes', score: 72 },
          { type: 'smoking', level: 65 }
        ]
      };

      const result = await decisionVisualizationService.generateVisualization(componentType, data);

      expect(result).toBeDefined();
      expect(result.visualizationId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.componentType).toBe(componentType);
      expect(result.result).toBeDefined();
      expect(result.result.type).toBe('radar');
      expect(result.generationTime).toBeGreaterThan(0);
    });

    test('should generate treatment effectiveness visualization correctly', async () => {
      const componentType = 'treatmentEffectiveness';
      const data = {
        treatments: [
          { name: 'ACE inhibitors', effectiveness: [0.6, 0.7, 0.8, 0.85] },
          { name: 'Beta blockers', effectiveness: [0.5, 0.6, 0.65, 0.7] }
        ],
        timePoints: ['Month 1', 'Month 2', 'Month 3', 'Month 4']
      };

      const result = await decisionVisualizationService.generateVisualization(componentType, data);

      expect(result).toBeDefined();
      expect(result.visualizationId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.componentType).toBe(componentType);
      expect(result.result).toBeDefined();
      expect(result.result.type).toBe('line');
      expect(result.generationTime).toBeGreaterThan(0);
    });

    test('should generate condition distribution visualization correctly', async () => {
      const componentType = 'conditionDistribution';
      const data = {
        conditions: [
          { name: 'hypertension', count: 45 },
          { name: 'diabetes', count: 32 },
          { name: 'heart disease', count: 28 }
        ]
      };

      const result = await decisionVisualizationService.generateVisualization(componentType, data);

      expect(result).toBeDefined();
      expect(result.visualizationId).toBeDefined();
      expect(result.status).toBe('completed');
      expect(result.componentType).toBe(componentType);
      expect(result.result).toBeDefined();
      expect(result.result.type).toBe('pie');
      expect(result.generationTime).toBeGreaterThan(0);
    });

    test('should throw an error for missing component type', async () => {
      const data = { recommendations: [] };

      await expect(decisionVisualizationService.generateVisualization(null, data))
        .rejects
        .toThrow('Component type is required');
    });

    test('should throw an error for missing data', async () => {
      const componentType = 'recommendationConfidence';

      await expect(decisionVisualizationService.generateVisualization(componentType, null))
        .rejects
        .toThrow('Data is required for visualization');
    });

    test('should throw an error for unsupported component type', async () => {
      const componentType = 'unsupported-component';
      const data = { recommendations: [] };

      await expect(decisionVisualizationService.generateVisualization(componentType, data))
        .rejects
        .toThrow('Visualization component type \'unsupported-component\' is not supported');
    });
  });

  describe('exportVisualization', () => {
    test('should export visualization correctly', async () => {
      const componentType = 'recommendationConfidence';
      const data = { recommendations: [{ condition: 'hypertension', likelihood: 0.92 }] };

      // Generate a visualization first
      const generationResult = await decisionVisualizationService.generateVisualization(componentType, data);

      // Export the visualization
      const result = await decisionVisualizationService.exportVisualization(generationResult.visualizationId, 'png');

      expect(result).toBeDefined();
      expect(result.visualizationId).toBe(generationResult.visualizationId);
      expect(result.format).toBe('png');
      expect(result.url).toBeDefined();
      expect(result.status).toBe('completed');
    });

    test('should throw an error for non-existent visualization', async () => {
      await expect(decisionVisualizationService.exportVisualization('non-existent-id', 'png'))
        .rejects
        .toThrow('Visualization not found');
    });

    test('should throw an error for unsupported export format', async () => {
      const componentType = 'recommendationConfidence';
      const data = { recommendations: [{ condition: 'hypertension', likelihood: 0.92 }] };

      // Generate a visualization first
      const generationResult = await decisionVisualizationService.generateVisualization(componentType, data);

      await expect(decisionVisualizationService.exportVisualization(generationResult.visualizationId, 'unsupported'))
        .rejects
        .toThrow('Export format \'unsupported\' is not supported');
    });
  });

  describe('getVisualizationStatus', () => {
    test('should retrieve visualization status correctly', async () => {
      const componentType = 'recommendationConfidence';
      const data = { recommendations: [{ condition: 'hypertension', likelihood: 0.92 }] };

      // Generate a visualization first
      const generationResult = await decisionVisualizationService.generateVisualization(componentType, data);

      // Check visualization status
      const status = decisionVisualizationService.getVisualizationStatus(generationResult.visualizationId);

      expect(status).toBeDefined();
      expect(status.visualizationId).toBe(generationResult.visualizationId);
      expect(status.componentType).toBe(componentType);
      expect(status.status).toBe('completed');
    });

    test('should return null for non-existent visualization', () => {
      const status = decisionVisualizationService.getVisualizationStatus('non-existent-id');
      expect(status).toBeNull();
    });
  });

  describe('getAvailableComponents', () => {
    test('should return available visualization components', () => {
      const components = decisionVisualizationService.getAvailableComponents();

      expect(components).toBeDefined();
      expect(Array.isArray(components)).toBe(true);
      expect(components).toContain('recommendationConfidence');
      expect(components).toContain('riskAssessment');
      expect(components).toContain('treatmentEffectiveness');
      expect(components).toContain('conditionDistribution');
      expect(components).toContain('vitalSignsTrend');
      expect(components).toContain('drugInteractionNetwork');
      expect(components).toContain('patientOutcomeCorrelation');
      expect(components).toContain('treatmentPathway');
    });
  });

  describe('getComponentConfiguration', () => {
    test('should retrieve component configuration correctly', () => {
      const configuration = decisionVisualizationService.getComponentConfiguration('recommendationConfidence');

      expect(configuration).toBeDefined();
      expect(configuration.name).toBe('Recommendation Confidence Visualization');
      expect(configuration.chartType).toBe('barChart');
      expect(configuration.dataType).toBe('recommendations');
    });

    test('should return null for non-existent component configuration', () => {
      const configuration = decisionVisualizationService.getComponentConfiguration('non-existent-component');
      expect(configuration).toBeNull();
    });
  });
});