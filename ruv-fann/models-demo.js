// MediSync Healthcare AI Platform - Healthcare-Specific Models Demo
// Demonstration of specialized healthcare neural networks

const MedicalDiagnosisNN = require('./src/models/diagnosis-nn');
const DrugInteractionNN = require('./src/models/drug-interaction-nn');
const RiskAssessmentNN = require('./src/models/risk-assessment-nn');

async function runDemo() {
  console.log('🏥 MediSync Healthcare-Specific Neural Networks Demo');
  console.log('==================================================\n');

  // Example 1: Medical Diagnosis Neural Network
  console.log('1️⃣ Medical Diagnosis Neural Network\n');
  const diagnosisNN = new MedicalDiagnosisNN({
    numInput: 50,
    numHidden: 100,
    numOutput: 25,
    confidenceThreshold: 0.8
  });

  // Add medical conditions and specialties
  diagnosisNN.addMedicalCondition('Hypertension');
  diagnosisNN.addMedicalCondition('Diabetes Mellitus');
  diagnosisNN.addMedicalCondition('Coronary Artery Disease');
  diagnosisNN.addMedicalSpecialty('Cardiology');
  diagnosisNN.addMedicalSpecialty('Endocrinology');

  console.log('✅ Diagnosis network initialized');
  console.log('📊 Network configuration:');
  const diagStats = diagnosisNN.getStatistics();
  console.log('   Input features:', diagStats.numInput);
  console.log('   Hidden neurons:', diagStats.numHidden);
  console.log('   Output categories:', diagStats.numOutput);
  console.log('   Confidence threshold:', diagStats.diagnosisSpecific.confidenceThreshold);

  // Example diagnosis prediction
  console.log('\n🔍 Making diagnosis prediction...');
  const patientSymptoms = new Array(50).fill(0);
  // Simulate some symptoms
  patientSymptoms[0] = 0.8; // High blood pressure
  patientSymptoms[1] = 0.7; // Chest pain
  patientSymptoms[2] = 0.6; // Shortness of breath
  patientSymptoms[3] = 0.9; // Headache

  const diagnosisResult = diagnosisNN.predictDiagnosis(patientSymptoms, {
    maxResults: 5,
    threshold: 0.5
  });

  console.log('📊 Diagnosis results:');
  console.log('   Overall input features processed:', diagnosisResult.input.length);
  console.log('   Potential diagnoses found:', diagnosisResult.diagnoses.length);
  diagnosisResult.diagnoses.forEach((diag, index) => {
    console.log(`   ${index + 1}. ${diag.condition} (Confidence: ${(diag.confidence * 100).toFixed(1)}%)`);
  });

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 2: Drug Interaction Neural Network
  console.log('2️⃣ Drug Interaction Neural Network\n');
  const drugNN = new DrugInteractionNN({
    numInput: 30,
    numHidden: 60,
    numOutput: 15,
    interactionThreshold: 0.6
  });

  // Add drugs and interaction types
  drugNN.addDrug('Warfarin');
  drugNN.addDrug('Aspirin');
  drugNN.addDrug('Ibuprofen');
  drugNN.addDrug('Digoxin');
  drugNN.addInteractionType('Anticoagulant Interaction');
  drugNN.addInteractionType('NSAID Interaction');
  drugNN.addInteractionType('Cardiac Drug Interaction');

  console.log('✅ Drug interaction network initialized');
  console.log('📊 Network configuration:');
  const drugStats = drugNN.getStatistics();
  console.log('   Input features:', drugStats.numInput);
  console.log('   Hidden neurons:', drugStats.numHidden);
  console.log('   Interaction types:', drugStats.numOutput);
  console.log('   Interaction threshold:', drugStats.drugInteractionSpecific.interactionThreshold);

  // Example drug interaction prediction
  console.log('\n⚠️  Checking drug interactions...');
  const drugPair = ['Warfarin', 'Aspirin'];
  const interactionResult = drugNN.predictInteractions(drugPair, {
    maxResults: 3,
    threshold: 0.4
  });

  console.log('📊 Interaction results:');
  console.log('   Drugs checked:', interactionResult.drugs.join(' + '));
  console.log('   Potential interactions found:', interactionResult.interactions.length);
  interactionResult.interactions.forEach((interaction, index) => {
    console.log(`   ${index + 1}. ${interaction.type} (Severity: ${(interaction.severity * 100).toFixed(1)}%)`);
  });

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 3: Patient Risk Assessment Neural Network
  console.log('3️⃣ Patient Risk Assessment Neural Network\n');
  const riskNN = new RiskAssessmentNN({
    numInput: 25,
    numHidden: 50,
    numOutput: 8,
    riskThresholds: {
      low: 0.3,
      medium: 0.6,
      high: 0.8
    }
  });

  // Add risk categories
  riskNN.addRiskCategory('Cardiovascular Risk');
  riskNN.addRiskCategory('Diabetes Risk');
  riskNN.addRiskCategory('Cancer Risk');
  riskNN.addRiskCategory('Stroke Risk');

  console.log('✅ Risk assessment network initialized');
  console.log('📊 Network configuration:');
  const riskStats = riskNN.getStatistics();
  console.log('   Input features:', riskStats.numInput);
  console.log('   Hidden neurons:', riskStats.numHidden);
  console.log('   Risk categories:', riskStats.numOutput);
  console.log('   Risk thresholds:', riskStats.riskAssessmentSpecific.riskThresholds);

  // Example risk assessment
  console.log('\n📋 Assessing patient risk...');
  const patientData = {
    age: 55,
    gender: 'male',
    bloodPressure: { systolic: 145, diastolic: 95 },
    heartRate: 85,
    temperature: 98.6,
    bmi: 32,
    history: {
      diabetes: false,
      hypertension: true,
      heartDisease: true,
      cancer: false
    },
    lifestyle: {
      smoking: true,
      alcohol: false,
      exercise: 0.3 // Low exercise level (0-1 scale)
    },
    labResults: {
      cholesterol: { total: 240, ldl: 160 },
      glucose: 110,
      creatine: 1.2
    },
    medications: {
      count: 3,
      highRisk: true
    }
  };

  const riskResult = riskNN.assessRisk(patientData, {
    threshold: 0.2
  });

  console.log('📊 Risk assessment results:');
  console.log('   Overall risk level:', riskResult.riskAssessment.riskLevel.toUpperCase());
  console.log('   Overall risk score:', (riskResult.riskAssessment.overallRisk * 100).toFixed(1) + '%');
  console.log('   Individual risk categories:');
  riskResult.riskAssessment.categories.slice(0, 3).forEach((category, index) => {
    console.log(`   ${index + 1}. ${category.category}: ${(category.score * 100).toFixed(1)}% (${category.level.toUpperCase()})`);
  });

  console.log('\n💡 Recommendations:');
  riskResult.riskAssessment.recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });

  console.log('\n' + '='.repeat(50) + '\n');

  // Example 4: Show metadata for all networks
  console.log('4️⃣ Network Metadata Summary\n');

  console.log('📊 Medical Diagnosis Network Metadata:');
  const diagMetadata = diagnosisNN.getDiagnosisMetadata();
  console.log('   Conditions in database:', diagMetadata.conditions.length);
  console.log('   Medical specialties:', diagMetadata.specialties.length);
  console.log('   Last updated:', diagMetadata.lastUpdated || 'Never');

  console.log('\n📊 Drug Interaction Network Metadata:');
  const drugMetadata = drugNN.getInteractionMetadata();
  console.log('   Drugs in database:', drugMetadata.drugDatabase.length);
  console.log('   Interaction types:', drugMetadata.interactionTypes.length);
  console.log('   Drug pairs analyzed:', drugMetadata.drugPairs);
  console.log('   Last updated:', drugMetadata.lastUpdated || 'Never');

  console.log('\n📊 Risk Assessment Network Metadata:');
  const riskMetadata = riskNN.getRiskMetadata();
  console.log('   Risk categories:', riskMetadata.categories.length);
  console.log('   Total assessments:', riskMetadata.assessments);
  console.log('   Last updated:', riskMetadata.lastUpdated || 'Never');

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('🎉 Demo completed successfully!');
}

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };