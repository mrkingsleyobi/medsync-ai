// MediSync Healthcare AI Platform - HuggingFace Integration Demo
// Demonstration of HuggingFace model integration capabilities

const HuggingFaceIntegration = require('./src/huggingface');
const fs = require('fs');

async function runDemo() {
  console.log('🚀 MediSync HuggingFace Integration Demo');
  console.log('========================================\n');

  // Initialize HuggingFace integration
  const hf = new HuggingFaceIntegration({
    cacheDir: './demo/cache'
  });

  console.log('🔧 HuggingFace Integration Initialized');
  console.log('📊 System Statistics:', hf.getStatistics());
  console.log();

  // Register some models
  console.log('📋 Registering Healthcare Models...');

  // Text Classification Models
  hf.registerModel('medical-bert', {
    name: 'emilyalsentzer/Bio_ClinicalBERT',
    type: 'text-classification',
    domain: 'medical',
    description: 'Clinical BERT for medical text classification'
  });

  // Named Entity Recognition Models
  hf.registerModel('clinical-ner', {
    name: 'd4data/biomedical-ner-all',
    type: 'token-classification',
    domain: 'medical',
    description: 'Biomedical NER for medical entities'
  });

  // Question Answering Models
  hf.registerModel('medical-qa', {
    name: 'deepset/medical_bert-base-squad2',
    type: 'question-answering',
    domain: 'medical-qa',
    description: 'Medical question answering'
  });

  // Summarization Models
  hf.registerModel('clinical-summarization', {
    name: 'Falconsai/medical_summarization',
    type: 'summarization',
    domain: 'clinical-notes',
    description: 'Clinical notes summarization'
  });

  console.log('✅ Registered', hf.getRegisteredModels().length, 'models');
  console.log('📋 Registered Models:', hf.getRegisteredModels());
  console.log();

  // Load a model
  console.log('📥 Loading Medical BERT Model...');
  try {
    await hf.loadModel('medical-bert');
    console.log('✅ Medical BERT Model Loaded Successfully');

    const metadata = hf.getModelMetadata('medical-bert');
    console.log('📊 Model Metadata:', {
      name: metadata.name,
      type: metadata.type,
      domain: metadata.domain,
      status: metadata.status
    });
  } catch (error) {
    console.log('⚠️  Model loading requires API key for actual inference');
  }
  console.log();

  // Demonstrate model metadata
  console.log('🔍 All Model Metadata:');
  const allMetadata = hf.getAllModelMetadata();
  for (const [modelName, modelData] of Object.entries(allMetadata)) {
    console.log(`  ${modelName}: ${modelData.status}`);
  }
  console.log();

  // System statistics
  console.log('📈 Final System Statistics:');
  console.log(hf.getStatistics());
  console.log();

  // Clean up demo cache
  if (fs.existsSync('./demo/cache')) {
    fs.rmSync('./demo/cache', { recursive: true });
    console.log('🧹 Cleaned up demo cache');
  }

  console.log('\n🎉 HuggingFace Integration Demo Completed!');
  console.log('📝 Note: Actual model inference requires a HuggingFace API key');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };