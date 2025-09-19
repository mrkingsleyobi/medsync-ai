/**
 * Preference Service
 * Service for managing patient preferences
 */

const config = require('../config/preferences.config.js');

class PreferenceService {
  constructor() {
    this.config = config;
    this.categories = config.categories;
  }

  /**
   * Get all user preferences
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User preferences
   */
  async getUserPreferences(userId) {
    try {
      // Validate input
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log('Retrieving user preferences', {
        userId: userId
      });

      // In a real implementation, this would retrieve from a database
      // For demonstration, we'll create sample preferences
      const preferences = {
        userId: userId,
        categories: {
          [this.categories.COMMUNICATION]: this.getDefaultCommunicationPreferences(),
          [this.categories.PRIVACY]: this.getDefaultPrivacyPreferences(),
          [this.categories.HEALTHCARE]: this.getDefaultHealthcarePreferences(),
          [this.categories.NOTIFICATIONS]: this.getDefaultNotificationPreferences(),
          [this.categories.ACCESSIBILITY]: this.getDefaultAccessibilityPreferences(),
          [this.categories.PERSONALIZATION]: this.getDefaultPersonalizationPreferences()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('User preferences retrieved successfully', {
        userId: userId
      });

      return preferences;
    } catch (error) {
      console.error('Failed to retrieve user preferences', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Get user preferences by category
   * @param {string} userId - User ID
   * @param {string} category - Preference category
   * @returns {Promise<Object>} User preferences for category
   */
  async getUserPreferencesByCategory(userId, category) {
    try {
      // Validate input
      if (!userId || !category) {
        throw new Error('User ID and category are required');
      }

      // Validate category
      if (!this.categories[category.toUpperCase()]) {
        throw new Error(`Invalid preference category: ${category}`);
      }

      console.log('Retrieving user preferences by category', {
        userId: userId,
        category: category
      });

      // In a real implementation, this would retrieve from a database
      // For demonstration, we'll create sample preferences
      let categoryPreferences;

      switch (category) {
        case this.categories.COMMUNICATION:
          categoryPreferences = this.getDefaultCommunicationPreferences();
          break;
        case this.categories.PRIVACY:
          categoryPreferences = this.getDefaultPrivacyPreferences();
          break;
        case this.categories.HEALTHCARE:
          categoryPreferences = this.getDefaultHealthcarePreferences();
          break;
        case this.categories.NOTIFICATIONS:
          categoryPreferences = this.getDefaultNotificationPreferences();
          break;
        case this.categories.ACCESSIBILITY:
          categoryPreferences = this.getDefaultAccessibilityPreferences();
          break;
        case this.categories.PERSONALIZATION:
          categoryPreferences = this.getDefaultPersonalizationPreferences();
          break;
        default:
          throw new Error(`Unsupported preference category: ${category}`);
      }

      console.log('User preferences by category retrieved successfully', {
        userId: userId,
        category: category
      });

      return {
        userId: userId,
        category: category,
        preferences: categoryPreferences,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to retrieve user preferences by category', {
        error: error.message,
        userId: userId,
        category: category
      });
      throw error;
    }
  }

  /**
   * Update user preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - New preferences
   * @returns {Promise<Object>} Update result
   */
  async updateUserPreferences(userId, preferences) {
    try {
      // Validate input
      if (!userId || !preferences) {
        throw new Error('User ID and preferences are required');
      }

      console.log('Updating user preferences', {
        userId: userId
      });

      // Validate preferences structure
      this.validatePreferences(preferences);

      // In a real implementation, this would update the preferences in a database
      // For demonstration, we'll just return success

      console.log('User preferences updated successfully', {
        userId: userId
      });

      return {
        success: true,
        message: 'Preferences updated successfully',
        preferences: preferences,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to update user preferences', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Update user preferences by category
   * @param {string} userId - User ID
   * @param {string} category - Preference category
   * @param {Object} categoryPreferences - New preferences for category
   * @returns {Promise<Object>} Update result
   */
  async updateUserPreferencesByCategory(userId, category, categoryPreferences) {
    try {
      // Validate input
      if (!userId || !category || !categoryPreferences) {
        throw new Error('User ID, category, and preferences are required');
      }

      // Validate category
      if (!this.categories[category.toUpperCase()]) {
        throw new Error(`Invalid preference category: ${category}`);
      }

      console.log('Updating user preferences by category', {
        userId: userId,
        category: category
      });

      // Validate category preferences
      this.validateCategoryPreferences(category, categoryPreferences);

      // In a real implementation, this would update the preferences in a database
      // For demonstration, we'll just return success

      console.log('User preferences by category updated successfully', {
        userId: userId,
        category: category
      });

      return {
        success: true,
        message: `Preferences for category ${category} updated successfully`,
        category: category,
        preferences: categoryPreferences,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to update user preferences by category', {
        error: error.message,
        userId: userId,
        category: category
      });
      throw error;
    }
  }

  /**
   * Reset user preferences to defaults
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Reset result
   */
  async resetUserPreferences(userId) {
    try {
      // Validate input
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log('Resetting user preferences to defaults', {
        userId: userId
      });

      // Create default preferences
      const defaultPreferences = {
        userId: userId,
        categories: {
          [this.categories.COMMUNICATION]: this.getDefaultCommunicationPreferences(),
          [this.categories.PRIVACY]: this.getDefaultPrivacyPreferences(),
          [this.categories.HEALTHCARE]: this.getDefaultHealthcarePreferences(),
          [this.categories.NOTIFICATIONS]: this.getDefaultNotificationPreferences(),
          [this.categories.ACCESSIBILITY]: this.getDefaultAccessibilityPreferences(),
          [this.categories.PERSONALIZATION]: this.getDefaultPersonalizationPreferences()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // In a real implementation, this would update the preferences in a database
      // For demonstration, we'll just return success

      console.log('User preferences reset to defaults successfully', {
        userId: userId
      });

      return {
        success: true,
        message: 'Preferences reset to defaults successfully',
        preferences: defaultPreferences,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to reset user preferences', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Export user preferences
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Exported preferences
   */
  async exportUserPreferences(userId) {
    try {
      // Validate input
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log('Exporting user preferences', {
        userId: userId
      });

      // Get user preferences
      const preferences = await this.getUserPreferences(userId);

      // In a real implementation, this would format the preferences for export
      // For demonstration, we'll just return the preferences

      console.log('User preferences exported successfully', {
        userId: userId
      });

      return {
        success: true,
        message: 'Preferences exported successfully',
        preferences: preferences,
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to export user preferences', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Import user preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - Preferences to import
   * @returns {Promise<Object>} Import result
   */
  async importUserPreferences(userId, preferences) {
    try {
      // Validate input
      if (!userId || !preferences) {
        throw new Error('User ID and preferences are required');
      }

      console.log('Importing user preferences', {
        userId: userId
      });

      // Validate preferences structure
      this.validatePreferences(preferences);

      // In a real implementation, this would import the preferences to a database
      // For demonstration, we'll just return success

      console.log('User preferences imported successfully', {
        userId: userId
      });

      return {
        success: true,
        message: 'Preferences imported successfully',
        preferences: preferences,
        importedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to import user preferences', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Get default communication preferences
   * @returns {Object} Default communication preferences
   */
  getDefaultCommunicationPreferences() {
    return {
      preferredLanguage: this.config.communication.preferredLanguage.default,
      preferredCommunicationChannel: this.config.communication.preferredCommunicationChannel.default,
      communicationFrequency: this.config.communication.communicationFrequency.default,
      receiveEducationalContent: this.config.communication.receiveEducationalContent.default,
      receiveHealthTips: this.config.communication.receiveHealthTips.default
    };
  }

  /**
   * Get default privacy preferences
   * @returns {Object} Default privacy preferences
   */
  getDefaultPrivacyPreferences() {
    return {
      shareDataWithResearchers: this.config.privacy.shareDataWithResearchers.default,
      shareDataWithProviders: this.config.privacy.shareDataWithProviders.default,
      allowDataExport: this.config.privacy.allowDataExport.default,
      profileVisibility: this.config.privacy.profileVisibility.default
    };
  }

  /**
   * Get default healthcare preferences
   * @returns {Object} Default healthcare preferences
   */
  getDefaultHealthcarePreferences() {
    return {
      preferredProvider: this.config.healthcare.preferredProvider.default,
      preferredPharmacy: this.config.healthcare.preferredPharmacy.default,
      preferredHospital: this.config.healthcare.preferredHospital.default,
      allowTelehealth: this.config.healthcare.allowTelehealth.default,
      appointmentReminders: this.config.healthcare.appointmentReminders.default
    };
  }

  /**
   * Get default notification preferences
   * @returns {Object} Default notification preferences
   */
  getDefaultNotificationPreferences() {
    return {
      emailNotifications: this.config.notifications.emailNotifications.default,
      smsNotifications: this.config.notifications.smsNotifications.default,
      pushNotifications: this.config.notifications.pushNotifications.default,
      inAppNotifications: this.config.notifications.inAppNotifications.default,
      doNotDisturb: this.config.notifications.doNotDisturb.default
    };
  }

  /**
   * Get default accessibility preferences
   * @returns {Object} Default accessibility preferences
   */
  getDefaultAccessibilityPreferences() {
    return {
      fontSize: this.config.accessibility.fontSize.default,
      highContrast: this.config.accessibility.highContrast.default,
      screenReader: this.config.accessibility.screenReader.default,
      keyboardNavigation: this.config.accessibility.keyboardNavigation.default
    };
  }

  /**
   * Get default personalization preferences
   * @returns {Object} Default personalization preferences
   */
  getDefaultPersonalizationPreferences() {
    return {
      theme: this.config.personalization.theme.default,
      dashboardLayout: this.config.personalization.dashboardLayout.default,
      showHealthSummary: this.config.personalization.showHealthSummary.default,
      showAppointments: this.config.personalization.showAppointments.default,
      showDocuments: this.config.personalization.showDocuments.default
    };
  }

  /**
   * Validate preferences structure
   * @param {Object} preferences - Preferences to validate
   */
  validatePreferences(preferences) {
    if (!preferences.categories) {
      throw new Error('Preferences must include categories');
    }

    // Validate each category
    for (const [category, categoryPreferences] of Object.entries(preferences.categories)) {
      this.validateCategoryPreferences(category, categoryPreferences);
    }
  }

  /**
   * Validate category preferences
   * @param {string} category - Category to validate
   * @param {Object} categoryPreferences - Category preferences to validate
   */
  validateCategoryPreferences(category, categoryPreferences) {
    // This is a simplified validation
    // In a real implementation, you would validate against the config schema
    if (typeof categoryPreferences !== 'object') {
      throw new Error(`Preferences for category ${category} must be an object`);
    }
  }
}

module.exports = PreferenceService;