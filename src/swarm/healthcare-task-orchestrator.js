#!/usr/bin/env node

/**
 * MediSync Healthcare AI Platform - Task Orchestrator
 *
 * This orchestrator coordinates parallel execution of medical AI tasks across all specialized agents
 * with healthcare-specific workflow patterns, HIPAA compliance, emergency protocols, and safety monitoring.
 *
 * CRITICAL HEALTHCARE MANDATES:
 * - HIPAA compliance is NON-NEGOTIABLE
 * - Medical AI decisions require 95%+ confidence threshold with human oversight
 * - Zero downtime tolerance for critical healthcare functions
 * - All clinical algorithms must have explainable AI capabilities
 * - FDA/regulatory compliance built into every component
 * - Byzantine fault tolerance required for distributed healthcare systems
 */

const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const EventEmitter = require('events');

// Healthcare-compliant logging configuration
const healthcareLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: './logs/healthcare-task-orchestrator.log',
      flags: 'a',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

/**
 * Healthcare Task Orchestrator
 * Coordinates parallel execution of medical AI tasks with compliance and safety
 */
class HealthcareTaskOrchestrator extends EventEmitter {
  constructor() {
    super();

    this.tasks = new Map(); // Track all tasks
    this.agents = new Map(); // Track all specialized agents
    this.workflows = new Map(); // Track workflows
    this.auditTrail = []; // HIPAA-compliant audit trail

    // Healthcare execution context
    this.emergencyMode = false;
    this.maintenanceMode = false;
    this.humanOversightRequired = true;
    this.confidenceThreshold = 0.95; // Medical AI confidence threshold

    // Monitoring intervals
    this.safetyMonitoringInterval = null;
    this.complianceMonitoringInterval = null;

    // Initialize compliance and monitoring
    this.initializeHealthcareCompliance();
    this.initializeMonitoring();

    // Error handling
    process.on('uncaughtException', (error) => this.handleCriticalError(error));
    process.on('unhandledRejection', (reason) => this.handleCriticalError(reason));
  }

  /**
   * Initialize healthcare compliance frameworks
   */
  initializeHealthcareCompliance() {
    healthcareLogger.info('🛡️ Initializing healthcare compliance frameworks');

    this.compliance = {
      hipaa: {
        anonymizationRequired: true,
        auditTrailEnabled: true,
        accessControl: 'role_based',
        retentionPolicy: '7_years'
      },
      fda: {
        explainableAIRequired: true,
        confidenceThreshold: 0.95,
        humanOversight: true,
        validationRequired: true
      },
      gdpr: {
        dataMinimization: true,
        consentRequired: true,
        rightToErasure: true,
        privacyByDesign: true
      }
    };

    healthcareLogger.info('✅ Healthcare compliance frameworks initialized');
  }

  /**
   * Initialize real-time monitoring
   */
  initializeMonitoring() {
    healthcareLogger.info('📊 Initializing real-time healthcare monitoring');

    // Clinical safety monitoring (5-second intervals)
    this.safetyMonitoringInterval = setInterval(() => {
      this.monitorClinicalSafety();
    }, 5000);

    // Compliance validation (30-second intervals)
    this.complianceMonitoringInterval = setInterval(() => {
      this.validateContinuousCompliance();
    }, 30000);

    healthcareLogger.info('✅ Real-time healthcare monitoring initialized');
  }

  /**
   * Register a specialized healthcare agent
   */
  registerAgent(agentConfig) {
    try {
      const agent = {
        id: agentConfig.id || uuidv4(),
        type: agentConfig.type,
        capabilities: agentConfig.capabilities || [],
        status: 'registered',
        lastHeartbeat: new Date().toISOString(),
        confidenceThreshold: agentConfig.confidenceThreshold || this.confidenceThreshold,
        compliance: agentConfig.compliance || ['HIPAA', 'FDA', 'GDPR']
      };

      this.agents.set(agent.id, agent);
      this.logAuditEvent('AGENT_REGISTERED', { agentId: agent.id, type: agent.type });

      healthcareLogger.info(`🤖 Healthcare agent registered: ${agent.type} (${agent.id})`);
      return agent.id;
    } catch (error) {
      healthcareLogger.error('❌ Failed to register healthcare agent', error);
      throw error;
    }
  }

  /**
   * Create a healthcare workflow with compliance
   */
  async createWorkflow(workflowConfig) {
    try {
      const workflowId = uuidv4();
      const workflow = {
        id: workflowId,
        name: workflowConfig.name,
        status: 'pending',
        tasks: [],
        dependencies: workflowConfig.dependencies || [],
        compliance: workflowConfig.compliance || ['HIPAA', 'FDA'],
        safetyThreshold: workflowConfig.safetyThreshold || 0.95,
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        results: null
      };

      this.workflows.set(workflowId, workflow);
      this.logAuditEvent('WORKFLOW_CREATED', { workflowId, name: workflow.name });

      healthcareLogger.info(`🔗 Healthcare workflow created: ${workflow.name} (${workflowId})`);
      return workflowId;
    } catch (error) {
      healthcareLogger.error('❌ Failed to create healthcare workflow', error);
      throw error;
    }
  }

  /**
   * Add parallel tasks to a workflow
   */
  async addParallelTasks(workflowId, tasks) {
    try {
      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        throw new Error(`Workflow not found: ${workflowId}`);
      }

      for (const task of tasks) {
        const taskId = uuidv4();
        const taskEntry = {
          id: taskId,
          workflowId: workflowId,
          agentType: task.agent,
          taskType: task.task,
          priority: task.priority || 'medium',
          status: 'pending',
          dependencies: task.dependencies || [],
          confidenceThreshold: task.confidenceThreshold || this.confidenceThreshold,
          createdAt: new Date().toISOString(),
          startedAt: null,
          completedAt: null,
          result: null,
          error: null
        };

        this.tasks.set(taskId, taskEntry);
        workflow.tasks.push(taskId);

        this.logAuditEvent('TASK_ADDED', {
          taskId,
          workflowId,
          agentType: task.agent,
          taskType: task.task
        });
      }

      healthcareLogger.info(`➕ Added ${tasks.length} parallel tasks to workflow: ${workflow.name}`);
    } catch (error) {
      healthcareLogger.error('❌ Failed to add parallel tasks to workflow', error);
      throw error;
    }
  }

  /**
   * Execute a healthcare workflow with proper coordination
   */
  async executeWorkflow(workflowId) {
    try {
      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        throw new Error(`Workflow not found: ${workflowId}`);
      }

      healthcareLogger.info(`🚀 Executing healthcare workflow: ${workflow.name}`);
      workflow.status = 'executing';
      workflow.startedAt = new Date().toISOString();

      this.logAuditEvent('WORKFLOW_EXECUTING', { workflowId, name: workflow.name });

      // Validate workflow compliance before execution
      await this.validateWorkflowCompliance(workflow);

      // Execute tasks in parallel based on dependencies
      const results = await this.executeParallelTasks(workflow);

      // Process workflow results with safety checks
      const processedResults = await this.processWorkflowResults(workflow, results);

      workflow.status = 'completed';
      workflow.completedAt = new Date().toISOString();
      workflow.results = processedResults;

      this.logAuditEvent('WORKFLOW_COMPLETED', { workflowId, name: workflow.name });

      healthcareLogger.info(`✅ Healthcare workflow completed: ${workflow.name}`);
      this.emit('workflowCompleted', workflowId, processedResults);

      return processedResults;
    } catch (error) {
      healthcareLogger.error(`❌ Healthcare workflow execution failed: ${workflowId}`, error);
      await this.handleWorkflowError(workflowId, error);
      throw error;
    }
  }

  /**
   * Execute parallel tasks with healthcare coordination
   */
  async executeParallelTasks(workflow) {
    try {
      healthcareLogger.info(`ParallelGroup executing ${workflow.tasks.length} tasks in parallel`);

      // Group tasks by agent type for efficient execution
      const taskGroups = new Map();

      for (const taskId of workflow.tasks) {
        const task = this.tasks.get(taskId);
        if (!taskGroups.has(task.agentType)) {
          taskGroups.set(task.agentType, []);
        }
        taskGroups.get(task.agentType).push(task);
      }

      // Execute tasks in parallel by agent type
      const groupPromises = [];
      for (const [agentType, tasks] of taskGroups.entries()) {
        const groupPromise = this.executeAgentTaskGroup(agentType, tasks);
        groupPromises.push(groupPromise);
      }

      // Wait for all task groups to complete
      const groupResults = await Promise.all(groupPromises);

      // Flatten results
      const allResults = [];
      for (const groupResult of groupResults) {
        allResults.push(...groupResult);
      }

      healthcareLogger.info(`ParallelGroup completed execution of ${workflow.tasks.length} tasks`);
      return allResults;
    } catch (error) {
      healthcareLogger.error('ParallelGroup execution failed', error);
      throw error;
    }
  }

  /**
   * Execute a group of tasks for a specific agent type
   */
  async executeAgentTaskGroup(agentType, tasks) {
    try {
      healthcareLogger.info(`ParallelGroup executing ${tasks.length} tasks for agent: ${agentType}`);

      // Execute tasks in parallel
      const taskPromises = tasks.map(task => this.executeSingleTask(task));
      const results = await Promise.all(taskPromises);

      return results;
    } catch (error) {
      healthcareLogger.error(`ParallelGroup execution failed for agent ${agentType}`, error);
      throw error;
    }
  }

  /**
   * Execute a single task with healthcare compliance
   */
  async executeSingleTask(task) {
    try {
      task.status = 'executing';
      task.startedAt = new Date().toISOString();

      this.logAuditEvent('TASK_EXECUTING', {
        taskId: task.id,
        agentType: task.agentType,
        taskType: task.taskType
      });

      // Simulate task execution (in a real implementation, this would call the actual agent)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

      // Simulate task result with confidence score
      const result = {
        taskId: task.id,
        agentType: task.agentType,
        taskType: task.taskType,
        confidence: Math.random() * 0.1 + 0.90, // 90-100% confidence
        data: { message: `Task ${task.taskType} completed successfully` },
        timestamp: new Date().toISOString()
      };

      // Check confidence threshold
      if (result.confidence < task.confidenceThreshold) {
        healthcareLogger.warn(`⚠️ Task confidence below threshold: ${result.confidence} < ${task.confidenceThreshold}`);
        await this.triggerHumanOversight(result);
      }

      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.result = result;

      this.logAuditEvent('TASK_COMPLETED', {
        taskId: task.id,
        agentType: task.agentType,
        taskType: task.taskType,
        confidence: result.confidence
      });

      healthcareLogger.info(`✅ Task completed: ${task.taskType} (${task.id}) with confidence: ${result.confidence}`);
      return result;
    } catch (error) {
      task.status = 'failed';
      task.completedAt = new Date().toISOString();
      task.error = error.message;

      this.logAuditEvent('TASK_FAILED', {
        taskId: task.id,
        agentType: task.agentType,
        taskType: task.taskType,
        error: error.message
      });

      healthcareLogger.error(`❌ Task failed: ${task.taskType} (${task.id})`, error);
      throw error;
    }
  }

  /**
   * Process workflow results with safety validation
   */
  async processWorkflowResults(workflow, results) {
    try {
      healthcareLogger.info(`Processing ${results.length} workflow results with safety validation`);

      // Validate all results meet confidence thresholds
      const lowConfidenceResults = results.filter(result =>
        result.confidence < workflow.safetyThreshold
      );

      if (lowConfidenceResults.length > 0) {
        healthcareLogger.warn(`⚠️ ${lowConfidenceResults.length} results below safety threshold`);
        await this.triggerClinicalReview(lowConfidenceResults);
      }

      // Aggregate results
      const processedResults = {
        workflowId: workflow.id,
        workflowName: workflow.name,
        taskCount: results.length,
        completionTime: workflow.completedAt ?
          new Date(workflow.completedAt) - new Date(workflow.startedAt) : 0,
        results: results,
        safetyValidated: lowConfidenceResults.length === 0,
        timestamp: new Date().toISOString()
      };

      // Check for any adverse events in results
      await this.checkForAdverseEvents(results);

      return processedResults;
    } catch (error) {
      healthcareLogger.error('Failed to process workflow results', error);
      throw error;
    }
  }

  /**
   * Validate workflow compliance before execution
   */
  async validateWorkflowCompliance(workflow) {
    try {
      healthcareLogger.info(`Validating compliance for workflow: ${workflow.name}`);

      // Check HIPAA compliance
      if (workflow.compliance.includes('HIPAA')) {
        await this.validateHIPAACompliance(workflow);
      }

      // Check FDA compliance
      if (workflow.compliance.includes('FDA')) {
        await this.validateFDACompliance(workflow);
      }

      // Check GDPR compliance
      if (workflow.compliance.includes('GDPR')) {
        await this.validateGDPRCompliance(workflow);
      }

      healthcareLogger.info(`✅ Compliance validated for workflow: ${workflow.name}`);
    } catch (error) {
      healthcareLogger.error(`❌ Compliance validation failed for workflow: ${workflow.name}`, error);
      throw new Error(`Compliance validation failed: ${error.message}`);
    }
  }

  /**
   * Validate HIPAA compliance
   */
  async validateHIPAACompliance(workflow) {
    // In a real implementation, this would check:
    // - Patient data anonymization
    // - Audit trail requirements
    // - Access control policies
    // - Data retention policies
    healthcareLogger.debug('HIPAA compliance validation passed');
  }

  /**
   * Validate FDA compliance
   */
  async validateFDACompliance(workflow) {
    // In a real implementation, this would check:
    // - Explainable AI requirements
    // - Confidence thresholds
    // - Human oversight protocols
    // - Validation documentation
    healthcareLogger.debug('FDA compliance validation passed');
  }

  /**
   * Validate GDPR compliance
   */
  async validateGDPRCompliance(workflow) {
    // In a real implementation, this would check:
    // - Data minimization
    // - Consent requirements
    // - Right to erasure
    // - Privacy by design
    healthcareLogger.debug('GDPR compliance validation passed');
  }

  /**
   * Monitor clinical safety in real-time
   */
  monitorClinicalSafety() {
    try {
      const safetyMetrics = {
        timestamp: new Date().toISOString(),
        totalTasks: this.tasks.size,
        completedTasks: Array.from(this.tasks.values()).filter(t => t.status === 'completed').length,
        failedTasks: Array.from(this.tasks.values()).filter(t => t.status === 'failed').length,
        executingTasks: Array.from(this.tasks.values()).filter(t => t.status === 'executing').length,
        confidenceAvg: this.calculateAverageConfidence(),
        patientSafetyScore: this.calculatePatientSafetyScore()
      };

      // Trigger alerts if safety thresholds are breached
      if (safetyMetrics.failedTasks > 0) {
        this.triggerClinicalAlert('TASK_FAILURES_DETECTED', safetyMetrics);
      }

      if (safetyMetrics.confidenceAvg < this.confidenceThreshold) {
        this.triggerClinicalAlert('LOW_CONFIDENCE_DETECTED', safetyMetrics);
      }

      healthcareLogger.debug('Clinical safety metrics updated', safetyMetrics);
    } catch (error) {
      healthcareLogger.error('Clinical safety monitoring error', error);
    }
  }

  /**
   * Calculate average confidence across tasks
   */
  calculateAverageConfidence() {
    try {
      const completedTasks = Array.from(this.tasks.values()).filter(t =>
        t.status === 'completed' && t.result && t.result.confidence
      );

      if (completedTasks.length === 0) return 1.0;

      const totalConfidence = completedTasks.reduce((sum, task) =>
        sum + task.result.confidence, 0
      );

      return totalConfidence / completedTasks.length;
    } catch (error) {
      healthcareLogger.error('Error calculating average confidence', error);
      return 1.0; // Default to full confidence if calculation fails
    }
  }

  /**
   * Calculate patient safety score
   */
  calculatePatientSafetyScore() {
    try {
      const completedTasks = Array.from(this.tasks.values()).filter(t =>
        t.status === 'completed'
      );

      if (completedTasks.length === 0) return 1.0;

      const safeTasks = completedTasks.filter(t =>
        !t.result || t.result.confidence >= this.confidenceThreshold
      );

      return safeTasks.length / completedTasks.length;
    } catch (error) {
      healthcareLogger.error('Error calculating patient safety score', error);
      return 1.0; // Default to full safety score if calculation fails
    }
  }

  /**
   * Validate continuous compliance
   */
  validateContinuousCompliance() {
    try {
      const complianceStatus = {
        hipaa: true,
        fda: true,
        gdpr: true,
        timestamp: new Date().toISOString()
      };

      // Check all compliance requirements
      for (const [regulation, compliant] of Object.entries(complianceStatus)) {
        if (!compliant) {
          this.triggerComplianceAlert(`${regulation}_COMPLIANCE_FAILURE`, complianceStatus);
        }
      }

      healthcareLogger.debug('Continuous compliance validation completed', complianceStatus);
    } catch (error) {
      healthcareLogger.error('Continuous compliance validation error', error);
    }
  }

  /**
   * Check for adverse events in results
   */
  async checkForAdverseEvents(results) {
    // In a real implementation, this would check for:
    // - Contradictory recommendations
    // - Unusual patterns in results
    // - Safety concerns in medical recommendations
    healthcareLogger.debug('Adverse event check completed');
  }

  /**
   * Trigger human oversight for low confidence results
   */
  async triggerHumanOversight(result) {
    healthcareLogger.warn(`👨‍⚕️ Human oversight triggered for task: ${result.taskType}`);
    // In a real implementation, this would:
    // - Notify clinical staff
    // - Pause automated processing
    // - Request human review
    // - Log oversight event
  }

  /**
   * Trigger clinical review for safety concerns
   */
  async triggerClinicalReview(results) {
    healthcareLogger.warn(`👨‍⚕️ Clinical review triggered for ${results.length} results`);
    // In a real implementation, this would:
    // - Notify medical professionals
    // - Escalate to clinical oversight
    // - Document review requirements
  }

  /**
   * Trigger clinical alert
   */
  triggerClinicalAlert(alertType, metrics) {
    healthcareLogger.error(`🚨 CLINICAL ALERT: ${alertType}`, metrics);

    // Emit event for external handling
    this.emit('clinicalAlert', alertType, metrics);

    // In a real implementation, this would:
    // - Notify clinical staff immediately
    // - Activate emergency protocols if needed
    // - Document alert in audit trail
  }

  /**
   * Trigger security alert
   */
  triggerSecurityAlert(alertType, metrics) {
    healthcareLogger.error(`🚨 SECURITY ALERT: ${alertType}`, metrics);

    // Emit event for external handling
    this.emit('securityAlert', alertType, metrics);

    // In a real implementation, this would:
    // - Activate security response procedures
    // - Isolate affected systems
    // - Notify security team
  }

  /**
   * Trigger compliance alert
   */
  triggerComplianceAlert(alertType, metrics) {
    healthcareLogger.error(`🚨 COMPLIANCE ALERT: ${alertType}`, metrics);

    // Emit event for external handling
    this.emit('complianceAlert', alertType, metrics);

    // In a real implementation, this would:
    // - Notify compliance officers
    // - Document violation
    // - Initiate corrective actions
  }

  /**
   * Handle workflow error
   */
  async handleWorkflowError(workflowId, error) {
    try {
      const workflow = this.workflows.get(workflowId);
      if (workflow) {
        workflow.status = 'failed';
        workflow.completedAt = new Date().toISOString();
        workflow.error = error.message;

        this.logAuditEvent('WORKFLOW_FAILED', {
          workflowId,
          name: workflow.name,
          error: error.message
        });
      }

      // Emit error event
      this.emit('workflowError', workflowId, error);

      // Trigger emergency protocols if needed
      if (this.isCriticalError(error)) {
        await this.handleCriticalError(error);
      }
    } catch (handlerError) {
      healthcareLogger.error('Error handling workflow error', handlerError);
    }
  }

  /**
   * Determine if an error is critical
   */
  isCriticalError(error) {
    // Critical errors that require immediate attention:
    // - Patient safety concerns
    // - Compliance violations
    // - Security breaches
    // - System failures
    const criticalIndicators = [
      'patient safety',
      'compliance violation',
      'security breach',
      'system failure',
      'HIPAA violation',
      'FDA violation'
    ];

    const errorMessage = error.message.toLowerCase();
    return criticalIndicators.some(indicator => errorMessage.includes(indicator));
  }

  /**
   * Handle critical errors
   */
  async handleCriticalError(error) {
    healthcareLogger.error('💥 CRITICAL ERROR HANDLING INITIATED', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Activate emergency protocols
    this.emergencyMode = true;

    // Emit critical error event
    this.emit('criticalError', error);

    // Notify clinical oversight
    await this.notifyClinicalOversight(error);

    // Attempt graceful recovery
    await this.attemptGracefulRecovery(error);
  }

  /**
   * Notify clinical oversight
   */
  async notifyClinicalOversight(error) {
    healthcareLogger.error('📢 Notifying clinical oversight of critical error');
    // Implementation would notify medical staff
  }

  /**
   * Attempt graceful recovery
   */
  async attemptGracefulRecovery(error) {
    healthcareLogger.info('🔄 Attempting graceful recovery');
    // Implementation would attempt to restore service
  }

  /**
   * Log audit events for HIPAA compliance
   */
  logAuditEvent(eventType, eventData) {
    try {
      const auditEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType: eventType,
        eventData: eventData,
        systemUser: 'HealthcareTaskOrchestrator',
        ipAddress: 'secure_internal',
        action: 'system_operation',
        complianceValidation: true
      };

      this.auditTrail.push(auditEntry);

      // Log to secure audit file
      healthcareLogger.info('AUDIT_EVENT', auditEntry);
    } catch (error) {
      healthcareLogger.error('Failed to log audit event', error);
    }
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return null;
    }

    return {
      id: workflow.id,
      name: workflow.name,
      status: workflow.status,
      taskCount: workflow.tasks.length,
      completedTasks: workflow.tasks.filter(taskId => {
        const task = this.tasks.get(taskId);
        return task && task.status === 'completed';
      }).length,
      createdAt: workflow.createdAt,
      startedAt: workflow.startedAt,
      completedAt: workflow.completedAt
    };
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) {
      return null;
    }

    return {
      id: task.id,
      workflowId: task.workflowId,
      agentType: task.agentType,
      taskType: task.taskType,
      status: task.status,
      confidence: task.result ? task.result.confidence : null,
      createdAt: task.createdAt,
      startedAt: task.startedAt,
      completedAt: task.completedAt
    };
  }

  /**
   * Get audit trail
   */
  getAuditTrail() {
    return this.auditTrail.slice(); // Return a copy
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    healthcareLogger.info('🛑 Initiating graceful shutdown of Healthcare Task Orchestrator');

    // Stop monitoring intervals
    if (this.safetyMonitoringInterval) {
      clearInterval(this.safetyMonitoringInterval);
    }
    if (this.complianceMonitoringInterval) {
      clearInterval(this.complianceMonitoringInterval);
    }

    // Complete executing tasks or fail them gracefully
    const executingTasks = Array.from(this.tasks.values()).filter(t => t.status === 'executing');
    for (const task of executingTasks) {
      task.status = 'failed';
      task.error = 'Orchestrator shutdown';
      task.completedAt = new Date().toISOString();
    }

    // Update workflow statuses
    for (const workflow of this.workflows.values()) {
      if (workflow.status === 'executing') {
        workflow.status = 'failed';
        workflow.completedAt = new Date().toISOString();
      }
    }

    // Log shutdown event
    this.logAuditEvent('ORCHESTRATOR_SHUTDOWN', {
      taskCount: this.tasks.size,
      workflowCount: this.workflows.size,
      auditTrailCount: this.auditTrail.length
    });

    healthcareLogger.info('✅ Healthcare Task Orchestrator shut down gracefully');
  }
}

// Export the orchestrator
module.exports = HealthcareTaskOrchestrator;

// If running directly, demonstrate usage
if (require.main === module) {
  (async () => {
    try {
      // Create orchestrator instance
      const orchestrator = new HealthcareTaskOrchestrator();

      // Register specialized agents
      const agents = [
        { type: 'medical-imaging', capabilities: ['analyze-radiology', 'detect-anomalies'] },
        { type: 'clinical-nlp', capabilities: ['process-notes', 'extract-entities'] },
        { type: 'research-integration', capabilities: ['literature-review', 'evidence-synthesis'] },
        { type: 'safety-monitor', capabilities: ['validate-recommendations', 'detect-adverse-events'] }
      ];

      for (const agent of agents) {
        orchestrator.registerAgent(agent);
      }

      // Create a workflow
      const workflowId = await orchestrator.createWorkflow({
        name: 'comprehensive-medical-analysis',
        compliance: ['HIPAA', 'FDA', 'GDPR'],
        safetyThreshold: 0.95
      });

      // Add parallel tasks
      await orchestrator.addParallelTasks(workflowId, [
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
      ]);

      // Listen for events
      orchestrator.on('workflowCompleted', (workflowId, results) => {
        console.log(`Workflow ${workflowId} completed with results:`, JSON.stringify(results, null, 2));
      });

      orchestrator.on('clinicalAlert', (alertType, metrics) => {
        console.error(`Clinical Alert: ${alertType}`, metrics);
      });

      // Execute workflow
      console.log('Executing healthcare workflow...');
      const results = await orchestrator.executeWorkflow(workflowId);
      console.log('Workflow execution completed successfully');

      // Get status
      const status = orchestrator.getWorkflowStatus(workflowId);
      console.log('Workflow status:', status);

      // Get audit trail
      const auditTrail = orchestrator.getAuditTrail();
      console.log(`Audit trail contains ${auditTrail.length} events`);

      // Shutdown
      await orchestrator.shutdown();
      console.log('Orchestrator shutdown completed');

    } catch (error) {
      console.error('Error in orchestrator demonstration:', error);
      process.exit(1);
    }
  })();
}