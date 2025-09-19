/**
 * Stress Testing Service Tests
 * Unit tests for the stress testing service
 */

const StressTestingService = require('../stress-testing.service.js');

describe('StressTestingService', () => {
  let stressTestingService;

  beforeEach(() => {
    stressTestingService = new StressTestingService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runSpikeTest', () => {
    test('should run spike test successfully', async () => {
      // Mock the config to use shorter test duration
      stressTestingService.config.spike.spikeDuration = 1;
      stressTestingService.config.spike.recoveryTime = 1;

      const result = await stressTestingService.runSpikeTest();

      expect(result).toBeDefined();
      expect(result.baseline).toBeDefined();
      expect(result.spike).toBeDefined();
      expect(result.recovery).toBeDefined();
    });
  });

  describe('runSoakTest', () => {
    test('should run soak test successfully', async () => {
      // Mock the config to use shorter test duration
      stressTestingService.config.soak.duration = 2;

      const result = await stressTestingService.runSoakTest();

      expect(result).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.requests).toBeGreaterThanOrEqual(0);
      expect(result.successes).toBeGreaterThanOrEqual(0);
      expect(result.failures).toBeGreaterThanOrEqual(0);
    });
  });

  describe('runBreakpointTest', () => {
    test('should run breakpoint test successfully', async () => {
      // Mock the config to use shorter test parameters
      stressTestingService.config.breakpoint.startRPS = 10;
      stressTestingService.config.breakpoint.stepRPS = 10;
      stressTestingService.config.breakpoint.maxRPS = 30;
      stressTestingService.config.breakpoint.stepDuration = 1;

      const result = await stressTestingService.runBreakpointTest();

      expect(result).toBeDefined();
      expect(result.steps).toBeInstanceOf(Array);
    });
  });

  describe('saveResults', () => {
    test('should save test results to file', async () => {
      // Mock fs.writeFile
      const fs = require('fs').promises;
      fs.writeFile = jest.fn().mockResolvedValue();

      const filePath = '/tmp/test-results.json';
      await stressTestingService.saveResults(filePath);

      expect(fs.writeFile).toHaveBeenCalledWith(
        filePath,
        expect.any(String)
      );
    });
  });

  describe('getCurrentMetrics', () => {
    test('should return current test metrics', () => {
      const metrics = stressTestingService.getCurrentMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });
  });

  describe('reset', () => {
    test('should reset test results', () => {
      // Add some test data
      stressTestingService.results.tests.push({ test: 'data' });

      // Reset
      stressTestingService.reset();

      // Check that results are cleared
      expect(stressTestingService.results.tests).toHaveLength(0);
      expect(stressTestingService.results.summary).toEqual({});
    });
  });
});