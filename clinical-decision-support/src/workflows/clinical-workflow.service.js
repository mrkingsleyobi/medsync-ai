/**
 * Clinical Workflow Service
 * Service for managing clinical decision support workflows
 */

const config = require('../config/workflow.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

class ClinicalWorkflowService {
  /**
   * Create a new Clinical Workflow Service
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.workflows = new Map();
    this.workflowDefinitions = config.workflows;
    this.stepDefinitions = config.steps;

    this.logger.info('Clinical Workflow Service created', {
      service: 'clinical-workflow-service'
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
      defaultMeta: { service: 'clinical-workflow-service' },
      transports: [
        new winston.transports.File({ filename: 'logs/clinical-workflow-service-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/clinical-workflow-service-combined.log' })
      ]
    });
  }

  /**
   * Execute a clinical workflow
   * @param {string} workflowType - Type of workflow to execute
   * @param {Object} patientContext - Patient context and clinical data
   * @param {Object} workflowConfig - Configuration for workflow execution
   * @returns {Promise<Object>} Workflow execution result
   */
  async executeWorkflow(workflowType, patientContext, workflowConfig = {}) {
    try {
      // Validate input
      if (!workflowType) {
        throw new Error('Workflow type is required');
      }

      if (!patientContext || !patientContext.patientId) {
        throw new Error('Patient context with patientId is required');
      }

      const workflowId = uuidv4();
      this.logger.info('Executing clinical workflow', {
        workflowId,
        workflowType,
        patientId: patientContext.patientId
      });

      // Create workflow record
      const workflow = {
        id: workflowId,
        type: workflowType,
        patientContext: patientContext,
        config: workflowConfig,
        status: 'pending',
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        steps: [],
        result: null,
        error: null
      };

      this.workflows.set(workflowId, workflow);

      // Validate workflow type
      const workflowDefinition = this.workflowDefinitions[workflowType];
      if (!workflowDefinition) {
        throw new Error(`Workflow type '${workflowType}' is not supported`);
      }

      // Start workflow execution
      workflow.status = 'running';
      workflow.startedAt = new Date().toISOString();

      // Execute workflow steps
      const result = await this._executeWorkflowSteps(workflow, workflowDefinition);

      // Complete workflow
      workflow.completedAt = new Date().toISOString();
      workflow.status = 'completed';
      workflow.result = result;

      this.logger.info('Clinical workflow executed successfully', {
        workflowId,
        workflowType,
        patientId: patientContext.patientId,
        executionTime: new Date(workflow.completedAt).getTime() - new Date(workflow.startedAt).getTime()
      });

      return {
        workflowId: workflow.id,
        status: workflow.status,
        result: workflow.result,
        executionTime: new Date(workflow.completedAt).getTime() - new Date(workflow.startedAt).getTime()
      };
    } catch (error) {
      this.logger.error('Failed to execute clinical workflow', {
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Execute workflow steps
   * @param {Object} workflow - Workflow record
   * @param {Object} workflowDefinition - Workflow definition
   * @returns {Promise<Object>} Workflow result
   * @private
   */
  async _executeWorkflowSteps(workflow, workflowDefinition) {
    const steps = workflowDefinition.steps;
    const results = {};

    this.logger.info('Executing workflow steps', {
      workflowId: workflow.id,
      stepCount: steps.length
    });

    // Execute steps either in parallel or sequentially
    if (this.config.execution.parallelSteps) {
      // Execute steps in parallel
      const stepPromises = steps.map(step => this._executeStep(workflow, step, results));
      await Promise.all(stepPromises);
    } else {
      // Execute steps sequentially
      for (const step of steps) {
        await this._executeStep(workflow, step, results);
      }
    }

    return results;
  }

  /**
   * Execute a single workflow step
   * @param {Object} workflow - Workflow record
   * @param {string} stepName - Name of the step to execute
   * @param {Object} results - Accumulated results
   * @returns {Promise<void>}
   * @private
   */
  async _executeStep(workflow, stepName, results) {
    const stepDefinition = this.stepDefinitions[stepName];
    if (!stepDefinition) {
      this.logger.warn('Unknown workflow step', {
        workflowId: workflow.id,
        stepName
      });
      return;
    }

    this.logger.info('Executing workflow step', {
      workflowId: workflow.id,
      stepName
    });

    // Create step record
    const step = {
      name: stepName,
      status: 'pending',
      startedAt: null,
      completedAt: null,
      result: null,
      error: null
    };

    workflow.steps.push(step);

    try {
      // Start step execution
      step.status = 'running';
      step.startedAt = new Date().toISOString();

      // Validate required fields if specified
      if (stepDefinition.requiredFields) {
        for (const field of stepDefinition.requiredFields) {
          if (!workflow.patientContext[field]) {
            throw new Error(`Required field '${field}' is missing for step '${stepName}'`);
          }
        }
      }

      // Simulate step processing
      await new Promise(resolve => setTimeout(resolve, Math.random() * stepDefinition.timeout));

      // Generate step result based on step type
      const result = this._generateStepResult(stepName, workflow.patientContext);

      // Complete step
      step.completedAt = new Date().toISOString();
      step.status = 'completed';
      step.result = result;

      // Store result for use in subsequent steps
      results[stepName] = result;

      this.logger.info('Workflow step executed successfully', {
        workflowId: workflow.id,
        stepName,
        executionTime: new Date(step.completedAt).getTime() - new Date(step.startedAt).getTime()
      });
    } catch (error) {
      step.completedAt = new Date().toISOString();
      step.status = 'failed';
      step.error = error.message;

      this.logger.error('Workflow step failed', {
        workflowId: workflow.id,
        stepName,
        error: error.message
      });

      // Handle step failure based on configuration
      if (this.config.execution.errorHandling.strategy === 'fail-fast') {
        throw error;
      }
    }
  }

  /**
   * Generate result for a workflow step
   * @param {string} stepName - Name of the step
   * @param {Object} patientContext - Patient context
   * @returns {Object} Step result
   * @private
   */
  _generateStepResult(stepName, patientContext) {
    // Generate different results based on step type
    switch (stepName) {
      case 'patientDataValidation':
        return {
          valid: true,
          patientId: patientContext.patientId
        };

      case 'symptomAnalysis':
        return {
          symptoms: patientContext.symptoms || [],
          patterns: this._analyzeSymptomPatterns(patientContext.symptoms || [])
        };

      case 'vitalSignsAssessment':
        return {
          vitalSigns: patientContext.vitalSigns || {},
          abnormalities: this._assessVitalSigns(patientContext.vitalSigns || {})
        };

      case 'medicalHistoryReview':
        return {
          medicalHistory: patientContext.medicalHistory || [],
          relevantFactors: this._identifyRelevantFactors(patientContext.medicalHistory || [])
        };

      case 'diagnosisRecommendation':
        return {
          recommendations: [
            {
              condition: 'hypertension',
              likelihood: 0.85,
              recommendation: 'Check blood pressure and consider antihypertensive therapy',
              priority: 'high'
            }
          ]
        };

      case 'evidenceCollection':
        return {
          evidence: [
            'Headache and blurred vision are common symptoms of hypertension',
            'Blood pressure reading confirms hypertension'
          ]
        };

      case 'confidenceCalculation':
        return {
          confidence: 0.85
        };

      case 'resultGeneration':
        return {
          decisionId: uuidv4(),
          status: 'completed',
          recommendations: [
            {
              condition: 'hypertension',
              likelihood: 0.85,
              recommendation: 'Check blood pressure and consider antihypertensive therapy',
              priority: 'high'
            }
          ],
          confidence: 0.85,
          evidence: [
            'Headache and blurred vision are common symptoms of hypertension',
            'Blood pressure reading confirms hypertension'
          ]
        };

      case 'conditionValidation':
        return {
          valid: true,
          condition: patientContext.condition
        };

      case 'guidelineRetrieval':
        return {
          guidelines: [
            'First-line treatment: ACE inhibitors or ARBs',
            'Target BP: <130/80 mmHg for high-risk patients',
            'Lifestyle modifications: Diet, exercise, weight loss'
          ]
        };

      case 'patientProfileAnalysis':
        return {
          personalizedRecommendations: [
            {
              treatment: 'ACE inhibitors',
              dosage: '10mg daily',
              considerations: ['Monitor kidney function', 'Check for cough']
            }
          ]
        };

      case 'contraindicationCheck':
        return {
          contraindications: []
        };

      case 'interactionCheck':
        return {
          interactions: []
        };

      case 'dosageCalculation':
        return {
          dosage: '10mg daily'
        };

      case 'recommendationGeneration':
        return {
          recommendations: [
            {
              treatment: 'ACE inhibitors',
              dosage: '10mg daily',
              priority: 'high'
            }
          ]
        };

      case 'riskFactorIdentification':
        return {
          riskFactors: patientContext.riskFactors || []
        };

      case 'labResultReview':
        return {
          labResults: patientContext.labResults || {}
        };

      case 'riskCalculation':
        return {
          riskScore: 7,
          riskLevel: 'moderate'
        };

      case 'medicationListValidation':
        return {
          valid: true,
          medications: patientContext.medications || []
        };

      case 'interactionDatabaseQuery':
        return {
          interactions: this._checkDrugInteractions(patientContext.medications || [])
        };

      case 'patientProfileCheck':
        return {
          riskFactors: []
        };

      case 'severityAssessment':
        return {
          severity: 'moderate'
        };

      case 'vitalSignsMonitoring':
        return {
          criticalValues: this._checkCriticalVitalSigns(patientContext.vitalSigns || {})
        };

      case 'labResultAnalysis':
        return {
          criticalValues: []
        };

      case 'thresholdComparison':
        return {
          alerts: []
        };

      case 'alertGeneration':
        return {
          alert: {
            type: 'clinical-alert',
            severity: 'high',
            message: 'Hypertensive crisis detected'
          }
        };

      case 'severityClassification':
        return {
          severity: 'high'
        };

      case 'notificationDispatch':
        return {
          dispatched: true
        };

      default:
        return {
          message: `Step '${stepName}' executed successfully`
        };
    }
  }

  /**
   * Analyze symptom patterns
   * @param {Array} symptoms - Array of symptoms
   * @returns {Array} Symptom patterns
   * @private
   */
  _analyzeSymptomPatterns(symptoms) {
    const patterns = [];

    if (symptoms.includes('headache') && symptoms.includes('blurred vision')) {
      patterns.push('hypertension_pattern');
    }

    if (symptoms.includes('chest pain')) {
      patterns.push('cardiac_pattern');
    }

    return patterns;
  }

  /**
   * Assess vital signs for abnormalities
   * @param {Object} vitalSigns - Vital signs object
   * @returns {Array} Abnormalities found
   * @private
   */
  _assessVitalSigns(vitalSigns) {
    const abnormalities = [];

    if (vitalSigns.bloodPressure) {
      const parts = vitalSigns.bloodPressure.split('/');
      if (parts.length === 2) {
        const systolic = parseInt(parts[0]);
        const diastolic = parseInt(parts[1]);

        if (systolic > 140 || diastolic > 90) {
          abnormalities.push('hypertension');
        }
      }
    }

    if (vitalSigns.heartRate && vitalSigns.heartRate > 100) {
      abnormalities.push('tachycardia');
    }

    return abnormalities;
  }

  /**
   * Identify relevant medical history factors
   * @param {Array} medicalHistory - Medical history array
   * @returns {Array} Relevant factors
   * @private
   */
  _identifyRelevantFactors(medicalHistory) {
    return medicalHistory.filter(factor =>
      factor.includes('hypertension') ||
      factor.includes('diabetes') ||
      factor.includes('heart')
    );
  }

  /**
   * Check for drug interactions
   * @param {Array} medications - Array of medications
   * @returns {Array} Interactions found
   * @private
   */
  _checkDrugInteractions(medications) {
    const interactions = [];

    if (medications.includes('warfarin') && medications.includes('aspirin')) {
      interactions.push({
        drugs: ['warfarin', 'aspirin'],
        severity: 'high',
        description: 'Increased bleeding risk'
      });
    }

    return interactions;
  }

  /**
   * Check for critical vital signs
   * @param {Object} vitalSigns - Vital signs object
   * @returns {Array} Critical values found
   * @private
   */
  _checkCriticalVitalSigns(vitalSigns) {
    const criticalValues = [];

    if (vitalSigns.bloodPressure) {
      const parts = vitalSigns.bloodPressure.split('/');
      if (parts.length === 2) {
        const systolic = parseInt(parts[0]);
        const diastolic = parseInt(parts[1]);

        if (systolic > 180 || diastolic > 120) {
          criticalValues.push({
            parameter: 'bloodPressure',
            value: vitalSigns.bloodPressure,
            critical: true,
            description: 'Hypertensive crisis'
          });
        }
      }
    }

    return criticalValues;
  }

  /**
   * Get workflow status
   * @param {string} workflowId - Workflow identifier
   * @returns {Object|null} Workflow status or null if not found
   */
  getWorkflowStatus(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return null;
    }

    return {
      workflowId: workflow.id,
      type: workflow.type,
      status: workflow.status,
      createdAt: workflow.createdAt,
      startedAt: workflow.startedAt,
      completedAt: workflow.completedAt,
      steps: workflow.steps.map(step => ({
        name: step.name,
        status: step.status,
        startedAt: step.startedAt,
        completedAt: step.completedAt
      }))
    };
  }

  /**
   * Get available workflows
   * @returns {Array} Array of available workflow types
   */
  getAvailableWorkflows() {
    return Object.keys(this.workflowDefinitions);
  }

  /**
   * Get workflow definition
   * @param {string} workflowType - Workflow type
   * @returns {Object|null} Workflow definition or null if not found
   */
  getWorkflowDefinition(workflowType) {
    return this.workflowDefinitions[workflowType] || null;
  }
}

module.exports = ClinicalWorkflowService;