/**
 * Provider Preference Controller
 * Controller for handling provider preference management requests
 */

const ProviderPreferenceService = require('./provider-preference.service.js');

class ProviderPreferenceController {
  /**
   * Create a new Provider Preference Controller
   */
  constructor() {
    this.providerPreferenceService = new ProviderPreferenceService();
  }

  /**
   * Get provider preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProviderPreferences(req, res) {
    try {
      const { providerId } = req.params;
      const { scope } = req.query;

      // Validate required fields
      if (!providerId) {
        return res.status(400).json({
          error: 'Provider ID is required'
        });
      }

      // Get provider preferences
      const preferences = this.providerPreferenceService.getProviderPreferences(providerId, scope);

      // Return preferences
      res.status(200).json({
        success: true,
        providerId: providerId,
        scope: scope || 'provider',
        preferences: preferences
      });
    } catch (error) {
      console.error('Get provider preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve provider preferences',
        message: error.message
      });
    }
  }

  /**
   * Set provider preference
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async setProviderPreference(req, res) {
    try {
      const { providerId } = req.params;
      const { category, preferenceKey, value, scope } = req.body;

      // Validate required fields
      if (!providerId) {
        return res.status(400).json({
          error: 'Provider ID is required'
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

      // Set provider preference
      const preferences = this.providerPreferenceService.setProviderPreference(
        providerId,
        category,
        preferenceKey,
        value,
        scope
      );

      // Return updated preferences
      res.status(200).json({
        success: true,
        message: 'Provider preference updated successfully',
        providerId: providerId,
        scope: scope || 'provider',
        preferences: preferences
      });
    } catch (error) {
      console.error('Set provider preference controller error', {
        error: error.message
      });

      // Handle validation errors
      if (error.message.includes('required') || error.message.includes('Unknown preference')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to update provider preference',
        message: error.message
      });
    }
  }

  /**
   * Update multiple provider preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateProviderPreferences(req, res) {
    try {
      const { providerId } = req.params;
      const { preferences, scope } = req.body;

      // Validate required fields
      if (!providerId) {
        return res.status(400).json({
          error: 'Provider ID is required'
        });
      }

      if (!preferences || typeof preferences !== 'object') {
        return res.status(400).json({
          error: 'Preferences object is required'
        });
      }

      // Update provider preferences
      const updatedPreferences = this.providerPreferenceService.updateProviderPreferences(
        providerId,
        preferences,
        scope
      );

      // Return updated preferences
      res.status(200).json({
        success: true,
        message: 'Provider preferences updated successfully',
        providerId: providerId,
        scope: scope || 'provider',
        preferences: updatedPreferences
      });
    } catch (error) {
      console.error('Update provider preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to update provider preferences',
        message: error.message
      });
    }
  }

  /**
   * Reset provider preferences to defaults
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetProviderPreferences(req, res) {
    try {
      const { providerId } = req.params;
      const { scope } = req.body;

      // Validate required fields
      if (!providerId) {
        return res.status(400).json({
          error: 'Provider ID is required'
        });
      }

      // Reset provider preferences
      const preferences = this.providerPreferenceService.resetProviderPreferences(providerId, scope);

      // Return reset preferences
      res.status(200).json({
        success: true,
        message: 'Provider preferences reset to defaults successfully',
        providerId: providerId,
        scope: scope || 'provider',
        preferences: preferences
      });
    } catch (error) {
      console.error('Reset provider preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to reset provider preferences',
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
      const categories = this.providerPreferenceService.getAvailableCategories();

      // Return categories
      res.status(200).json({
        success: true,
        categories: categories
      });
    } catch (error) {
      console.error('Get available categories controller error', {
        error: error.message
      });

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
      const configuration = this.providerPreferenceService.getCategoryConfiguration(category);

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
      console.error('Get category configuration controller error', {
        error: error.message
      });

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
      const configuration = this.providerPreferenceService.getPreferenceConfiguration(category, preferenceKey);

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
      console.error('Get preference configuration controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve preference configuration',
        message: error.message
      });
    }
  }

  /**
   * Export provider preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportProviderPreferences(req, res) {
    try {
      const { providerId } = req.params;
      const { scope } = req.query;

      // Validate required fields
      if (!providerId) {
        return res.status(400).json({
          error: 'Provider ID is required'
        });
      }

      // Export provider preferences
      const exportedPreferences = this.providerPreferenceService.exportProviderPreferences(providerId, scope);

      // Return exported preferences
      res.status(200).json({
        success: true,
        message: 'Provider preferences exported successfully',
        exportedPreferences: exportedPreferences
      });
    } catch (error) {
      console.error('Export provider preferences controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to export provider preferences',
        message: error.message
      });
    }
  }

  /**
   * Import provider preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async importProviderPreferences(req, res) {
    try {
      const { providerId } = req.params;
      const { preferences, scope } = req.body;

      // Validate required fields
      if (!providerId) {
        return res.status(400).json({
          error: 'Provider ID is required'
        });
      }

      if (!preferences || typeof preferences !== 'object') {
        return res.status(400).json({
          error: 'Preferences object is required'
        });
      }

      // Import provider preferences
      const importedPreferences = this.providerPreferenceService.importProviderPreferences(
        providerId,
        preferences,
        scope
      );

      // Return imported preferences
      res.status(200).json({
        success: true,
        message: 'Provider preferences imported successfully',
        importedPreferences: importedPreferences
      });
    } catch (error) {
      console.error('Import provider preferences controller error', {
        error: error.message
      });

      // Handle validation errors
      if (error.message.includes('required') || error.message.includes('Invalid preferences structure')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to import provider preferences',
        message: error.message
      });
    }
  }
}

module.exports = ProviderPreferenceController;