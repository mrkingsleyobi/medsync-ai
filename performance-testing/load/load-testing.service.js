/**
 * Load Testing Service
 * Service for conducting load tests on MediSync services
 */

const config = require('../config/performance.config.js');
const http = require('http');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');

class LoadTestingService {
  constructor() {
    this.config = config.loadTestingConfig;
    this.results = {
      tests: [],
      summary: {}
    };
    this.currentTest = null;
    this.testMetrics = {};
  }

  /**
   * Run load test for a specific scenario
   * @param {string} scenarioName - Name of the scenario to test
   * @param {Object} options - Test options
   * @returns {Promise<Object>} Test results
   */
  async runScenarioTest(scenarioName, options = {}) {
    try {
      // Find the scenario
      const scenario = this.config.scenarios.find(s => s.name === scenarioName);
      if (!scenario) {
        throw new Error(`Scenario '${scenarioName}' not found`);
      }

      console.log(`Starting load test for scenario: ${scenarioName}`);

      // Initialize test metrics
      this.testMetrics[scenarioName] = {
        startTime: Date.now(),
        requests: 0,
        successes: 0,
        failures: 0,
        totalResponseTime: 0,
        responseTimes: [],
        errors: []
      };

      // Run the test
      const results = await this._executeLoadTest(scenario, options);

      // Store results
      this.results.tests.push({
        scenario: scenarioName,
        ...results
      });

      console.log(`Load test completed for scenario: ${scenarioName}`);
      return results;
    } catch (error) {
      console.error(`Load test failed for scenario: ${scenarioName}`, error);
      throw error;
    }
  }

  /**
   * Run comprehensive load test across all scenarios
   * @param {Object} options - Test options
   * @returns {Promise<Object>} Test results
   */
  async runComprehensiveLoadTest(options = {}) {
    try {
      console.log('Starting comprehensive load test across all scenarios');

      const startTime = Date.now();
      const scenarioResults = [];

      // Run tests for each scenario
      for (const scenario of this.config.scenarios) {
        const result = await this.runScenarioTest(scenario.name, options);
        scenarioResults.push(result);
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // in seconds

      // Generate summary
      const summary = this._generateLoadTestSummary(scenarioResults, duration);

      this.results.summary = summary;

      console.log('Comprehensive load test completed');
      return {
        scenarios: scenarioResults,
        summary: summary,
        duration: duration
      };
    } catch (error) {
      console.error('Comprehensive load test failed', error);
      throw error;
    }
  }

  /**
   * Execute load test for a scenario
   * @param {Object} scenario - Scenario configuration
   * @param {Object} options - Test options
   * @returns {Promise<Object>} Test results
   */
  async _executeLoadTest(scenario, options) {
    return new Promise((resolve, reject) => {
      try {
        const startTime = Date.now();
        const metrics = this.testMetrics[scenario.name];
        let completedRequests = 0;
        const totalRequests = this.config.targetRPS * this.config.duration;

        // Calculate ramp-up requests
        const rampUpRequests = this.config.targetRPS * this.config.rampUpPeriod;
        const steadyStateRequests = totalRequests - rampUpRequests;

        // Track concurrent requests
        let concurrentRequests = 0;
        const maxConcurrent = this.config.concurrency.max;

        // Function to make a request
        const makeRequest = async () => {
          if (completedRequests >= totalRequests) {
            return;
          }

          if (concurrentRequests >= maxConcurrent) {
            // Wait a bit before trying again
            setTimeout(makeRequest, 10);
            return;
          }

          concurrentRequests++;
          completedRequests++;

          try {
            const result = await this._makeTestRequest(scenario);
            metrics.requests++;

            if (result.success) {
              metrics.successes++;
              metrics.totalResponseTime += result.responseTime;
              metrics.responseTimes.push(result.responseTime);
            } else {
              metrics.failures++;
              metrics.errors.push(result.error);
            }
          } catch (error) {
            metrics.failures++;
            metrics.errors.push(error.message);
          } finally {
            concurrentRequests--;
          }

          // Schedule next request based on target RPS
          const elapsed = (Date.now() - startTime) / 1000; // in seconds
          const expectedRequests = this._calculateExpectedRequests(elapsed);

          if (completedRequests < expectedRequests) {
            // Need to catch up, make next request immediately
            setImmediate(makeRequest);
          } else if (completedRequests < totalRequests) {
            // Calculate delay to maintain target RPS
            const delay = Math.max(0, (1000 / this.config.targetRPS) - 1);
            setTimeout(makeRequest, delay);
          }
        };

        // Start requests
        const interval = setInterval(() => {
          const currentRequests = Math.min(
            this.config.concurrency.initial +
            Math.floor((Date.now() - startTime) / 1000) *
            (this.config.concurrency.step / this.config.rampUpPeriod),
            this.config.concurrency.max
          );

          for (let i = 0; i < currentRequests; i++) {
            makeRequest();
          }
        }, 100);

        // End test after duration
        setTimeout(() => {
          clearInterval(interval);

          // Wait for pending requests to complete
          const checkCompletion = () => {
            if (concurrentRequests === 0) {
              const endTime = Date.now();
              const testDuration = (endTime - startTime) / 1000;

              // Calculate metrics
              const avgResponseTime = metrics.successes > 0 ?
                metrics.totalResponseTime / metrics.successes : 0;

              // Sort response times for percentiles
              const sortedResponseTimes = [...metrics.responseTimes].sort((a, b) => a - b);
              const p50 = this._getPercentile(sortedResponseTimes, 50);
              const p90 = this._getPercentile(sortedResponseTimes, 90);
              const p95 = this._getPercentile(sortedResponseTimes, 95);
              const p99 = this._getPercentile(sortedResponseTimes, 99);

              const errorRate = (metrics.failures / metrics.requests) * 100;

              resolve({
                duration: testDuration,
                requests: metrics.requests,
                successes: metrics.successes,
                failures: metrics.failures,
                avgResponseTime: avgResponseTime,
                percentiles: {
                  p50: p50,
                  p90: p90,
                  p95: p95,
                  p99: p99
                },
                errorRate: errorRate,
                errors: metrics.errors.slice(0, 10) // Limit to first 10 errors
              });
            } else {
              setTimeout(checkCompletion, 100);
            }
          };

          checkCompletion();
        }, this.config.duration * 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Make a test request to a service endpoint
   * @param {Object} scenario - Scenario configuration
   * @returns {Promise<Object>} Request result
   */
  async _makeTestRequest(scenario) {
    return new Promise((resolve) => {
      const startTime = Date.now();

      // Select a random endpoint based on weights
      const endpoint = this._selectWeightedEndpoint(scenario.endpoints);

      // Generate test data based on endpoint
      const testData = this._generateTestData(endpoint);

      // Configure request options
      const requestOptions = {
        hostname: 'localhost',
        port: 3000, // Default port, should be configurable
        path: endpoint.path,
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MediSync-Load-Tester/1.0'
        }
      };

      // Choose HTTP or HTTPS based on endpoint
      const client = endpoint.path.startsWith('https') ? https : http;

      // Make the request
      const req = client.request(requestOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            statusCode: res.statusCode,
            responseTime: responseTime,
            data: data
          });
        });
      });

      req.on('error', (error) => {
        const responseTime = Date.now() - startTime;
        resolve({
          success: false,
          error: error.message,
          responseTime: responseTime
        });
      });

      // Send test data for POST/PUT requests
      if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
        req.write(JSON.stringify(testData));
      }

      req.end();
    });
  }

  /**
   * Select a weighted endpoint from the list
   * @param {Array} endpoints - List of endpoints with weights
   * @returns {Object} Selected endpoint
   */
  _selectWeightedEndpoint(endpoints) {
    // Calculate total weight
    const totalWeight = endpoints.reduce((sum, endpoint) => sum + (endpoint.weight || 1), 0);

    // Select random value
    let random = Math.random() * totalWeight;

    // Find the selected endpoint
    for (const endpoint of endpoints) {
      random -= endpoint.weight || 1;
      if (random <= 0) {
        return endpoint;
      }
    }

    // Fallback to first endpoint
    return endpoints[0];
  }

  /**
   * Generate test data for an endpoint
   * @param {Object} endpoint - Endpoint configuration
   * @returns {Object} Test data
   */
  _generateTestData(endpoint) {
    // This is a simplified implementation
    // In a real implementation, this would generate realistic test data
    // based on the endpoint and service requirements

    switch (endpoint.path) {
      case '/api/patients/login':
        return {
          username: `testuser_${Math.floor(Math.random() * 10000)}`,
          password: 'testpassword123'
        };

      case '/api/patients/medical-documents/simplify':
        return {
          document: {
            id: `DOC-${Math.floor(Math.random() * 10000)}`,
            content: 'This is a sample medical document with complex terminology that needs to be simplified for patient understanding.',
            type: 'discharge_summary'
          }
        };

      case '/api/patients/voice-journal/transcribe':
        return {
          audio: {
            id: `AUDIO-${Math.floor(Math.random() * 10000)}`,
            // Base64 encoded sample audio data
            data: 'UklGRh4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
          }
        };

      case '/api/patients/education/personalize':
        return {
          patientId: `PAT-${Math.floor(Math.random() * 10000)}`,
          topics: ['diabetes_management', 'medication_adherence'],
          complexity: 'medium'
        };

      case '/api/clinical-decisions/diagnose':
        return {
          patientData: {
            id: `PAT-${Math.floor(Math.random() * 10000)}`,
            symptoms: ['fever', 'cough', 'fatigue'],
            vitals: {
              temperature: 38.5,
              heartRate: 95
            }
          }
        };

      default:
        return {
          timestamp: new Date().toISOString(),
          test: true
        };
    }
  }

  /**
   * Calculate expected requests based on elapsed time
   * @param {number} elapsed - Elapsed time in seconds
   * @returns {number} Expected number of requests
   */
  _calculateExpectedRequests(elapsed) {
    if (elapsed <= this.config.rampUpPeriod) {
      // During ramp-up, linear increase
      const rampUpRatio = elapsed / this.config.rampUpPeriod;
      return Math.floor(this.config.targetRPS * rampUpRatio * elapsed);
    } else {
      // After ramp-up, steady state
      const steadyStateTime = elapsed - this.config.rampUpPeriod;
      const rampUpRequests = this.config.targetRPS * this.config.rampUpPeriod / 2; // Triangle area
      const steadyStateRequests = this.config.targetRPS * steadyStateTime;
      return Math.floor(rampUpRequests + steadyStateRequests);
    }
  }

  /**
   * Get percentile value from sorted array
   * @param {Array} sortedArray - Sorted array of values
   * @param {number} percentile - Percentile to calculate (0-100)
   * @returns {number} Percentile value
   */
  _getPercentile(sortedArray, percentile) {
    if (sortedArray.length === 0) return 0;

    const index = (percentile / 100) * (sortedArray.length - 1);
    if (index % 1 === 0) {
      return sortedArray[index];
    } else {
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      return sortedArray[lower] + (sortedArray[upper] - sortedArray[lower]) * (index - lower);
    }
  }

  /**
   * Generate load test summary
   * @param {Array} scenarioResults - Results from scenario tests
   * @param {number} duration - Test duration in seconds
   * @returns {Object} Summary metrics
   */
  _generateLoadTestSummary(scenarioResults, duration) {
    const totalRequests = scenarioResults.reduce((sum, result) => sum + result.requests, 0);
    const totalSuccesses = scenarioResults.reduce((sum, result) => sum + result.successes, 0);
    const totalFailures = scenarioResults.reduce((sum, result) => sum + result.failures, 0);

    const avgResponseTime = scenarioResults.reduce((sum, result) =>
      sum + result.avgResponseTime, 0) / scenarioResults.length;

    const overallErrorRate = (totalFailures / totalRequests) * 100;

    // Find worst performing scenarios
    const worstResponseTime = Math.max(...scenarioResults.map(r => r.avgResponseTime));
    const worstErrorRate = Math.max(...scenarioResults.map(r => r.errorRate));

    const worstResponseTimeScenario = scenarioResults.find(r => r.avgResponseTime === worstResponseTime);
    const worstErrorRateScenario = scenarioResults.find(r => r.errorRate === worstErrorRate);

    return {
      totalRequests: totalRequests,
      totalSuccesses: totalSuccesses,
      totalFailures: totalFailures,
      overallRPS: totalRequests / duration,
      avgResponseTime: avgResponseTime,
      overallErrorRate: overallErrorRate,
      worstResponseTime: {
        scenario: worstResponseTimeScenario?.scenario,
        value: worstResponseTime
      },
      worstErrorRate: {
        scenario: worstErrorRateScenario?.scenario,
        value: worstErrorRate
      },
      duration: duration
    };
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

module.exports = LoadTestingService;