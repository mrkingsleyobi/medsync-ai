// MediSync Healthcare AI Platform - Medical Named Entity Recognition
// Named entity recognition for healthcare applications

const { HfInference } = require('@huggingface/inference');

class MedicalNamedEntityRecognition {
  constructor(config = {}) {
    this.config = {
      apiKey: process.env.HUGGINGFACE_API_KEY || config.apiKey,
      defaultModel: config.defaultModel || 'd4data/biomedical-ner-all',
      timeout: config.timeout || 30000,
      ...config
    };

    // Initialize HuggingFace inference client
    if (this.config.apiKey) {
      this.hf = new HfInference(this.config.apiKey);
    }

    // Predefined medical NER models
    this.models = {
      biomedical_ner: {
        name: 'd4data/biomedical-ner-all',
        type: 'token-classification',
        domain: 'biomedical',
        description: 'Comprehensive biomedical NER model',
        entities: ['Disease', 'Chemical', 'Gene', 'Species', 'Mutation']
      },
      clinical_ner: {
        name: 'Clinical-AI-AI/clinical-ner',
        type: 'token-classification',
        domain: 'clinical',
        description: 'Clinical notes NER model',
        entities: ['Problem', 'Test', 'Treatment', 'Medication', 'Dosage']
      },
      disease_ner: {
        name: 'prajjwal1/bert-medium-disease',
        type: 'token-classification',
        domain: 'disease-detection',
        description: 'Disease-specific NER model',
        entities: ['Disease', 'Symptom', 'Sign']
      },
      drug_ner: {
        name: 'dslim/bert-base-NER',
        type: 'token-classification',
        domain: 'pharmacovigilance',
        description: 'Drug and medication NER model',
        entities: ['Drug', 'Dosage', 'Frequency', 'Route']
      }
    };

    console.log('Medical Named Entity Recognition initialized', {
      defaultModel: this.config.defaultModel,
      availableModels: Object.keys(this.models)
    });
  }

  /**
   * Extract named entities from medical text
   * @param {string} text - Text to analyze
   * @param {string} modelName - Model to use for NER
   * @param {Object} options - NER options
   * @returns {Promise<Object>} NER results
   */
  async extractEntities(text, modelName = 'biomedical_ner', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Text is required for entity extraction');
    }

    const modelConfig = this.models[modelName];
    if (!modelConfig) {
      throw new Error(`Model ${modelName} not found. Available models: ${Object.keys(this.models).join(', ')}`);
    }

    try {
      const result = await this.hf.tokenClassification({
        model: modelConfig.name,
        inputs: text,
        parameters: {
          aggregation_strategy: 'simple',
          ...options.parameters
        },
        ...options
      });

      console.log('Named entity recognition completed', {
        modelName: modelConfig.name,
        textLength: text.length,
        entityCount: result.length
      });

      return {
        model: modelConfig.name,
        type: modelConfig.type,
        domain: modelConfig.domain,
        input: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        entities: result,
        entityTypes: this.extractUniqueEntityTypes(result),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Named entity recognition failed', {
        modelName: modelConfig.name,
        textLength: text.length,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Extract unique entity types from results
   * @param {Array} entities - Entity results
   * @returns {Array} Unique entity types
   */
  extractUniqueEntityTypes(entities) {
    if (!Array.isArray(entities)) return [];
    return [...new Set(entities.map(e => e.entity_group || e.entity))];
  }

  /**
   * Extract medical conditions from text
   * @param {string} text - Medical text
   * @returns {Promise<Object>} Medical conditions
   */
  async extractMedicalConditions(text) {
    return await this.extractEntities(text, 'disease_ner');
  }

  /**
   * Extract medications from text
   * @param {string} text - Medical text
   * @returns {Promise<Object>} Medications
   */
  async extractMedications(text) {
    return await this.extractEntities(text, 'drug_ner');
  }

  /**
   * Extract clinical entities from text
   * @param {string} text - Clinical text
   * @returns {Promise<Object>} Clinical entities
   */
  async extractClinicalEntities(text) {
    return await this.extractEntities(text, 'clinical_ner');
  }

  /**
   * Batch extract entities from multiple texts
   * @param {Array} texts - Array of texts to analyze
   * @param {string} modelName - Model to use
   * @param {Object} options - NER options
   * @returns {Promise<Object>} Batch results
   */
  async batchExtractEntities(texts, modelName = 'biomedical_ner', options = {}) {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error('Texts must be a non-empty array');
    }

    const results = [];
    const errors = [];

    // Process texts sequentially to avoid rate limiting
    for (let i = 0; i < texts.length; i++) {
      try {
        const result = await this.extractEntities(texts[i], modelName, options);
        results.push({
          index: i,
          text: texts[i].substring(0, 50) + (texts[i].length > 50 ? '...' : ''),
          result: result
        });
      } catch (error) {
        errors.push({
          index: i,
          text: texts[i].substring(0, 50) + (texts[i].length > 50 ? '...' : ''),
          error: error.message
        });
      }
    }

    console.log('Batch entity extraction completed', {
      total: texts.length,
      successful: results.length,
      errors: errors.length
    });

    return {
      results: results,
      errors: errors,
      total: texts.length,
      successful: results.length,
      failed: errors.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Filter entities by type
   * @param {Array} entities - Entity results
   * @param {string|Array} entityTypes - Entity types to filter
   * @returns {Array} Filtered entities
   */
  filterEntitiesByType(entities, entityTypes) {
    if (!Array.isArray(entities)) return [];

    const types = Array.isArray(entityTypes) ? entityTypes : [entityTypes];
    return entities.filter(entity => {
      const entityType = entity.entity_group || entity.entity;
      return types.includes(entityType);
    });
  }

  /**
   * Get entity statistics
   * @param {Array} entities - Entity results
   * @returns {Object} Entity statistics
   */
  getEntityStatistics(entities) {
    if (!Array.isArray(entities)) return {};

    const stats = {};
    entities.forEach(entity => {
      const type = entity.entity_group || entity.entity;
      stats[type] = (stats[type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get available models
   * @returns {Object} Available models
   */
  getAvailableModels() {
    return this.models;
  }

  /**
   * Get model information
   * @param {string} modelName - Model name
   * @returns {Object} Model information
   */
  getModelInfo(modelName) {
    return this.models[modelName] || null;
  }

  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getStatistics() {
    return {
      defaultModel: this.config.defaultModel,
      availableModels: Object.keys(this.models).length,
      modelTypes: [...new Set(Object.values(this.models).map(m => m.type))],
      domains: [...new Set(Object.values(this.models).map(m => m.domain))]
    };
  }
}

module.exports = MedicalNamedEntityRecognition;