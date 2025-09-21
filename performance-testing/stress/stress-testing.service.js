/**
 * Stress Testing Service
 * Service for conducting stress tests on MediSync services
 */

const config = require('../config/performance.config.js');
const os = require('os');
const fs = require('fs').promises;

class StressTestingService {
  constructor() {
    this.config = config.stressTestingConfig;
    this.results = {
      tests: [],
      summary: {}
    };
    this.currentTest = null;
    this.testMetrics = {};
  }

  /**
   * Run spike test
   * @param {Object} options - Test options
   * @returns {Promise<Object>} Test results
   */
  async runSpikeTest(options = {}) {
    try {
      console.log('Starting spike test');

      // Initialize test metrics
      this.testMetrics.spike = {
        startTime: Date.now(),
        baseline: {
          requests: 0,
          successes: 0,
          failures: 0,
          avgResponseTime: 0
        },
        spike: {
          requests: 0,
          successes: 0,
          failures: 0,
          avgResponseTime: 0
        },
        recovery: {
          requests: 0,
          successes: 0,
          failures: 0,
          avgResponseTime: 0
        }
      };

      // Run baseline period
      console.log('Running baseline period...');
      const baselineResults = await this._runTestPeriod(
        this.config.spike.baselineRPS,
        this.config.spike.spikeDuration
      );

      // Run spike period
      console.log('Running spike period...');
      const spikeResults = await this._runTestPeriod(
        this.config.spike.spikeRPS,
        this.config.spike.spikeDuration
      );

      // Run recovery period
      console.log('Running recovery period...');
      const recoveryResults = await this._runTestPeriod(
        this.config.spike.baselineRPS,
        this.config.spike.recoveryTime
      );

      // Calculate metrics
      const results = {
        baseline: baselineResults,
        spike: spikeResults,
        recovery: recoveryResults
      };

      // Store results
      this.results.tests.push({
        type: 'spike',
        ...results
      });

      console.log('Spike test completed');
      return results;
    } catch (error) {
      console.error('Spike test failed', error);
      throw error;
    }
  }

  /**
   * Run soak test
   * @param {Object} options - Test options
   * @returns {Promise<Object>} Test results
   */
  async runSoakTest(options = {}) {
    try {
      console.log('Starting soak test');

      const startTime = Date.now();
      const metrics = {
        requests: 0,
        successes: 0,
        failures: 0,
        totalResponseTime: 0,
        errorRateHistory: [],
        responseTimeHistory: [],
        resourceUsage: []
      };

      // Run test for specified duration
      const testDuration = this.config.soak.duration;
      const interval = 1000; // 1 second intervals
      const iterations = Math.ceil(testDuration / (interval / 1000));

      for (let i = 0; i < iterations; i++) {
        // Make requests at target RPS
        const periodResults = await this._runTestPeriod(
          this.config.soak.targetRPS,
          interval / 1000
        );

        metrics.requests += periodResults.requests;
        metrics.successes += periodResults.successes;
        metrics.failures += periodResults.failures;
        metrics.totalResponseTime += periodResults.totalResponseTime;

        // Calculate period metrics
        const periodErrorRate = (periodResults.failures / periodResults.requests) * 100;
        const periodAvgResponseTime = periodResults.successes > 0 ?
          periodResults.totalResponseTime / periodResults.successes : 0;

        metrics.errorRateHistory.push(periodErrorRate);
        metrics.responseTimeHistory.push(periodAvgResponseTime);

        // Monitor resource usage
        const resourceUsage = this._getResourceUsage();
        metrics.resourceUsage.push(resourceUsage);

        // Check if system is failing SLA
        if (periodErrorRate > this.config.soak.maxErrorRate ||
            periodAvgResponseTime > this.config.soak.maxResponseTime) {
          console.warn(`Soak test failing SLA at iteration ${i + 1}`);
        }

        // Wait for next interval
        await new Promise(resolve => setTimeout(resolve, interval));
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      // Calculate final metrics
      const avgResponseTime = metrics.successes > 0 ?
        metrics.totalResponseTime / metrics.successes : 0;
      const errorRate = (metrics.failures / metrics.requests) * 100;

      const results = {
        duration: duration,
        requests: metrics.requests,
        successes: metrics.successes,
        failures: metrics.failures,
        avgResponseTime: avgResponseTime,
        errorRate: errorRate,
        maxErrorRate: Math.max(...metrics.errorRateHistory),
        maxResponseTime: Math.max(...metrics.responseTimeHistory),
        resourceUsage: metrics.resourceUsage
      };

      // Store results
      this.results.tests.push({
        type: 'soak',
        ...results
      });

      console.log('Soak test completed');
      return results;
    } catch (error) {
      console.error('Soak test failed', error);
      throw error;
    }
  }

  /**
   * Run breakpoint test
   * @param {Object} options - Test options
   * @returns {Promise<Object>} Test results
   */
  async runBreakpointTest(options = {}) {
    try {
      console.log('Starting breakpoint test');

      const results = {
        steps: [],
        breakpoint: null
      };

      let currentRPS = this.config.breakpoint.startRPS;
      let previousSuccessRate = 1.0;

      while (currentRPS <= this.config.breakpoint.maxRPS) {
        console.log(`Testing at ${currentRPS} RPS...`);

        // Run test at current RPS
        const stepResults = await this._runTestPeriod(
          currentRPS,
          this.config.breakpoint.stepDuration
        );

        const successRate = stepResults.successes / stepResults.requests;
        const errorRate = (stepResults.failures / stepResults.requests) * 100;
        const avgResponseTime = stepResults.successes > 0 ?
          stepResults.totalResponseTime / stepResults.successes : 0;

        const stepResult = {
          rps: currentRPS,
          requests: stepResults.requests,
          successes: stepResults.successes,
          failures: stepResults.failures,
          successRate: successRate,
          errorRate: errorRate,
          avgResponseTime: avgResponseTime
        };

        results.steps.push(stepResult);

        // Check if we've found the breakpoint
        if (successRate < 0.95 && previousSuccessRate >= 0.95) {
          results.breakpoint = currentRPS;
          console.log(`Breakpoint found at ${currentRPS} RPS`);
          break;
        }

        previousSuccessRate = successRate;
        currentRPS += this.config.breakpoint.stepRPS;
      }

      // Store results
      this.results.tests.push({
        type: 'breakpoint',
        ...results
      });

      console.log('Breakpoint test completed');
      return results;
    } catch (error) {
      console.error('Breakpoint test failed', error);
      throw error;
    }
  }

  /**
   * Run test period at specified RPS
   * @param {number} rps - Requests per second
   * @param {number} duration - Duration in seconds
   * @returns {Promise<Object>} Period results
   */
  async _runTestPeriod(rps, duration) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const metrics = {
        requests: 0,
        successes: 0,
        failures: 0,
        totalResponseTime: 0
      };

      const totalRequests = Math.floor(rps * duration);
      let completedRequests = 0;

      // Function to make a request
      const makeRequest = async () => {
        if (completedRequests >= totalRequests) {
          return;
        }

        completedRequests++;
        metrics.requests++;

        try {
          const result = await this._makeTestRequest();
          const responseTime = Date.now() - startTime;

          if (result.success) {
            metrics.successes++;
            metrics.totalResponseTime += responseTime;
          } else {
            metrics.failures++;
          }
        } catch (error) {
          metrics.failures++;
        }

        // Schedule next request to maintain RPS
        if (completedRequests < totalRequests) {
          const delay = Math.max(0, (1000 / rps) - 1);
          setTimeout(makeRequest, delay);
        }
      };

      // Start requests
      const requestInterval = 1000 / rps;
      const interval = setInterval(makeRequest, requestInterval);

      // End period after duration
      setTimeout(() => {
        clearInterval(interval);
        resolve(metrics);
      }, duration * 1000);
    });
  }

  /**
   * Make a test request
   * @returns {Promise<Object>} Request result
   */
  async _makeTestRequest() {
    // This is a simplified implementation
    // In a real implementation, this would make actual HTTP requests
    // to the services being tested

    // Simulate network delay and processing time
    const delay = Math.random() * 100; // 0-100ms delay
    const processingTime = Math.random() * 50; // 0-50ms processing
    const totalDelay = delay + processingTime;

    // Simulate occasional failures
    const success = Math.random() > 0.01; // 1% failure rate

    await new Promise(resolve => setTimeout(resolve, totalDelay));

    return {
      success: success,
      responseTime: totalDelay
    };
  }

  /**
   * Get system resource usage
   * @returns {Object} Resource usage metrics
   */
  _getResourceUsage() {
    const cpuUsage = process.cpuUsage();
    const memoryUsage = process.memoryUsage();
    const systemMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = systemMemory - freeMemory;

    return {
      timestamp: new Date().toISOString(),
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        system: systemMemory,
        free: freeMemory,
        used: usedMemory,
        usagePercent: (usedMemory / systemMemory) * 100
      },
      loadAverage: os.loadavg()
    };
  }

  /**
   * Monitor system resources during test
   * @param {number} duration - Monitoring duration in seconds
   * @returns {Promise<Array>} Resource usage history
   */
  async monitorResources(duration) {
    const history = [];
    const interval = 5000; // 5 seconds
    const iterations = Math.ceil(duration / (interval / 1000));

    for (let i = 0; i < iterations; i++) {
      const usage = this._getResourceUsage();
      history.push(usage);
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    return history;
  }

  /**
   * Check if system is under stress
   * @param {Object} resourceUsage - Current resource usage
   * @returns {Object} Stress status
   */
  _checkStressStatus(resourceUsage) {
    const cpuUsage = resourceUsage.cpu.user + resourceUsage.cpu.system;
    const memoryUsagePercent = resourceUsage.memory.usagePercent;

    const cpuStressed = cpuUsage > this.config.monitoring.cpuThreshold;
    const memoryStressed = memoryUsagePercent > this.config.monitoring.memoryThreshold;

    return {
      cpuStressed: cpuStressed,
      memoryStressed: memoryStressed,
      stressed: cpuStressed || memoryStressed,
      recommendations: this._getStressRecommendations(cpuStressed, memoryStressed)
    };
  }

  /**
   * Get stress recommendations
   * @param {boolean} cpuStressed - Whether CPU is stressed
   * @param {boolean} memoryStressed - Whether memory is stressed
   * @returns {Array} Recommendations
   */
  _getStressRecommendations(cpuStressed, memoryStressed) {
    const recommendations = [];

    if (cpuStressed) {
      recommendations.push('Scale up CPU resources or optimize CPU-intensive operations');
    }

    if (memoryStressed) {
      recommendations.push('Scale up memory resources or optimize memory usage');
    }

    if (cpuStressed && memoryStressed) {
      recommendations.push('Consider horizontal scaling to distribute load');
    }

    return recommendations;
  }

  /**
   * Save test results to file
   * @param {string} filePath - Path to save results
   * @returns {Promise<void>}
   */
  async saveResults(filePath) {
    try {
      const resultsJson = JSON.stringify(this.results, null, 2);
      await fs.writeFile(filePath, resultsJson);
      console.log(`Test results saved to ${filePath}`);
    } catch (error) {
      console.error('Failed to save test results', error);
      throw error;
    }
  }

  /**
   * Get current test metrics
   * @returns {Object} Current metrics
   */
  getCurrentMetrics() {
    return { ...this.testMetrics };
  }

  /**
   * Reset test results
   * @returns {void}
   */
  reset() {
    this.results = {
      tests: [],
      summary: {}
    };
    this.testMetrics = {};
  }
}

module.exports = StressTestingService;