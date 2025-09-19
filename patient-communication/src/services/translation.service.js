/**
 * Translation Service
 * Service for translating medical content to multiple languages
 */

const config = require('../config/translation.config.js');

class TranslationService {
  constructor() {
    this.config = config;
    this.supportedLanguages = config.supportedLanguages;
    this.defaultLanguage = config.defaultLanguage;
  }

  /**
   * Translate text to a target language
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<string>} Translated text
   */
  async translateText(text, targetLanguage, sourceLanguage = null) {
    try {
      // Validate input
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid text provided for translation');
      }

      // Validate target language
      if (!this.supportedLanguages[targetLanguage]) {
        throw new Error(`Unsupported target language: ${targetLanguage}`);
      }

      // If source language is not provided, detect it
      if (!sourceLanguage) {
        sourceLanguage = await this.detectLanguage(text);
      }

      // Check if translation is needed
      if (sourceLanguage === targetLanguage) {
        return text;
      }

      console.log('Translating text', {
        textLength: text.length,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      });

      // In a real implementation, this would call a translation API
      // For now, we'll simulate translation
      const translatedText = this.simulateTranslation(text, sourceLanguage, targetLanguage);

      console.log('Text translation completed', {
        originalLength: text.length,
        translatedLength: translatedText.length,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      });

      return translatedText;
    } catch (error) {
      console.error('Text translation failed', {
        error: error.message,
        textLength: text ? text.length : 0,
        targetLanguage: targetLanguage
      });
      throw error;
    }
  }

  /**
   * Detect the language of a text
   * @param {string} text - Text to analyze
   * @returns {Promise<string>} Detected language code
   */
  async detectLanguage(text) {
    try {
      // Validate input
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid text provided for language detection');
      }

      console.log('Detecting language', {
        textLength: text.length
      });

      // In a real implementation, this would call a language detection API
      // For now, we'll return the default language
      const detectedLanguage = this.defaultLanguage;

      console.log('Language detection completed', {
        detectedLanguage: detectedLanguage
      });

      return detectedLanguage;
    } catch (error) {
      console.error('Language detection failed', {
        error: error.message,
        textLength: text ? text.length : 0
      });
      throw error;
    }
  }

  /**
   * Translate medical document
   * @param {string} documentText - Medical document text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<string>} Translated medical document
   */
  async translateMedicalDocument(documentText, targetLanguage, sourceLanguage = null) {
    try {
      // Validate input
      if (!documentText || typeof documentText !== 'string') {
        throw new Error('Invalid medical document text provided for translation');
      }

      // Validate target language
      if (!this.supportedLanguages[targetLanguage]) {
        throw new Error(`Unsupported target language: ${targetLanguage}`);
      }

      // If source language is not provided, detect it
      if (!sourceLanguage) {
        sourceLanguage = await this.detectLanguage(documentText);
      }

      // Check if translation is needed
      if (sourceLanguage === targetLanguage) {
        return documentText;
      }

      console.log('Translating medical document', {
        documentLength: documentText.length,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      });

      // For medical documents, we need to preserve medical terms
      // In a real implementation, this would use medical glossaries
      const translatedDocument = this.translateWithMedicalGlossary(documentText, sourceLanguage, targetLanguage);

      console.log('Medical document translation completed', {
        originalLength: documentText.length,
        translatedLength: translatedDocument.length,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      });

      return translatedDocument;
    } catch (error) {
      console.error('Medical document translation failed', {
        error: error.message,
        documentLength: documentText ? documentText.length : 0,
        targetLanguage: targetLanguage
      });
      throw error;
    }
  }

  /**
   * Simulate translation (for demonstration purposes)
   * @param {string} text - Text to translate
   * @param {string} sourceLanguage - Source language code
   * @param {string} targetLanguage - Target language code
   * @returns {string} Simulated translated text
   */
  simulateTranslation(text, sourceLanguage, targetLanguage) {
    // In a real implementation, this would call a translation API
    // For demonstration, we'll just append the target language code
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }

  /**
   * Translate with medical glossary (for demonstration purposes)
   * @param {string} documentText - Medical document text to translate
   * @param {string} sourceLanguage - Source language code
   * @param {string} targetLanguage - Target language code
   * @returns {string} Simulated translated medical document
   */
  translateWithMedicalGlossary(documentText, sourceLanguage, targetLanguage) {
    // In a real implementation, this would use medical glossaries to preserve terms
    // For demonstration, we'll just append the target language code and indicate medical terms preserved
    return `[${targetLanguage.toUpperCase()} MEDICAL] ${documentText}`;
  }

  /**
   * Get supported languages
   * @returns {Object} Supported languages mapping
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Check if a language is supported
   * @param {string} languageCode - Language code to check
   * @returns {boolean} True if language is supported
   */
  isLanguageSupported(languageCode) {
    return !!this.supportedLanguages[languageCode];
  }

  /**
   * Translate batch of texts
   * @param {Array<string>} texts - Array of texts to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<Array<string>>} Array of translated texts
   */
  async translateBatch(texts, targetLanguage, sourceLanguage = null) {
    try {
      // Validate input
      if (!Array.isArray(texts)) {
        throw new Error('Invalid texts array provided for batch translation');
      }

      // Validate target language
      if (!this.supportedLanguages[targetLanguage]) {
        throw new Error(`Unsupported target language: ${targetLanguage}`);
      }

      console.log('Translating batch of texts', {
        textCount: texts.length,
        targetLanguage: targetLanguage
      });

      // Translate each text
      const translatedTexts = [];
      for (const text of texts) {
        const translatedText = await this.translateText(text, targetLanguage, sourceLanguage);
        translatedTexts.push(translatedText);
      }

      console.log('Batch translation completed', {
        textCount: texts.length,
        translatedCount: translatedTexts.length,
        targetLanguage: targetLanguage
      });

      return translatedTexts;
    } catch (error) {
      console.error('Batch translation failed', {
        error: error.message,
        textCount: texts ? texts.length : 0,
        targetLanguage: targetLanguage
      });
      throw error;
    }
  }
}

module.exports = TranslationService;