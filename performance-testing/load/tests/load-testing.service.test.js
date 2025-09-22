/**
 * Load Testing Service Tests
 * Unit tests for the load testing service
 */

const LoadTestingService = require('../load-testing.service.js');

// Mock HTTP requests
jest.mock('http', () => ({
  request: jest.fn().mockImplementation((options, callback) => {
    return {
      on: jest.fn(),
      write: jest.fn(),
      end: () => {
        // Simulate immediate response
        const res = {
          statusCode: 200,
          on: (event, handler) => {
            if (event === 'data') {
              handler('{"success": true}');
            } else if (event === 'end') {
              handler();
            }
          }
        };
        callback(res);
      }
    };
  })
}));

describe('LoadTestingService', () => {
  let loadTestingService;

  beforeEach(() => {
    loadTestingService = new LoadTestingService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runScenarioTest', () => {
    test('should run load test for a valid scenario', async () => {
      const scenarioName = 'patient-communication';
      const options = { duration: 1 }; // Short duration for testing

      // Mock the config to use shorter test duration
      loadTestingService.config.duration = 1;
      loadTestingService.config.targetRPS = 10;

      const result = await loadTestingService.runScenarioTest(scenarioName, options);

      expect(result).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.requests).toBeGreaterThanOrEqual(0);
      expect(result.successes).toBeGreaterThanOrEqual(0);
      expect(result.failures).toBeGreaterThanOrEqual(0);
    });

    test('should throw error for invalid scenario', async () => {
      const scenarioName = 'invalid-scenario';
      const options = {};

      await expect(loadTestingService.runScenarioTest(scenarioName, options))
        .rejects
        .toThrow(`Scenario '${scenarioName}' not found`);
    });
  });

  describe('runComprehensiveLoadTest', () => {
    test('should run comprehensive load test across all scenarios', async () => {
      const options = { duration: 1 }; // Short duration for testing

      // Mock the config to use shorter test duration
      loadTestingService.config.duration = 1;
      loadTestingService.config.targetRPS = 10;

      const result = await loadTestingService.runComprehensiveLoadTest(options);

      expect(result).toBeDefined();
      expect(result.scenarios).toHaveLength(loadTestingService.config.scenarios.length);
      expect(result.summary).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
    }, 10000); // 10 second timeout
  });

  describe('saveResults', () => {
    test('should save test results to file', async () => {
      // Mock fs.writeFile
      const fs = require('fs').promises;
      fs.writeFile = jest.fn().mockResolvedValue();

      const filePath = '/tmp/test-results.json';
      await loadTestingService.saveResults(filePath);

      expect(fs.writeFile).toHaveBeenCalledWith(
        filePath,
        expect.any(String)
      );
    });
  });

  describe('getCurrentMetrics', () => {
    test('should return current test metrics', () => {
      const metrics = loadTestingService.getCurrentMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });
  });

  describe('reset', () => {
    test('should reset test results', () => {
      // Add some test data
      loadTestingService.results.tests.push({ test: 'data' });

      // Reset
      loadTestingService.reset();

      // Check that results are cleared
      expect(loadTestingService.results.tests).toHaveLength(0);
      expect(loadTestingService.results.summary).toEqual({});
    });
  });
});