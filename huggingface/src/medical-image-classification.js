// MediSync Healthcare AI Platform - Medical Image Classification
// Image classification models for healthcare applications

const { HfInference } = require('@huggingface/inference');
const fs = require('fs');

class MedicalImageClassification {
  constructor(config = {}) {
    this.config = {
      apiKey: process.env.HUGGINGFACE_API_KEY || config.apiKey,
      defaultModel: config.defaultModel || 'google/vit-base-patch16-224',
      timeout: config.timeout || 30000,
      ...config
    };

    // Initialize HuggingFace inference client
    if (this.config.apiKey) {
      this.hf = new HfInference(this.config.apiKey);
    }

    // Predefined medical image classification models
    this.models = {
      vit_medical: {
        name: 'google/vit-base-patch16-224',
        type: 'image-classification',
        domain: 'general-medical',
        description: 'Vision Transformer for general medical image classification'
      },
      resnet_medical: {
        name: 'microsoft/resnet-50',
        type: 'image-classification',
        domain: 'medical-imaging',
        description: 'ResNet model for medical image classification'
      },
      radiology_cnn: {
        name: 'StanfordAIMI/chest-imagenet',
        type: 'image-classification',
        domain: 'radiology',
        description: 'CNN for radiology image classification'
      },
      dermatology_cnn: {
        name: 'mdbootstrap/resnet50-dermoscopic-images',
        type: 'image-classification',
        domain: 'dermatology',
        description: 'ResNet for dermatology image classification'
      },
      pathology_cnn: {
        name: 'histo-resnet50',
        type: 'image-classification',
        domain: 'pathology',
        description: 'ResNet for pathology image classification'
      }
    };

    console.log('Medical Image Classification initialized', {
      defaultModel: this.config.defaultModel,
      availableModels: Object.keys(this.models)
    });
  }

  /**
   * Classify medical image from file path
   * @param {string} imagePath - Path to image file
   * @param {string} modelName - Model to use for classification
   * @param {Object} options - Classification options
   * @returns {Promise<Object>} Classification results
   */
  async classifyImageFromFile(imagePath, modelName = 'vit_medical', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const modelConfig = this.models[modelName];
    if (!modelConfig) {
      throw new Error(`Model ${modelName} not found. Available models: ${Object.keys(this.models).join(', ')}`);
    }

    try {
      // Read image file
      const imageData = fs.readFileSync(imagePath);

      const result = await this.hf.imageClassification({
        model: modelConfig.name,
        data: imageData,
        ...options
      });

      console.log('Image classification completed', {
        modelName: modelConfig.name,
        imagePath: imagePath,
        resultCount: result.length
      });

      return {
        model: modelConfig.name,
        type: modelConfig.type,
        domain: modelConfig.domain,
        imagePath: imagePath,
        results: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Image classification failed', {
        modelName: modelConfig.name,
        imagePath: imagePath,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Classify medical image from buffer
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} modelName - Model to use for classification
   * @param {Object} options - Classification options
   * @returns {Promise<Object>} Classification results
   */
  async classifyImageFromBuffer(imageBuffer, modelName = 'vit_medical', options = {}) {
    if (!this.hf) {
      throw new Error('HuggingFace API key not configured');
    }

    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error('Image data must be a Buffer');
    }

    const modelConfig = this.models[modelName];
    if (!modelConfig) {
      throw new Error(`Model ${modelName} not found. Available models: ${Object.keys(this.models).join(', ')}`);
    }

    try {
      const result = await this.hf.imageClassification({
        model: modelConfig.name,
        data: imageBuffer,
        ...options
      });

      console.log('Image classification completed', {
        modelName: modelConfig.name,
        imageSize: imageBuffer.length,
        resultCount: result.length
      });

      return {
        model: modelConfig.name,
        type: modelConfig.type,
        domain: modelConfig.domain,
        imageSize: imageBuffer.length,
        results: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Image classification failed', {
        modelName: modelConfig.name,
        imageSize: imageBuffer.length,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Classify radiology images
   * @param {string|Buffer} image - Image path or buffer
   * @returns {Promise<Object>} Radiology classification
   */
  async classifyRadiologyImage(image) {
    if (typeof image === 'string') {
      return await this.classifyImageFromFile(image, 'radiology_cnn');
    } else {
      return await this.classifyImageFromBuffer(image, 'radiology_cnn');
    }
  }

  /**
   * Classify dermatology images
   * @param {string|Buffer} image - Image path or buffer
   * @returns {Promise<Object>} Dermatology classification
   */
  async classifyDermatologyImage(image) {
    if (typeof image === 'string') {
      return await this.classifyImageFromFile(image, 'dermatology_cnn');
    } else {
      return await this.classifyImageFromBuffer(image, 'dermatology_cnn');
    }
  }

  /**
   * Classify pathology images
   * @param {string|Buffer} image - Image path or buffer
   * @returns {Promise<Object>} Pathology classification
   */
  async classifyPathologyImage(image) {
    if (typeof image === 'string') {
      return await this.classifyImageFromFile(image, 'pathology_cnn');
    } else {
      return await this.classifyImageFromBuffer(image, 'pathology_cnn');
    }
  }

  /**
   * Batch classify multiple images
   * @param {Array} images - Array of image paths or buffers
   * @param {string} modelName - Model to use
   * @param {Object} options - Classification options
   * @returns {Promise<Object>} Batch results
   */
  async batchClassifyImages(images, modelName = 'vit_medical', options = {}) {
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('Images must be a non-empty array');
    }

    const results = [];
    const errors = [];

    // Process images sequentially to avoid rate limiting
    for (let i = 0; i < images.length; i++) {
      try {
        let result;
        if (typeof images[i] === 'string') {
          result = await this.classifyImageFromFile(images[i], modelName, options);
        } else {
          result = await this.classifyImageFromBuffer(images[i], modelName, options);
        }

        results.push({
          index: i,
          image: typeof images[i] === 'string' ? images[i] : `Buffer(${images[i].length} bytes)`,
          result: result
        });
      } catch (error) {
        errors.push({
          index: i,
          image: typeof images[i] === 'string' ? images[i] : `Buffer(${images[i].length} bytes)`,
          error: error.message
        });
      }
    }

    console.log('Batch image classification completed', {
      total: images.length,
      successful: results.length,
      errors: errors.length
    });

    return {
      results: results,
      errors: errors,
      total: images.length,
      successful: results.length,
      failed: errors.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get top classification result
   * @param {Array} results - Classification results
   * @returns {Object} Top result
   */
  getTopResult(results) {
    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }

    return results.reduce((top, current) => {
      return (current.score > top.score) ? current : top;
    });
  }

  /**
   * Filter results by confidence threshold
   * @param {Array} results - Classification results
   * @param {number} threshold - Confidence threshold (0-1)
   * @returns {Array} Filtered results
   */
  filterByConfidence(results, threshold = 0.5) {
    if (!Array.isArray(results)) return [];
    return results.filter(result => result.score >= threshold);
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

module.exports = MedicalImageClassification;