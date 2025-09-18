// MediSync Healthcare AI Platform - Performance Monitoring Tests
// Test suite for model performance monitoring system

const ModelPerformanceMonitoring = require('../src/performance-monitoring');
const fs = require('fs');
const path = require('path');

describe('Model Performance Monitoring', () => {
  let monitoring;
  const testMetricsDir = './test/metrics';

  beforeEach(() => {
    monitoring = new ModelPerformanceMonitoring({
      metricsStorageDir: testMetricsDir,
      collectionInterval: 0 // Disable automatic collection for testing
    });
  });

  afterEach(() => {
    // Clean up test metrics directory
    if (fs.existsSync(testMetricsDir)) {
      fs.rmSync(testMetricsDir, { recursive: true });
    }
  });

  test('should initialize performance monitoring system', () => {
    expect(monitoring).toBeInstanceOf(ModelPerformanceMonitoring);
    expect(monitoring.config).toBeDefined();
    expect(monitoring.metrics).toBeInstanceOf(Map);
  });

  test('should record inference metrics', () => {
    const metrics = {
      latency: 150,
      tokens: 50,
      success: true
    };

    monitoring.recordInferenceMetrics('test-model', metrics);

    const modelMetrics = monitoring.getModelMetrics('test-model');
    expect(modelMetrics).toBeDefined();
    expect(modelMetrics.inferenceCount).toBe(1);
    expect(modelMetrics.avgLatency).toBe(150);
    expect(modelMetrics.avgTokens).toBe(50);
    expect(modelMetrics.errors).toBe(0);
  });

  test('should handle error metrics', () => {
    const metrics = {
      latency: 200,
      tokens: 30,
      error: 'Timeout error'
    };

    monitoring.recordInferenceMetrics('test-model', metrics);

    const modelMetrics = monitoring.getModelMetrics('test-model');
    expect(modelMetrics.errors).toBe(1);
    expect(modelMetrics.errorRate).toBe(100);
  });

  test('should calculate averages correctly', () => {
    const metrics1 = { latency: 100, tokens: 25 };
    const metrics2 = { latency: 200, tokens: 75 };
    const metrics3 = { latency: 150, tokens: 50 };

    monitoring.recordInferenceMetrics('test-model', metrics1);
    monitoring.recordInferenceMetrics('test-model', metrics2);
    monitoring.recordInferenceMetrics('test-model', metrics3);

    const modelMetrics = monitoring.getModelMetrics('test-model');
    expect(modelMetrics.inferenceCount).toBe(3);
    expect(modelMetrics.avgLatency).toBe(150); // (100 + 200 + 150) / 3
    expect(modelMetrics.avgTokens).toBe(50); // (25 + 75 + 50) / 3
  });

  test('should get all model metrics', () => {
    const metrics1 = { latency: 100, tokens: 50 };
    const metrics2 = { latency: 200, tokens: 100 };

    monitoring.recordInferenceMetrics('model-1', metrics1);
    monitoring.recordInferenceMetrics('model-2', metrics2);

    const allMetrics = monitoring.getAllModelMetrics();
    expect(Object.keys(allMetrics)).toHaveLength(2);
    expect(allMetrics['model-1']).toBeDefined();
    expect(allMetrics['model-2']).toBeDefined();
  });

  test('should get performance history', () => {
    const metrics = { latency: 150, tokens: 50 };

    monitoring.recordInferenceMetrics('test-model', metrics);
    monitoring.recordInferenceMetrics('test-model', metrics);
    monitoring.recordInferenceMetrics('test-model', metrics);

    const history = monitoring.getPerformanceHistory('test-model');
    expect(history).toHaveLength(3);

    const limitedHistory = monitoring.getPerformanceHistory('test-model', 2);
    expect(limitedHistory).toHaveLength(2);
  });

  test('should check performance requirements', () => {
    const metrics = { latency: 150, tokens: 50 };
    monitoring.recordInferenceMetrics('test-model', metrics);

    const requirements = {
      maxLatency: 200,
      maxErrorRate: 5
    };

    const result = monitoring.checkPerformanceRequirements('test-model', requirements);
    expect(result.passed).toBe(true);
    expect(result.checks.latency.passed).toBe(true);
    expect(result.checks.errorRate.passed).toBe(true);
  });

  test('should fail performance requirements when exceeded', () => {
    const metrics = { latency: 300, tokens: 50, error: 'Timeout' };
    monitoring.recordInferenceMetrics('test-model', metrics);

    const requirements = {
      maxLatency: 200,
      maxErrorRate: 5
    };

    const result = monitoring.checkPerformanceRequirements('test-model', requirements);
    expect(result.passed).toBe(false);
    expect(result.checks.latency.passed).toBe(false);
    expect(result.checks.errorRate.passed).toBe(false);
  });

  test('should generate performance report', () => {
    const metrics = { latency: 150, tokens: 50 };
    monitoring.recordInferenceMetrics('test-model', metrics);

    const report = monitoring.generatePerformanceReport();
    expect(report).toBeDefined();
    expect(report.timestamp).toBeDefined();
    expect(report.system).toBeDefined();
    expect(report.models).toBeDefined();
    expect(report.models['test-model']).toBeDefined();

    const modelReport = monitoring.generatePerformanceReport('test-model');
    expect(modelReport.models['test-model']).toBeDefined();
  });

  test('should get system statistics', () => {
    const metrics1 = { latency: 100, tokens: 50 };
    const metrics2 = { latency: 200, tokens: 100, error: 'Timeout' };

    monitoring.recordInferenceMetrics('model-1', metrics1);
    monitoring.recordInferenceMetrics('model-2', metrics2);

    const stats = monitoring.getStatistics();
    expect(stats.totalModels).toBe(2);
    expect(stats.totalInferences).toBe(2);
    expect(stats.totalErrors).toBe(1);
    expect(stats.errorRate).toBe(50);
  });

  test('should handle non-existent model metrics', () => {
    const metrics = monitoring.getModelMetrics('non-existent-model');
    expect(metrics).toBeNull();

    const history = monitoring.getPerformanceHistory('non-existent-model');
    expect(history).toHaveLength(0);

    const check = monitoring.checkPerformanceRequirements('non-existent-model');
    expect(check.passed).toBe(false);
    expect(check.reason).toBe('No metrics available');
  });
});