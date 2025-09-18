// MediSync Healthcare AI Platform - ruv-FANN Tests
// Test suite for the FANN neural network implementation

const FANN = require('../src/fann');

describe('ruv-FANN Neural Network', () => {
  test('should initialize FANN neural network', () => {
    const fann = new FANN({
      numInput: 2,
      numHidden: 3,
      numOutput: 1
    });

    expect(fann).toBeInstanceOf(FANN);
    expect(fann.getConfig()).toBeDefined();
    expect(fann.getConfig().numInput).toBe(2);
    expect(fann.getConfig().numHidden).toBe(3);
    expect(fann.getConfig().numOutput).toBe(1);
  });

  test('should perform forward propagation', () => {
    const fann = new FANN({
      numInput: 2,
      numHidden: 3,
      numOutput: 1
    });

    const inputs = [0.5, 0.8];
    const outputs = fann.forward(inputs);

    expect(outputs).toHaveLength(1);
    expect(outputs[0]).toBeGreaterThanOrEqual(0);
    expect(outputs[0]).toBeLessThanOrEqual(1);
  });

  test('should handle forward propagation with different activation functions', () => {
    const fannSigmoid = new FANN({ numInput: 2, numHidden: 3, numOutput: 1, activationFunction: 'sigmoid' });
    const fannTanh = new FANN({ numInput: 2, numHidden: 3, numOutput: 1, activationFunction: 'tanh' });
    const fannRelu = new FANN({ numInput: 2, numHidden: 3, numOutput: 1, activationFunction: 'relu' });

    const inputs = [0.5, 0.8];
    const outputSigmoid = fannSigmoid.forward(inputs);
    const outputTanh = fannTanh.forward(inputs);
    const outputRelu = fannRelu.forward(inputs);

    expect(outputSigmoid[0]).toBeGreaterThanOrEqual(0);
    expect(outputSigmoid[0]).toBeLessThanOrEqual(1);
    expect(outputTanh[0]).toBeGreaterThanOrEqual(-1);
    expect(outputTanh[0]).toBeLessThanOrEqual(1);
    expect(outputRelu[0]).toBeGreaterThanOrEqual(0);
  });

  test('should perform backward propagation', () => {
    const fann = new FANN({
      numInput: 2,
      numHidden: 3,
      numOutput: 1
    });

    const inputs = [0.5, 0.8];
    const targets = [0.7];

    fann.forward(inputs);
    const error = fann.backward(targets);

    expect(typeof error).toBe('number');
    expect(error).toBeGreaterThanOrEqual(0);
  });

  test('should train on XOR problem', () => {
    const fann = new FANN({
      numInput: 2,
      numHidden: 4,
      numOutput: 1,
      learningRate: 0.7
    });

    // XOR training data
    const trainingData = [
      { input: [0, 0], output: [0] },
      { input: [0, 1], output: [1] },
      { input: [1, 0], output: [1] },
      { input: [1, 1], output: [0] }
    ];

    const result = fann.train(trainingData, {
      epochs: 5000,
      targetError: 0.01,
      logInterval: 1000
    });

    expect(result.epochs).toBeGreaterThan(0);
    expect(result.finalError).toBeLessThan(0.3);
  });

  test('should get and set weights', () => {
    const fann = new FANN({
      numInput: 2,
      numHidden: 3,
      numOutput: 1
    });

    const originalWeights = fann.getWeights();
    expect(originalWeights).toHaveLength(2);
    expect(originalWeights[0]).toHaveLength(2);
    expect(originalWeights[0][0]).toHaveLength(3);
    expect(originalWeights[1]).toHaveLength(3);
    expect(originalWeights[1][0]).toHaveLength(1);

    // Modify weights
    const newWeights = JSON.parse(JSON.stringify(originalWeights));
    newWeights[0][0][0] = 0.5;
    fann.setWeights(newWeights);

    const updatedWeights = fann.getWeights();
    expect(updatedWeights[0][0][0]).toBe(0.5);
  });

  test('should get network statistics', () => {
    const fann = new FANN({
      numInput: 3,
      numHidden: 5,
      numOutput: 2
    });

    const stats = fann.getStatistics();
    expect(stats).toBeDefined();
    expect(stats.numInput).toBe(3);
    expect(stats.numHidden).toBe(5);
    expect(stats.numOutput).toBe(2);
    expect(stats.totalWeights).toBe(25); // 3*5 + 5*2 = 15 + 10 = 25
    expect(stats.totalBiases).toBe(7); // 5 + 2 = 7
  });

  test('should handle error cases', () => {
    const fann = new FANN({
      numInput: 2,
      numHidden: 3,
      numOutput: 1
    });

    // Test invalid input size
    expect(() => fann.forward([0.5])).toThrow();
    expect(() => fann.forward([0.5, 0.3, 0.7])).toThrow();

    // Test invalid target size
    fann.forward([0.5, 0.3]);
    expect(() => fann.backward([0.5, 0.3])).toThrow();
    expect(() => fann.backward([])).toThrow();
  });
});