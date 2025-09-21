/**
 * Clinical Workflow Controller
 * Controller for handling clinical workflow requests
 */

const ClinicalWorkflowService = require('./clinical-workflow.service.js');

class ClinicalWorkflowController {
  /**
   * Create a new Clinical Workflow Controller
   */
  constructor() {
    this.clinicalWorkflowService = new ClinicalWorkflowService();
  }

  /**
   * Execute a clinical workflow
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async executeWorkflow(req, res) {
    try {
      const { workflowType, patientContext, workflowConfig } = req.body;

      // Validate required fields
      if (!workflowType) {
        return res.status(400).json({
          error: 'Workflow type is required'
        });
      }

      if (!patientContext) {
        return res.status(400).json({
          error: 'Patient context is required'
        });
      }

      if (!patientContext.patientId) {
        return res.status(400).json({
          error: 'Patient ID is required in patient context'
        });
      }

      // Execute workflow
      const result = await this.clinicalWorkflowService.executeWorkflow(workflowType, patientContext, workflowConfig);

      // Return workflow result
      res.status(200).json({
        success: true,
        message: 'Clinical workflow executed successfully',
        workflowId: result.workflowId,
        status: result.status,
        result: result.result,
        executionTime: result.executionTime
      });
    } catch (error) {
      if (this.clinicalWorkflowService && this.clinicalWorkflowService.logger) {
        this.clinicalWorkflowService.logger.error('Execute workflow controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Handle specific error cases
      if (error.message.includes('Workflow type')) {
        return res.status(400).json({
          error: error.message
        });
      }

      if (error.message.includes('Patient context')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to execute clinical workflow',
        message: error.message
      });
    }
  }

  /**
   * Get workflow status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getWorkflowStatus(req, res) {
    try {
      const { workflowId } = req.params;

      // Validate required fields
      if (!workflowId) {
        return res.status(400).json({
          error: 'Workflow ID is required'
        });
      }

      // Get workflow status
      const status = this.clinicalWorkflowService.getWorkflowStatus(workflowId);

      // Return workflow status
      if (status) {
        res.status(200).json({
          success: true,
          status: status
        });
      } else {
        res.status(404).json({
          error: 'Workflow not found'
        });
      }
    } catch (error) {
      if (this.clinicalWorkflowService && this.clinicalWorkflowService.logger) {
        this.clinicalWorkflowService.logger.error('Get workflow status controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve workflow status',
        message: error.message
      });
    }
  }

  /**
   * Get available workflows
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAvailableWorkflows(req, res) {
    try {
      // Get available workflows
      const workflows = this.clinicalWorkflowService.getAvailableWorkflows();

      // Return available workflows
      res.status(200).json({
        success: true,
        workflows: workflows
      });
    } catch (error) {
      if (this.clinicalWorkflowService && this.clinicalWorkflowService.logger) {
        this.clinicalWorkflowService.logger.error('Get available workflows controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve available workflows',
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
      const definition = this.clinicalWorkflowService.getWorkflowDefinition(workflowType);

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
      if (this.clinicalWorkflowService && this.clinicalWorkflowService.logger) {
        this.clinicalWorkflowService.logger.error('Get workflow definition controller error', {
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

module.exports = ClinicalWorkflowController;