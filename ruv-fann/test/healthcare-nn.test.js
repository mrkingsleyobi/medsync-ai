// MediSync Healthcare AI Platform - Healthcare Neural Network Tests
// Test suite for the healthcare neural network implementation

const HealthcareNeuralNetwork = require('../src/healthcare-nn');

describe('Healthcare Neural Network', () => {
  test('should initialize healthcare neural network', () => {
    const hnn = new HealthcareNeuralNetwork({
      type: 'diagnosis',
      healthcareSpecialization: 'cardiology',
      numInput: 10,
      numHidden: 20,
      numOutput: 5
    });

    expect(hnn).toBeInstanceOf(HealthcareNeuralNetwork);
    expect(hnn.getStatistics()).toBeDefined();
    expect(hnn.getMetadata()).toBeDefined();
  });

  test('should create specialized networks', () => {
    const diagnosisNN = HealthcareNeuralNetwork.createSpecializedNetwork('diagnosis');
    const riskNN = HealthcareNeuralNetwork.createSpecializedNetwork('risk_assessment');
    const drugNN = HealthcareNeuralNetwork.createSpecializedNetwork('drug_interaction');

    expect(diagnosisNN.config.type).toBe('diagnosis');
    expect(riskNN.config.type).toBe('risk_assessment');
    expect(drugNN.config.type).toBe('drug_interaction');

    expect(diagnosisNN.config.healthcareSpecialization).toBe('clinical_decision_support');
    expect(riskNN.config.healthcareSpecialization).toBe('predictive_analytics');
    expect(drugNN.config.healthcareSpecialization).toBe('pharmacovigilance');
  });

  test('should train and predict', () => {
    const hnn = new HealthcareNeuralNetwork({
      numInput: 3,
      numHidden: 6,
      numOutput: 2,
      learningRate: 0.7
    });

    // Simple training data
    const trainingData = [
      { input: [0.1, 0.2, 0.3], output: [0.8, 0.2] },
      { input: [0.4, 0.5, 0.6], output: [0.3, 0.7] },
      { input: [0.7, 0.8, 0.9], output: [0.1, 0.9] }
    ];

    const result = hnn.train(trainingData, {
      epochs: 100,
      targetError: 0.1
    });

    expect(result.epochs).toBeGreaterThan(0);
    expect(result.finalError).toBeGreaterThanOrEqual(0);

    // Test prediction
    const prediction = hnn.predict([0.2, 0.3, 0.4]);
    expect(prediction).toHaveLength(2);
    expect(prediction[0]).toBeGreaterThanOrEqual(0);
    expect(prediction[0]).toBeLessThanOrEqual(1);
    expect(prediction[1]).toBeGreaterThanOrEqual(0);
    expect(prediction[1]).toBeLessThanOrEqual(1);
  });

  test('should save and load model', () => {
    const hnn = new HealthcareNeuralNetwork({
      type: 'test',
      healthcareSpecialization: 'testing',
      numInput: 2,
      numHidden: 4,
      numOutput: 1
    });

    // Train with simple data
    const trainingData = [
      { input: [0.1, 0.2], output: [0.3] },
      { input: [0.4, 0.5], output: [0.6] }
    ];

    hnn.train(trainingData, { epochs: 10 });

    // Save model
    const modelState = hnn.saveModel();
    expect(modelState.weights).toBeDefined();
    expect(modelState.config).toBeDefined();
    expect(modelState.metadata).toBeDefined();
    expect(modelState.trained).toBe(true);

    // Create new network and load model
    const newHNN = new HealthcareNeuralNetwork({
      numInput: 2,
      numHidden: 4,
      numOutput: 1
    });

    newHNN.loadModel(modelState);
    expect(newHNN.trained).toBe(true);

    // Test that predictions are similar
    const originalPred = hnn.predict([0.25, 0.35]);
    const loadedPred = newHNN.predict([0.25, 0.35]);

    // Check that both networks give similar results (within tolerance)
    expect(Math.abs(originalPred[0] - loadedPred[0])).toBeLessThan(0.3);
  });

  test('should get statistics and metadata', () => {
    const hnn = new HealthcareNeuralNetwork({
      type: 'statistics_test',
      healthcareSpecialization: 'testing',
      numInput: 5,
      numHidden: 10,
      numOutput: 3
    });

    const stats = hnn.getStatistics();
    expect(stats).toBeDefined();
    expect(stats.numInput).toBe(5);
    expect(stats.numHidden).toBe(10);
    expect(stats.numOutput).toBe(3);
    expect(stats.type).toBe('statistics_test');
    expect(stats.healthcareSpecialization).toBe('testing');

    const metadata = hnn.getMetadata();
    expect(metadata).toBeDefined();
    expect(metadata.createdAt).toBeDefined();
    expect(metadata.type).toBe('statistics_test');
    expect(metadata.healthcareSpecialization).toBe('testing');
  });

  test('should handle evaluation', () => {
    const hnn = new HealthcareNeuralNetwork({
      numInput: 2,
      numHidden: 4,
      numOutput: 1
    });

    // Train with data
    const trainingData = [
      { input: [0, 0], output: [0] },
      { input: [0, 1], output: [1] },
      { input: [1, 0], output: [1] },
      { input: [1, 1], output: [0] }
    ];

    hnn.train(trainingData, { epochs: 100 });

    // Test with same data (for simplicity)
    const testData = [
      { input: [0, 0], output: [0] },
      { input: [0, 1], output: [1] }
    ];

    const result = hnn.evaluate(testData);
    expect(result).toBeDefined();
    expect(result.accuracy).toBeGreaterThanOrEqual(0);
    expect(result.accuracy).toBeLessThanOrEqual(1);
    expect(result.correct).toBeGreaterThanOrEqual(0);
    expect(result.total).toBe(2);
  });

  test('should warn when predicting without training', () => {
    const hnn = new HealthcareNeuralNetwork({
      numInput: 2,
      numHidden: 4,
      numOutput: 1
    });

    // Capture console.warn
    const originalWarn = console.warn;
    const mockWarn = jest.fn();
    console.warn = mockWarn;

    const prediction = hnn.predict([0.5, 0.5]);
    expect(prediction).toHaveLength(1);
    expect(mockWarn).toHaveBeenCalledWith('Model has not been trained yet. Predictions may be unreliable.');

    // Restore console.warn
    console.warn = originalWarn;
  });
});