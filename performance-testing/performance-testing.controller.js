/**
 * Performance Testing Controller
 * Controller for managing performance tests
 */

const LoadTestingService = require('./load/load-testing.service.js');
const StressTestingService = require('./stress/stress-testing.service.js');
const ScalabilityTestingService = require('./scalability/scalability-testing.service.js');
const config = require('./config/performance.config.js');

class PerformanceTestingController {
  constructor() {
    this.loadTestingService = new LoadTestingService();
    this.stressTestingService = new StressTestingService();
    this.scalabilityTestingService = new ScalabilityTestingService();
    this.config = config;
  }

  /**
   * Run load test for a specific scenario
   * POST /api/performance/load/scenario
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async runLoadScenarioTest(req, res) {
    try {
      const { scenarioName, options } = req.body;

      if (!scenarioName) {
        return res.status(400).json({
          error: 'Missing required field: scenarioName'
        });
      }

      const results = await this.loadTestingService.runScenarioTest(scenarioName, options);

      res.status(200).json({
        success: true,
        message: `Load test completed for scenario: ${scenarioName}`,
        results: results
      });
    } catch (error) {
      console.error('Run load scenario test error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to run load scenario test',
        message: error.message
      });
    }
  }

  /**
   * Run comprehensive load test
   * POST /api/performance/load/comprehensive
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async runComprehensiveLoadTest(req, res) {
    try {
      const { options } = req.body;

      const results = await this.loadTestingService.runComprehensiveLoadTest(options);

      res.status(200).json({
        success: true,
        message: 'Comprehensive load test completed',
        results: results
      });
    } catch (error) {
      console.error('Run comprehensive load test error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to run comprehensive load test',
        message: error.message
      });
    }
  }

  /**
   * Run spike test
   * POST /api/performance/stress/spike
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async runSpikeTest(req, res) {
    try {
      const { options } = req.body;

      const results = await this.stressTestingService.runSpikeTest(options);

      res.status(200).json({
        success: true,
        message: 'Spike test completed',
        results: results
      });
    } catch (error) {
      console.error('Run spike test error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to run spike test',
        message: error.message
      });
    }
  }

  /**
   * Run soak test
   * POST /api/performance/stress/soak
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async runSoakTest(req, res) {
    try {
      const { options } = req.body;

      const results = await this.stressTestingService.runSoakTest(options);

      res.status(200).json({
        success: true,
        message: 'Soak test completed',
        results: results
      });
    } catch (error) {
      console.error('Run soak test error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to run soak test',
        message: error.message
      });
    }
  }

  /**
   * Run breakpoint test
   * POST /api/performance/stress/breakpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async runBreakpointTest(req, res) {
    try {
      const { options } = req.body;

      const results = await this.stressTestingService.runBreakpointTest(options);

      res.status(200).json({
        success: true,
        message: 'Breakpoint test completed',
        results: results
      });
    } catch (error) {
      console.error('Run breakpoint test error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to run breakpoint test',
        message: error.message
      });
    }
  }

  /**
   * Run horizontal scaling test
   * POST /api/performance/scalability/horizontal
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async runHorizontalScalingTest(req, res) {
    try {
      const { options } = req.body;

      const results = await this.scalabilityTestingService.runHorizontalScalingTest(options);

      res.status(200).json({
        success: true,
        message: 'Horizontal scaling test completed',
        results: results
      });
    } catch (error) {
      console.error('Run horizontal scaling test error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to run horizontal scaling test',
        message: error.message
      });
    }
  }

  /**
   * Run vertical scaling test
   * POST /api/performance/scalability/vertical
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async runVerticalScalingTest(req, res) {
    try {
      const { options } = req.body;

      const results = await this.scalabilityTestingService.runVerticalScalingTest(options);

      res.status(200).json({
        success: true,
        message: 'Vertical scaling test completed',
        results: results
      });
    } catch (error) {
      console.error('Run vertical scaling test error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to run vertical scaling test',
        message: error.message
      });
    }
  }

  /**
   * Run auto-scaling test
   * POST /api/performance/scalability/auto
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async runAutoScalingTest(req, res) {
    try {
      const { options } = req.body;

      const results = await this.scalabilityTestingService.runAutoScalingTest(options);

      res.status(200).json({
        success: true,
        message: 'Auto-scaling test completed',
        results: results
      });
    } catch (error) {
      console.error('Run auto-scaling test error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to run auto-scaling test',
        message: error.message
      });
    }
  }

  /**
   * Get current test status
   * GET /api/performance/status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTestStatus(req, res) {
    try {
      const loadMetrics = this.loadTestingService.getCurrentMetrics();
      const stressMetrics = this.stressTestingService.getCurrentMetrics();

      res.status(200).json({
        success: true,
        status: {
          loadTesting: loadMetrics,
          stressTesting: stressMetrics
        }
      });
    } catch (error) {
      console.error('Get test status error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to get test status',
        message: error.message
      });
    }
  }

  /**
   * Get test configuration
   * GET /api/performance/config
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTestConfig(req, res) {
    try {
      res.status(200).json({
        success: true,
        config: this.config
      });
    } catch (error) {
      console.error('Get test config error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to get test configuration',
        message: error.message
      });
    }
  }

  /**
   * Reset test results
   * POST /api/performance/reset
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetTestResults(req, res) {
    try {
      this.loadTestingService.reset();
      this.stressTestingService.reset();
      this.scalabilityTestingService.reset();

      res.status(200).json({
        success: true,
        message: 'Test results reset successfully'
      });
    } catch (error) {
      console.error('Reset test results error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to reset test results',
        message: error.message
      });
    }
  }
}

module.exports = PerformanceTestingController;