// MediSync Healthcare AI Platform - HuggingFace Integration
// Main module for HuggingFace model integration

const { HfInference } = require('@huggingface/inference');
const fs = require('fs');
const path = require('path');

class HuggingFaceIntegration {
  constructor(config = {}) {
    this.config = {
      apiKey: process.env.HUGGINGFACE_API_KEY || config.apiKey,
      defaultModel: config.defaultModel || 'bert-base-uncased',
      cacheDir: config.cacheDir || './models/cache',
      ...config
    };

    // Initialize HuggingFace inference client
    if (this.config.apiKey) {
      this.hf = new HfInference(this.config.apiKey);
    }

    // Create cache directory if it doesn't exist
    if (!fs.existsSync(this.config.cacheDir)) {
      fs.mkdirSync(this.config.cacheDir, { recursive: true });
    }

    // Model registry
    this.models = new Map();
    this.modelMetadata = new Map();

    console.log('HuggingFace integration initialized', {
      defaultModel: this.config.defaultModel,
      cacheDir: this.config.cacheDir
    });
  }

  /**
   * Register a model with the integration
   * @param {string} modelName - Name of the model
   * @param {Object} modelConfig - Configuration for the model
   */
  registerModel(modelName, modelConfig) {
    this.models.set(modelName, {
      ...modelConfig,
      registeredAt: new Date().toISOString()
    });

    console.log('Model registered', { modelName, modelConfig });
  }

  /**
   * Get registered models
   * @returns {Array} List of registered models
   */
  getRegisteredModels() {
    return Array.from(this.models.keys());
  }

  /**
   * Load a model for inference
   * @param {string} modelName - Name of the model to load
   * @param {Object} options - Loading options
   */
  async loadModel(modelName, options = {}) {
    try {
      const modelConfig = this.models.get(modelName);
      if (!modelConfig) {
        throw new Error(`Model ${modelName} not registered`);
      }

      // Store model metadata
      this.modelMetadata.set(modelName, {
        ...modelConfig,
        loadedAt: new Date().toISOString(),
        status: 'loaded'
      });

      console.log('Model loaded successfully', { modelName });
      return true;
    } catch (error) {
      console.error('Error loading model', { modelName, error: error.message });
      throw error;
    }
  }

  /**
   * Unload a model
   * @param {string} modelName - Name of the model to unload
   */
  unloadModel(modelName) {
    const metadata = this.modelMetadata.get(modelName);
    if (metadata) {
      this.modelMetadata.set(modelName, {
        ...metadata,
        unloadedAt: new Date().toISOString(),
        status: 'unloaded'
      });
    }

    console.log('Model unloaded', { modelName });
  }

  /**
   * Perform text classification using a HuggingFace model
   * @param {string} text - Text to classify
   * @param {string} modelName - Model to use for classification
   * @param {Object} options - Classification options
   * @returns {Promise<Object>} Classification results
   */
  async textClassification(text, modelName = 'facebook/bart-large-mnli', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    try {
      const result = await this.hf.textClassification({
        model: modelName,
        inputs: text,
        ...options
      });

      console.log('Text classification completed', {
        textLength: text.length,
        modelName,
        resultCount: result.length
      });

      return result;
    } catch (error) {
      console.error('Text classification failed', {
        textLength: text.length,
        modelName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Perform named entity recognition using a HuggingFace model
   * @param {string} text - Text to analyze
   * @param {string} modelName - Model to use for NER
   * @param {Object} options - NER options
   * @returns {Promise<Object>} NER results
   */
  async namedEntityRecognition(text, modelName = 'dslim/bert-base-NER', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    try {
      const result = await this.hf.tokenClassification({
        model: modelName,
        inputs: text,
        ...options
      });

      console.log('Named entity recognition completed', {
        textLength: text.length,
        modelName,
        entityCount: result.length
      });

      return result;
    } catch (error) {
      console.error('Named entity recognition failed', {
        textLength: text.length,
        modelName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Perform question answering using a HuggingFace model
   * @param {string} question - Question to answer
   * @param {string} context - Context to search for answer
   * @param {string} modelName - Model to use for QA
   * @param {Object} options - QA options
   * @returns {Promise<Object>} QA results
   */
  async questionAnswering(question, context, modelName = 'deepset/roberta-base-squad2', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    try {
      const result = await this.hf.questionAnswering({
        model: modelName,
        inputs: {
          question: question,
          context: context
        },
        ...options
      });

      console.log('Question answering completed', {
        questionLength: question.length,
        contextLength: context.length,
        modelName
      });

      return result;
    } catch (error) {
      console.error('Question answering failed', {
        questionLength: question.length,
        contextLength: context.length,
        modelName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Perform text summarization using a HuggingFace model
   * @param {string} text - Text to summarize
   * @param {string} modelName - Model to use for summarization
   * @param {Object} options - Summarization options
   * @returns {Promise<Object>} Summarization results
   */
  async summarization(text, modelName = 'facebook/bart-large-cnn', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    try {
      const result = await this.hf.summarization({
        model: modelName,
        inputs: text,
        ...options
      });

      console.log('Text summarization completed', {
        textLength: text.length,
        modelName
      });

      return result;
    } catch (error) {
      console.error('Text summarization failed', {
        textLength: text.length,
        modelName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Perform text generation using a HuggingFace model
   * @param {string} prompt - Prompt for text generation
   * @param {string} modelName - Model to use for generation
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generation results
   */
  async textGeneration(prompt, modelName = 'gpt2', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    try {
      const result = await this.hf.textGeneration({
        model: modelName,
        inputs: prompt,
        ...options
      });

      console.log('Text generation completed', {
        promptLength: prompt.length,
        modelName
      });

      return result;
    } catch (error) {
      console.error('Text generation failed', {
        promptLength: prompt.length,
        modelName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Perform image classification using a HuggingFace model
   * @param {string} imagePath - Path to image file
   * @param {string} modelName - Model to use for classification
   * @param {Object} options - Classification options
   * @returns {Promise<Object>} Classification results
   */
  async imageClassification(imagePath, modelName = 'google/vit-base-patch16-224', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    try {
      // Read image file
      const data = fs.readFileSync(imagePath);

      const result = await this.hf.imageClassification({
        model: modelName,
        data: data,
        ...options
      });

      console.log('Image classification completed', {
        imagePath,
        modelName,
        resultCount: result.length
      });

      return result;
    } catch (error) {
      console.error('Image classification failed', {
        imagePath,
        modelName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get model metadata
   * @param {string} modelName - Name of the model
   * @returns {Object} Model metadata
   */
  getModelMetadata(modelName) {
    return this.modelMetadata.get(modelName) || null;
  }

  /**
   * Get all model metadata
   * @returns {Object} All model metadata
   */
  getAllModelMetadata() {
    const metadata = {};
    for (const [modelName, modelData] of this.modelMetadata.entries()) {
      metadata[modelName] = modelData;
    }
    return metadata;
  }

  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getStatistics() {
    return {
      registeredModels: this.getRegisteredModels().length,
      loadedModels: Array.from(this.modelMetadata.values()).filter(m => m.status === 'loaded').length,
      totalModels: this.models.size,
      cacheDir: this.config.cacheDir,
      defaultModel: this.config.defaultModel
    };
  }
}

module.exports = HuggingFaceIntegration;