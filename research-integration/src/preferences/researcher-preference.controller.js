/**
 * Researcher Preference Controller
 * Controller for handling researcher preference management requests
 */

const ResearcherPreferenceService = require('./researcher-preference.service.js');
const winston = require('winston');

class ResearcherPreferenceController {
  /**
   * Create a new Researcher Preference Controller
   */
  constructor() {
    this.researcherPreferenceService = new ResearcherPreferenceService();
    this.logger = this._createLogger();
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
      defaultMeta: { service: 'researcher-preference-controller' },
      transports: [
        new winston.transports.File({ filename: 'logs/researcher-preference-controller-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/researcher-preference-controller-combined.log' })
      ]
    });
  }

  /**
   * Get researcher preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getResearcherPreferences(req, res) {
    try {
      const { researcherId } = req.params;
      const { scope } = req.query;

      // Validate required fields
      if (!researcherId) {
        return res.status(400).json({
          error: 'Researcher ID is required'
        });
      }

      // Get researcher preferences
      const preferences = this.researcherPreferenceService.getResearcherPreferences(researcherId, scope);

      // Return preferences
      res.status(200).json({
        success: true,
        researcherId: researcherId,
        scope: scope || 'researcher',
        preferences: preferences
      });
    } catch (error) {
      if (this.logger) {
        this.logger.error('Get researcher preferences controller error', {
          error: error.message
        });
      } else {
        console.error('Get researcher preferences controller error', {
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve researcher preferences',
        message: error.message
      });
    }
  }

  /**
   * Set researcher preference
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async setResearcherPreference(req, res) {
    try {
      const { researcherId } = req.params;
      const { category, preferenceKey, value, scope } = req.body;

      // Validate required fields
      if (!researcherId) {
        return res.status(400).json({
          error: 'Researcher ID is required'
        });
      }

      if (!category) {
        return res.status(400).json({
          error: 'Category is required'
        });
      }

      if (!preferenceKey) {
        return res.status(400).json({
          error: 'Preference key is required'
        });
      }

      if (value === undefined) {
        return res.status(400).json({
          error: 'Preference value is required'
        });
      }

      // Set researcher preference
      const preferences = this.researcherPreferenceService.setResearcherPreference(
        researcherId,
        category,
        preferenceKey,
        value,
        scope
      );

      // Return updated preferences
      res.status(200).json({
        success: true,
        message: 'Researcher preference updated successfully',
        researcherId: researcherId,
        scope: scope || 'researcher',
        preferences: preferences
      });
    } catch (error) {
      if (this.logger) {
        this.logger.error('Set researcher preference controller error', {
          error: error.message
        });
      } else {
        console.error('Set researcher preference controller error', {
          error: error.message
        });
      }

      // Handle validation errors
      if (error.message.includes('required') ||
          error.message.includes('Unknown preference') ||
          error.message.includes('must be') ||
          error.message.includes('Invalid preferences structure')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to update researcher preference',
        message: error.message
      });
    }
  }

  /**
   * Update multiple researcher preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateResearcherPreferences(req, res) {
    try {
      const { researcherId } = req.params;
      const { preferences, scope } = req.body;

      // Validate required fields
      if (!researcherId) {
        return res.status(400).json({
          error: 'Researcher ID is required'
        });
      }

      if (!preferences || typeof preferences !== 'object') {
        return res.status(400).json({
          error: 'Preferences object is required'
        });
      }

      // Update researcher preferences
      const updatedPreferences = this.researcherPreferenceService.updateResearcherPreferences(
        researcherId,
        preferences,
        scope
      );

      // Return updated preferences
      res.status(200).json({
        success: true,
        message: 'Researcher preferences updated successfully',
        researcherId: researcherId,
        scope: scope || 'researcher',
        preferences: updatedPreferences
      });
    } catch (error) {
      if (this.logger) {
        this.logger.error('Update researcher preferences controller error', {
          error: error.message
        });
      } else {
        console.error('Update researcher preferences controller error', {
          error: error.message
        });
      }

      // Handle validation errors
      if (error.message.includes('required') ||
          error.message.includes('Unknown preference') ||
          error.message.includes('must be') ||
          error.message.includes('Invalid preferences structure')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to update researcher preferences',
        message: error.message
      });
    }
  }

  /**
   * Reset researcher preferences to defaults
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetResearcherPreferences(req, res) {
    try {
      const { researcherId } = req.params;
      const { scope } = req.body;

      // Validate required fields
      if (!researcherId) {
        return res.status(400).json({
          error: 'Researcher ID is required'
        });
      }

      // Reset researcher preferences
      const preferences = this.researcherPreferenceService.resetResearcherPreferences(researcherId, scope);

      // Return reset preferences
      res.status(200).json({
        success: true,
        message: 'Researcher preferences reset to defaults successfully',
        researcherId: researcherId,
        scope: scope || 'researcher',
        preferences: preferences
      });
    } catch (error) {
      if (this.logger) {
        this.logger.error('Reset researcher preferences controller error', {
          error: error.message
        });
      } else {
        console.error('Reset researcher preferences controller error', {
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to reset researcher preferences',
        message: error.message
      });
    }
  }

  /**
   * Get available preference categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAvailableCategories(req, res) {
    try {
      // Get available categories
      const categories = this.researcherPreferenceService.getAvailableCategories();

      // Return categories
      res.status(200).json({
        success: true,
        categories: categories
      });
    } catch (error) {
      if (this.logger) {
        this.logger.error('Get available categories controller error', {
          error: error.message
        });
      } else {
        console.error('Get available categories controller error', {
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve preference categories',
        message: error.message
      });
    }
  }

  /**
   * Get category configuration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getCategoryConfiguration(req, res) {
    try {
      const { category } = req.params;

      // Validate required fields
      if (!category) {
        return res.status(400).json({
          error: 'Category is required'
        });
      }

      // Get category configuration
      const configuration = this.researcherPreferenceService.getCategoryConfiguration(category);

      // Return configuration
      if (configuration) {
        res.status(200).json({
          success: true,
          category: category,
          configuration: configuration
        });
      } else {
        res.status(404).json({
          error: 'Category configuration not found'
        });
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Get category configuration controller error', {
          error: error.message
        });
      } else {
        console.error('Get category configuration controller error', {
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve category configuration',
        message: error.message
      });
    }
  }

  /**
   * Get preference configuration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getPreferenceConfiguration(req, res) {
    try {
      const { category, preferenceKey } = req.params;

      // Validate required fields
      if (!category) {
        return res.status(400).json({
          error: 'Category is required'
        });
      }

      if (!preferenceKey) {
        return res.status(400).json({
          error: 'Preference key is required'
        });
      }

      // Get preference configuration
      const configuration = this.researcherPreferenceService.getPreferenceConfiguration(category, preferenceKey);

      // Return configuration
      if (configuration) {
        res.status(200).json({
          success: true,
          category: category,
          preference: preferenceKey,
          configuration: configuration
        });
      } else {
        res.status(404).json({
          error: 'Preference configuration not found'
        });
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Get preference configuration controller error', {
          error: error.message
        });
      } else {
        console.error('Get preference configuration controller error', {
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve preference configuration',
        message: error.message
      });
    }
  }

  /**
   * Export researcher preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportResearcherPreferences(req, res) {
    try {
      const { researcherId } = req.params;
      const { scope } = req.query;

      // Validate required fields
      if (!researcherId) {
        return res.status(400).json({
          error: 'Researcher ID is required'
        });
      }

      // Export researcher preferences
      const exportedPreferences = this.researcherPreferenceService.exportResearcherPreferences(researcherId, scope);

      // Return exported preferences
      res.status(200).json({
        success: true,
        message: 'Researcher preferences exported successfully',
        exportedPreferences: exportedPreferences
      });
    } catch (error) {
      if (this.logger) {
        this.logger.error('Export researcher preferences controller error', {
          error: error.message
        });
      } else {
        console.error('Export researcher preferences controller error', {
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to export researcher preferences',
        message: error.message
      });
    }
  }

  /**
   * Import researcher preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async importResearcherPreferences(req, res) {
    try {
      const { researcherId } = req.params;
      const { preferences, scope } = req.body;

      // Validate required fields
      if (!researcherId) {
        return res.status(400).json({
          error: 'Researcher ID is required'
        });
      }

      if (!preferences || typeof preferences !== 'object') {
        return res.status(400).json({
          error: 'Preferences object is required'
        });
      }

      // Import researcher preferences
      const importedPreferences = this.researcherPreferenceService.importResearcherPreferences(
        researcherId,
        preferences,
        scope
      );

      // Return imported preferences
      res.status(200).json({
        success: true,
        message: 'Researcher preferences imported successfully',
        importedPreferences: importedPreferences
      });
    } catch (error) {
      if (this.logger) {
        this.logger.error('Import researcher preferences controller error', {
          error: error.message
        });
      } else {
        console.error('Import researcher preferences controller error', {
          error: error.message
        });
      }

      // Handle validation errors
      if (error.message.includes('required') || error.message.includes('Invalid preferences structure')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to import researcher preferences',
        message: error.message
      });
    }
  }
}

module.exports = ResearcherPreferenceController;