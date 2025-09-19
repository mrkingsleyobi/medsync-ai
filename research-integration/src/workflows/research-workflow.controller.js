/**
 * Research Workflow Controller
 * Controller for handling research workflow requests
 */

const ResearchWorkflowService = require('./research-workflow.service.js');

class ResearchWorkflowController {
  /**
   * Create a new Research Workflow Controller
   */
  constructor() {
    this.researchWorkflowService = new ResearchWorkflowService();
  }

  /**
   * Execute a research workflow
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async executeWorkflow(req, res) {
    try {
      const { workflowType, inputData, workflowConfig } = req.body;

      // Validate required fields
      if (!workflowType) {
        return res.status(400).json({
          error: 'Workflow type is required'
        });
      }

      if (!inputData) {
        return res.status(400).json({
          error: 'Input data is required'
        });
      }

      // Execute workflow
      const result = await this.researchWorkflowService.executeWorkflow(workflowType, inputData, workflowConfig);

      // Return workflow result
      res.status(200).json({
        success: true,
        message: 'Research workflow executed successfully',
        workflowId: result.workflowId,
        status: result.status,
        result: result.result,
        executionTime: result.executionTime
      });
    } catch (error) {
      console.error('Execute workflow controller error', {
        error: error.message
      });

      // Handle validation errors
      if (error.message.includes('Workflow type') ||
          error.message.includes('Input data') ||
          error.message.includes('required')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to execute research workflow',
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
      const status = this.researchWorkflowService.getWorkflowStatus(workflowId);

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
      console.error('Get workflow status controller error', {
        error: error.message
      });

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
      const workflows = this.researchWorkflowService.getAvailableWorkflows();

      // Return available workflows
      res.status(200).json({
        success: true,
        workflows: workflows
      });
    } catch (error) {
      console.error('Get available workflows controller error', {
        error: error.message
      });

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
      const definition = this.researchWorkflowService.getWorkflowDefinition(workflowType);

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
      console.error('Get workflow definition controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve workflow definition',
        message: error.message
      });
    }
  }
}

module.exports = ResearchWorkflowController;