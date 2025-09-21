/**
 * Scalability Testing Service Tests
 * Unit tests for the scalability testing service
 */

const ScalabilityTestingService = require('../scalability-testing.service.js');

describe('ScalabilityTestingService', () => {
  let scalabilityTestingService;

  beforeEach(() => {
    scalabilityTestingService = new ScalabilityTestingService();

    // Mock the simulation methods to resolve immediately
    scalabilityTestingService._simulateDeployment = jest.fn().mockResolvedValue();
    scalabilityTestingService._simulateCleanup = jest.fn().mockResolvedValue();
    scalabilityTestingService._simulateResourceConfiguration = jest.fn().mockResolvedValue();
    scalabilityTestingService._simulateAutoScalingConfiguration = jest.fn().mockResolvedValue();
    scalabilityTestingService._runLoadTest = jest.fn().mockResolvedValue({
      duration: 1,
      requests: 100,
      successes: 95,
      failures: 5,
      avgResponseTime: 50,
      errorRate: 5
    });
    scalabilityTestingService._runVariableLoadTest = jest.fn().mockResolvedValue({
      scalingEvents: [],
      performance: {
        avgResponseTime: 75,
        errorRate: 0.5,
        maxResponseTime: 300
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runHorizontalScalingTest', () => {
    test('should run horizontal scaling test successfully', async () => {
      // Mock the config to use fewer instances for testing
      scalabilityTestingService.config.horizontal.instances = [1, 2];

      const result = await scalabilityTestingService.runHorizontalScalingTest();

      expect(result).toBeDefined();
      expect(result.instances).toBeInstanceOf(Array);
      expect(result.instances).toHaveLength(2);
    }, 10000); // 10 second timeout
  });

  describe('runVerticalScalingTest', () => {
    test('should run vertical scaling test successfully', async () => {
      // Mock the config to use fewer resource configurations for testing
      scalabilityTestingService.config.vertical.cpuCores = [1, 2];
      scalabilityTestingService.config.vertical.memory = [1, 2];

      const result = await scalabilityTestingService.runVerticalScalingTest();

      expect(result).toBeDefined();
      expect(result.cpuTests).toBeInstanceOf(Array);
      expect(result.memoryTests).toBeInstanceOf(Array);
    }, 10000); // 10 second timeout
  });

  describe('runAutoScalingTest', () => {
    test('should run auto-scaling test successfully', async () => {
      // Mock the config to use shorter test duration
      scalabilityTestingService.config.autoScaling.duration = 2;

      const result = await scalabilityTestingService.runAutoScalingTest();

      expect(result).toBeDefined();
    });
  });

  describe('saveResults', () => {
    test('should save test results to file', async () => {
      // Mock fs.writeFile
      const fs = require('fs').promises;
      fs.writeFile = jest.fn().mockResolvedValue();

      const filePath = '/tmp/test-results.json';
      await scalabilityTestingService.saveResults(filePath);

      expect(fs.writeFile).toHaveBeenCalledWith(
        filePath,
        expect.any(String)
      );
    });
  });

  describe('reset', () => {
    test('should reset test results', () => {
      // Add some test data
      scalabilityTestingService.results.tests.push({ test: 'data' });

      // Reset
      scalabilityTestingService.reset();

      // Check that results are cleared
      expect(scalabilityTestingService.results.tests).toHaveLength(0);
      expect(scalabilityTestingService.results.summary).toEqual({});
    });
  });
});