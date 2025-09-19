/**
 * Translation Controller Tests
 * Tests for the translation controller
 */

const TranslationController = require('../../src/controllers/translation.controller.js');

// Mock the TranslationService
jest.mock('../../src/services/translation.service.js');

describe('Translation Controller', () => {
  let translationController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    translationController = new TranslationController();
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('translateText', () => {
    test('should translate text to target language', async () => {
      const text = 'Hello, how are you?';
      const targetLanguage = 'es';
      const translatedText = '[ES] Hello, how are you?';

      mockReq.body = { text, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(true);
      translationController.translationService.translateText.mockResolvedValue(translatedText);

      await translationController.translateText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        originalText: text,
        translatedText: translatedText,
        sourceLanguage: 'detected',
        targetLanguage: targetLanguage
      });
    });

    test('should return 400 if text is missing', async () => {
      mockReq.body = { targetLanguage: 'es' };

      await translationController.translateText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Text is required'
      });
    });

    test('should return 400 if target language is missing', async () => {
      mockReq.body = { text: 'Hello' };

      await translationController.translateText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Target language is required'
      });
    });

    test('should return 400 if target language is not supported', async () => {
      const text = 'Hello';
      const targetLanguage = 'xyz';
      const supportedLanguages = { en: 'English', es: 'Spanish' };

      mockReq.body = { text, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(false);
      translationController.translationService.getSupportedLanguages.mockReturnValue(supportedLanguages);

      await translationController.translateText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: `Unsupported target language: ${targetLanguage}`,
        supportedLanguages: supportedLanguages
      });
    });

    test('should return 500 if service throws an error', async () => {
      const text = 'Hello';
      const targetLanguage = 'es';
      const errorMessage = 'Service error';

      mockReq.body = { text, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(true);
      translationController.translationService.translateText.mockRejectedValue(new Error(errorMessage));

      await translationController.translateText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to translate text',
        message: errorMessage
      });
    });
  });

  describe('translateMedicalDocument', () => {
    test('should translate medical document to target language', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const targetLanguage = 'es';
      const translatedDocument = '[ES MEDICAL] The patient was diagnosed with myocardial infarction.';

      mockReq.body = { documentText, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(true);
      translationController.translationService.translateMedicalDocument.mockResolvedValue(translatedDocument);

      await translationController.translateMedicalDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        originalLength: documentText.length,
        translatedLength: translatedDocument.length,
        translatedDocument: translatedDocument,
        sourceLanguage: 'detected',
        targetLanguage: targetLanguage
      });
    });

    test('should return 400 if document text is missing', async () => {
      mockReq.body = { targetLanguage: 'es' };

      await translationController.translateMedicalDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Document text is required'
      });
    });

    test('should return 400 if target language is missing', async () => {
      mockReq.body = { documentText: 'The patient was diagnosed with myocardial infarction.' };

      await translationController.translateMedicalDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Target language is required'
      });
    });

    test('should return 400 if target language is not supported', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const targetLanguage = 'xyz';
      const supportedLanguages = { en: 'English', es: 'Spanish' };

      mockReq.body = { documentText, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(false);
      translationController.translationService.getSupportedLanguages.mockReturnValue(supportedLanguages);

      await translationController.translateMedicalDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: `Unsupported target language: ${targetLanguage}`,
        supportedLanguages: supportedLanguages
      });
    });

    test('should return 500 if service throws an error', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const targetLanguage = 'es';
      const errorMessage = 'Service error';

      mockReq.body = { documentText, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(true);
      translationController.translationService.translateMedicalDocument.mockRejectedValue(new Error(errorMessage));

      await translationController.translateMedicalDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to translate medical document',
        message: errorMessage
      });
    });
  });

  describe('detectLanguage', () => {
    test('should detect language of text', async () => {
      const text = 'Hello, how are you?';
      const detectedLanguage = 'en';

      mockReq.body = { text };

      // Mock the service method
      translationController.translationService.detectLanguage.mockResolvedValue(detectedLanguage);

      await translationController.detectLanguage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        detectedLanguage: detectedLanguage,
        textLength: text.length
      });
    });

    test('should return 400 if text is missing', async () => {
      mockReq.body = {};

      await translationController.detectLanguage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Text is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const text = 'Hello';
      const errorMessage = 'Service error';

      mockReq.body = { text };

      // Mock the service method to throw an error
      translationController.translationService.detectLanguage.mockRejectedValue(new Error(errorMessage));

      await translationController.detectLanguage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to detect language',
        message: errorMessage
      });
    });
  });

  describe('getSupportedLanguages', () => {
    test('should return supported languages', () => {
      const supportedLanguages = { en: 'English', es: 'Spanish', fr: 'French' };

      // Mock the service method
      translationController.translationService.getSupportedLanguages.mockReturnValue(supportedLanguages);

      translationController.getSupportedLanguages(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        supportedLanguages: supportedLanguages
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      translationController.translationService.getSupportedLanguages.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      translationController.getSupportedLanguages(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve supported languages',
        message: errorMessage
      });
    });
  });

  describe('translateBatch', () => {
    test('should translate batch of texts', async () => {
      const texts = ['Hello', 'How are you?'];
      const targetLanguage = 'es';
      const translatedTexts = ['[ES] Hello', '[ES] How are you?'];

      mockReq.body = { texts, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(true);
      translationController.translationService.translateBatch.mockResolvedValue(translatedTexts);

      await translationController.translateBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        textCount: texts.length,
        translatedCount: translatedTexts.length,
        translatedTexts: translatedTexts,
        sourceLanguage: 'detected',
        targetLanguage: targetLanguage
      });
    });

    test('should return 400 if texts is not an array', async () => {
      mockReq.body = { texts: 'Hello', targetLanguage: 'es' };

      await translationController.translateBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Texts must be an array'
      });
    });

    test('should return 400 if target language is missing', async () => {
      mockReq.body = { texts: ['Hello'] };

      await translationController.translateBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Target language is required'
      });
    });

    test('should return 400 if target language is not supported', async () => {
      const texts = ['Hello'];
      const targetLanguage = 'xyz';
      const supportedLanguages = { en: 'English', es: 'Spanish' };

      mockReq.body = { texts, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(false);
      translationController.translationService.getSupportedLanguages.mockReturnValue(supportedLanguages);

      await translationController.translateBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: `Unsupported target language: ${targetLanguage}`,
        supportedLanguages: supportedLanguages
      });
    });

    test('should return 500 if service throws an error', async () => {
      const texts = ['Hello'];
      const targetLanguage = 'es';
      const errorMessage = 'Service error';

      mockReq.body = { texts, targetLanguage };

      // Mock the service methods
      translationController.translationService.isLanguageSupported.mockReturnValue(true);
      translationController.translationService.translateBatch.mockRejectedValue(new Error(errorMessage));

      await translationController.translateBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to translate batch of texts',
        message: errorMessage
      });
    });
  });
});