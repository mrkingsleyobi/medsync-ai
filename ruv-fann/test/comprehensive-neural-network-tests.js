// MediSync Healthcare AI Platform - Comprehensive Neural Network Test Suite
// Comprehensive test suite for all neural network components using the testing framework

const NeuralNetworkTestingFramework = require('./neural-network-testing-framework');
const FANN = require('../src/fann');
const HealthcareNeuralNetwork = require('../src/healthcare-nn');
const MedicalDiagnosisNN = require('../src/models/diagnosis-nn');
const DrugInteractionNN = require('../src/models/drug-interaction-nn');
const RiskAssessmentNN = require('../src/models/risk-assessment-nn');
const WASMCompiler = require('../src/wasm/wasm-compiler');
const WASMRuntime = require('../src/wasm/wasm-runtime');
const path = require('path');

async function runComprehensiveTests() {
  const framework = new NeuralNetworkTestingFramework();

  // Test Suite 1: Core FANN Implementation
  framework.addTestSuite('Core FANN Implementation', (testFramework) => {
    testFramework.addTest('FANN initialization', () => {
      const fann = new FANN({
        numInput: 3,
        numHidden: 5,
        numOutput: 2
      });

      testFramework.assert(fann instanceof FANN, 'FANN should be instance of FANN class');
      testFramework.assertEqual(fann.getConfig().numInput, 3, 'Input neurons should be 3');
      testFramework.assertEqual(fann.getConfig().numHidden, 5, 'Hidden neurons should be 5');
      testFramework.assertEqual(fann.getConfig().numOutput, 2, 'Output neurons should be 2');
    });

    testFramework.addTest('Forward propagation', () => {
      const fann = new FANN({
        numInput: 2,
        numHidden: 3,
        numOutput: 1
      });

      const inputs = [0.5, 0.8];
      const outputs = fann.forward(inputs);

      testFramework.assertArrayLength(outputs, 1, 'Output should have 1 element');
      testFramework.assertInRange(outputs[0], 0, 1, 'Output should be between 0 and 1');
    });

    testFramework.addTest('Backward propagation', () => {
      const fann = new FANN({
        numInput: 2,
        numHidden: 3,
        numOutput: 1
      });

      const inputs = [0.5, 0.8];
      const targets = [0.7];

      fann.forward(inputs);
      const error = fann.backward(targets);

      testFramework.assert(typeof error === 'number', 'Error should be a number');
      testFramework.assert(error >= 0, 'Error should be non-negative');
    });

    testFramework.addTest('XOR training', () => {
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
        epochs: 1000,
        targetError: 0.1
      });

      testFramework.assert(result.epochs > 0, 'Should have trained for at least 1 epoch');
      testFramework.assert(result.finalError < 0.5, 'Final error should be reasonably low');
    });

    testFramework.addTest('Weight management', () => {
      const fann = new FANN({
        numInput: 2,
        numHidden: 3,
        numOutput: 1
      });

      const originalWeights = fann.getWeights();
      testFramework.assertArrayLength(originalWeights, 2, 'Should have 2 weight layers');

      // Modify weights
      const newWeights = JSON.parse(JSON.stringify(originalWeights));
      newWeights[0][0][0] = 0.5;
      fann.setWeights(newWeights);

      const updatedWeights = fann.getWeights();
      testFramework.assertEqual(updatedWeights[0][0][0], 0.5, 'Weight should be updated');
    });

    testFramework.addTest('Error handling', () => {
      const fann = new FANN({
        numInput: 2,
        numHidden: 3,
        numOutput: 1
      });

      // Test invalid input size
      testFramework.assertThrows(() => fann.forward([0.5]), 'Should throw error for invalid input size');
      testFramework.assertThrows(() => fann.forward([0.5, 0.3, 0.7]), 'Should throw error for invalid input size');

      // Test invalid target size
      fann.forward([0.5, 0.3]);
      testFramework.assertThrows(() => fann.backward([0.5, 0.3]), 'Should throw error for invalid target size');
    });
  });

  // Test Suite 2: Healthcare Neural Network Implementation
  framework.addTestSuite('Healthcare Neural Network Implementation', (testFramework) => {
    testFramework.addTest('Healthcare NN initialization', () => {
      const hnn = new HealthcareNeuralNetwork({
        type: 'diagnosis',
        healthcareSpecialization: 'cardiology',
        numInput: 10,
        numHidden: 20,
        numOutput: 5
      });

      testFramework.assert(hnn instanceof HealthcareNeuralNetwork, 'Should be instance of HealthcareNeuralNetwork');
      testFramework.assert(hnn.getStatistics() !== undefined, 'Should have statistics');
      testFramework.assert(hnn.getMetadata() !== undefined, 'Should have metadata');
    });

    testFramework.addTest('Specialized networks creation', () => {
      const diagnosisNN = HealthcareNeuralNetwork.createSpecializedNetwork('diagnosis');
      const riskNN = HealthcareNeuralNetwork.createSpecializedNetwork('risk_assessment');
      const drugNN = HealthcareNeuralNetwork.createSpecializedNetwork('drug_interaction');

      testFramework.assertEqual(diagnosisNN.config.type, 'diagnosis', 'Should create diagnosis network');
      testFramework.assertEqual(riskNN.config.type, 'risk_assessment', 'Should create risk assessment network');
      testFramework.assertEqual(drugNN.config.type, 'drug_interaction', 'Should create drug interaction network');
    });

    testFramework.addTest('Training and prediction', () => {
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
        epochs: 50,
        targetError: 0.2
      });

      testFramework.assert(result.epochs > 0, 'Should have trained for epochs');
      testFramework.assert(result.finalError >= 0, 'Final error should be non-negative');

      // Test prediction
      const prediction = hnn.predict([0.2, 0.3, 0.4]);
      testFramework.assertArrayLength(prediction, 2, 'Prediction should have 2 outputs');
      testFramework.assertInRange(prediction[0], 0, 1, 'Prediction should be between 0 and 1');
    });

    testFramework.addTest('Model save and load', () => {
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
      testFramework.assert(modelState.weights !== undefined, 'Should have weights');
      testFramework.assert(modelState.config !== undefined, 'Should have config');
      testFramework.assert(modelState.trained === true, 'Should be marked as trained');

      // Create new network and load model
      const newHNN = new HealthcareNeuralNetwork({
        numInput: 2,
        numHidden: 4,
        numOutput: 1
      });

      newHNN.loadModel(modelState);
      testFramework.assert(newHNN.trained === true, 'New network should be marked as trained');
    });
  });

  // Test Suite 3: Healthcare-Specific Models
  framework.addTestSuite('Healthcare-Specific Models', (testFramework) => {
    testFramework.addTest('Medical Diagnosis NN', () => {
      const diagnosisNN = new MedicalDiagnosisNN({
        numInput: 50,
        numHidden: 100,
        numOutput: 25
      });

      testFramework.assert(diagnosisNN instanceof MedicalDiagnosisNN, 'Should be instance of MedicalDiagnosisNN');
      testFramework.assertEqual(diagnosisNN.config.type, 'medical_diagnosis', 'Should have correct type');
      testFramework.assertEqual(diagnosisNN.config.healthcareSpecialization, 'clinical_decision_support', 'Should have correct specialization');

      // Add conditions and specialties
      diagnosisNN.addMedicalCondition('hypertension');
      diagnosisNN.addMedicalSpecialty('cardiology');

      const metadata = diagnosisNN.getDiagnosisMetadata();
      testFramework.assert(metadata.conditions.includes('hypertension'), 'Should include hypertension');
      testFramework.assert(metadata.specialties.includes('cardiology'), 'Should include cardiology');
    });

    testFramework.addTest('Drug Interaction NN', () => {
      const drugNN = new DrugInteractionNN({
        numInput: 25,
        numHidden: 50,
        numOutput: 15
      });

      testFramework.assert(drugNN instanceof DrugInteractionNN, 'Should be instance of DrugInteractionNN');
      testFramework.assertEqual(drugNN.config.type, 'drug_interaction', 'Should have correct type');
      testFramework.assertEqual(drugNN.config.healthcareSpecialization, 'pharmacovigilance', 'Should have correct specialization');

      // Add drugs and interaction types
      drugNN.addDrug('aspirin');
      drugNN.addInteractionType('anticoagulant_interaction');

      const metadata = drugNN.getInteractionMetadata();
      testFramework.assert(metadata.drugDatabase.includes('aspirin'), 'Should include aspirin');
      testFramework.assert(metadata.interactionTypes.includes('anticoagulant_interaction'), 'Should include anticoagulant_interaction');
    });

    testFramework.addTest('Risk Assessment NN', () => {
      const riskNN = new RiskAssessmentNN({
        numInput: 20,
        numHidden: 40,
        numOutput: 8
      });

      testFramework.assert(riskNN instanceof RiskAssessmentNN, 'Should be instance of RiskAssessmentNN');
      testFramework.assertEqual(riskNN.config.type, 'risk_assessment', 'Should have correct type');
      testFramework.assertEqual(riskNN.config.healthcareSpecialization, 'predictive_analytics', 'Should have correct specialization');

      // Add risk categories
      riskNN.addRiskCategory('cardiovascular_risk');

      const metadata = riskNN.getRiskMetadata();
      testFramework.assert(metadata.categories.includes('cardiovascular_risk'), 'Should include cardiovascular_risk');
    });
  });

  // Test Suite 4: WASM Integration
  framework.addTestSuite('WASM Integration', async (testFramework) => {
    testFramework.addTest('WASM Compiler initialization', () => {
      const compiler = new WASMCompiler();
      testFramework.assert(compiler instanceof WASMCompiler, 'Should be instance of WASMCompiler');
      testFramework.assert(compiler.config !== undefined, 'Should have config');
    });

    testFramework.addTest('WASM Runtime initialization', () => {
      const runtime = new WASMRuntime();
      testFramework.assert(runtime instanceof WASMRuntime, 'Should be instance of WASMRuntime');
      testFramework.assert(runtime.config !== undefined, 'Should have config');
    });

    testFramework.addTest('WASM Compilation pipeline', async () => {
      const compiler = new WASMCompiler();
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');

      const result = await compiler.compile(sourceFile, {
        optimization: '-O2'
      });

      testFramework.assert(result.success === true, 'Compilation should succeed');
      testFramework.assert(result.wasmFile !== undefined, 'Should have WASM file path');
      testFramework.assert(result.jsFile !== undefined, 'Should have JS file path');
      testFramework.assert(result.compilationTime > 0, 'Should have compilation time');
    });

    testFramework.addTest('WASM Runtime execution', async () => {
      const compiler = new WASMCompiler();
      const runtime = new WASMRuntime();
      const sourceFile = path.join(__dirname, '../src/wasm/neural-network.c');

      // Compile first
      const compileResult = await compiler.compile(sourceFile);
      testFramework.assert(compileResult.success === true, 'Compilation should succeed');

      // Load module
      const loadResult = await runtime.loadModule(compileResult.wasmFile, 'test-module');
      testFramework.assert(loadResult.success === true, 'Module loading should succeed');
      testFramework.assert(runtime.isModuleLoaded('test-module') === true, 'Module should be loaded');

      // Execute forward propagation
      const inputs = [0.5, 0.3, 0.8];
      const weights = {
        inputToHidden: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
        hiddenToOutput: [0.7, 0.8, 0.9]
      };
      const biases = {
        hidden: [0.1, 0.2],
        output: [0.3]
      };

      const result = await runtime.executeForwardPropagation(
        'test-module',
        inputs,
        weights,
        biases,
        { hiddenSize: 2, outputSize: 1 }
      );

      testFramework.assert(result.success === true, 'Forward propagation should succeed');
      testFramework.assert(result.result !== undefined, 'Should have result');
      testFramework.assert(result.result.hiddenLayer.length === 2, 'Should have 2 hidden layer outputs');
      testFramework.assert(result.result.outputLayer.length === 1, 'Should have 1 output layer value');
      testFramework.assert(result.executionTime > 0, 'Should have execution time');
    });
  });

  // Test Suite 5: Performance and Integration
  framework.addTestSuite('Performance and Integration', (testFramework) => {
    testFramework.addTest('Performance comparison', () => {
      // This is a simplified performance test
      // In a real implementation, we would run actual benchmarks
      const baseline = { executionTime: 100, memoryUsage: 50 };
      const current = { executionTime: 90, memoryUsage: 45 };

      const comparison = framework.comparePerformance(baseline, current);
      testFramework.assert(Object.keys(comparison.improvements).length > 0, 'Should show improvements');
    });

    testFramework.addTest('Integration between components', () => {
      // Test that all components can work together
      const diagnosisNN = new MedicalDiagnosisNN();
      const drugNN = new DrugInteractionNN();
      const riskNN = new RiskAssessmentNN();

      // All should be properly initialized
      testFramework.assert(diagnosisNN.config.type === 'medical_diagnosis', 'Diagnosis NN should be properly configured');
      testFramework.assert(drugNN.config.type === 'drug_interaction', 'Drug NN should be properly configured');
      testFramework.assert(riskNN.config.type === 'risk_assessment', 'Risk NN should be properly configured');
    });
  });

  // Run all tests
  const results = await framework.runAllTests();

  // Save results
  framework.saveResults('./test-results/neural-network-comprehensive-test-results.json', results);

  return results;
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runComprehensiveTests().then(results => {
    if (results.success) {
      console.log('\n🎉 All neural network tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some neural network tests failed!');
      process.exit(1);
    }
  }).catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
  });
}

module.exports = { runComprehensiveTests };