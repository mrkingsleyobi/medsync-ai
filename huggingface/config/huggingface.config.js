// MediSync Healthcare AI Platform - HuggingFace Configuration
// Configuration file for HuggingFace model integration

module.exports = {
  // API Configuration
  api: {
    baseUrl: 'https://api-inference.huggingface.co',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },

  // Model Configuration
  models: {
    // Text Classification Models
    textClassification: {
      medicalBert: {
        name: 'emilyalsentzer/Bio_ClinicalBERT',
        type: 'text-classification',
        domain: 'medical',
        description: 'Clinical BERT model for medical text classification'
      },
      pubmedBert: {
        name: 'microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext',
        type: 'text-classification',
        domain: 'medical-research',
        description: 'PubMed BERT model for medical research text classification'
      },
      clinicalLongformer: {
        name: 'yikuan8/Clinical-Longformer',
        type: 'text-classification',
        domain: 'clinical-notes',
        description: 'Longformer model for long clinical notes classification'
      }
    },

    // Named Entity Recognition Models
    ner: {
      clinicalBert: {
        name: 'd4data/biomedical-ner-all',
        type: 'token-classification',
        domain: 'medical',
        description: 'Biomedical NER model for medical entities'
      },
      diseaseBert: {
        name: 'prajjwal1/bert-medium-disease',
        type: 'token-classification',
        domain: 'disease-detection',
        description: 'Disease-specific NER model'
      },
      drugBert: {
        name: 'dslim/bert-base-NER',
        type: 'token-classification',
        domain: 'pharmacovigilance',
        description: 'Drug and medication NER model'
      }
    },

    // Question Answering Models
    qa: {
      medicalQa: {
        name: 'deepset/medical_bert-base-squad2',
        type: 'question-answering',
        domain: 'medical-qa',
        description: 'Medical question answering model'
      },
      clinicalQa: {
        name: 'deepset/covid_bert-base-squad2',
        type: 'question-answering',
        domain: 'clinical-qa',
        description: 'Clinical question answering model'
      }
    },

    // Summarization Models
    summarization: {
      medicalBart: {
        name: 'facebook/bart-large-cnn',
        type: 'summarization',
        domain: 'medical-literature',
        description: 'BART model for medical text summarization'
      },
      clinicalBart: {
        name: 'Falconsai/medical_summarization',
        type: 'summarization',
        domain: 'clinical-notes',
        description: 'Clinical notes summarization model'
      }
    },

    // Text Generation Models
    generation: {
      medicalGpt: {
        name: 'epfl-llm/meditron-7b',
        type: 'text-generation',
        domain: 'medical-dialogue',
        description: 'Medical dialogue generation model'
      },
      clinicalGpt: {
        name: 'stanfordnlp/SteamSHP-med',
        type: 'text-generation',
        domain: 'clinical-recommendations',
        description: 'Clinical recommendation generation model'
      }
    },

    // Image Classification Models
    imageClassification: {
      medicalCnn: {
        name: 'microsoft/resnet-50',
        type: 'image-classification',
        domain: 'medical-imaging',
        description: 'ResNet model for medical image classification'
      },
      radiologyCnn: {
        name: 'google/vit-base-patch16-224',
        type: 'image-classification',
        domain: 'radiology',
        description: 'Vision Transformer for radiology image classification'
      },
      dermatologyCnn: {
        name: 'facebook/deit-base-patch16-224',
        type: 'image-classification',
        domain: 'dermatology',
        description: 'DeiT model for dermatology image classification'
      }
    }
  },

  // Healthcare-Specific Configuration
  healthcare: {
    // HIPAA Compliance Settings
    hipaaCompliance: {
      dataEncryption: true,
      auditLogging: true,
      dataRetention: '730d', // 2 years
      piiRedaction: true
    },

    // FDA Compliance Settings
    fdaCompliance: {
      modelValidation: true,
      traceability: true,
      explainability: true,
      safetyMonitoring: true
    },

    // GDPR Compliance Settings
    gdprCompliance: {
      dataMinimization: true,
      rightToErasure: true,
      dataPortability: true,
      consentManagement: true
    },

    // Medical Confidence Thresholds
    confidenceThresholds: {
      diagnosis: 0.95,
      treatment: 0.90,
      medication: 0.92,
      riskAssessment: 0.85
    },

    // Model Performance Requirements
    performance: {
      maxLatency: '1000ms', // 1 second
      minAccuracy: 0.85,
      maxErrorRate: 0.01, // 1%
      uptime: '99.9%'
    }
  },

  // Caching Configuration
  caching: {
    enabled: true,
    ttl: '1h', // 1 hour
    maxSize: '100MB',
    evictionPolicy: 'LRU'
  },

  // Monitoring Configuration
  monitoring: {
    enabled: true,
    metricsCollection: true,
    performanceLogging: true,
    errorReporting: true,
    healthChecks: '30s'
  },

  // Security Configuration
  security: {
    apiKeyEncryption: true,
    requestValidation: true,
    rateLimiting: {
      requestsPerMinute: 100,
      burstLimit: 20
    },
    authentication: {
      required: true,
      method: 'api-key'
    }
  }
};