/**
 * Document Simplification Controller
 * Controller for handling document simplification requests
 */

const DocumentSimplificationService = require('../services/document-simplification.service.js');

class DocumentSimplificationController {
  constructor() {
    this.documentSimplificationService = new DocumentSimplificationService();
  }

  /**
   * Simplify a medical document
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async simplifyDocument(req, res) {
    try {
      const { documentText, level } = req.body;

      // Validate required fields
      if (!documentText) {
        return res.status(400).json({
          error: 'Document text is required'
        });
      }

      // Simplify the document
      const simplifiedText = await this.documentSimplificationService.simplifyDocument(documentText, level);

      // Return the simplified document
      res.status(200).json({
        success: true,
        originalLength: documentText.length,
        simplifiedLength: simplifiedText.length,
        level: level || 'basic',
        simplifiedText: simplifiedText
      });
    } catch (error) {
      console.error('Document simplification controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to simplify document',
        message: error.message
      });
    }
  }

  /**
   * Analyze document complexity
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async analyzeComplexity(req, res) {
    try {
      const { documentText } = req.body;

      // Validate required fields
      if (!documentText) {
        return res.status(400).json({
          error: 'Document text is required'
        });
      }

      // Analyze the document complexity
      const complexity = this.documentSimplificationService.analyzeComplexity(documentText);

      // Return the complexity analysis
      res.status(200).json({
        success: true,
        complexity: complexity
      });
    } catch (error) {
      console.error('Document complexity analysis controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to analyze document complexity',
        message: error.message
      });
    }
  }

  /**
   * Get available simplification levels
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAvailableLevels(req, res) {
    try {
      const levels = this.documentSimplificationService.simplificationLevels;

      res.status(200).json({
        success: true,
        levels: Object.values(levels)
      });
    } catch (error) {
      console.error('Get available levels controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve simplification levels',
        message: error.message
      });
    }
  }
}

module.exports = DocumentSimplificationController;