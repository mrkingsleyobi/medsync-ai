/**
 * Provider Preference Service
 * Service for managing clinical decision support provider preferences
 */

const config = require('../config/preferences.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

class ProviderPreferenceService {
  /**
   * Create a new Provider Preference Service
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.preferences = new Map();
    this.categories = config.categories;
    this.scopes = config.scopes;

    // Initialize with default preferences
    this._initializeDefaultPreferences();

    this.logger.info('Provider Preference Service created', {
      service: 'provider-preference-service'
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
      defaultMeta: { service: 'provider-preference-service' },
      transports: [
        new winston.transports.File({ filename: 'logs/provider-preference-service-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/provider-preference-service-combined.log' })
      ]
    });
  }

  /**
   * Initialize default preferences
   * @private
   */
  _initializeDefaultPreferences() {
    // Create system-wide default preferences
    const systemPreferences = {
      id: 'system-defaults',
      providerId: 'system',
      scope: 'system',
      preferences: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Set default values for all categories and preferences
    for (const [categoryKey, category] of Object.entries(this.categories)) {
      systemPreferences.preferences[categoryKey] = {};
      for (const [preferenceKey, preference] of Object.entries(category.preferences)) {
        systemPreferences.preferences[categoryKey][preferenceKey] = preference.defaultValue;
      }
    }

    this.preferences.set('system-defaults', systemPreferences);
  }

  /**
   * Get provider preferences
   * @param {string} providerId - Provider identifier
   * @param {string} scope - Preference scope
   * @returns {Object} Provider preferences
   */
  getProviderPreferences(providerId, scope = 'provider') {
    try {
      if (!providerId) {
        throw new Error('Provider ID is required');
      }

      this.logger.info('Retrieving provider preferences', {
        providerId,
        scope
      });

      // Get provider-specific preferences
      const providerPrefs = this.preferences.get(`${scope}-${providerId}`);
      if (providerPrefs) {
        return this._resolvePreferences(providerPrefs);
      }

      // If no provider-specific preferences, return system defaults
      const systemDefaults = this.preferences.get('system-defaults');
      if (systemDefaults) {
        return this._resolvePreferences(systemDefaults);
      }

      // If no preferences found, return empty object
      return {};
    } catch (error) {
      this.logger.error('Failed to retrieve provider preferences', {
        error: error.message,
        providerId,
        scope
      });

      throw error;
    }
  }

  /**
   * Set provider preference
   * @param {string} providerId - Provider identifier
   * @param {string} category - Preference category
   * @param {string} preferenceKey - Preference key
   * @param {*} value - Preference value
   * @param {string} scope - Preference scope
   * @returns {Object} Updated preferences
   */
  setProviderPreference(providerId, category, preferenceKey, value, scope = 'provider') {
    try {
      if (!providerId) {
        throw new Error('Provider ID is required');
      }

      if (!category) {
        throw new Error('Category is required');
      }

      if (!preferenceKey) {
        throw new Error('Preference key is required');
      }

      // Validate preference
      this._validatePreference(category, preferenceKey, value);

      this.logger.info('Setting provider preference', {
        providerId,
        category,
        preferenceKey,
        value,
        scope
      });

      // Get or create preference record
      const preferenceId = `${scope}-${providerId}`;
      let providerPrefs = this.preferences.get(preferenceId);

      if (!providerPrefs) {
        providerPrefs = {
          id: preferenceId,
          providerId,
          scope,
          preferences: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.preferences.set(preferenceId, providerPrefs);
      }

      // Initialize category if it doesn't exist
      if (!providerPrefs.preferences[category]) {
        providerPrefs.preferences[category] = {};
      }

      // Set preference value
      providerPrefs.preferences[category][preferenceKey] = value;
      providerPrefs.updatedAt = new Date().toISOString();

      return this._resolvePreferences(providerPrefs);
    } catch (error) {
      this.logger.error('Failed to set provider preference', {
        error: error.message,
        providerId,
        category,
        preferenceKey,
        value,
        scope
      });

      throw error;
    }
  }

  /**
   * Update multiple provider preferences
   * @param {string} providerId - Provider identifier
   * @param {Object} preferences - Preferences to update
   * @param {string} scope - Preference scope
   * @returns {Object} Updated preferences
   */
  updateProviderPreferences(providerId, preferences, scope = 'provider') {
    try {
      if (!providerId) {
        throw new Error('Provider ID is required');
      }

      if (!preferences || typeof preferences !== 'object') {
        throw new Error('Preferences object is required');
      }

      this.logger.info('Updating provider preferences', {
        providerId,
        preferenceCount: Object.keys(preferences).length,
        scope
      });

      // Get or create preference record
      const preferenceId = `${scope}-${providerId}`;
      let providerPrefs = this.preferences.get(preferenceId);

      if (!providerPrefs) {
        providerPrefs = {
          id: preferenceId,
          providerId,
          scope,
          preferences: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.preferences.set(preferenceId, providerPrefs);
      }

      // Update preferences
      for (const [categoryKey, categoryPrefs] of Object.entries(preferences)) {
        // Validate category
        if (!this.categories[categoryKey]) {
          this.logger.warn('Unknown preference category', {
            category: categoryKey
          });
          continue;
        }

        // Initialize category if it doesn't exist
        if (!providerPrefs.preferences[categoryKey]) {
          providerPrefs.preferences[categoryKey] = {};
        }

        // Update category preferences
        for (const [prefKey, prefValue] of Object.entries(categoryPrefs)) {
          // Validate preference
          try {
            this._validatePreference(categoryKey, prefKey, prefValue);
            providerPrefs.preferences[categoryKey][prefKey] = prefValue;
          } catch (validationError) {
            this.logger.warn('Invalid preference value', {
              category: categoryKey,
              preference: prefKey,
              value: prefValue,
              error: validationError.message
            });
          }
        }
      }

      providerPrefs.updatedAt = new Date().toISOString();

      return this._resolvePreferences(providerPrefs);
    } catch (error) {
      this.logger.error('Failed to update provider preferences', {
        error: error.message,
        providerId,
        scope
      });

      throw error;
    }
  }

  /**
   * Reset provider preferences to defaults
   * @param {string} providerId - Provider identifier
   * @param {string} scope - Preference scope
   * @returns {Object} Reset preferences
   */
  resetProviderPreferences(providerId, scope = 'provider') {
    try {
      if (!providerId) {
        throw new Error('Provider ID is required');
      }

      this.logger.info('Resetting provider preferences to defaults', {
        providerId,
        scope
      });

      const preferenceId = `${scope}-${providerId}`;
      const providerPrefs = this.preferences.get(preferenceId);

      if (providerPrefs) {
        // Reset to system defaults
        const systemDefaults = this.preferences.get('system-defaults');
        if (systemDefaults) {
          providerPrefs.preferences = JSON.parse(JSON.stringify(systemDefaults.preferences));
          providerPrefs.updatedAt = new Date().toISOString();
          return this._resolvePreferences(providerPrefs);
        }
      }

      // If no preferences found, return system defaults
      const systemDefaults = this.preferences.get('system-defaults');
      if (systemDefaults) {
        return this._resolvePreferences(systemDefaults);
      }

      return {};
    } catch (error) {
      this.logger.error('Failed to reset provider preferences', {
        error: error.message,
        providerId,
        scope
      });

      throw error;
    }
  }

  /**
   * Validate preference value
   * @param {string} category - Preference category
   * @param {string} preferenceKey - Preference key
   * @param {*} value - Preference value
   * @private
   */
  _validatePreference(category, preferenceKey, value) {
    const categoryConfig = this.categories[category];
    if (!categoryConfig) {
      throw new Error(`Unknown preference category: ${category}`);
    }

    const preferenceConfig = categoryConfig.preferences[preferenceKey];
    if (!preferenceConfig) {
      throw new Error(`Unknown preference: ${preferenceKey} in category: ${category}`);
    }

    // Type validation
    if (preferenceConfig.type === 'number') {
      if (typeof value !== 'number') {
        throw new Error(`Preference ${preferenceKey} must be a number`);
      }

      if (preferenceConfig.min !== undefined && value < preferenceConfig.min) {
        throw new Error(`Preference ${preferenceKey} must be at least ${preferenceConfig.min}`);
      }

      if (preferenceConfig.max !== undefined && value > preferenceConfig.max) {
        throw new Error(`Preference ${preferenceKey} must be at most ${preferenceConfig.max}`);
      }
    } else if (preferenceConfig.type === 'boolean') {
      if (typeof value !== 'boolean') {
        throw new Error(`Preference ${preferenceKey} must be a boolean`);
      }
    } else if (preferenceConfig.type === 'string') {
      if (typeof value !== 'string') {
        throw new Error(`Preference ${preferenceKey} must be a string`);
      }

      if (preferenceConfig.options && !preferenceConfig.options.includes(value)) {
        throw new Error(`Preference ${preferenceKey} must be one of: ${preferenceConfig.options.join(', ')}`);
      }
    } else if (preferenceConfig.type === 'array') {
      if (!Array.isArray(value)) {
        throw new Error(`Preference ${preferenceKey} must be an array`);
      }

      if (preferenceConfig.options) {
        for (const item of value) {
          if (!preferenceConfig.options.includes(item)) {
            throw new Error(`Preference ${preferenceKey} array items must be one of: ${preferenceConfig.options.join(', ')}`);
          }
        }
      }
    }
  }

  /**
   * Resolve preferences with inheritance
   * @param {Object} providerPrefs - Provider preferences
   * @returns {Object} Resolved preferences
   * @private
   */
  _resolvePreferences(providerPrefs) {
    // For now, we'll just return the provider preferences
    // In a real implementation, this would handle inheritance from department/organization
    return {
      id: providerPrefs.id,
      providerId: providerPrefs.providerId,
      scope: providerPrefs.scope,
      preferences: providerPrefs.preferences,
      createdAt: providerPrefs.createdAt,
      updatedAt: providerPrefs.updatedAt
    };
  }

  /**
   * Get available preference categories
   * @returns {Array} Array of available preference categories
   */
  getAvailableCategories() {
    return Object.keys(this.categories);
  }

  /**
   * Get category configuration
   * @param {string} category - Category name
   * @returns {Object|null} Category configuration or null if not found
   */
  getCategoryConfiguration(category) {
    return this.categories[category] || null;
  }

  /**
   * Get preference configuration
   * @param {string} category - Category name
   * @param {string} preferenceKey - Preference key
   * @returns {Object|null} Preference configuration or null if not found
   */
  getPreferenceConfiguration(category, preferenceKey) {
    const categoryConfig = this.categories[category];
    if (!categoryConfig) {
      return null;
    }

    return categoryConfig.preferences[preferenceKey] || null;
  }

  /**
   * Export provider preferences
   * @param {string} providerId - Provider identifier
   * @param {string} scope - Preference scope
   * @returns {Object} Exported preferences
   */
  exportProviderPreferences(providerId, scope = 'provider') {
    try {
      if (!providerId) {
        throw new Error('Provider ID is required');
      }

      this.logger.info('Exporting provider preferences', {
        providerId,
        scope
      });

      const preferences = this.getProviderPreferences(providerId, scope);

      return {
        providerId,
        scope,
        preferences,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      this.logger.error('Failed to export provider preferences', {
        error: error.message,
        providerId,
        scope
      });

      throw error;
    }
  }

  /**
   * Import provider preferences
   * @param {string} providerId - Provider identifier
   * @param {Object} importedPreferences - Preferences to import
   * @param {string} scope - Preference scope
   * @returns {Object} Imported preferences
   */
  importProviderPreferences(providerId, importedPreferences, scope = 'provider') {
    try {
      if (!providerId) {
        throw new Error('Provider ID is required');
      }

      if (!importedPreferences || typeof importedPreferences !== 'object') {
        throw new Error('Imported preferences object is required');
      }

      this.logger.info('Importing provider preferences', {
        providerId,
        scope
      });

      // Validate imported preferences structure
      if (!importedPreferences.preferences || typeof importedPreferences.preferences !== 'object') {
        throw new Error('Invalid preferences structure in import data');
      }

      // Update preferences
      const result = this.updateProviderPreferences(providerId, importedPreferences.preferences, scope);

      return {
        providerId,
        scope,
        preferences: result,
        importedAt: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Failed to import provider preferences', {
        error: error.message,
        providerId,
        scope
      });

      throw error;
    }
  }
}

module.exports = ProviderPreferenceService;