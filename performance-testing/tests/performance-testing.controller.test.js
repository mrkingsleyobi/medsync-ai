/**
 * Performance Testing Controller Tests
 * Unit tests for the performance testing controller
 */

const PerformanceTestingController = require('../performance-testing.controller.js');

// Mock the services
jest.mock('../load/load-testing.service.js');
jest.mock('../stress/stress-testing.service.js');
jest.mock('../scalability/scalability-testing.service.js');

const LoadTestingService = require('../load/load-testing.service.js');
const StressTestingService = require('../stress/stress-testing.service.js');
const ScalabilityTestingService = require('../scalability/scalability-testing.service.js');

describe('PerformanceTestingController', () => {
  let performanceTestingController;
  let mockLoadTestingService;
  let mockStressTestingService;
  let mockScalabilityTestingService;

  beforeEach(() => {
    performanceTestingController = new PerformanceTestingController();
    mockLoadTestingService = performanceTestingController.loadTestingService;
    mockStressTestingService = performanceTestingController.stressTestingService;
    mockScalabilityTestingService = performanceTestingController.scalabilityTestingService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runLoadScenarioTest', () => {
    test('should run load test for a scenario successfully', async () => {
      const req = {
        body: {
          scenarioName: 'patient-communication'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResults = {
        duration: 10,
        requests: 1000,
        successes: 995,
        failures: 5
      };

      mockLoadTestingService.runScenarioTest.mockResolvedValue(mockResults);

      await performanceTestingController.runLoadScenarioTest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: `Load test completed for scenario: patient-communication`,
        results: mockResults
      });
    });

    test('should return 400 when scenario name is not provided', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await performanceTestingController.runLoadScenarioTest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: scenarioName'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          scenarioName: 'patient-communication'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockLoadTestingService.runScenarioTest.mockRejectedValue(new Error('Service error'));

      await performanceTestingController.runLoadScenarioTest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to run load scenario test',
        message: 'Service error'
      });
    });
  });

  describe('runComprehensiveLoadTest', () => {
    test('should run comprehensive load test successfully', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResults = {
        scenarios: [],
        summary: {},
        duration: 300
      };

      mockLoadTestingService.runComprehensiveLoadTest.mockResolvedValue(mockResults);

      await performanceTestingController.runComprehensiveLoadTest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Comprehensive load test completed',
        results: mockResults
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockLoadTestingService.runComprehensiveLoadTest.mockRejectedValue(new Error('Service error'));

      await performanceTestingController.runComprehensiveLoadTest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to run comprehensive load test',
        message: 'Service error'
      });
    });
  });

  describe('runSpikeTest', () => {
    test('should run spike test successfully', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResults = {
        baseline: {},
        spike: {},
        recovery: {}
      };

      mockStressTestingService.runSpikeTest.mockResolvedValue(mockResults);

      await performanceTestingController.runSpikeTest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Spike test completed',
        results: mockResults
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockStressTestingService.runSpikeTest.mockRejectedValue(new Error('Service error'));

      await performanceTestingController.runSpikeTest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to run spike test',
        message: 'Service error'
      });
    });
  });

  describe('runSoakTest', () => {
    test('should run soak test successfully', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResults = {
        duration: 7200,
        requests: 1000000,
        successes: 999995,
        failures: 5
      };

      mockStressTestingService.runSoakTest.mockResolvedValue(mockResults);

      await performanceTestingController.runSoakTest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Soak test completed',
        results: mockResults
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockStressTestingService.runSoakTest.mockRejectedValue(new Error('Service error'));

      await performanceTestingController.runSoakTest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to run soak test',
        message: 'Service error'
      });
    });
  });

  describe('runBreakpointTest', () => {
    test('should run breakpoint test successfully', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResults = {
        steps: [],
        breakpoint: 5000
      };

      mockStressTestingService.runBreakpointTest.mockResolvedValue(mockResults);

      await performanceTestingController.runBreakpointTest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Breakpoint test completed',
        results: mockResults
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockStressTestingService.runBreakpointTest.mockRejectedValue(new Error('Service error'));

      await performanceTestingController.runBreakpointTest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to run breakpoint test',
        message: 'Service error'
      });
    });
  });

  describe('runHorizontalScalingTest', () => {
    test('should run horizontal scaling test successfully', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResults = {
        instances: []
      };

      mockScalabilityTestingService.runHorizontalScalingTest.mockResolvedValue(mockResults);

      await performanceTestingController.runHorizontalScalingTest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Horizontal scaling test completed',
        results: mockResults
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockScalabilityTestingService.runHorizontalScalingTest.mockRejectedValue(new Error('Service error'));

      await performanceTestingController.runHorizontalScalingTest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to run horizontal scaling test',
        message: 'Service error'
      });
    });
  });

  describe('runVerticalScalingTest', () => {
    test('should run vertical scaling test successfully', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResults = {
        cpuTests: [],
        memoryTests: []
      };

      mockScalabilityTestingService.runVerticalScalingTest.mockResolvedValue(mockResults);

      await performanceTestingController.runVerticalScalingTest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Vertical scaling test completed',
        results: mockResults
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockScalabilityTestingService.runVerticalScalingTest.mockRejectedValue(new Error('Service error'));

      await performanceTestingController.runVerticalScalingTest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to run vertical scaling test',
        message: 'Service error'
      });
    });
  });

  describe('runAutoScalingTest', () => {
    test('should run auto-scaling test successfully', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResults = {
        scalingEvents: [],
        performance: {}
      };

      mockScalabilityTestingService.runAutoScalingTest.mockResolvedValue(mockResults);

      await performanceTestingController.runAutoScalingTest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Auto-scaling test completed',
        results: mockResults
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockScalabilityTestingService.runAutoScalingTest.mockRejectedValue(new Error('Service error'));

      await performanceTestingController.runAutoScalingTest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to run auto-scaling test',
        message: 'Service error'
      });
    });
  });

  describe('getTestStatus', () => {
    test('should return current test status successfully', async () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockLoadMetrics = {};
      const mockStressMetrics = {};

      mockLoadTestingService.getCurrentMetrics.mockReturnValue(mockLoadMetrics);
      mockStressTestingService.getCurrentMetrics.mockReturnValue(mockStressMetrics);

      await performanceTestingController.getTestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: {
          loadTesting: mockLoadMetrics,
          stressTesting: mockStressMetrics
        }
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockLoadTestingService.getCurrentMetrics.mockImplementation(() => {
        throw new Error('Service error');
      });

      await performanceTestingController.getTestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to get test status',
        message: 'Service error'
      });
    });
  });

  describe('getTestConfig', () => {
    test('should return test configuration successfully', async () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await performanceTestingController.getTestConfig(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        config: performanceTestingController.config
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock the config to throw an error
      Object.defineProperty(performanceTestingController, 'config', {
        get: () => {
          throw new Error('Config error');
        }
      });

      await performanceTestingController.getTestConfig(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to get test configuration',
        message: 'Config error'
      });
    });
  });

  describe('resetTestResults', () => {
    test('should reset test results successfully', async () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await performanceTestingController.resetTestResults(req, res);

      expect(mockLoadTestingService.reset).toHaveBeenCalled();
      expect(mockStressTestingService.reset).toHaveBeenCalled();
      expect(mockScalabilityTestingService.reset).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Test results reset successfully'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockLoadTestingService.reset.mockImplementation(() => {
        throw new Error('Service error');
      });

      await performanceTestingController.resetTestResults(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to reset test results',
        message: 'Service error'
      });
    });
  });
});