/**
 * Clinical Workflow Configuration
 * Configuration for clinical decision support workflows
 */

module.exports = {
  // Workflow engine settings
  engine: {
    name: 'Clinical Decision Support Workflow Engine',
    version: '1.0.0',
    description: 'Workflow engine for clinical decision support processes',
    enabled: true,
    maxConcurrentWorkflows: 50,
    timeout: 60000 // 60 seconds
  },

  // Workflow definitions
  workflows: {
    diagnosisSupport: {
      name: 'Diagnosis Support Workflow',
      description: 'Workflow for generating diagnosis support recommendations',
      version: '1.0.0',
      steps: [
        'patientDataValidation',
        'symptomAnalysis',
        'vitalSignsAssessment',
        'medicalHistoryReview',
        'diagnosisRecommendation',
        'evidenceCollection',
        'confidenceCalculation',
        'resultGeneration'
      ],
      enabled: true,
      timeout: 30000 // 30 seconds
    },

    treatmentRecommendation: {
      name: 'Treatment Recommendation Workflow',
      description: 'Workflow for generating treatment recommendations',
      version: '1.0.0',
      steps: [
        'conditionValidation',
        'guidelineRetrieval',
        'patientProfileAnalysis',
        'contraindicationCheck',
        'interactionCheck',
        'dosageCalculation',
        'recommendationGeneration',
        'evidenceCollection'
      ],
      enabled: true,
      timeout: 30000 // 30 seconds
    },

    riskAssessment: {
      name: 'Risk Assessment Workflow',
      description: 'Workflow for assessing patient risk factors',
      version: '1.0.0',
      steps: [
        'riskFactorIdentification',
        'vitalSignsAnalysis',
        'labResultReview',
        'medicalHistoryAssessment',
        'riskCalculation',
        'recommendationGeneration',
        'evidenceCollection'
      ],
      enabled: true,
      timeout: 25000 // 25 seconds
    },

    drugInteraction: {
      name: 'Drug Interaction Workflow',
      description: 'Workflow for identifying potential drug interactions',
      version: '1.0.0',
      steps: [
        'medicationListValidation',
        'interactionDatabaseQuery',
        'patientProfileCheck',
        'severityAssessment',
        'recommendationGeneration',
        'evidenceCollection'
      ],
      enabled: true,
      timeout: 20000 // 20 seconds
    },

    clinicalAlert: {
      name: 'Clinical Alert Workflow',
      description: 'Workflow for generating clinical alerts',
      version: '1.0.0',
      steps: [
        'vitalSignsMonitoring',
        'labResultAnalysis',
        'thresholdComparison',
        'alertGeneration',
        'severityClassification',
        'notificationDispatch'
      ],
      enabled: true,
      timeout: 15000 // 15 seconds
    }
  },

  // Workflow steps configuration
  steps: {
    patientDataValidation: {
      name: 'Patient Data Validation',
      description: 'Validate patient data and required fields',
      timeout: 2000,
      requiredFields: ['patientId']
    },

    symptomAnalysis: {
      name: 'Symptom Analysis',
      description: 'Analyze patient symptoms for pattern matching',
      timeout: 3000,
      requiredFields: ['symptoms']
    },

    vitalSignsAssessment: {
      name: 'Vital Signs Assessment',
      description: 'Assess patient vital signs for abnormalities',
      timeout: 2500,
      requiredFields: ['vitalSigns']
    },

    medicalHistoryReview: {
      name: 'Medical History Review',
      description: 'Review patient medical history for relevant factors',
      timeout: 3000,
      requiredFields: ['medicalHistory']
    },

    diagnosisRecommendation: {
      name: 'Diagnosis Recommendation',
      description: 'Generate diagnosis recommendations based on analysis',
      timeout: 4000
    },

    evidenceCollection: {
      name: 'Evidence Collection',
      description: 'Collect supporting evidence for recommendations',
      timeout: 3000
    },

    confidenceCalculation: {
      name: 'Confidence Calculation',
      description: 'Calculate confidence score for recommendations',
      timeout: 2000
    },

    resultGeneration: {
      name: 'Result Generation',
      description: 'Generate final decision support result',
      timeout: 1500
    },

    conditionValidation: {
      name: 'Condition Validation',
      description: 'Validate patient condition for treatment',
      timeout: 2000,
      requiredFields: ['condition']
    },

    guidelineRetrieval: {
      name: 'Guideline Retrieval',
      description: 'Retrieve relevant clinical guidelines',
      timeout: 3000
    },

    patientProfileAnalysis: {
      name: 'Patient Profile Analysis',
      description: 'Analyze patient profile for personalized treatment',
      timeout: 3500
    },

    contraindicationCheck: {
      name: 'Contraindication Check',
      description: 'Check for treatment contraindications',
      timeout: 2500
    },

    interactionCheck: {
      name: 'Interaction Check',
      description: 'Check for drug interactions',
      timeout: 2500
    },

    dosageCalculation: {
      name: 'Dosage Calculation',
      description: 'Calculate appropriate medication dosages',
      timeout: 2000
    },

    recommendationGeneration: {
      name: 'Recommendation Generation',
      description: 'Generate treatment recommendations',
      timeout: 3000
    },

    riskFactorIdentification: {
      name: 'Risk Factor Identification',
      description: 'Identify patient risk factors',
      timeout: 2500
    },

    labResultReview: {
      name: 'Lab Result Review',
      description: 'Review laboratory results for risk assessment',
      timeout: 3000,
      requiredFields: ['labResults']
    },

    riskCalculation: {
      name: 'Risk Calculation',
      description: 'Calculate patient risk scores',
      timeout: 3000
    },

    medicationListValidation: {
      name: 'Medication List Validation',
      description: 'Validate patient medication list',
      timeout: 2000,
      requiredFields: ['medications']
    },

    interactionDatabaseQuery: {
      name: 'Interaction Database Query',
      description: 'Query drug interaction database',
      timeout: 3500
    },

    patientProfileCheck: {
      name: 'Patient Profile Check',
      description: 'Check patient profile for interaction risk factors',
      timeout: 2500
    },

    severityAssessment: {
      name: 'Severity Assessment',
      description: 'Assess severity of potential interactions',
      timeout: 2000
    },

    vitalSignsMonitoring: {
      name: 'Vital Signs Monitoring',
      description: 'Monitor patient vital signs for critical values',
      timeout: 2000
    },

    labResultAnalysis: {
      name: 'Lab Result Analysis',
      description: 'Analyze laboratory results for critical values',
      timeout: 2500
    },

    thresholdComparison: {
      name: 'Threshold Comparison',
      description: 'Compare values against critical thresholds',
      timeout: 1500
    },

    alertGeneration: {
      name: 'Alert Generation',
      description: 'Generate clinical alert',
      timeout: 2000
    },

    severityClassification: {
      name: 'Severity Classification',
      description: 'Classify alert severity',
      timeout: 1500
    },

    notificationDispatch: {
      name: 'Notification Dispatch',
      description: 'Dispatch alert notification',
      timeout: 2000
    }
  },

  // Workflow execution settings
  execution: {
    parallelSteps: true,
    maxRetries: 3,
    retryDelay: 1000,
    errorHandling: {
      strategy: 'fail-fast',
      logErrors: true,
      notifyOnFailure: true
    }
  },

  // Workflow monitoring settings
  monitoring: {
    enabled: true,
    logLevel: 'info',
    metricsCollection: true,
    performanceTracking: true,
    auditLogging: true
  },

  // Security settings
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM'
    },
    auditLogging: {
      enabled: true,
      retentionDays: 365
    },
    accessControl: {
      enabled: true,
      roleBasedAccess: true
    }
  },

  // Compliance settings
  compliance: {
    hipaa: {
      enabled: true,
      dataEncryption: true,
      auditLogging: true
    },
    gdpr: {
      enabled: true,
      dataProtection: true,
      consentManagement: true
    }
  }
};