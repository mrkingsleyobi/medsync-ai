// MediSync Healthcare AI Platform - ruv-FANN Demo
// Demonstration of healthcare neural networks

const HealthcareNeuralNetwork = require('./src/healthcare-nn');

async function runDemo() {
  console.log('🏥 MediSync ruv-FANN Healthcare Neural Networks Demo');
  console.log('====================================================\n');

  // Example 1: Create a diagnosis neural network
  console.log('1️⃣ Creating a specialized diagnosis neural network...\n');
  const diagnosisNN = HealthcareNeuralNetwork.createSpecializedNetwork('diagnosis', {
    healthcareSpecialization: 'cardiology'
  });

  console.log('✅ Diagnosis neural network created');
  console.log('📊 Network statistics:');
  const diagStats = diagnosisNN.getStatistics();
  console.log('   Input neurons:', diagStats.numInput);
  console.log('   Hidden neurons:', diagStats.numHidden);
  console.log('   Output neurons:', diagStats.numOutput);
  console.log('   Specialization:', diagStats.healthcareSpecialization);

  // Example 2: Create a risk assessment neural network
  console.log('\n2️⃣ Creating a risk assessment neural network...\n');
  const riskNN = HealthcareNeuralNetwork.createSpecializedNetwork('risk_assessment', {
    healthcareSpecialization: 'diabetes'
  });

  console.log('✅ Risk assessment neural network created');
  console.log('📊 Network statistics:');
  const riskStats = riskNN.getStatistics();
  console.log('   Input neurons:', riskStats.numInput);
  console.log('   Hidden neurons:', riskStats.numHidden);
  console.log('   Output neurons:', riskStats.numOutput);
  console.log('   Specialization:', riskStats.healthcareSpecialization);

  // Example 3: Train a simple neural network
  console.log('\n3️⃣ Training a simple healthcare neural network...\n');
  const simpleNN = new HealthcareNeuralNetwork({
    type: 'demo',
    healthcareSpecialization: 'general',
    numInput: 3,
    numHidden: 6,
    numOutput: 2,
    learningRate: 0.7
  });

  // Simple training data (simulating patient data)
  const trainingData = [
    { input: [0.1, 0.2, 0.3], output: [0.8, 0.2] }, // Patient with high risk
    { input: [0.4, 0.5, 0.6], output: [0.3, 0.7] }, // Patient with medium risk
    { input: [0.7, 0.8, 0.9], output: [0.1, 0.9] }, // Patient with low risk
    { input: [0.2, 0.3, 0.4], output: [0.7, 0.3] }, // Another high risk patient
    { input: [0.5, 0.6, 0.7], output: [0.4, 0.6] }  // Another medium risk patient
  ];

  const trainingResult = simpleNN.train(trainingData, {
    epochs: 500,
    targetError: 0.05,
    logInterval: 100
  });

  console.log('✅ Training completed');
  console.log('📊 Training results:');
  console.log('   Epochs:', trainingResult.epochs);
  console.log('   Final error:', trainingResult.finalError.toFixed(6));
  console.log('   Converged:', trainingResult.converged ? 'Yes' : 'No');

  // Example 4: Make predictions
  console.log('\n4️⃣ Making predictions with the trained network...\n');
  const testInputs = [
    [0.15, 0.25, 0.35], // Similar to high risk patient
    [0.55, 0.65, 0.75], // Similar to medium risk patient
    [0.85, 0.95, 0.90]  // Similar to low risk patient
  ];

  testInputs.forEach((input, index) => {
    const prediction = simpleNN.predict(input);
    console.log(`   Patient ${index + 1} [${input.join(', ')}] → [${prediction.map(p => p.toFixed(3)).join(', ')}]`);
  });

  // Example 5: Save and load model
  console.log('\n5️⃣ Saving and loading model...\n');
  const modelState = simpleNN.saveModel();
  console.log('✅ Model saved');
  console.log('📊 Model metadata:');
  console.log('   Created at:', modelState.metadata.createdAt);
  console.log('   Training history entries:', modelState.metadata.trainingHistory.length);

  // Create a new network and load the model
  const loadedNN = new HealthcareNeuralNetwork({
    numInput: 3,
    numHidden: 6,
    numOutput: 2
  });

  loadedNN.loadModel(modelState);
  console.log('✅ Model loaded successfully');

  // Test that the loaded model gives similar predictions
  const originalPred = simpleNN.predict([0.3, 0.4, 0.5]);
  const loadedPred = loadedNN.predict([0.3, 0.4, 0.5]);
  console.log('📊 Prediction comparison:');
  console.log('   Original model:', originalPred.map(p => p.toFixed(3)).join(', '));
  console.log('   Loaded model:  ', loadedPred.map(p => p.toFixed(3)).join(', '));

  // Example 6: Show model metadata
  console.log('\n6️⃣ Showing model metadata...\n');
  const metadata = simpleNN.getMetadata();
  console.log('📊 Model metadata:');
  console.log('   Type:', metadata.type);
  console.log('   Specialization:', metadata.healthcareSpecialization);
  console.log('   Created at:', metadata.createdAt);
  console.log('   Training history:', metadata.trainingHistory.length, 'entries');

  if (metadata.trainingHistory.length > 0) {
    const lastTraining = metadata.trainingHistory[metadata.trainingHistory.length - 1];
    console.log('   Last training:');
    console.log('     Duration:', lastTraining.duration, 'ms');
    console.log('     Epochs:', lastTraining.epochs);
    console.log('     Final error:', lastTraining.finalError.toFixed(6));
  }

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('🎉 Demo completed successfully!');
}

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };