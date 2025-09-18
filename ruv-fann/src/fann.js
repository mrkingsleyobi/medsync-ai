// MediSync Healthcare AI Platform - ruv-FANN Neural Network Implementation
// Fast Artificial Neural Network implementation for healthcare applications

class FANN {
  /**
   * Create a new FANN neural network
   * @param {Object} config - Neural network configuration
   */
  constructor(config = {}) {
    this.config = {
      numInput: config.numInput || 1,
      numHidden: config.numHidden || 1,
      numOutput: config.numOutput || 1,
      learningRate: config.learningRate || 0.7,
      momentum: config.momentum || 0.0,
      activationFunction: config.activationFunction || 'sigmoid',
      ...config
    };

    this.weights = [];
    this.biases = [];
    this.activations = [];
    this.errors = [];

    // Initialize the network
    this._initializeNetwork();

    console.log('FANN neural network initialized', {
      numInput: this.config.numInput,
      numHidden: this.config.numHidden,
      numOutput: this.config.numOutput
    });
  }

  /**
   * Initialize the neural network weights and biases
   * @private
   */
  _initializeNetwork() {
    // Initialize weights between input and hidden layers
    this.weights.push(this._createRandomMatrix(this.config.numInput, this.config.numHidden));

    // Initialize weights between hidden and output layers
    this.weights.push(this._createRandomMatrix(this.config.numHidden, this.config.numOutput));

    // Initialize biases for hidden and output layers
    this.biases.push(new Array(this.config.numHidden).fill(0).map(() => Math.random() * 2 - 1));
    this.biases.push(new Array(this.config.numOutput).fill(0).map(() => Math.random() * 2 - 1));

    // Initialize activation arrays
    this.activations.push(new Array(this.config.numInput).fill(0));
    this.activations.push(new Array(this.config.numHidden).fill(0));
    this.activations.push(new Array(this.config.numOutput).fill(0));

    // Initialize error arrays
    this.errors.push(new Array(this.config.numHidden).fill(0));
    this.errors.push(new Array(this.config.numOutput).fill(0));
  }

  /**
   * Create a random matrix with values between -1 and 1
   * @param {number} rows - Number of rows
   * @param {number} cols - Number of columns
   * @returns {Array} Random matrix
   * @private
   */
  _createRandomMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.random() * 2 - 1);
      }
      matrix.push(row);
    }
    return matrix;
  }

  /**
   * Activation function
   * @param {number} x - Input value
   * @returns {number} Activated value
   * @private
   */
  _activationFunction(x) {
    switch (this.config.activationFunction) {
      case 'sigmoid':
        return 1 / (1 + Math.exp(-x));
      case 'tanh':
        return Math.tanh(x);
      case 'relu':
        return Math.max(0, x);
      default:
        return 1 / (1 + Math.exp(-x));
    }
  }

  /**
   * Derivative of activation function
   * @param {number} x - Input value
   * @returns {number} Derivative value
   * @private
   */
  _activationDerivative(x) {
    switch (this.config.activationFunction) {
      case 'sigmoid':
        const sigmoid = 1 / (1 + Math.exp(-x));
        return sigmoid * (1 - sigmoid);
      case 'tanh':
        return 1 - Math.tanh(x) * Math.tanh(x);
      case 'relu':
        return x > 0 ? 1 : 0;
      default:
        const sig = 1 / (1 + Math.exp(-x));
        return sig * (1 - sig);
    }
  }

  /**
   * Forward propagation
   * @param {Array} inputs - Input values
   * @returns {Array} Output values
   */
  forward(inputs) {
    if (inputs.length !== this.config.numInput) {
      throw new Error(`Expected ${this.config.numInput} inputs, got ${inputs.length}`);
    }

    // Set input layer activations
    this.activations[0] = [...inputs];

    // Calculate hidden layer activations
    for (let j = 0; j < this.config.numHidden; j++) {
      let sum = this.biases[0][j];
      for (let i = 0; i < this.config.numInput; i++) {
        sum += inputs[i] * this.weights[0][i][j];
      }
      this.activations[1][j] = this._activationFunction(sum);
    }

    // Calculate output layer activations
    const outputs = [];
    for (let k = 0; k < this.config.numOutput; k++) {
      let sum = this.biases[1][k];
      for (let j = 0; j < this.config.numHidden; j++) {
        sum += this.activations[1][j] * this.weights[1][j][k];
      }
      outputs[k] = this._activationFunction(sum);
    }

    this.activations[2] = outputs;
    return [...outputs];
  }

  /**
   * Backward propagation
   * @param {Array} targets - Target values
   * @returns {number} Mean squared error
   */
  backward(targets) {
    if (targets.length !== this.config.numOutput) {
      throw new Error(`Expected ${this.config.numOutput} targets, got ${targets.length}`);
    }

    // Calculate output layer errors
    const outputErrors = [];
    for (let k = 0; k < this.config.numOutput; k++) {
      const error = targets[k] - this.activations[2][k];
      outputErrors[k] = error * this._activationDerivative(this.activations[2][k]);
      this.errors[1][k] = outputErrors[k];
    }

    // Calculate hidden layer errors
    for (let j = 0; j < this.config.numHidden; j++) {
      let error = 0;
      for (let k = 0; k < this.config.numOutput; k++) {
        error += outputErrors[k] * this.weights[1][j][k];
      }
      this.errors[0][j] = error * this._activationDerivative(this.activations[1][j]);
    }

    // Update weights and biases
    // Update weights between hidden and output layers
    for (let j = 0; j < this.config.numHidden; j++) {
      for (let k = 0; k < this.config.numOutput; k++) {
        this.weights[1][j][k] += this.config.learningRate * outputErrors[k] * this.activations[1][j];
      }
    }

    // Update biases for output layer
    for (let k = 0; k < this.config.numOutput; k++) {
      this.biases[1][k] += this.config.learningRate * outputErrors[k];
    }

    // Update weights between input and hidden layers
    for (let i = 0; i < this.config.numInput; i++) {
      for (let j = 0; j < this.config.numHidden; j++) {
        this.weights[0][i][j] += this.config.learningRate * this.errors[0][j] * this.activations[0][i];
      }
    }

    // Update biases for hidden layer
    for (let j = 0; j < this.config.numHidden; j++) {
      this.biases[0][j] += this.config.learningRate * this.errors[0][j];
    }

    // Calculate mean squared error
    let mse = 0;
    for (let k = 0; k < this.config.numOutput; k++) {
      mse += Math.pow(targets[k] - this.activations[2][k], 2);
    }
    mse /= this.config.numOutput;

    return mse;
  }

  /**
   * Train the neural network
   * @param {Array} trainingData - Training data [{input, output}, ...]
   * @param {Object} options - Training options
   * @returns {Object} Training results
   */
  train(trainingData, options = {}) {
    const epochs = options.epochs || 1000;
    const targetError = options.targetError || 0.01;
    const logInterval = options.logInterval || 100;

    let epoch = 0;
    let error = Infinity;

    while (epoch < epochs && error > targetError) {
      let totalError = 0;

      for (const data of trainingData) {
        const outputs = this.forward(data.input);
        const mse = this.backward(data.output);
        totalError += mse;
      }

      error = totalError / trainingData.length;

      if (epoch % logInterval === 0) {
        console.log(`Epoch ${epoch}, Error: ${error.toFixed(6)}`);
      }

      epoch++;
    }

    return {
      epochs: epoch,
      finalError: error,
      converged: error <= targetError
    };
  }

  /**
   * Test the neural network
   * @param {Array} testData - Test data [{input, output}, ...]
   * @returns {Object} Test results
   */
  test(testData) {
    let correct = 0;
    let total = testData.length;

    for (const data of testData) {
      const outputs = this.forward(data.input);
      const predicted = outputs.map(o => Math.round(o));
      const actual = data.output.map(o => Math.round(o));

      if (predicted.every((p, i) => p === actual[i])) {
        correct++;
      }
    }

    return {
      accuracy: correct / total,
      correct,
      total
    };
  }

  /**
   * Get network weights
   * @returns {Array} Network weights
   */
  getWeights() {
    return this.weights.map(layer => layer.map(row => [...row]));
  }

  /**
   * Set network weights
   * @param {Array} weights - New weights
   */
  setWeights(weights) {
    if (weights.length !== this.weights.length) {
      throw new Error('Invalid weights structure');
    }

    for (let i = 0; i < weights.length; i++) {
      if (weights[i].length !== this.weights[i].length) {
        throw new Error('Invalid weights structure');
      }

      for (let j = 0; j < weights[i].length; j++) {
        if (weights[i][j].length !== this.weights[i][j].length) {
          throw new Error('Invalid weights structure');
        }

        for (let k = 0; k < weights[i][j].length; k++) {
          this.weights[i][j][k] = weights[i][j][k];
        }
      }
    }
  }

  /**
   * Get network configuration
   * @returns {Object} Network configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Get network statistics
   * @returns {Object} Network statistics
   */
  getStatistics() {
    return {
      numInput: this.config.numInput,
      numHidden: this.config.numHidden,
      numOutput: this.config.numOutput,
      totalWeights: this.weights.reduce((sum, layer) => sum + layer.length * layer[0].length, 0),
      totalBiases: this.biases.reduce((sum, layer) => sum + layer.length, 0)
    };
  }
}

module.exports = FANN;