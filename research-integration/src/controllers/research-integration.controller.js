/**
 * Research Integration Controller
 * Controller for handling research integration requests
 */

const ResearchIntegrationService = require('../services/research-integration.service.js');

class ResearchIntegrationController {
  /**
   * Create a new Research Integration Controller
   */
  constructor() {
    this.researchIntegrationService = new ResearchIntegrationService();
  }

  /**
   * Analyze medical literature
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async analyzeMedicalLiterature(req, res) {
    try {
      const { documents, analysisConfig } = req.body;

      // Validate required fields
      if (!documents) {
        return res.status(400).json({
          error: 'Documents are required'
        });
      }

      // Analyze medical literature
      const result = await this.researchIntegrationService.analyzeMedicalLiterature(documents, analysisConfig);

      // Return analysis result
      res.status(200).json({
        success: true,
        message: 'Medical literature analysis completed successfully',
        taskId: result.taskId,
        documentCount: result.documentCount,
        entities: result.entities,
        topics: result.topics,
        sentiment: result.sentiment,
        summary: result.summary,
        processingTime: result.processingTime,
        usedAgent: !!result.agentResults,
        agentResults: result.agentResults
      });
    } catch (error) {
      if (this.researchIntegrationService && this.researchIntegrationService.logger) {
        this.researchIntegrationService.logger.error('Analyze medical literature controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to analyze medical literature',
        message: error.message
      });
    }
  }

  /**
   * Match clinical trials
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async matchClinicalTrials(req, res) {
    try {
      const { patientProfile, matchingConfig } = req.body;

      // Validate required fields
      if (!patientProfile) {
        return res.status(400).json({
          error: 'Patient profile is required'
        });
      }

      // Match clinical trials
      const result = await this.researchIntegrationService.matchClinicalTrials(patientProfile, matchingConfig);

      // Return matching result
      res.status(200).json({
        success: true,
        message: 'Clinical trial matching completed successfully',
        taskId: result.taskId,
        patientId: result.patientId,
        trials: result.trials,
        processingTime: result.processingTime,
        usedAgent: !!result.agentResults,
        agentResults: result.agentResults
      });
    } catch (error) {
      if (this.researchIntegrationService && this.researchIntegrationService.logger) {
        this.researchIntegrationService.logger.error('Match clinical trials controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to match clinical trials',
        message: error.message
      });
    }
  }

  /**
   * Track research impact
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async trackResearchImpact(req, res) {
    try {
      const { researchId, trackingConfig } = req.body;

      // Validate required fields
      if (!researchId) {
        return res.status(400).json({
          error: 'Research ID is required'
        });
      }

      // Track research impact
      const result = await this.researchIntegrationService.trackResearchImpact(researchId, trackingConfig);

      // Return tracking result
      res.status(200).json({
        success: true,
        message: 'Research impact tracking completed successfully',
        taskId: result.taskId,
        researchId: result.researchId,
        metrics: result.metrics,
        processingTime: result.processingTime,
        usedAgent: !!result.agentResults,
        agentResults: result.agentResults
      });
    } catch (error) {
      if (this.researchIntegrationService && this.researchIntegrationService.logger) {
        this.researchIntegrationService.logger.error('Track research impact controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to track research impact',
        message: error.message
      });
    }
  }

  /**
   * Create collaborative research project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createCollaborativeResearchProject(req, res) {
    try {
      const { projectData } = req.body;

      // Validate required fields
      if (!projectData || !projectData.title) {
        return res.status(400).json({
          error: 'Project title is required'
        });
      }

      // Create collaborative research project
      const project = await this.researchIntegrationService.createCollaborativeResearchProject(projectData);

      // Return created project
      res.status(200).json({
        success: true,
        message: 'Collaborative research project created successfully',
        project: project,
        hasResearchContext: !!project.researchContext
      });
    } catch (error) {
      if (this.researchIntegrationService && this.researchIntegrationService.logger) {
        this.researchIntegrationService.logger.error('Create collaborative research project controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to create collaborative research project',
        message: error.message
      });
    }
  }

  /**
   * Get research task status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getResearchTaskStatus(req, res) {
    try {
      const { taskId } = req.params;

      // Validate required fields
      if (!taskId) {
        return res.status(400).json({
          error: 'Task ID is required'
        });
      }

      // Get research task status
      const status = this.researchIntegrationService.getResearchTaskStatus(taskId);

      // Return task status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Research task not found'
        });
      }
    } catch (error) {
      if (this.researchIntegrationService && this.researchIntegrationService.logger) {
        this.researchIntegrationService.logger.error('Get research task status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve research task status',
        message: error.message
      });
    }
  }

  /**
   * Get available research workflows
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAvailableWorkflows(req, res) {
    try {
      // Get available workflows
      const workflows = this.researchIntegrationService.getAvailableWorkflows();

      // Return available workflows
      res.status(200).json({
        success: true,
        workflows: workflows
      });
    } catch (error) {
      if (this.researchIntegrationService && this.researchIntegrationService.logger) {
        this.researchIntegrationService.logger.error('Get available workflows controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve available research workflows',
        message: error.message
      });
    }
  }

  /**
   * Get workflow definition
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getWorkflowDefinition(req, res) {
    try {
      const { workflowType } = req.params;

      // Validate required fields
      if (!workflowType) {
        return res.status(400).json({
          error: 'Workflow type is required'
        });
      }

      // Get workflow definition
      const definition = this.researchIntegrationService.getWorkflowDefinition(workflowType);

      // Return workflow definition
      if (definition) {
        res.status(200).json({
          success: true,
          definition: definition
        });
      } else {
        res.status(404).json({
          error: 'Workflow definition not found'
        });
      }
    } catch (error) {
      if (this.researchIntegrationService && this.researchIntegrationService.logger) {
        this.researchIntegrationService.logger.error('Get workflow definition controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve workflow definition',
        message: error.message
      });
    }
  }
}

module.exports = ResearchIntegrationController;