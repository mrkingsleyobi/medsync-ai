/**
 * Translation Controller
 * Controller for handling translation requests
 */

const TranslationService = require('../services/translation.service.js');

class TranslationController {
  constructor() {
    this.translationService = new TranslationService();
  }

  /**
   * Translate text to a target language
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async translateText(req, res) {
    try {
      const { text, targetLanguage, sourceLanguage } = req.body;

      // Validate required fields
      if (!text) {
        return res.status(400).json({
          error: 'Text is required'
        });
      }

      if (!targetLanguage) {
        return res.status(400).json({
          error: 'Target language is required'
        });
      }

      // Check if target language is supported
      if (!this.translationService.isLanguageSupported(targetLanguage)) {
        return res.status(400).json({
          error: `Unsupported target language: ${targetLanguage}`,
          supportedLanguages: this.translationService.getSupportedLanguages()
        });
      }

      // Translate the text
      const translatedText = await this.translationService.translateText(text, targetLanguage, sourceLanguage);

      // Return the translated text
      res.status(200).json({
        success: true,
        originalText: text,
        translatedText: translatedText,
        sourceLanguage: sourceLanguage || 'detected',
        targetLanguage: targetLanguage
      });
    } catch (error) {
      console.error('Text translation controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to translate text',
        message: error.message
      });
    }
  }

  /**
   * Translate medical document
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async translateMedicalDocument(req, res) {
    try {
      const { documentText, targetLanguage, sourceLanguage } = req.body;

      // Validate required fields
      if (!documentText) {
        return res.status(400).json({
          error: 'Document text is required'
        });
      }

      if (!targetLanguage) {
        return res.status(400).json({
          error: 'Target language is required'
        });
      }

      // Check if target language is supported
      if (!this.translationService.isLanguageSupported(targetLanguage)) {
        return res.status(400).json({
          error: `Unsupported target language: ${targetLanguage}`,
          supportedLanguages: this.translationService.getSupportedLanguages()
        });
      }

      // Translate the medical document
      const translatedDocument = await this.translationService.translateMedicalDocument(documentText, targetLanguage, sourceLanguage);

      // Return the translated document
      res.status(200).json({
        success: true,
        originalLength: documentText.length,
        translatedLength: translatedDocument.length,
        translatedDocument: translatedDocument,
        sourceLanguage: sourceLanguage || 'detected',
        targetLanguage: targetLanguage
      });
    } catch (error) {
      console.error('Medical document translation controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to translate medical document',
        message: error.message
      });
    }
  }

  /**
   * Detect language of text
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async detectLanguage(req, res) {
    try {
      const { text } = req.body;

      // Validate required fields
      if (!text) {
        return res.status(400).json({
          error: 'Text is required'
        });
      }

      // Detect the language
      const detectedLanguage = await this.translationService.detectLanguage(text);

      // Return the detected language
      res.status(200).json({
        success: true,
        detectedLanguage: detectedLanguage,
        textLength: text.length
      });
    } catch (error) {
      console.error('Language detection controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to detect language',
        message: error.message
      });
    }
  }

  /**
   * Get supported languages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSupportedLanguages(req, res) {
    try {
      const supportedLanguages = this.translationService.getSupportedLanguages();

      res.status(200).json({
        success: true,
        supportedLanguages: supportedLanguages
      });
    } catch (error) {
      console.error('Get supported languages controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve supported languages',
        message: error.message
      });
    }
  }

  /**
   * Translate batch of texts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async translateBatch(req, res) {
    try {
      const { texts, targetLanguage, sourceLanguage } = req.body;

      // Validate required fields
      if (!Array.isArray(texts)) {
        return res.status(400).json({
          error: 'Texts must be an array'
        });
      }

      if (!targetLanguage) {
        return res.status(400).json({
          error: 'Target language is required'
        });
      }

      // Check if target language is supported
      if (!this.translationService.isLanguageSupported(targetLanguage)) {
        return res.status(400).json({
          error: `Unsupported target language: ${targetLanguage}`,
          supportedLanguages: this.translationService.getSupportedLanguages()
        });
      }

      // Translate the batch of texts
      const translatedTexts = await this.translationService.translateBatch(texts, targetLanguage, sourceLanguage);

      // Return the translated texts
      res.status(200).json({
        success: true,
        textCount: texts.length,
        translatedCount: translatedTexts.length,
        translatedTexts: translatedTexts,
        sourceLanguage: sourceLanguage || 'detected',
        targetLanguage: targetLanguage
      });
    } catch (error) {
      console.error('Batch translation controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to translate batch of texts',
        message: error.message
      });
    }
  }
}

module.exports = TranslationController;