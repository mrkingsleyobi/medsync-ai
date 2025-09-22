/**
 * Clinical Decision Support Service
 * Service for providing real-time clinical decision support to healthcare providers
 */

const config = require('../config/decision-support.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const { cleanupOldEntries } = require('../../../src/utils/cleanup.util.js');

class ClinicalDecisionSupportService {
  /**
   * Create a new Clinical Decision Support Service
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.decisionModels = new Map();
    this.decisionHistory = new Map();
    this.alerts = new Map();
    this.clinicalGuidelines = new Map();

    // Initialize decision support components
    this._initializeDecisionSupport();

    // Start cleanup intervals
    this._startCleanupIntervals();

    this.logger.info('Clinical Decision Support Service created', {
      service: 'clinical-decision-support-service'
    });
  }

  /**
   * Create logger instance
   * @returns {Object} Winston logger instance
   */
  _createLogger() {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'clinical-decision-support-service' },
      transports: [
        new winston.transports.File({
          filename: path.join(logsDir, 'clinical-decision-support-service-error.log'),
          level: 'error',
          maxsize: 10000000, // 10MB
          maxFiles: 5
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'clinical-decision-support-service-combined.log'),
          maxsize: 10000000, // 10MB
          maxFiles: 5
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
              return `${timestamp} [${level}] ${service || 'clinical-decision-support-service'}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            })
          )
        })
      ]
    });
  }

  /**
   * Initialize decision support components
   * @private
   */
  _initializeDecisionSupport() {
    // Register built-in decision models
    this._registerBuiltInDecisionModels();

    // Load clinical guidelines
    this._loadClinicalGuidelines();

    this.logger.info('Clinical decision support components initialized');
  }

  /**
   * Start cleanup intervals for Map data structures
   * @private
   */
  _startCleanupIntervals() {
    // Clean up decision history periodically
    const cleanupDecisionHistory = () => {
      try {
        const stats = cleanupOldEntries(this.decisionHistory, {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          maxEntries: 10000
        });

        if (stats.totalRemoved > 0) {
          this.logger.debug('Decision history cleanup completed', {
            removedByAge: stats.removedByAge,
            removedByCount: stats.removedByCount,
            totalRemoved: stats.totalRemoved
          });
        }
      } catch (error) {
        this.logger.error('Decision history cleanup failed', {
          error: error.message,
          stack: error.stack
        });
      } finally {
        setTimeout(cleanupDecisionHistory, 60 * 60 * 1000); // Run every hour
      }
    };

    // Clean up alerts periodically
    const cleanupAlerts = () => {
      try {
        const stats = cleanupOldEntries(this.alerts, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          maxEntries: 5000
        });

        if (stats.totalRemoved > 0) {
          this.logger.debug('Alerts cleanup completed', {
            removedByAge: stats.removedByAge,
            removedByCount: stats.removedByCount,
            totalRemoved: stats.totalRemoved
          });
        }
      } catch (error) {
        this.logger.error('Alerts cleanup failed', {
          error: error.message,
          stack: error.stack
        });
      } finally {
        setTimeout(cleanupAlerts, 30 * 60 * 1000); // Run every 30 minutes
      }
    };

    // Start cleanup processes
    cleanupDecisionHistory();
    cleanupAlerts();

    this.logger.info('Cleanup intervals started for Map data structures');
  }

  /**
   * Register built-in decision models
   * @private
   */
  _registerBuiltInDecisionModels() {
    // Register diagnosis support model
    this.decisionModels.set('diagnosis-support', {
      name: this.config.models.diagnosisSupport.name,
      description: this.config.models.diagnosisSupport.description,
      version: this.config.models.diagnosisSupport.version,
      confidenceThreshold: this.config.models.diagnosisSupport.confidenceThreshold,
      process: this._processDiagnosisSupport.bind(this)
    });

    // Register treatment recommendation model
    this.decisionModels.set('treatment-recommendation', {
      name: this.config.models.treatmentRecommendation.name,
      description: this.config.models.treatmentRecommendation.description,
      version: this.config.models.treatmentRecommendation.version,
      confidenceThreshold: this.config.models.treatmentRecommendation.confidenceThreshold,
      process: this._processTreatmentRecommendation.bind(this)
    });

    // Register risk assessment model
    this.decisionModels.set('risk-assessment', {
      name: this.config.models.riskAssessment.name,
      description: this.config.models.riskAssessment.description,
      version: this.config.models.riskAssessment.version,
      confidenceThreshold: this.config.models.riskAssessment.confidenceThreshold,
      process: this._processRiskAssessment.bind(this)
    });

    // Register drug interaction model
    this.decisionModels.set('drug-interaction', {
      name: this.config.models.drugInteraction.name,
      description: this.config.models.drugInteraction.description,
      version: this.config.models.drugInteraction.version,
      confidenceThreshold: this.config.models.drugInteraction.confidenceThreshold,
      process: this._processDrugInteraction.bind(this)
    });

    // Register clinical alert model
    this.decisionModels.set('clinical-alert', {
      name: this.config.models.clinicalAlert.name,
      description: this.config.models.clinicalAlert.description,
      version: this.config.models.clinicalAlert.version,
      confidenceThreshold: this.config.models.clinicalAlert.confidenceThreshold,
      process: this._processClinicalAlert.bind(this)
    });

    this.logger.info('Built-in decision models registered', {
      modelCount: this.decisionModels.size
    });
  }

  /**
   * Load clinical guidelines
   * @private
   */
  _loadClinicalGuidelines() {
    // Load hypertension guidelines
    this.clinicalGuidelines.set('hypertension', {
      condition: 'hypertension',
      title: 'Hypertension Management Guidelines',
      version: '2.1.0',
      lastUpdated: '2025-01-15',
      recommendations: {
        diagnosis: [
          'Confirm diagnosis with repeated blood pressure measurements',
          'Evaluate for secondary causes in selected patients',
          'Assess cardiovascular risk factors'
        ],
        treatment: [
          'Lifestyle modifications as first-line therapy',
          'Initiate pharmacological treatment for Stage 2 hypertension',
          'Target blood pressure <130/80 mmHg for high-risk patients'
        ],
        monitoring: [
          'Monthly follow-up until target BP achieved',
          'Quarterly monitoring once stable',
          'Annual comprehensive cardiovascular assessment'
        ]
      },
      evidenceLevel: 'A',
      references: [
        '2024 ESC/ESH Guidelines for the management of arterial hypertension',
        'ACC/AHA 2023 Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults'
      ]
    });

    // Load diabetes guidelines
    this.clinicalGuidelines.set('diabetes', {
      condition: 'diabetes',
      title: 'Type 2 Diabetes Management Guidelines',
      version: '3.0.0',
      lastUpdated: '2025-02-01',
      recommendations: {
        diagnosis: [
          'Diagnose with HbA1c ≥6.5% or fasting glucose ≥126 mg/dL',
          'Confirm with repeat testing on a different day',
          'Screen for complications at diagnosis'
        ],
        treatment: [
          'Metformin as first-line pharmacological therapy',
          'Individualize HbA1c targets based on patient factors',
          'Consider SGLT-2 inhibitors or GLP-1 agonists for cardiovascular risk'
        ],
        monitoring: [
          'HbA1c every 3-6 months',
          'Annual comprehensive foot examination',
          'Annual dilated eye examination'
        ]
      },
      evidenceLevel: 'A',
      references: [
        'ADA Standards of Medical Care in Diabetes—2025',
        'EASD 2024 Clinical Guidelines for Type 2 Diabetes'
      ]
    });

    this.logger.info('Clinical guidelines loaded', {
      guidelineCount: this.clinicalGuidelines.size
    });
  }

  /**
   * Process diagnosis support
   * @param {Object} patientContext - Patient context data
   * @param {Object} config - Decision configuration
   * @returns {Object} Diagnosis support result
   * @private
   */
  _processDiagnosisSupport(patientContext, config = {}) {
    const recommendations = [];
    const alerts = [];
    let confidence = 0.85;

    // Analyze vital signs
    if (patientContext.vitalSigns) {
      const { bloodPressure, heartRate, temperature } = patientContext.vitalSigns;

      // Blood pressure analysis
      if (bloodPressure) {
        const { systolic, diastolic } = bloodPressure;
        if (systolic >= 140 || diastolic >= 90) {
          recommendations.push({
            type: 'diagnosis',
            condition: 'hypertension',
            priority: 'high',
            recommendation: 'Patient meets criteria for hypertension. Confirm with repeated measurements.',
            evidence: `Blood pressure ${systolic}/${diastolic} mmHg meets hypertension criteria`,
            confidence: 0.9
          });

          alerts.push({
            type: 'clinical-alert',
            priority: 'high',
            message: 'Hypertensive crisis - immediate attention required',
            condition: 'hypertension',
            confidence: 0.95
          });

          confidence = Math.max(confidence, 0.9);
        }
      }

      // Heart rate analysis
      if (heartRate) {
        if (heartRate > 100) {
          recommendations.push({
            type: 'diagnosis',
            condition: 'tachycardia',
            priority: 'medium',
            recommendation: 'Patient has elevated heart rate. Evaluate for underlying causes.',
            evidence: `Heart rate of ${heartRate} bpm is elevated`,
            confidence: 0.8
          });
        } else if (heartRate < 60) {
          recommendations.push({
            type: 'diagnosis',
            condition: 'bradycardia',
            priority: 'medium',
            recommendation: 'Patient has low heart rate. Evaluate for underlying causes.',
            evidence: `Heart rate of ${heartRate} bpm is low`,
            confidence: 0.8
          });
        }
      }
    }

    // Analyze symptoms
    if (patientContext.symptoms) {
      const symptoms = Array.isArray(patientContext.symptoms) ? patientContext.symptoms : [patientContext.symptoms];

      // Diabetes symptoms
      const diabetesSymptoms = ['increased_thirst', 'frequent_urination', 'blurred_vision', 'fatigue'];
      const diabetesMatches = symptoms.filter(symptom => diabetesSymptoms.includes(symptom));
      if (diabetesMatches.length >= 2) {
        recommendations.push({
          type: 'diagnosis',
          condition: 'diabetes',
          priority: 'high',
          recommendation: 'Patient presents with classic diabetes symptoms. Consider HbA1c testing.',
          evidence: `Presenting with ${diabetesMatches.join(', ')} symptoms`,
          confidence: 0.85
        });

        confidence = Math.max(confidence, 0.85);
      }

      // Respiratory symptoms
      const respiratorySymptoms = ['shortness_of_breath', 'cough', 'chest_pain'];
      const respiratoryMatches = symptoms.filter(symptom => respiratorySymptoms.includes(symptom));
      if (respiratoryMatches.length >= 2) {
        recommendations.push({
          type: 'diagnosis',
          condition: 'respiratory_condition',
          priority: 'medium',
          recommendation: 'Patient presents with respiratory symptoms. Evaluate pulmonary function.',
          evidence: `Presenting with ${respiratoryMatches.join(', ')} symptoms`,
          confidence: 0.75
        });
      }
    }

    return {
      recommendations,
      alerts,
      confidence
    };
  }

  /**
   * Process treatment recommendation
   * @param {Object} patientContext - Patient context data
   * @param {Object} config - Decision configuration
   * @returns {Object} Treatment recommendation result
   * @private
   */
  _processTreatmentRecommendation(patientContext, config = {}) {
    const recommendations = [];
    const alerts = [];
    let confidence = 0.8;

    // Medication recommendations based on conditions
    if (patientContext.conditions) {
      const conditions = Array.isArray(patientContext.conditions) ? patientContext.conditions : [patientContext.conditions];

      // Hypertension treatment
      if (conditions.includes('hypertension')) {
        recommendations.push({
          type: 'medication',
          drug: 'lisinopril',
          dosage: '10mg daily',
          priority: 'high',
          recommendation: 'Start ACE inhibitor for hypertension management',
          evidence: 'First-line treatment for hypertension per guidelines',
          confidence: 0.9
        });

        recommendations.push({
          type: 'lifestyle',
          intervention: 'dietary_modification',
          priority: 'high',
          recommendation: 'Implement DASH diet for blood pressure control',
          evidence: 'Evidence-based dietary approach to stop hypertension',
          confidence: 0.85
        });

        confidence = Math.max(confidence, 0.9);
      }

      // Diabetes treatment
      if (conditions.includes('diabetes')) {
        recommendations.push({
          type: 'medication',
          drug: 'metformin',
          dosage: '500mg twice daily',
          priority: 'high',
          recommendation: 'Start metformin as first-line therapy for type 2 diabetes',
          evidence: 'First-line pharmacological treatment per ADA guidelines',
          confidence: 0.95
        });

        confidence = Math.max(confidence, 0.95);
      }
    }

    // Lab value-based recommendations
    if (patientContext.labResults) {
      // High cholesterol
      if (patientContext.labResults.ldl && patientContext.labResults.ldl > 100) {
        recommendations.push({
          type: 'medication',
          drug: 'atorvastatin',
          dosage: '20mg daily',
          priority: 'medium',
          recommendation: 'Start statin therapy for LDL cholesterol > 100 mg/dL',
          evidence: 'Indicated for primary/secondary prevention of cardiovascular disease',
          confidence: 0.85
        });
      }

      // Low vitamin D
      if (patientContext.labResults.vitaminD && patientContext.labResults.vitaminD < 20) {
        recommendations.push({
          type: 'supplement',
          supplement: 'vitamin_d3',
          dosage: '2000 IU daily',
          priority: 'low',
          recommendation: 'Supplement vitamin D for deficiency',
          evidence: 'Replacement therapy for vitamin D deficiency',
          confidence: 0.8
        });
      }
    }

    return {
      recommendations,
      alerts,
      confidence
    };
  }

  /**
   * Process risk assessment
   * @param {Object} patientContext - Patient context data
   * @param {Object} config - Decision configuration
   * @returns {Object} Risk assessment result
   * @private
   */
  _processRiskAssessment(patientContext, config = {}) {
    const recommendations = [];
    const alerts = [];
    let confidence = 0.85;
    let cardiovascularRisk = 0;
    let diabetesRisk = 0;

    // Calculate cardiovascular risk based on risk factors
    if (patientContext.riskFactors) {
      const riskFactors = Array.isArray(patientContext.riskFactors) ? patientContext.riskFactors : [patientContext.riskFactors];

      // Count traditional cardiovascular risk factors
      const cvRiskFactors = ['hypertension', 'diabetes', 'smoking', 'obesity', 'family_history', 'sedentary_lifestyle'];
      const cvRiskCount = riskFactors.filter(factor => cvRiskFactors.includes(factor)).length;

      // Estimate 10-year cardiovascular risk
      if (cvRiskCount >= 3) {
        cardiovascularRisk = 0.2; // 20% 10-year risk
        alerts.push({
          type: 'risk-alert',
          priority: 'high',
          message: 'High cardiovascular risk - comprehensive prevention plan indicated',
          risk: 'cardiovascular',
          confidence: 0.9
        });
      } else if (cvRiskCount >= 1) {
        cardiovascularRisk = 0.1; // 10% 10-year risk
        alerts.push({
          type: 'risk-alert',
          priority: 'medium',
          message: 'Moderate cardiovascular risk - preventive measures recommended',
          risk: 'cardiovascular',
          confidence: 0.8
        });
      }

      // Diabetes risk assessment
      if (riskFactors.includes('prediabetes') || riskFactors.includes('obesity') || riskFactors.includes('family_history_diabetes')) {
        diabetesRisk = 0.15; // 15% 5-year risk
        recommendations.push({
          type: 'prevention',
          intervention: 'diabetes_prevention',
          priority: 'medium',
          recommendation: 'Implement diabetes prevention strategies',
          evidence: 'High risk based on prediabetes or risk factors',
          confidence: 0.85
        });
      }
    }

    // Age-based risk assessment
    if (patientContext.demographics && patientContext.demographics.age) {
      const age = patientContext.demographics.age;

      if (age > 65) {
        recommendations.push({
          type: 'screening',
          test: 'annual_comprehensive_exam',
          priority: 'high',
          recommendation: 'Annual comprehensive health assessment for older adults',
          evidence: 'Age-based screening recommendation',
          confidence: 0.9
        });
      }

      if (age > 50) {
        cardiovascularRisk += 0.05; // Additional age-related risk
      }
    }

    return {
      recommendations,
      alerts,
      confidence,
      riskScores: {
        cardiovascular: cardiovascularRisk,
        diabetes: diabetesRisk
      }
    };
  }

  /**
   * Process drug interaction check
   * @param {Object} patientContext - Patient context data
   * @param {Object} config - Decision configuration
   * @returns {Object} Drug interaction result
   * @private
   */
  _processDrugInteraction(patientContext, config = {}) {
    const recommendations = [];
    const alerts = [];
    let confidence = 0.9;

    // Check for drug interactions if medications are provided
    if (patientContext.medications) {
      const medications = Array.isArray(patientContext.medications) ? patientContext.medications : [patientContext.medications];

      // Check for common dangerous combinations
      const hasWarfarin = medications.some(med => med.name.toLowerCase().includes('warfarin'));
      const hasNSAIDs = medications.some(med => med.name.toLowerCase().includes('ibuprofen') || med.name.toLowerCase().includes('naproxen'));

      if (hasWarfarin && hasNSAIDs) {
        alerts.push({
          type: 'drug-interaction',
          priority: 'critical',
          message: 'Warfarin + NSAIDs - HIGH RISK of bleeding. Consider alternative pain management.',
          drugs: ['warfarin', 'nsaids'],
          severity: 'high',
          confidence: 0.95
        });

        recommendations.push({
          type: 'alternative',
          drug: 'acetaminophen',
          priority: 'critical',
          recommendation: 'Consider acetaminophen as safer alternative for pain management',
          evidence: 'Lower bleeding risk when combined with warfarin',
          confidence: 0.9
        });

        confidence = 0.95;
      }

      // Check for statin + grapefruit interaction
      const hasStatin = medications.some(med =>
        med.name.toLowerCase().includes('atorvastatin') ||
        med.name.toLowerCase().includes('simvastatin') ||
        med.name.toLowerCase().includes('lovastatin')
      );

      if (hasStatin && patientContext.dietaryIntake && patientContext.dietaryIntake.includes('grapefruit')) {
        alerts.push({
          type: 'drug-interaction',
          priority: 'high',
          message: 'Statin + grapefruit juice - increased risk of side effects. Limit grapefruit consumption.',
          drugs: ['statin', 'grapefruit'],
          severity: 'moderate',
          confidence: 0.85
        });
      }
    }

    return {
      recommendations,
      alerts,
      confidence
    };
  }

  /**
   * Process clinical alert
   * @param {Object} patientContext - Patient context data
   * @param {Object} config - Decision configuration
   * @returns {Object} Clinical alert result
   * @private
   */
  _processClinicalAlert(patientContext, config = {}) {
    const recommendations = [];
    const alerts = [];
    let confidence = 0.9;

    // Check vital signs for critical values
    if (patientContext.vitalSigns) {
      const { bloodPressure, heartRate, temperature, oxygenSaturation } = patientContext.vitalSigns;

      // Critical blood pressure
      if (bloodPressure) {
        const { systolic, diastolic } = bloodPressure;
        if (systolic > 180 || diastolic > 120) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Hypertensive emergency - immediate medical attention required',
            condition: 'severe_hypertension',
            vital: 'blood_pressure',
            value: `${systolic}/${diastolic}`,
            confidence: 0.95
          });
        } else if (systolic < 90 || diastolic < 60) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'high',
            message: 'Hypotension - monitor closely and assess for shock',
            condition: 'hypotension',
            vital: 'blood_pressure',
            value: `${systolic}/${diastolic}`,
            confidence: 0.9
          });
        }
      }

      // Critical heart rate
      if (heartRate) {
        if (heartRate > 150) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'high',
            message: 'Severe tachycardia - evaluate for underlying causes',
            condition: 'severe_tachycardia',
            vital: 'heart_rate',
            value: heartRate,
            confidence: 0.85
          });
        } else if (heartRate < 40) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Severe bradycardia - immediate cardiac evaluation required',
            condition: 'severe_bradycardia',
            vital: 'heart_rate',
            value: heartRate,
            confidence: 0.9
          });
        }
      }

      // Critical temperature
      if (temperature) {
        if (temperature > 104) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Hyperthermia - immediate cooling measures required',
            condition: 'hyperthermia',
            vital: 'temperature',
            value: temperature,
            confidence: 0.95
          });
        } else if (temperature < 95) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Hypothermia - immediate warming measures required',
            condition: 'hypothermia',
            vital: 'temperature',
            value: temperature,
            confidence: 0.95
          });
        }
      }

      // Critical oxygen saturation
      if (oxygenSaturation) {
        if (oxygenSaturation < 88) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Severe hypoxemia - immediate oxygen therapy required',
            condition: 'severe_hypoxemia',
            vital: 'oxygen_saturation',
            value: oxygenSaturation,
            confidence: 0.95
          });
        } else if (oxygenSaturation < 92) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'high',
            message: 'Hypoxemia - supplemental oxygen therapy indicated',
            condition: 'hypoxemia',
            vital: 'oxygen_saturation',
            value: oxygenSaturation,
            confidence: 0.9
          });
        }
      }
    }

    // Check lab values for critical values
    if (patientContext.labResults) {
      // Critical potassium levels
      if (patientContext.labResults.potassium) {
        const potassium = patientContext.labResults.potassium;
        if (potassium > 6.0) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Severe hyperkalemia - immediate cardiac monitoring and treatment required',
            condition: 'severe_hyperkalemia',
            lab: 'potassium',
            value: potassium,
            confidence: 0.95
          });
        } else if (potassium < 2.5) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Severe hypokalemia - immediate potassium replacement required',
            condition: 'severe_hypokalemia',
            lab: 'potassium',
            value: potassium,
            confidence: 0.95
          });
        }
      }

      // Critical glucose levels
      if (patientContext.labResults.glucose) {
        const glucose = patientContext.labResults.glucose;
        if (glucose > 600) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Severe hyperglycemia - immediate insulin therapy required',
            condition: 'severe_hyperglycemia',
            lab: 'glucose',
            value: glucose,
            confidence: 0.95
          });
        } else if (glucose < 40) {
          alerts.push({
            type: 'clinical-alert',
            priority: 'critical',
            message: 'Severe hypoglycemia - immediate glucose administration required',
            condition: 'severe_hypoglycemia',
            lab: 'glucose',
            value: glucose,
            confidence: 0.95
          });
        }
      }
    }

    return {
      recommendations,
      alerts,
      confidence
    };
  }

  /**
   * Generate clinical decision support
   * @param {Object} patientContext - Patient context data
   * @param {Object} decisionConfig - Decision configuration
   * @returns {Promise<Object>} Decision support result
   */
  async generateDecisionSupport(patientContext, decisionConfig = {}) {
    const startTime = Date.now();
    const decisionId = uuidv4();

    try {
      if (!patientContext) {
        throw new Error('Patient context is required');
      }

      if (!patientContext.patientId) {
        throw new Error('Patient context with patientId is required');
      }

      this.logger.info('Generating clinical decision support', {
        decisionId,
        patientId: patientContext.patientId,
        decisionType: decisionConfig.decisionType || 'comprehensive'
      });

      // Validate decision model type
      const decisionType = decisionConfig.decisionType || 'comprehensive';
      if (decisionType !== 'comprehensive' && !this.decisionModels.has(decisionType)) {
        throw new Error(`No decision model available for type: ${decisionType}`);
      }

      let result;
      if (decisionType === 'comprehensive') {
        // Run all decision models
        const modelResults = [];
        for (const [modelType, model] of this.decisionModels.entries()) {
          const modelResult = await model.process(patientContext, decisionConfig);
          modelResults.push({
            modelType,
            ...modelResult
          });
        }

        // Combine results
        result = {
          recommendations: [].concat(...modelResults.map(r => r.recommendations)),
          alerts: [].concat(...modelResults.map(r => r.alerts)),
          confidence: modelResults.reduce((acc, r) => acc + r.confidence, 0) / modelResults.length
        };
      } else {
        // Run specific decision model
        const model = this.decisionModels.get(decisionType);
        result = await model.process(patientContext, decisionConfig);
      }

      // Create decision history entry
      const historyEntry = {
        decisionId,
        patientId: patientContext.patientId,
        decisionType,
        context: {
          conditions: patientContext.conditions,
          symptoms: patientContext.symptoms,
          vitalSigns: patientContext.vitalSigns
        },
        recommendations: result.recommendations,
        alerts: result.alerts,
        confidence: result.confidence,
        processingTime: Date.now() - startTime,
        createdAt: new Date().toISOString()
      };

      // Store in decision history
      this.decisionHistory.set(decisionId, historyEntry);

      // Store alerts separately for active monitoring
      result.alerts.forEach(alert => {
        const alertId = uuidv4();
        this.alerts.set(alertId, {
          alertId,
          decisionId,
          patientId: patientContext.patientId,
          ...alert,
          acknowledged: false,
          createdAt: new Date().toISOString()
        });
      });

      this.logger.info('Clinical decision support generated successfully', {
        decisionId,
        patientId: patientContext.patientId,
        recommendations: result.recommendations.length,
        alerts: result.alerts.length,
        confidence: result.confidence,
        processingTime: Date.now() - startTime
      });

      return {
        decisionId,
        ...result,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      this.logger.error('Failed to generate clinical decision support', {
        decisionId,
        patientId: patientContext?.patientId,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Get decision history for a patient
   * @param {string} patientId - Patient ID
   * @returns {Array} Decision history
   */
  getDecisionHistory(patientId) {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }

    const history = [];
    for (const [decisionId, entry] of this.decisionHistory.entries()) {
      if (entry.patientId === patientId) {
        history.push(entry);
      }
    }

    // Sort by creation date (newest first)
    return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Get active alerts
   * @returns {Array} Active alerts
   */
  getActiveAlerts() {
    const activeAlerts = [];
    for (const [alertId, alert] of this.alerts.entries()) {
      if (!alert.acknowledged) {
        activeAlerts.push({
          alertId: alert.alertId,
          ...alert
        });
      }
    }

    // Sort by priority and creation date
    return activeAlerts.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  /**
   * Acknowledge an alert
   * @param {string} alertId - Alert ID
   * @returns {boolean} Success status
   */
  acknowledgeAlert(alertId) {
    if (!alertId) {
      throw new Error('Alert ID is required');
    }

    const alert = this.alerts.get(alertId);
    if (!alert) {
      return false;
    }

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    this.alerts.set(alertId, alert);

    this.logger.info('Alert acknowledged', {
      alertId,
      patientId: alert.patientId
    });

    return true;
  }

  /**
   * Get available decision models
   * @returns {Array} Available decision models
   */
  getAvailableDecisionModels() {
    const models = [];
    for (const [type, model] of this.decisionModels.entries()) {
      models.push({
        type,
        name: model.name,
        description: model.description,
        version: model.version,
        confidenceThreshold: model.confidenceThreshold
      });
    }
    return models;
  }

  /**
   * Get clinical guidelines
   * @param {string} condition - Medical condition
   * @returns {Object|null} Clinical guidelines or null if not found
   */
  getClinicalGuidelines(condition) {
    if (!condition) {
      throw new Error('Condition is required');
    }

    return this.clinicalGuidelines.get(condition.toLowerCase()) || null;
  }

  /**
   * Register custom decision model
   * @param {string} type - Model type
   * @param {Object} model - Model definition
   */
  registerDecisionModel(type, model) {
    if (!type || !model) {
      throw new Error('Type and model are required');
    }

    if (typeof model.process !== 'function') {
      throw new Error('Model must have a process function');
    }

    this.decisionModels.set(type, {
      name: model.name || type,
      description: model.description || 'Custom decision model',
      version: model.version || '1.0.0',
      confidenceThreshold: model.confidenceThreshold || 0.8,
      process: model.process
    });

    this.logger.info('Custom decision model registered', {
      type,
      name: model.name || type
    });
  }
}

module.exports = ClinicalDecisionSupportService;