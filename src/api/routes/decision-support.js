// MediSync Healthcare AI Platform - Decision Support Routes
// This file implements the API endpoints for clinical decision support

const express = require('express');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for decision history (in a real implementation, this would be a database)
const decisionHistory = new Map();
const activeAlerts = new Map();

// Helper functions
/**
 * Determine decision type from patient context
 * @param {Object} patientContext - Patient context and clinical data
 * @param {Object} config - Decision configuration
 * @returns {string} Decision type
 */
function determineDecisionType(patientContext, config) {
  if (config && config.decisionType) {
    return config.decisionType;
  }

  // Determine decision type based on context
  if (patientContext.vitalSigns && typeof patientContext.vitalSigns.bloodPressure === 'string') {
    const bp = patientContext.vitalSigns.bloodPressure;
    const parts = bp.split('/');
    if (parts.length === 2) {
      const systolic = parseInt(parts[0], 10);
      const diastolic = parseInt(parts[1], 10);
      if (!isNaN(systolic) && !isNaN(diastolic) && (systolic > 140 || diastolic > 90)) {
        return 'risk-assessment';
      }
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
 * Process decision based on type
 * @param {string} decisionType - Type of decision to process
 * @param {Object} patientContext - Patient context and clinical data
 * @param {Object} config - Decision configuration
 * @returns {Promise<Object>} Processing result
 */
async function processDecision(decisionType, patientContext, config) {
  // Simulate processing time
  const processingTime = Math.floor(Math.random() * 300) + 50;
  await new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, processingTime);
  });

  switch (decisionType) {
    case 'diagnosis-support':
      return processDiagnosisSupport(patientContext, config);
    case 'treatment-recommendation':
      return processTreatmentRecommendation(patientContext, config);
    case 'risk-assessment':
      return processRiskAssessment(patientContext, config);
    case 'drug-interaction':
      return processDrugInteraction(patientContext, config);
    case 'clinical-alert':
      return processClinicalAlert(patientContext, config);
    default:
      return {
        recommendations: [],
        alerts: [],
        confidence: 0.5,
        evidence: ['No specific decision model available'],
        processingTime
      };
  }
}

/**
 * Process diagnosis support
 * @param {Object} patientContext - Patient context and clinical data
 * @param {Object} config - Decision configuration
 * @returns {Object} Processing result
 */
function processDiagnosisSupport(patientContext, _config) {
  const symptoms = patientContext.symptoms || [];
  const recommendations = [];
  const evidence = [];

  // Simple rule-based diagnosis for demo
  if (symptoms.includes('headache') && symptoms.includes('blurred vision')) {
    recommendations.push({
      condition: 'hypertension',
      likelihood: 0.85,
      recommendation: 'Check blood pressure and consider antihypertensive therapy',
      priority: 'high'
    });
    evidence.push('Headache and blurred vision are common symptoms of hypertension');
  }

  if (symptoms.includes('chest pain')) {
    recommendations.push({
      condition: 'cardiac-event',
      likelihood: 0.92,
      recommendation: 'Immediate cardiac evaluation recommended',
      priority: 'critical'
    });
    evidence.push('Chest pain requires immediate cardiac assessment');
  }

  return {
    recommendations,
    alerts: [],
    confidence: recommendations.length > 0 ? 0.92 : 0.75,
    evidence,
    processingTime: Math.floor(Math.random() * 100) + 50
  };
}

/**
 * Process treatment recommendation
 * @param {Object} patientContext - Patient context and clinical data
 * @param {Object} config - Decision configuration
 * @returns {Object} Processing result
 */
function processTreatmentRecommendation(patientContext, _config) {
  const { condition } = patientContext;
  const recommendations = [];
  const evidence = [];

  if (condition) {
    // Simple treatment recommendations for demo
    const treatmentGuidelines = {
      hypertension: {
        treatment: [
          'ACE inhibitors or ARBs as first-line',
          'Target BP: <130/80 mmHg for high-risk patients',
          'Lifestyle modifications: Diet, exercise, weight loss'
        ],
        evidenceLevel: 'A',
        recommendation: 'Follow hypertension clinical guidelines'
      },
      diabetes: {
        treatment: [
          'HbA1c target: <7% for most patients',
          'First-line treatment: Metformin',
          'Regular monitoring of kidney function'
        ],
        evidenceLevel: 'A',
        recommendation: 'Follow diabetes clinical guidelines'
      },
      'heart-failure': {
        treatment: [
          'ACE inhibitors and beta-blockers as first-line',
          'Diuretics for fluid management',
          'Regular monitoring of weight and symptoms'
        ],
        evidenceLevel: 'A',
        recommendation: 'Follow heart failure clinical guidelines'
      }
    };

    const guideline = treatmentGuidelines[condition.toLowerCase()];
    if (guideline) {
      recommendations.push({
        treatment: guideline.treatment,
        evidenceLevel: guideline.evidenceLevel,
        recommendation: guideline.recommendation,
        priority: 'medium'
      });
      evidence.push(`Evidence-based guidelines for ${condition}`);
    } else {
      recommendations.push({
        treatment: ['Symptomatic treatment', 'Monitor and reassess'],
        evidenceLevel: 'C',
        recommendation: 'General supportive care',
        priority: 'low'
      });
      evidence.push('No specific guidelines available, providing general care');
    }
  }

  return {
    recommendations,
    alerts: [],
    confidence: recommendations.length > 0 ? 0.90 : 0.65,
    evidence,
    processingTime: Math.floor(Math.random() * 100) + 50
  };
}

/**
 * Process risk assessment
 * @param {Object} patientContext - Patient context and clinical data
 * @param {Object} config - Decision configuration
 * @returns {Object} Processing result
 */
function processRiskAssessment(patientContext, _config) {
  const vitalSigns = patientContext.vitalSigns || {};
  const riskFactors = patientContext.riskFactors || [];
  const recommendations = [];
  const evidence = [];

  let riskScore = 0;
  let riskLevel = 'low';

  // Simple risk calculation for demo
  if (vitalSigns.bloodPressure) {
    const systolic = parseInt(vitalSigns.bloodPressure.split('/')[0], 10);
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

  const alerts = riskLevel === 'high'
    ? [{ type: 'high-risk', message: 'Patient at high cardiovascular risk', severity: 'high' }]
    : [];

  return {
    recommendations,
    alerts,
    confidence: 0.85,
    evidence,
    processingTime: Math.floor(Math.random() * 150) + 100
  };
}

/**
 * Process drug interaction
 * @param {Object} patientContext - Patient context and clinical data
 * @param {Object} config - Decision configuration
 * @returns {Object} Processing result
 */
function processDrugInteraction(patientContext, _config) {
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
    alerts,
    confidence: alerts.length > 0 ? 0.95 : 0.80,
    evidence,
    processingTime: Math.floor(Math.random() * 100) + 50
  };
}

/**
 * Process clinical alert
 * @param {Object} patientContext - Patient context and clinical data
 * @param {Object} config - Decision configuration
 * @returns {Object} Processing result
 */
function processClinicalAlert(patientContext, _config) {
  const vitalSigns = patientContext.vitalSigns || {};
  const alerts = [];
  const evidence = [];

  // Check for critical vital signs
  if (vitalSigns.bloodPressure) {
    const systolic = parseInt(vitalSigns.bloodPressure.split('/')[0], 10);
    const diastolic = parseInt(vitalSigns.bloodPressure.split('/')[1], 10);

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
    alerts,
    confidence: alerts.length > 0 ? 0.99 : 0.70,
    evidence,
    processingTime: Math.floor(Math.random() * 50) + 25
  };
}

// Create router
const router = express.Router();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'decision-support-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/decision-support-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/decision-support-combined.log' })
  ]
});

// If we're not in production, log to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Generate clinical decision support
 * POST /api/decision-support/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { patientContext, decisionConfig } = req.body;

    // Validate input
    if (!patientContext || !patientContext.patientId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Patient context with patientId is required'
      });
    }

    logger.info('Generating clinical decision support', {
      patientId: patientContext.patientId,
      contextSize: JSON.stringify(patientContext).length,
      decisionConfig
    });

    // In a real implementation, this would call the neural mesh decision support manager
    // For now, we'll simulate the response
    const decisionId = uuidv4();
    const timestamp = new Date().toISOString();

    // Simulate decision processing
    const decisionType = determineDecisionType(patientContext, decisionConfig);
    const result = await processDecision(decisionType, patientContext, decisionConfig);

    // Create decision record
    const decision = {
      decisionId,
      patientId: patientContext.patientId,
      patientContext,
      decisionConfig,
      decisionType,
      status: 'completed',
      createdAt: timestamp,
      completedAt: new Date().toISOString(),
      recommendations: result.recommendations,
      alerts: result.alerts,
      confidence: result.confidence,
      evidence: result.evidence,
      processingTime: result.processingTime
    };

    // Store decision in history
    decisionHistory.set(decisionId, decision);

    // Generate alerts if needed
    if (result.alerts && result.alerts.length > 0) {
      result.alerts.forEach(alert => {
        const alertId = uuidv4();
        const alertRecord = {
          alertId,
          decisionId,
          patientId: patientContext.patientId,
          type: 'decision-support',
          severity: alert.severity || 'medium',
          message: alert.message || alert.recommendation,
          createdAt: timestamp,
          acknowledged: false
        };
        activeAlerts.set(alertId, alertRecord);
      });
    }

    logger.info('Clinical decision support generated successfully', {
      decisionId,
      patientId: patientContext.patientId,
      recommendationCount: result.recommendations.length,
      alertCount: result.alerts.length,
      confidence: result.confidence
    });

    return res.status(200).json({
      decisionId: decision.decisionId,
      status: decision.status,
      recommendations: decision.recommendations,
      alerts: decision.alerts,
      confidence: decision.confidence,
      evidence: decision.evidence,
      processingTime: decision.processingTime
    });
  } catch (error) {
    logger.error('Failed to generate clinical decision support', {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate clinical decision support'
    });
  }
});

/**
 * Get decision history for a patient
 * GET /api/decision-support/history/:patientId
 */
router.get('/history/:patientId', (req, res) => {
  try {
    const { patientId } = req.params;

    logger.info('Retrieving decision history', { patientId });

    // Get decisions for this patient
    const patientDecisions = [];
    decisionHistory.forEach((decision, _decisionId) => {
      if (decision.patientId === patientId) {
        patientDecisions.push({
          decisionId: decision.decisionId,
          patientId: decision.patientId,
          decisionType: decision.decisionType,
          status: decision.status,
          createdAt: decision.createdAt,
          completedAt: decision.completedAt,
          recommendations: decision.recommendations,
          confidence: decision.confidence
        });
      }
    });

    return res.status(200).json({
      patientId,
      decisions: patientDecisions,
      count: patientDecisions.length
    });
  } catch (error) {
    logger.error('Failed to retrieve decision history', {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve decision history'
    });
  }
});

/**
 * Get active alerts
 * GET /api/decision-support/alerts
 */
router.get('/alerts', (req, res) => {
  try {
    logger.info('Retrieving active alerts');

    // Get all active (unacknowledged) alerts
    const alerts = [];
    activeAlerts.forEach((alert, _alertId) => {
      if (!alert.acknowledged) {
        alerts.push({
          alertId: alert.alertId,
          patientId: alert.patientId,
          decisionId: alert.decisionId,
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          createdAt: alert.createdAt
        });
      }
    });

    return res.status(200).json({
      alerts,
      count: alerts.length
    });
  } catch (error) {
    logger.error('Failed to retrieve active alerts', {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve active alerts'
    });
  }
});

/**
 * Acknowledge an alert
 * POST /api/decision-support/alerts/:alertId/acknowledge
 */
router.post('/alerts/:alertId/acknowledge', (req, res) => {
  try {
    const { alertId } = req.params;

    logger.info('Acknowledging alert', { alertId });

    const alert = activeAlerts.get(alertId);
    if (!alert) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Alert not found'
      });
    }

    // Mark alert as acknowledged
    alert.acknowledged = true;
    activeAlerts.set(alertId, alert);

    logger.info('Alert acknowledged successfully', { alertId });

    return res.status(200).json({
      alertId,
      acknowledged: true,
      message: 'Alert acknowledged successfully'
    });
  } catch (error) {
    logger.error('Failed to acknowledge alert', {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to acknowledge alert'
    });
  }
});

module.exports = router;
