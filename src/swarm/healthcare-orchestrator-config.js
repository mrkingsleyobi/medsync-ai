/**
 * Healthcare Task Orchestrator Configuration
 *
 * Defines specialized healthcare agents, their capabilities, and operational parameters
 * for the MediSync Healthcare AI Platform swarm.
 */

module.exports = {
  // Platform configuration
  platform: {
    name: 'MediSync Healthcare AI Platform',
    version: '1.0.0',
    compliance: ['HIPAA', 'FDA', 'GDPR', 'HITRUST'],
    confidenceThreshold: 0.95,
    emergencyProtocols: true
  },

  // Healthcare agent configurations
  agents: {
    // Medical Security Agent (Queen/Coordinator)
    'medical-security': {
      type: 'medical-security',
      role: 'queen',
      priority: 'critical',
      capabilities: [
        'HIPAA_compliance_enforcement',
        'end_to_end_encryption',
        'quantum_resistant_crypto',
        'access_control_authorization',
        'audit_trail_management',
        'security_breach_detection',
        'federated_learning_coordinator'
      ],
      configuration: {
        complianceMode: 'strict',
        encryptionAlgorithm: 'AES-256-GCM',
        quantumResistance: true,
        auditTrailEnabled: true,
        realTimeMonitoring: true,
        byzantineFaultTolerance: true
      },
      jurisdiction: {
        oversight: 'human_clinical',
        escalationPath: 'chief_medical_officer',
        emergencyOverride: true
      }
    },

    // Clinical Workflow Agent
    'clinical-workflow': {
      type: 'clinical-workflow',
      role: 'worker',
      priority: 'high',
      capabilities: [
        'patient_communication',
        'clinical_decision_support',
        'treatment_recommendation',
        'patient_safety_checks',
        'explainable_ai'
      ],
      configuration: {
        confidenceThreshold: 0.95,
        explainabilityEnabled: true,
        humanOversightRequired: true,
        emergencyProtocols: true
      }
    },

    // Healthcare Integration Agent
    'healthcare-integration': {
      type: 'healthcare-integration',
      role: 'worker',
      priority: 'high',
      capabilities: [
        'FHIR_integration',
        'HL7_messaging',
        'DICOM_processing',
        'EHR_interoperability',
        'standards_compliance'
      ],
      configuration: {
        fhirVersion: 'R4',
        hl7Version: '2.8',
        dicomConformance: true,
        dataValidation: true,
        transformationEngine: true
      }
    },

    // IoT & Wearable Health Agent
    'iot-wearable': {
      type: 'iot-wearable',
      role: 'worker',
      priority: 'medium',
      capabilities: [
        'wearable_device_integration',
        'sensor_data_processing',
        'real_time_vital_monitoring',
        'anomaly_detection',
        'predictive_health_alerts'
      ],
      configuration: {
        deviceProtocol: 'Bluetooth_5.0, WiFi_6',
        samplingRate: '1kHz',
        anomalyThreshold: 0.95,
        predictiveModels: true,
        bandwidthOptimization: true
      }
    },

    // Research & Analytics Agent
    'research-analytics': {
      type: 'research-analytics',
      role: 'worker',
      priority: 'medium',
      capabilities: [
        'research_integration',
        'population_health_analytics',
        'medical_literature_analysis',
        'evidence_synthesis',
        'clinical_trial_matching'
      ],
      configuration: {
        medicalDatabases: ['PubMed', 'ClinicalTrials.gov', 'Cochrane'],
        analyticsEngine: 'distributed_processing',
        evidenceLevel: 'A',
        statisticalSignificance: 0.95,
        biasDetection: true
      }
    },

    // Administrative & Monitoring Agent
    'administrative-monitoring': {
      type: 'administrative-monitoring',
      role: 'worker',
      priority: 'high',
      capabilities: [
        'system_monitoring',
        'performance_optimization',
        'resource_allocation',
        'compliance_reporting',
        'healthcare_KPI_tracking'
      ],
      configuration: {
        monitoringFrequency: '5s',
        alertThresholds: {
          availability: 99.9,
          latency: 100, // ms
          accuracy: 95 // percentage
        },
        autoScaling: true,
        disasterRecovery: true
      }
    },

    // Medical Image Analysis Agent
    'medical-imaging': {
      type: 'medical-imaging',
      role: 'specialist',
      priority: 'high',
      capabilities: [
        'radiology_analysis',
        'pathology_detection',
        'dermatology_assessment',
        'anomaly_detection',
        'image_classification'
      ],
      configuration: {
        supportedFormats: ['DICOM', 'NIfTI', 'JPEG', 'PNG'],
        models: ['medical_resnet', 'specialized_radiology_cnn'],
        confidenceThreshold: 0.95,
        explainabilityEnabled: true
      }
    },

    // Clinical Text Processing Agent
    'clinical-nlp': {
      type: 'clinical-nlp',
      role: 'specialist',
      priority: 'high',
      capabilities: [
        'clinical_note_analysis',
        'entity_extraction',
        'medical_concept_linking',
        'sentiment_analysis',
        'text_classification'
      ],
      configuration: {
        supportedFormats: ['FHIR', 'HL7', 'free_text'],
        models: ['clinical_bert', 'medical_ner'],
        confidenceThreshold: 0.95,
        languageSupport: ['English', 'Spanish', 'French']
      }
    },

    // Patient Communication Agent
    'patient-comms': {
      type: 'patient-comms',
      role: 'specialist',
      priority: 'medium',
      capabilities: [
        'simplification',
        'translation',
        'personalization',
        'accessibility',
        'multimodal_communication'
      ],
      configuration: {
        supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Chinese'],
        simplificationLevels: ['basic', 'intermediate', 'advanced'],
        accessibilitySupport: ['text_to_speech', 'high_contrast', 'braille'],
        confidenceThreshold: 0.95
      }
    },

    // Research Integration Agent
    'research-ai': {
      type: 'research-ai',
      role: 'specialist',
      priority: 'medium',
      capabilities: [
        'literature_analysis',
        'evidence_synthesis',
        'research_recommendation',
        'clinical_trial_matching',
        'medical_discovery'
      ],
      configuration: {
        medicalDatabases: ['PubMed', 'ClinicalTrials.gov', 'Cochrane', 'EMBASE'],
        researchModels: ['literature_classifier', 'evidence_scorer'],
        confidenceThreshold: 0.95,
        evidenceLevels: ['A', 'B', 'C', 'D']
      }
    },

    // Safety Monitor Agent
    'safety-monitor': {
      type: 'safety-monitor',
      role: 'monitor',
      priority: 'critical',
      capabilities: [
        'patient_safety_validation',
        'adverse_event_detection',
        'contradiction_analysis',
        'risk_assessment',
        'emergency_alerting'
      ],
      configuration: {
        safetyProtocols: ['continuous_validation', 'real_time_monitoring'],
        alertingThresholds: {
          confidenceDrop: 0.1,
          contradictionThreshold: 0.8,
          riskScore: 0.75
        },
        emergencyProtocols: true
      }
    },

    // Compliance Agent
    'compliance-agent': {
      type: 'compliance-agent',
      role: 'monitor',
      priority: 'high',
      capabilities: [
        'regulatory_compliance',
        'audit_trail_management',
        'policy_enforcement',
        'violation_detection',
        'reporting'
      ],
      configuration: {
        regulations: ['HIPAA', 'FDA', 'GDPR', 'HITRUST'],
        monitoringFrequency: 'continuous',
        reportingInterval: 'daily',
        violationEscalation: true
      }
    }
  },

  // Healthcare workflow patterns
  workflows: {
    'comprehensive-medical-analysis': {
      name: 'Comprehensive Medical Analysis',
      description: 'Complete analysis of patient medical data including imaging, notes, and research',
      compliance: ['HIPAA', 'FDA', 'GDPR'],
      safetyThreshold: 0.95,
      tasks: [
        {
          agent: 'medical-imaging',
          task: 'analyze-radiology',
          priority: 'critical'
        },
        {
          agent: 'clinical-nlp',
          task: 'process-notes',
          priority: 'high'
        },
        {
          agent: 'research-integration',
          task: 'literature-review',
          priority: 'medium'
        },
        {
          agent: 'safety-monitor',
          task: 'validate-recommendations',
          priority: 'critical'
        }
      ]
    },

    'patient-communication': {
      name: 'Patient Communication',
      description: 'Simplified communication of medical information to patients',
      compliance: ['HIPAA', 'FDA'],
      safetyThreshold: 0.95,
      tasks: [
        {
          agent: 'patient-comms',
          task: 'simplify-medical-info',
          priority: 'high'
        },
        {
          agent: 'safety-monitor',
          task: 'validate-communication',
          priority: 'critical'
        }
      ]
    },

    'research-integration': {
      name: 'Research Integration',
      description: 'Integration of latest medical research with patient care',
      compliance: ['HIPAA', 'FDA', 'GDPR'],
      safetyThreshold: 0.95,
      tasks: [
        {
          agent: 'research-ai',
          task: 'literature-analysis',
          priority: 'medium'
        },
        {
          agent: 'clinical-nlp',
          task: 'evidence-extraction',
          priority: 'high'
        },
        {
          agent: 'safety-monitor',
          task: 'validate-research',
          priority: 'critical'
        }
      ]
    }
  },

  // Memory namespace configurations for HIPAA compliance
  memoryNamespaces: {
    patientData: {
      type: 'encrypted',
      algorithm: 'AES-256-GCM',
      accessControl: 'role_based',
      auditTrail: true,
      retentionPolicy: '7_years',
      encryptionEnabled: true
    },
    clinicalDecisions: {
      type: 'immutable',
      algorithm: 'SHA-256_hashing',
      accessControl: 'clinical_staff_only',
      auditTrail: true,
      retentionPolicy: 'permanent',
      backupEnabled: true
    },
    medicalKnowledge: {
      type: 'distributed',
      algorithm: 'federated_learning',
      accessControl: 'readonly',
      auditTrail: true,
      synchronization: 'real_time',
      validationRequired: true
    },
    securityAudit: {
      type: 'write_once',
      algorithm: 'digital_signatures',
      accessControl: 'security_team_only',
      auditTrail: true,
      retentionPolicy: '10_years',
      complianceLevel: 'strict'
    },
    performanceMetrics: {
      type: 'time_series',
      algorithm: 'compressed_storage',
      accessControl: 'admin_only',
      auditTrail: true,
      retentionPolicy: '1_year',
      realTimeAnalysis: true
    }
  },

  // Security protocol configurations
  securityProtocols: {
    endToEndEncryption: {
      algorithm: 'AES-256-GCM',
      keyManagement: 'HSM-backed',
      rotationSchedule: 'daily',
      quantumResistance: true
    },
    authentication: {
      method: 'multi_factor',
      protocols: ['HMAC', 'JWT', 'OAUTH2'],
      sessionTimeout: '30_min',
      biometricRequired: true
    },
    authorization: {
      model: 'RBAC',
      leastPrivilege: true,
      soxCompliance: true,
      contextAware: true
    },
    dataProtection: {
      encryption: 'data_at_rest_and_transit',
      masking: 'dynamic',
      anonymization: 'k-anonymity',
      compliance: 'GDPR_AND_HIPAA'
    },
    networkSecurity: {
      firewalls: 'next_generation',
      IDS: 'real_time',
      zeroTrust: true,
      microsegmentation: true
    }
  },

  // Monitoring configurations
  monitoring: {
    clinicalSafety: {
      aiConfidenceMonitoring: 'real_time',
      humanOversightTriggers: '95%_confidence',
      adverseEventDetection: 'immediate',
      protocol: 'continuous_validation'
    },
    regulatoryCompliance: {
      hipaaMonitoring: 'continuous',
      fdaReporting: 'automated',
      gdprCompliance: 'real_time',
      auditTriggers: 'any_violation'
    },
    performanceMetrics: {
      availability: '99.9%',
      latency: '<100ms',
      accuracy: '>95%',
      alerting: 'immediate'
    },
    healthScore: {
      calculation: 'weighted_algorithm',
      factors: ['security', 'compliance', 'accuracy', 'availability'],
      thresholds: {
        critical: 0.95,
        warning: 0.98,
        optimal: 0.99
      }
    }
  }
};
