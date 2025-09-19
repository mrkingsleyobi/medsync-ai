/**
 * Researcher Preference Service
 * Service for managing research integration researcher preferences
 */

const config = require('../config/preferences.config.js');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

class ResearcherPreferenceService {
  /**
   * Create a new Researcher Preference Service
   * NOTE: This is a simulation implementation for demonstration purposes.
   * In a production environment, this would store preferences in a database
   * and implement proper inheritance logic.
   */
  constructor() {
    this.config = config;
    this.logger = this._createLogger();
    this.preferences = new Map();
    this.categories = config.categories;
    this.scopes = config.scopes;

    // Initialize with default preferences
    this._initializeDefaultPreferences();

    // TODO: Replace in-memory Map with persistent storage (e.g., database) for production use
    // This will prevent data loss when the service restarts

    this.logger.info('Researcher Preference Service created', {
      service: 'researcher-preference-service'
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
      defaultMeta: { service: 'researcher-preference-service' },
      transports: [
        new winston.transports.File({ filename: 'logs/researcher-preference-service-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/researcher-preference-service-combined.log' })
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
      researcherId: 'system',
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
   * Get researcher preferences
   * @param {string} researcherId - Researcher identifier
   * @param {string} scope - Preference scope
   * @returns {Object} Researcher preferences
   */
  getResearcherPreferences(researcherId, scope = 'researcher') {
    try {
      if (!researcherId) {
        throw new Error('Researcher ID is required');
      }

      this.logger.info('Retrieving researcher preferences', {
        researcherId,
        scope
      });

      // Get researcher-specific preferences
      const researcherPrefs = this.preferences.get(`${scope}-${researcherId}`);
      if (researcherPrefs) {
        return this._resolvePreferences(researcherPrefs);
      }

      // If no researcher-specific preferences, return system defaults
      const systemDefaults = this.preferences.get('system-defaults');
      if (systemDefaults) {
        return this._resolvePreferences(systemDefaults);
      }

      // If no preferences found, return empty object
      return {};
    } catch (error) {
      this.logger.error('Failed to retrieve researcher preferences', {
        error: error.message,
        researcherId,
        scope
      });

      throw error;
    }
  }

  /**
   * Set researcher preference
   * @param {string} researcherId - Researcher identifier
   * @param {string} category - Preference category
   * @param {string} preferenceKey - Preference key
   * @param {*} value - Preference value
   * @param {string} scope - Preference scope
   * @returns {Object} Updated preferences
   */
  setResearcherPreference(researcherId, category, preferenceKey, value, scope = 'researcher') {
    try {
      if (!researcherId) {
        throw new Error('Researcher ID is required');
      }

      if (!category) {
        throw new Error('Category is required');
      }

      if (!preferenceKey) {
        throw new Error('Preference key is required');
      }

      // Validate preference
      this._validatePreference(category, preferenceKey, value);

      this.logger.info('Setting researcher preference', {
        researcherId,
        category,
        preferenceKey,
        value,
        scope
      });

      // Get or create preference record
      const preferenceId = `${scope}-${researcherId}`;
      let researcherPrefs = this.preferences.get(preferenceId);

      if (!researcherPrefs) {
        researcherPrefs = {
          id: preferenceId,
          researcherId,
          scope,
          preferences: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.preferences.set(preferenceId, researcherPrefs);
      }

      // Initialize category if it doesn't exist
      if (!researcherPrefs.preferences[category]) {
        researcherPrefs.preferences[category] = {};
      }

      // Set preference value
      researcherPrefs.preferences[category][preferenceKey] = value;
      researcherPrefs.updatedAt = new Date().toISOString();

      return this._resolvePreferences(researcherPrefs);
    } catch (error) {
      this.logger.error('Failed to set researcher preference', {
        error: error.message,
        researcherId,
        category,
        preferenceKey,
        value,
        scope
      });

      throw error;
    }
  }

  /**
   * Update multiple researcher preferences
   * @param {string} researcherId - Researcher identifier
   * @param {Object} preferences - Preferences to update
   * @param {string} scope - Preference scope
   * @returns {Object} Updated preferences
   */
  updateResearcherPreferences(researcherId, preferences, scope = 'researcher') {
    try {
      if (!researcherId) {
        throw new Error('Researcher ID is required');
      }

      if (!preferences || typeof preferences !== 'object') {
        throw new Error('Preferences object is required');
      }

      this.logger.info('Updating researcher preferences', {
        researcherId,
        preferenceCount: Object.keys(preferences).length,
        scope
      });

      // Get or create preference record
      const preferenceId = `${scope}-${researcherId}`;
      let researcherPrefs = this.preferences.get(preferenceId);

      if (!researcherPrefs) {
        researcherPrefs = {
          id: preferenceId,
          researcherId,
          scope,
          preferences: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.preferences.set(preferenceId, researcherPrefs);
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
        if (!researcherPrefs.preferences[categoryKey]) {
          researcherPrefs.preferences[categoryKey] = {};
        }

        // Update category preferences
        for (const [prefKey, prefValue] of Object.entries(categoryPrefs)) {
          // Validate preference
          try {
            this._validatePreference(categoryKey, prefKey, prefValue);
            researcherPrefs.preferences[categoryKey][prefKey] = prefValue;
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

      researcherPrefs.updatedAt = new Date().toISOString();

      return this._resolvePreferences(researcherPrefs);
    } catch (error) {
      this.logger.error('Failed to update researcher preferences', {
        error: error.message,
        researcherId,
        scope
      });

      throw error;
    }
  }

  /**
   * Reset researcher preferences to defaults
   * @param {string} researcherId - Researcher identifier
   * @param {string} scope - Preference scope
   * @returns {Object} Reset preferences
   */
  resetResearcherPreferences(researcherId, scope = 'researcher') {
    try {
      if (!researcherId) {
        throw new Error('Researcher ID is required');
      }

      this.logger.info('Resetting researcher preferences to defaults', {
        researcherId,
        scope
      });

      const preferenceId = `${scope}-${researcherId}`;
      const researcherPrefs = this.preferences.get(preferenceId);

      if (researcherPrefs) {
        // Reset to system defaults
        const systemDefaults = this.preferences.get('system-defaults');
        if (systemDefaults) {
          researcherPrefs.preferences = JSON.parse(JSON.stringify(systemDefaults.preferences));
          researcherPrefs.updatedAt = new Date().toISOString();
          return this._resolvePreferences(researcherPrefs);
        }
      }

      // If no preferences found, return system defaults
      const systemDefaults = this.preferences.get('system-defaults');
      if (systemDefaults) {
        return this._resolvePreferences(systemDefaults);
      }

      return {};
    } catch (error) {
      this.logger.error('Failed to reset researcher preferences', {
        error: error.message,
        researcherId,
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
   * @param {Object} researcherPrefs - Researcher preferences
   * @returns {Object} Resolved preferences
   * @private
   */
  _resolvePreferences(researcherPrefs) {
    // TODO: Implement proper preference inheritance logic
    // This should merge researcher-specific preferences with system defaults
    // and handle inheritance from team/institution scopes
    return {
      id: researcherPrefs.id,
      researcherId: researcherPrefs.researcherId,
      scope: researcherPrefs.scope,
      preferences: researcherPrefs.preferences,
      createdAt: researcherPrefs.createdAt,
      updatedAt: researcherPrefs.updatedAt
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
   * Export researcher preferences
   * @param {string} researcherId - Researcher identifier
   * @param {string} scope - Preference scope
   * @returns {Object} Exported preferences
   */
  exportResearcherPreferences(researcherId, scope = 'researcher') {
    try {
      if (!researcherId) {
        throw new Error('Researcher ID is required');
      }

      this.logger.info('Exporting researcher preferences', {
        researcherId,
        scope
      });

      const preferences = this.getResearcherPreferences(researcherId, scope);

      return {
        researcherId,
        scope,
        preferences,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      this.logger.error('Failed to export researcher preferences', {
        error: error.message,
        researcherId,
        scope
      });

      throw error;
    }
  }

  /**
   * Import researcher preferences
   * @param {string} researcherId - Researcher identifier
   * @param {Object} importedPreferences - Preferences to import
   * @param {string} scope - Preference scope
   * @returns {Object} Imported preferences
   */
  importResearcherPreferences(researcherId, importedPreferences, scope = 'researcher') {
    try {
      if (!researcherId) {
        throw new Error('Researcher ID is required');
      }

      if (!importedPreferences || typeof importedPreferences !== 'object') {
        throw new Error('Imported preferences object is required');
      }

      this.logger.info('Importing researcher preferences', {
        researcherId,
        scope
      });

      // Validate imported preferences structure
      if (!importedPreferences.preferences || typeof importedPreferences.preferences !== 'object') {
        throw new Error('Invalid preferences structure in import data');
      }

      // Update preferences
      const result = this.updateResearcherPreferences(researcherId, importedPreferences.preferences, scope);

      return {
        researcherId,
        scope,
        preferences: result,
        importedAt: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Failed to import researcher preferences', {
        error: error.message,
        researcherId,
        scope
      });

      throw error;
    }
  }
}

module.exports = ResearcherPreferenceService;