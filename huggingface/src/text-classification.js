// MediSync Healthcare AI Platform - Medical Text Classification
// Text classification models for healthcare applications

const { HfInference } = require('@huggingface/inference');

class MedicalTextClassification {
  constructor(config = {}) {
    this.config = {
      apiKey: process.env.HUGGINGFACE_API_KEY || config.apiKey,
      defaultModel: config.defaultModel || 'emilyalsentzer/Bio_ClinicalBERT',
      timeout: config.timeout || 30000,
      ...config
    };

    // Initialize HuggingFace inference client
    if (this.config.apiKey) {
      this.hf = new HfInference(this.config.apiKey);
    }

    // Predefined medical classification models
    this.models = {
      clinical_bert: {
        name: 'emilyalsentzer/Bio_ClinicalBERT',
        type: 'text-classification',
        domain: 'clinical-notes',
        description: 'Clinical BERT for medical text classification',
        labels: ['clinical_note', 'discharge_summary', 'radiology_report', 'pathology_report']
      },
      pubmed_bert: {
        name: 'microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext',
        type: 'text-classification',
        domain: 'medical-research',
        description: 'PubMed BERT for medical research text classification',
        labels: ['research_abstract', 'clinical_trial', 'review_article', 'case_report']
      },
      medical_bart: {
        name: 'facebook/bart-large-mnli',
        type: 'zero-shot-classification',
        domain: 'medical-specialties',
        description: 'BART for zero-shot medical specialty classification',
        labels: ['cardiology', 'neurology', 'oncology', 'pediatrics', 'surgery', 'psychiatry']
      }
    };

    console.log('Medical Text Classification initialized', {
      defaultModel: this.config.defaultModel,
      availableModels: Object.keys(this.models)
    });
  }

  /**
   * Classify medical text using a specific model
   * @param {string} text - Text to classify
   * @param {string} modelName - Model to use for classification
   * @param {Object} options - Classification options
   * @returns {Promise<Object>} Classification results
   */
  async classifyText(text, modelName = 'clinical_bert', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Text is required for classification');
    }

    const modelConfig = this.models[modelName];
    if (!modelConfig) {
      throw new Error(`Model ${modelName} not found. Available models: ${Object.keys(this.models).join(', ')}`);
    }

    try {
      let result;

      // Handle zero-shot classification differently
      if (modelConfig.type === 'zero-shot-classification') {
        result = await this.hf.zeroShotClassification({
          model: modelConfig.name,
          inputs: text,
          parameters: {
            candidate_labels: modelConfig.labels,
            ...options.parameters
          }
        });
      } else {
        // Standard text classification
        result = await this.hf.textClassification({
          model: modelConfig.name,
          inputs: text,
          ...options
        });
      }

      console.log('Text classification completed', {
        modelName: modelConfig.name,
        textLength: text.length,
        resultCount: Array.isArray(result) ? result.length : 1
      });

      return {
        model: modelConfig.name,
        type: modelConfig.type,
        domain: modelConfig.domain,
        input: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        results: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Text classification failed', {
        modelName: modelConfig.name,
        textLength: text.length,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Classify medical document type
   * @param {string} text - Medical document text
   * @returns {Promise<Object>} Document type classification
   */
  async classifyDocumentType(text) {
    return await this.classifyText(text, 'clinical_bert');
  }

  /**
   * Classify medical research type
   * @param {string} text - Research text
   * @returns {Promise<Object>} Research type classification
   */
  async classifyResearchType(text) {
    return await this.classifyText(text, 'pubmed_bert');
  }

  /**
   * Classify medical specialty
   * @param {string} text - Medical text
   * @returns {Promise<Object>} Specialty classification
   */
  async classifyMedicalSpecialty(text) {
    return await this.classifyText(text, 'medical_bart');
  }

  /**
   * Batch classify multiple texts
   * @param {Array} texts - Array of texts to classify
   * @param {string} modelName - Model to use
   * @param {Object} options - Classification options
   * @returns {Promise<Array>} Array of classification results
   */
  async batchClassify(texts, modelName = 'clinical_bert', options = {}) {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error('Texts must be a non-empty array');
    }

    const results = [];
    const errors = [];

    // Process texts sequentially to avoid rate limiting
    for (let i = 0; i < texts.length; i++) {
      try {
        const result = await this.classifyText(texts[i], modelName, options);
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

    console.log('Batch classification completed', {
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

module.exports = MedicalTextClassification;