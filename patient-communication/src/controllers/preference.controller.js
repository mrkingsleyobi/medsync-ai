/**
 * Preference Controller
 * Controller for handling preference management requests
 */

const PreferenceService = require('../services/preference.service.js');

class PreferenceController {
  constructor() {
    this.preferenceService = new PreferenceService();
  }

  /**
   * Get all user preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserPreferences(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated

      // Get user preferences
      const preferences = await this.preferenceService.getUserPreferences(userId);

      // Return preferences
      res.status(200).json({
        success: true,
        preferences: preferences
      });
    } catch (error) {
      console.error('Get user preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve user preferences',
        message: error.message
      });
    }
  }

  /**
   * Get user preferences by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserPreferencesByCategory(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated
      const { category } = req.params;

      // Validate required fields
      if (!category) {
        return res.status(400).json({
          error: 'Category is required'
        });
      }

      // Get user preferences by category
      const preferences = await this.preferenceService.getUserPreferencesByCategory(userId, category);

      // Return preferences
      res.status(200).json({
        success: true,
        preferences: preferences
      });
    } catch (error) {
      console.error('Get user preferences by category controller error', {
        error: error.message
      });

      // Handle specific error cases
      if (error.message.includes('Invalid preference category')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve user preferences by category',
        message: error.message
      });
    }
  }

  /**
   * Update user preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserPreferences(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated
      const { preferences } = req.body;

      // Validate required fields
      if (!preferences) {
        return res.status(400).json({
          error: 'Preferences are required'
        });
      }

      // Update user preferences
      const result = await this.preferenceService.updateUserPreferences(userId, preferences);

      // Return result
      res.status(200).json({
        success: true,
        message: result.message,
        preferences: result.preferences,
        updatedAt: result.updatedAt
      });
    } catch (error) {
      console.error('Update user preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to update user preferences',
        message: error.message
      });
    }
  }

  /**
   * Update user preferences by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserPreferencesByCategory(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated
      const { category } = req.params;
      const { preferences } = req.body;

      // Validate required fields
      if (!category || !preferences) {
        return res.status(400).json({
          error: 'Category and preferences are required'
        });
      }

      // Update user preferences by category
      const result = await this.preferenceService.updateUserPreferencesByCategory(userId, category, preferences);

      // Return result
      res.status(200).json({
        success: true,
        message: result.message,
        category: result.category,
        preferences: result.preferences,
        updatedAt: result.updatedAt
      });
    } catch (error) {
      console.error('Update user preferences by category controller error', {
        error: error.message
      });

      // Handle specific error cases
      if (error.message.includes('Invalid preference category')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to update user preferences by category',
        message: error.message
      });
    }
  }

  /**
   * Reset user preferences to defaults
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetUserPreferences(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated

      // Reset user preferences
      const result = await this.preferenceService.resetUserPreferences(userId);

      // Return result
      res.status(200).json({
        success: true,
        message: result.message,
        preferences: result.preferences,
        updatedAt: result.updatedAt
      });
    } catch (error) {
      console.error('Reset user preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to reset user preferences',
        message: error.message
      });
    }
  }

  /**
   * Export user preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportUserPreferences(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated

      // Export user preferences
      const result = await this.preferenceService.exportUserPreferences(userId);

      // Return exported preferences
      res.status(200).json({
        success: true,
        message: result.message,
        preferences: result.preferences,
        exportedAt: result.exportedAt
      });
    } catch (error) {
      console.error('Export user preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to export user preferences',
        message: error.message
      });
    }
  }

  /**
   * Import user preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async importUserPreferences(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated
      const { preferences } = req.body;

      // Validate required fields
      if (!preferences) {
        return res.status(400).json({
          error: 'Preferences are required'
        });
      }

      // Import user preferences
      const result = await this.preferenceService.importUserPreferences(userId, preferences);

      // Return result
      res.status(200).json({
        success: true,
        message: result.message,
        preferences: result.preferences,
        importedAt: result.importedAt
      });
    } catch (error) {
      console.error('Import user preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to import user preferences',
        message: error.message
      });
    }
  }

  /**
   * Get available preference categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getPreferenceCategories(req, res) {
    try {
      const categories = this.preferenceService.categories;

      res.status(200).json({
        success: true,
        categories: categories
      });
    } catch (error) {
      console.error('Get preference categories controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve preference categories',
        message: error.message
      });
    }
  }

  /**
   * Get default preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getDefaultPreferences(req, res) {
    try {
      const defaultPreferences = {
        communication: this.preferenceService.getDefaultCommunicationPreferences(),
        privacy: this.preferenceService.getDefaultPrivacyPreferences(),
        healthcare: this.preferenceService.getDefaultHealthcarePreferences(),
        notifications: this.preferenceService.getDefaultNotificationPreferences(),
        accessibility: this.preferenceService.getDefaultAccessibilityPreferences(),
        personalization: this.preferenceService.getDefaultPersonalizationPreferences()
      };

      res.status(200).json({
        success: true,
        defaultPreferences: defaultPreferences
      });
    } catch (error) {
      console.error('Get default preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve default preferences',
        message: error.message
      });
    }
  }
}

module.exports = PreferenceController;