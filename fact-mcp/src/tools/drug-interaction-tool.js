// MediSync Healthcare AI Platform - Drug Interaction Checker Tool
// Tool for checking potential drug interactions

const BaseTool = require('./base-tool');

class DrugInteractionTool extends BaseTool {
  /**
   * Create a new Drug Interaction Checker tool
   * @param {Object} config - Tool configuration
   */
  constructor(config = {}) {
    super({
      name: 'DrugInteractionTool',
      description: 'Checks potential drug interactions and contraindications',
      version: '1.0.0',
      maxDrugs: config.maxDrugs || 10,
      ...config
    });

    // Initialize drug interaction database (in a real implementation, this would be external)
    this._initializeDrugDatabase();
  }

  /**
   * Check for drug interactions
   * @param {Object} params - Drug interaction parameters
   * @returns {Promise<Object>} Interaction results
   */
  async execute(params = {}) {
    try {
      // Validate parameters
      if (!this.validateParams(params)) {
        throw new Error('Invalid parameters provided');
      }

      // Check for interactions
      const results = this._checkInteractions(params.drugs);

      return {
        success: true,
        tool: this.config.name,
        query: params,
        results: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        tool: this.config.name,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Validate drug interaction parameters
   * @param {Object} params - Parameters to validate
   * @returns {boolean} True if parameters are valid
   */
  validateParams(params = {}) {
    if (!params.drugs || !Array.isArray(params.drugs)) {
      return false;
    }

    if (params.drugs.length < 2) {
      return false;
    }

    if (params.drugs.length > this.config.maxDrugs) {
      return false;
    }

    // Check that all drugs are strings
    return params.drugs.every(drug => typeof drug === 'string');
  }

  /**
   * Initialize drug interaction database
   * @private
   */
  _initializeDrugDatabase() {
    // In a real implementation, this would connect to an external drug interaction database
    // For this implementation, we'll use a simplified internal database
    this.drugDatabase = new Map();

    // Add some sample drug interactions
    this.drugDatabase.set('warfarin', {
      name: 'Warfarin',
      category: 'anticoagulant',
      interactions: ['aspirin', 'ibuprofen', 'amiodarone'],
      contraindications: ['active_bleeding'],
      warnings: ['monitor_inr']
    });

    this.drugDatabase.set('aspirin', {
      name: 'Aspirin',
      category: 'nsaids',
      interactions: ['warfarin', 'clopidogrel'],
      contraindications: ['peptic_ulcer_disease'],
      warnings: ['gastrointestinal_bleeding_risk']
    });

    this.drugDatabase.set('ibuprofen', {
      name: 'Ibuprofen',
      category: 'nsaids',
      interactions: ['warfarin', 'lisinopril'],
      contraindications: ['renal_impairment'],
      warnings: ['cardiovascular_risk']
    });

    this.drugDatabase.set('lisinopril', {
      name: 'Lisinopril',
      category: 'ace_inhibitor',
      interactions: ['ibuprofen', 'potassium_supplements'],
      contraindications: ['pregnancy', 'angioedema_history'],
      warnings: ['monitor_kidney_function']
    });

    this.drugDatabase.set('metformin', {
      name: 'Metformin',
      category: 'antidiabetic',
      interactions: ['contrast_media'],
      contraindications: ['severe_renal_impairment'],
      warnings: ['lactic_acidosis_risk']
    });
  }

  /**
   * Check for drug interactions
   * @param {Array} drugs - List of drugs to check
   * @returns {Object} Interaction results
   * @private
   */
  _checkInteractions(drugs) {
    const results = {
      interactions: [],
      contraindications: [],
      warnings: [],
      safeCombinations: []
    };

    // Normalize drug names
    const normalizedDrugs = drugs.map(drug => drug.toLowerCase().trim());

    // Check each drug against all others
    for (let i = 0; i < normalizedDrugs.length; i++) {
      const drug1 = normalizedDrugs[i];
      const drug1Info = this.drugDatabase.get(drug1);

      if (!drug1Info) {
        results.warnings.push({
          type: 'unknown_drug',
          drug: drug1,
          message: `Information not available for drug: ${drug1}`
        });
        continue;
      }

      for (let j = i + 1; j < normalizedDrugs.length; j++) {
        const drug2 = normalizedDrugs[j];
        const drug2Info = this.drugDatabase.get(drug2);

        if (!drug2Info) {
          results.warnings.push({
            type: 'unknown_drug',
            drug: drug2,
            message: `Information not available for drug: ${drug2}`
          });
          continue;
        }

        // Check for direct interactions
        if (drug1Info.interactions.includes(drug2)) {
          results.interactions.push({
            drugs: [drug1, drug2],
            severity: 'moderate',
            description: `Potential interaction between ${drug1Info.name} and ${drug2Info.name}`,
            recommendation: 'Monitor closely and consider alternative medications'
          });
        }

        // Check for contraindications
        if (drug1Info.contraindications.some(condition => drug2Info.category === condition)) {
          results.contraindications.push({
            drugs: [drug1, drug2],
            severity: 'high',
            description: `Contraindication between ${drug1Info.name} and ${drug2Info.name}`,
            recommendation: 'Avoid combination or use with extreme caution under specialist supervision'
          });
        }

        // Check for warnings
        drug1Info.warnings.forEach(warning => {
          if (drug2Info.warnings.includes(warning)) {
            results.warnings.push({
              drugs: [drug1, drug2],
              type: warning,
              description: `Shared warning for ${drug1Info.name} and ${drug2Info.name}: ${warning}`,
              recommendation: 'Monitor for specific adverse effects'
            });
          }
        });
      }
    }

    // Identify safe combinations (those without interactions, contraindications, or shared warnings)
    const allInteractions = [
      ...results.interactions.map(i => i.drugs.join('-')),
      ...results.contraindications.map(c => c.drugs.join('-'))
    ];

    for (let i = 0; i < normalizedDrugs.length; i++) {
      for (let j = i + 1; j < normalizedDrugs.length; j++) {
        const combination = [normalizedDrugs[i], normalizedDrugs[j]].join('-');
        if (!allInteractions.includes(combination)) {
          results.safeCombinations.push({
            drugs: [normalizedDrugs[i], normalizedDrugs[j]],
            message: 'No significant interactions identified'
          });
        }
      }
    }

    return results;
  }
}

module.exports = DrugInteractionTool;