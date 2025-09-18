// MediSync Healthcare AI Platform - Decision Support Manager
// This file implements real-time AI decision support for the neural mesh

const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

/**
 * Decision Support Manager Class
 * Implements real-time AI decision support for healthcare applications
 */
class DecisionSupportManager {
  /**
   * Create a new Decision Support Manager
   * @param {Object} neuralMesh - Reference to the neural mesh
   * @param {Object} config - Decision support configuration
   */
  constructor(neuralMesh, config = {}) {
    this.neuralMesh = neuralMesh;
    this.config = config;
    this.logger = this._createLogger();
    this.decisionModels = new Map();
    this.decisionHistory = new Map();
    this.alerts = new Map();
    this.clinicalGuidelines = new Map();

    // Initialize decision support components
    this._initializeDecisionSupport();

    this.logger.info('Decision Support Manager created', {
      service: 'decision-support-manager'
    });
  }

  /**
   * Create logger instance
   * @returns {Object} Winston logger instance
   */
  _createLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'decision-support-manager' },
      transports: [
        new winston.transports.File({ filename: 'logs/decision-support-manager-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/decision-support-manager-combined.log' })
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

    this.logger.info('Decision support components initialized');
  }

  /**
   * Register built-in decision models
   * @private
   */
  _registerBuiltInDecisionModels() {
    // Register diagnosis support model
    this.decisionModels.set('diagnosis-support', {
      name: 'Diagnosis Support Model',
      description: 'Provides differential diagnosis recommendations',
      version: '1.0.0',
      confidenceThreshold: 0.95,
      process: this._processDiagnosisSupport.bind(this)
    });

    // Register treatment recommendation model
    this.decisionModels.set('treatment-recommendation', {
      name: 'Treatment Recommendation Model',
      description: 'Provides evidence-based treatment recommendations',
      version: '1.0.0',
      confidenceThreshold: 0.90,
      process: this._processTreatmentRecommendation.bind(this)
    });

    // Register risk assessment model
    this.decisionModels.set('risk-assessment', {
      name: 'Risk Assessment Model',
      description: 'Assesses patient risk for various conditions',
      version: '1.0.0',
      confidenceThreshold: 0.85,
      process: this._processRiskAssessment.bind(this)
    });

    // Register drug interaction model
    this.decisionModels.set('drug-interaction', {
      name: 'Drug Interaction Model',
      description: 'Identifies potential drug interactions',
      version: '1.0.0',
      confidenceThreshold: 0.95,
      process: this._processDrugInteraction.bind(this)
    });

    // Register clinical alert model
    this.decisionModels.set('clinical-alert', {
      name: 'Clinical Alert Model',
      description: 'Generates clinical alerts for critical conditions',
      version: '1.0.0',
      confidenceThreshold: 0.99,
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
    // Load sample clinical guidelines
    // In a real implementation, these would come from a clinical knowledge base
    this.clinicalGuidelines.set('hypertension', {
      condition: 'hypertension',
      guidelines: [
        'First-line treatment: ACE inhibitors or ARBs',
        'Target BP: <130/80 mmHg for high-risk patients',
        'Lifestyle modifications: Diet, exercise, weight loss'
      ],
      evidenceLevel: 'A'
    });

    this.clinicalGuidelines.set('diabetes', {
      condition: 'diabetes',
      guidelines: [
        'HbA1c target: <7% for most patients',
        'First-line treatment: Metformin',
        'Regular monitoring of kidney function'
      ],
      evidenceLevel: 'A'
    });

    this.clinicalGuidelines.set('heart-failure', {
      condition: 'heart-failure',
      guidelines: [
        'ACE inhibitors and beta-blockers as first-line',
        'Diuretics for fluid management',
        'Regular monitoring of weight and symptoms'
      ],
      evidenceLevel: 'A'
    });

    this.logger.info('Clinical guidelines loaded', {
      guidelineCount: this.clinicalGuidelines.size
    });
  }

  /**
   * Generate real-time clinical decision support
   * @param {Object} patientContext - Patient context and clinical data
   * @param {Object} decisionConfig - Configuration for decision support
   * @returns {Promise<Object>} Decision support result
   */
  async generateDecisionSupport(patientContext, decisionConfig = {}) {
    try {
      const decisionId = uuidv4();
      this.logger.info('Generating clinical decision support', {
        decisionId,
        patientId: patientContext.patientId,
        contextSize: JSON.stringify(patientContext).length,
        decisionConfig
      });

      // Create decision record
      const decision = {
        id: decisionId,
        patientContext: patientContext,
        config: decisionConfig,
        status: 'processing',
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        recommendations: [],
        alerts: [],
        confidence: 0,
        evidence: []
      };

      this.decisionHistory.set(decisionId, decision);

      // Start processing
      decision.startedAt = new Date().toISOString();

      // Determine decision type and select appropriate model
      const decisionType = this._determineDecisionType(patientContext, decisionConfig);
      const model = this.decisionModels.get(decisionType);

      if (!model) {
        throw new Error(`No decision model available for type: ${decisionType}`);
      }

      this.logger.info('Selected decision model', {
        decisionId,
        model: model.name,
        decisionType
      });

      // Process decision using the selected model
      const result = await model.process(patientContext, decisionConfig);

      // Complete decision
      decision.completedAt = new Date().toISOString();
      decision.status = 'completed';
      decision.recommendations = result.recommendations || [];
      decision.alerts = result.alerts || [];
      decision.confidence = result.confidence || 0;
      decision.evidence = result.evidence || [];

      // Generate alerts if confidence is high enough
      if (decision.confidence >= model.confidenceThreshold) {
        this._generateDecisionAlerts(decision);
      }

      this.logger.info('Clinical decision support generated successfully', {
        decisionId,
        recommendationCount: decision.recommendations.length,
        alertCount: decision.alerts.length,
        confidence: decision.confidence,
        processingTime: new Date(decision.completedAt).getTime() - new Date(decision.startedAt).getTime()
      });

      return {
        decisionId: decision.id,
        status: decision.status,
        recommendations: decision.recommendations,
        alerts: decision.alerts,
        confidence: decision.confidence,
        evidence: decision.evidence,
        processingTime: new Date(decision.completedAt).getTime() - new Date(decision.startedAt).getTime()
      };
    } catch (error) {
      this.logger.error('Failed to generate clinical decision support', {
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Determine decision type from patient context
   * @param {Object} patientContext - Patient context and clinical data
   * @param {Object} config - Decision configuration
   * @returns {string} Decision type
   * @private
   */
  _determineDecisionType(patientContext, config) {
    if (config.decisionType) {
      return config.decisionType;
    }

    // Determine decision type based on context
    if (patientContext.vitalSigns) {
      const bp = patientContext.vitalSigns.bloodPressure;
      if (bp && (parseInt(bp.split('/')[0]) > 140 || parseInt(bp.split('/')[1]) > 90)) {
        return 'risk-assessment';
      }
    }

    if (patientContext.symptoms && patientContext.symptoms.length > 0) {
      return 'diagnosis-support';
    }

    if (patientContext.medications && patientContext.medications.length > 1) {
      return 'drug-interaction';
    }

    // Default to diagnosis support
    return 'diagnosis-support';
  }

  /**
   * Process diagnosis support
   * @param {Object} patientContext - Patient context and clinical data
   * @param {Object} config - Decision configuration
   * @returns {Promise<Object>} Processing result
   * @private
   */
  async _processDiagnosisSupport(patientContext, config) {
    this.logger.info('Processing diagnosis support', {
      patientId: patientContext.patientId,
      symptomCount: patientContext.symptoms?.length
    });

    // Simulate diagnosis processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300));

    const symptoms = patientContext.symptoms || [];
    const vitalSigns = patientContext.vitalSigns || {};
    const medicalHistory = patientContext.medicalHistory || [];
    const medications = patientContext.medications || [];
    const age = patientContext.age || 0;
    const recommendations = [];
    const evidence = [];
    const alerts = [];

    // Enhanced rule-based diagnosis with multiple factors
    if (symptoms.includes('headache') && symptoms.includes('blurred vision')) {
      // Check blood pressure if available
      let likelihood = 0.85;
      const supportingFactors = ['Headache and blurred vision are common symptoms of hypertension'];

      if (vitalSigns.bloodPressure) {
        const bpParts = vitalSigns.bloodPressure.split('/');
        if (bpParts.length === 2) {
          const systolic = parseInt(bpParts[0], 10);
          const diastolic = parseInt(bpParts[1], 10);
          if (!isNaN(systolic) && !isNaN(diastolic)) {
            supportingFactors.push(`Current BP: ${vitalSigns.bloodPressure}`);

            if (systolic > 180 || diastolic > 120) {
              likelihood = 0.95; // Higher likelihood with severe hypertension
              alerts.push({
                type: 'hypertensive-crisis',
                severity: 'critical',
                message: 'Severe hypertension detected requiring immediate intervention'
              });
            } else if (systolic > 140 || diastolic > 90) {
              likelihood = 0.90; // Moderate hypertension
            }
          }
        }
      }

      recommendations.push({
        condition: 'hypertension',
        likelihood: likelihood,
        recommendation: 'Check blood pressure and consider antihypertensive therapy',
        priority: likelihood > 0.9 ? 'critical' : 'high',
        supportingFactors: supportingFactors
      });
      evidence.push('Headache and blurred vision are common symptoms of hypertension');
    }

    if (symptoms.includes('chest pain')) {
      let likelihood = 0.85;
      let priority = 'high';
      const supportingFactors = ['Chest pain requires immediate cardiac assessment'];

      // Increase likelihood based on risk factors
      if (medicalHistory.includes('heart-disease')) {
        likelihood = 0.95;
        supportingFactors.push('History of heart disease');
      }
      if (medicalHistory.includes('diabetes')) {
        likelihood = Math.min(likelihood + 0.05, 0.99);
        supportingFactors.push('Diabetes increases cardiac risk');
      }
      if (age > 50) {
        likelihood = Math.min(likelihood + 0.05, 0.99);
        supportingFactors.push('Age over 50 increases cardiac risk');
      }

      if (likelihood > 0.9) {
        priority = 'critical';
        alerts.push({
          type: 'cardiac-emergency',
          severity: 'critical',
          message: 'High probability cardiac event requiring immediate evaluation'
        });
      }

      recommendations.push({
        condition: 'cardiac-event',
        likelihood: likelihood,
        recommendation: 'Immediate cardiac evaluation recommended',
        priority: priority,
        supportingFactors: supportingFactors
      });
      evidence.push('Chest pain requires immediate cardiac assessment');
    }

    // Additional symptom patterns
    if (symptoms.includes('fever') && symptoms.includes('cough') && symptoms.includes('shortness-of-breath')) {
      recommendations.push({
        condition: 'respiratory-infection',
        likelihood: 0.80,
        recommendation: 'Respiratory evaluation and chest imaging recommended',
        priority: 'medium',
        supportingFactors: ['Classic triad of fever, cough, and dyspnea']
      });
      evidence.push('Fever, cough, and shortness of breath commonly indicate respiratory infection');
    }

    // Check for medication interactions that could cause symptoms
    if (medications.includes('ACE-inhibitor') && symptoms.includes('dry-cough')) {
      recommendations.push({
        condition: 'medication-side-effect',
        likelihood: 0.75,
        recommendation: 'Consider alternative antihypertensive therapy',
        priority: 'medium',
        supportingFactors: ['ACE inhibitors commonly cause dry cough as side effect']
      });
      evidence.push('ACE inhibitors are associated with dry cough in 10-15% of patients');
    }

    return {
      recommendations: recommendations,
      alerts: alerts,
      confidence: recommendations.length > 0 ? Math.max(...recommendations.map(r => r.likelihood)) : 0.75,
      evidence: evidence,
      processingTime: Math.floor(Math.random() * 100) + 50
    };
  }

  /**
   * Process treatment recommendation
   * @param {Object} patientContext - Patient context and clinical data
   * @param {Object} config - Decision configuration
   * @returns {Promise<Object>} Processing result
   * @private
   */
  async _processTreatmentRecommendation(patientContext, config) {
    this.logger.info('Processing treatment recommendation', {
      patientId: patientContext.patientId,
      condition: patientContext.condition
    });

    // Simulate treatment processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200));

    const condition = patientContext.condition;
    const vitalSigns = patientContext.vitalSigns || {};
    const medicalHistory = patientContext.medicalHistory || [];
    const medications = patientContext.medications || [];
    const allergies = patientContext.allergies || [];
    const age = patientContext.age || 0;
    const gender = patientContext.gender || 'unknown';
    const recommendations = [];
    const evidence = [];
    const alerts = [];

    if (condition) {
      // Get base guideline
      const guideline = this.clinicalGuidelines.get(condition.toLowerCase());

      if (guideline) {
        // Start with base recommendations
        const baseTreatment = {
          treatment: [...guideline.guidelines], // Copy array to avoid mutation
          evidenceLevel: guideline.evidenceLevel,
          recommendation: `Follow ${guideline.condition} clinical guidelines`,
          priority: 'medium',
          contraindications: [],
          considerations: []
        };

        // Personalize treatment based on patient factors
        const personalizedTreatment = this._personalizeTreatment(
          baseTreatment,
          patientContext
        );

        recommendations.push(personalizedTreatment);
        evidence.push(`Evidence-based guidelines for ${guideline.condition}`);
      } else {
        // Fallback recommendations with more detail
        const fallbackTreatment = {
          treatment: ['Symptomatic treatment', 'Monitor and reassess'],
          evidenceLevel: 'C',
          recommendation: 'General supportive care',
          priority: 'low',
          considerations: ['No specific guidelines available for this condition'],
          followUp: 'Reassess in 24-48 hours or sooner if symptoms worsen'
        };

        recommendations.push(fallbackTreatment);
        evidence.push('No specific guidelines available, providing general care');
      }

      // Check for potential drug interactions
      const interactions = this._checkDrugInteractions(medications, recommendations, allergies);
      if (interactions.length > 0) {
        alerts.push(...interactions);
      }

      // Check for contraindications based on medical history
      const contraindications = this._checkContraindications(medicalHistory, recommendations);
      if (contraindications.length > 0) {
        alerts.push(...contraindications);
      }
    }

    return {
      recommendations: recommendations,
      alerts: alerts,
      confidence: recommendations.length > 0 ? 0.90 : 0.65,
      evidence: evidence,
      processingTime: Math.floor(Math.random() * 100) + 50
    };
  }

  /**
   * Process risk assessment
   * @param {Object} patientContext - Patient context and clinical data
   * @param {Object} config - Decision configuration
   * @returns {Promise<Object>} Processing result
   * @private
   */
  async _processRiskAssessment(patientContext, config) {
    this.logger.info('Processing risk assessment', {
      patientId: patientContext.patientId
    });

    // Simulate risk assessment
    await new Promise(resolve => setTimeout(resolve, Math.random() * 250));

    // In a real implementation, this would:
    // 1. Analyze patient risk factors
    // 2. Calculate risk scores
    // 3. Compare with population data
    // 4. Generate risk-based recommendations

    const vitalSigns = patientContext.vitalSigns || {};
    const riskFactors = patientContext.riskFactors || [];
    const recommendations = [];
    const evidence = [];

    let riskScore = 0;
    let riskLevel = 'low';

    // Simple risk calculation for demo
    if (vitalSigns.bloodPressure) {
      const systolic = parseInt(vitalSigns.bloodPressure.split('/')[0]);
      if (systolic > 180) {
        riskScore += 3;
      } else if (systolic > 140) {
        riskScore += 2;
      } else if (systolic > 120) {
        riskScore += 1;
      }
    }

    if (vitalSigns.heartRate && vitalSigns.heartRate > 100) {
      riskScore += 1;
    }

    riskScore += riskFactors.length;

    if (riskScore >= 5) {
      riskLevel = 'high';
      recommendations.push({
        risk: 'cardiovascular',
        level: 'high',
        recommendation: 'Urgent cardiovascular risk assessment',
        priority: 'high'
      });
      evidence.push('Multiple risk factors identified');
    } else if (riskScore >= 3) {
      riskLevel = 'moderate';
      recommendations.push({
        risk: 'cardiovascular',
        level: 'moderate',
        recommendation: 'Regular monitoring and risk factor modification',
        priority: 'medium'
      });
      evidence.push('Moderate risk factors present');
    }

    return {
      recommendations: recommendations,
      alerts: riskLevel === 'high' ? [{ type: 'high-risk', message: 'Patient at high cardiovascular risk' }] : [],
      confidence: 0.85,
      evidence: evidence
    };
  }

  /**
   * Process drug interaction
   * @param {Object} patientContext - Patient context and clinical data
   * @param {Object} config - Decision configuration
   * @returns {Promise<Object>} Processing result
   * @private
   */
  async _processDrugInteraction(patientContext, config) {
    this.logger.info('Processing drug interaction check', {
      patientId: patientContext.patientId,
      medicationCount: patientContext.medications?.length
    });

    // Simulate drug interaction processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 150));

    // In a real implementation, this would:
    // 1. Analyze patient medications
    // 2. Check for known interactions
    // 3. Consider patient factors
    // 4. Generate interaction alerts

    const medications = patientContext.medications || [];
    const alerts = [];
    const evidence = [];

    // Simple interaction check for demo
    if (medications.includes('warfarin') && medications.includes('aspirin')) {
      alerts.push({
        type: 'drug-interaction',
        severity: 'high',
        message: 'Warfarin + Aspirin: Increased bleeding risk',
        recommendation: 'Monitor INR closely and consider alternative therapy'
      });
      evidence.push('Known drug interaction between warfarin and aspirin');
    }

    if (medications.includes('simvastatin') && medications.includes('amiodarone')) {
      alerts.push({
        type: 'drug-interaction',
        severity: 'moderate',
        message: 'Simvastatin + Amiodarone: Increased statin toxicity risk',
        recommendation: 'Consider dose reduction or alternative statin'
      });
      evidence.push('Known drug interaction between simvastatin and amiodarone');
    }

    return {
      recommendations: [],
      alerts: alerts,
      confidence: alerts.length > 0 ? 0.95 : 0.80,
      evidence: evidence
    };
  }

  /**
   * Process clinical alert
   * @param {Object} patientContext - Patient context and clinical data
   * @param {Object} config - Decision configuration
   * @returns {Promise<Object>} Processing result
   * @private
   */
  async _processClinicalAlert(patientContext, config) {
    this.logger.info('Processing clinical alert', {
      patientId: patientContext.patientId
    });

    // Simulate clinical alert processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

    // In a real implementation, this would:
    // 1. Monitor vital signs and lab values
    // 2. Check for critical thresholds
    // 3. Generate immediate alerts
    // 4. Prioritize based on severity

    const vitalSigns = patientContext.vitalSigns || {};
    const labResults = patientContext.labResults || {};
    const alerts = [];
    const evidence = [];

    // Check for critical vital signs
    if (vitalSigns.bloodPressure) {
      const systolic = parseInt(vitalSigns.bloodPressure.split('/')[0]);
      const diastolic = parseInt(vitalSigns.bloodPressure.split('/')[1]);

      if (systolic > 180 || diastolic > 120) {
        alerts.push({
          type: 'hypertensive-crisis',
          severity: 'critical',
          message: 'Hypertensive crisis: Immediate intervention required',
          recommendation: 'Emergency department evaluation'
        });
        evidence.push('Severe hypertension requiring immediate attention');
      }
    }

    if (vitalSigns.heartRate && vitalSigns.heartRate > 150) {
      alerts.push({
        type: 'tachycardia',
        severity: 'high',
        message: 'Severe tachycardia detected',
        recommendation: 'Cardiac monitoring and beta-blocker consideration'
      });
      evidence.push('Heart rate > 150 bpm requires intervention');
    }

    return {
      recommendations: [],
      alerts: alerts,
      confidence: alerts.length > 0 ? 0.99 : 0.70,
      evidence: evidence
    };
  }

  /**
   * Generate decision alerts
   * @param {Object} decision - Decision record
   * @private
   */
  _generateDecisionAlerts(decision) {
    const alertId = uuidv4();

    const alert = {
      id: alertId,
      decisionId: decision.id,
      patientId: decision.patientContext.patientId,
      type: 'decision-support',
      severity: this._calculateAlertSeverity(decision),
      recommendations: decision.recommendations,
      confidence: decision.confidence,
      createdAt: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.set(alertId, alert);

    this.logger.info('Decision alert generated', {
      alertId,
      patientId: alert.patientId,
      severity: alert.severity,
      recommendationCount: alert.recommendations.length
    });
  }

  /**
   * Calculate alert severity based on decision
   * @param {Object} decision - Decision record
   * @returns {string} Alert severity
   * @private
   */
  _calculateAlertSeverity(decision) {
    // Check for critical alerts first
    const hasCriticalAlert = decision.alerts.some(alert => alert.severity === 'critical');
    if (hasCriticalAlert) return 'critical';

    // Check for critical recommendations
    const hasCritical = decision.recommendations.some(rec => rec.priority === 'critical');
    if (hasCritical) return 'critical';

    // Check for high-severity alerts
    const hasHighAlert = decision.alerts.some(alert => alert.severity === 'high');
    if (hasHighAlert) return 'high';

    // Check for high-priority recommendations
    const hasHigh = decision.recommendations.some(rec => rec.priority === 'high');
    if (hasHigh) return 'high';

    // Check for moderate severity/priority
    const hasMediumAlert = decision.alerts.some(alert => alert.severity === 'medium');
    const hasMedium = decision.recommendations.some(rec => rec.priority === 'medium');
    if (hasMediumAlert || hasMedium) return 'medium';

    return 'low';
  }

  /**
   * Register a custom decision model
   * @param {string} type - Decision type identifier
   * @param {Object} model - Decision model definition
   */
  registerDecisionModel(type, model) {
    if (!type || !model || !model.process) {
      throw new Error('Invalid decision model registration');
    }

    this.decisionModels.set(type, model);
    this.logger.info('Custom decision model registered', {
      type,
      model: model.name
    });
  }

  /**
   * Get decision history
   * @param {string} patientId - Patient identifier
   * @returns {Array} Array of decisions for the patient
   */
  getDecisionHistory(patientId) {
    const patientDecisions = [];

    for (const [decisionId, decision] of this.decisionHistory.entries()) {
      if (decision.patientContext.patientId === patientId) {
        patientDecisions.push({
          decisionId: decision.id,
          patientId: decision.patientContext.patientId,
          status: decision.status,
          createdAt: decision.createdAt,
          completedAt: decision.completedAt,
          recommendations: decision.recommendations,
          confidence: decision.confidence
        });
      }
    }

    return patientDecisions;
  }

  /**
   * Get active alerts
   * @returns {Array} Array of active alerts
   */
  getActiveAlerts() {
    const activeAlerts = [];

    for (const [alertId, alert] of this.alerts.entries()) {
      if (!alert.acknowledged) {
        activeAlerts.push({
          alertId: alert.id,
          patientId: alert.patientId,
          type: alert.type,
          severity: alert.severity,
          message: alert.recommendations.map(rec => rec.recommendation).join('; '),
          createdAt: alert.createdAt
        });
      }
    }

    return activeAlerts;
  }

  /**
   * Acknowledge an alert
   * @param {string} alertId - Alert identifier
   * @returns {boolean} True if alert was acknowledged
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.logger.info('Alert acknowledged', { alertId });
      return true;
    }

    return false;
  }

  /**
   * Get available decision models
   * @returns {Array} Array of available decision model types
   */
  getAvailableDecisionModels() {
    return Array.from(this.decisionModels.keys());
  }

  /**
   * Get clinical guidelines
   * @param {string} condition - Condition to get guidelines for
   * @returns {Object|null} Clinical guidelines or null if not found
   */
  getClinicalGuidelines(condition) {
    return this.clinicalGuidelines.get(condition) || null;
  }

  /**
   * Personalize treatment based on patient factors
   * @param {Object} baseTreatment - Base treatment recommendation
   * @param {Object} patientContext - Patient context and clinical data
   * @returns {Object} Personalized treatment recommendation
   * @private
   */
  _personalizeTreatment(baseTreatment, patientContext) {
    const personalizedTreatment = { ...baseTreatment };
    const { age, gender, medicalHistory = [], medications = [], allergies = [] } = patientContext;

    // Add age-based considerations
    if (age !== undefined) {
      if (age > 75) {
        personalizedTreatment.considerations = personalizedTreatment.considerations || [];
        personalizedTreatment.considerations.push('Consider reduced dosages for elderly patients');
        personalizedTreatment.followUp = 'Monitor closely for adverse effects';
      } else if (age < 18) {
        personalizedTreatment.considerations = personalizedTreatment.considerations || [];
        personalizedTreatment.considerations.push('Pediatric dosing guidelines apply');
      }
    }

    // Add gender-based considerations
    if (gender && gender !== 'unknown') {
      personalizedTreatment.considerations = personalizedTreatment.considerations || [];
      personalizedTreatment.considerations.push(`Gender: ${gender}`);
    }

    // Check for contraindications
    const contraindications = this._checkContraindications(medicalHistory, [baseTreatment]);
    if (contraindications.length > 0) {
      personalizedTreatment.contraindications = contraindications;
    }

    return personalizedTreatment;
  }

  /**
   * Check for potential drug interactions
   * @param {Array} medications - Patient medications
   * @param {Array} recommendations - Treatment recommendations
   * @param {Array} allergies - Patient allergies
   * @returns {Array} Array of interaction alerts
   * @private
   */
  _checkDrugInteractions(medications = [], recommendations = [], allergies = []) {
    const alerts = [];

    // Simple interaction check for demo
    if (medications.includes('warfarin') && medications.includes('aspirin')) {
      alerts.push({
        type: 'drug-interaction',
        severity: 'high',
        message: 'Warfarin + Aspirin: Increased bleeding risk',
        recommendation: 'Monitor INR closely and consider alternative therapy'
      });
    }

    if (medications.includes('simvastatin') && medications.includes('amiodarone')) {
      alerts.push({
        type: 'drug-interaction',
        severity: 'moderate',
        message: 'Simvastatin + Amiodarone: Increased statin toxicity risk',
        recommendation: 'Consider dose reduction or alternative statin'
      });
    }

    // Check for allergies
    if (allergies.length > 0) {
      for (const allergy of allergies) {
        if (allergy.toLowerCase().includes('penicillin') &&
            recommendations.some(rec =>
              rec.treatment && rec.treatment.some(t => t.toLowerCase().includes('antibiotic')))) {
          alerts.push({
            type: 'allergy-alert',
            severity: 'high',
            message: `Potential allergic reaction to ${allergy}`,
            recommendation: 'Verify patient allergy history before prescribing'
          });
        }
      }
    }

    return alerts;
  }

  /**
   * Check for contraindications based on medical history
   * @param {Array} medicalHistory - Patient medical history
   * @param {Array} recommendations - Treatment recommendations
   * @returns {Array} Array of contraindication alerts
   * @private
   */
  _checkContraindications(medicalHistory = [], recommendations = []) {
    const alerts = [];

    // Check for contraindications in recommendations
    for (const recommendation of recommendations) {
      if (recommendation.treatment) {
        // Example contraindication checks
        if (medicalHistory.includes('kidney-disease') &&
            recommendation.treatment.some(t => t.toLowerCase().includes('nsaids'))) {
          alerts.push({
            type: 'contraindication',
            severity: 'high',
            message: 'NSAIDs contraindicated in patients with kidney disease',
            recommendation: 'Consider alternative pain management options'
          });
        }

        if (medicalHistory.includes('heart-failure') &&
            recommendation.treatment.some(t => t.toLowerCase().includes('calcium-channel-blockers'))) {
          alerts.push({
            type: 'contraindication',
            severity: 'moderate',
            message: 'Calcium channel blockers may worsen heart failure',
            recommendation: 'Avoid non-dihydropyridine calcium channel blockers'
          });
        }
      }
    }

    return alerts;
  }
}

module.exports = DecisionSupportManager;