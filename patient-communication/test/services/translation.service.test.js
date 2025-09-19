/**
 * Translation Service Tests
 * Tests for the translation service
 */

const TranslationService = require('../../src/services/translation.service.js');

describe('Translation Service', () => {
  let translationService;

  beforeEach(() => {
    translationService = new TranslationService();
  });

  describe('translateText', () => {
    test('should translate text to target language', async () => {
      const text = 'Hello, how are you?';
      const targetLanguage = 'es';

      const result = await translationService.translateText(text, targetLanguage);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('[ES]');
    });

    test('should throw an error for invalid text', async () => {
      const targetLanguage = 'es';

      await expect(translationService.translateText(null, targetLanguage))
        .rejects
        .toThrow('Invalid text provided for translation');

      await expect(translationService.translateText('', targetLanguage))
        .rejects
        .toThrow('Invalid text provided for translation');
    });

    test('should throw an error for unsupported target language', async () => {
      const text = 'Hello, how are you?';
      const invalidLanguage = 'xyz';

      await expect(translationService.translateText(text, invalidLanguage))
        .rejects
        .toThrow('Unsupported target language: xyz');
    });

    test('should return original text when source and target languages are the same', async () => {
      const text = 'Hello, how are you?';
      const targetLanguage = 'en'; // Assuming default language is 'en'

      const result = await translationService.translateText(text, targetLanguage);

      expect(result).toBe(text);
    });
  });

  describe('detectLanguage', () => {
    test('should detect language of text', async () => {
      const text = 'Hello, how are you?';

      const result = await translationService.detectLanguage(text);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toBe('en'); // Assuming default language is 'en'
    });

    test('should throw an error for invalid text', async () => {
      await expect(translationService.detectLanguage(null))
        .rejects
        .toThrow('Invalid text provided for language detection');

      await expect(translationService.detectLanguage(''))
        .rejects
        .toThrow('Invalid text provided for language detection');
    });
  });

  describe('translateMedicalDocument', () => {
    test('should translate medical document to target language', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const targetLanguage = 'es';

      const result = await translationService.translateMedicalDocument(documentText, targetLanguage);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('[ES MEDICAL]');
    });

    test('should throw an error for invalid document text', async () => {
      const targetLanguage = 'es';

      await expect(translationService.translateMedicalDocument(null, targetLanguage))
        .rejects
        .toThrow('Invalid medical document text provided for translation');

      await expect(translationService.translateMedicalDocument('', targetLanguage))
        .rejects
        .toThrow('Invalid medical document text provided for translation');
    });

    test('should throw an error for unsupported target language', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const invalidLanguage = 'xyz';

      await expect(translationService.translateMedicalDocument(documentText, invalidLanguage))
        .rejects
        .toThrow('Unsupported target language: xyz');
    });
  });

  describe('getSupportedLanguages', () => {
    test('should return supported languages mapping', () => {
      const result = translationService.getSupportedLanguages();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });
  });

  describe('isLanguageSupported', () => {
    test('should return true for supported language', () => {
      const result = translationService.isLanguageSupported('en');

      expect(result).toBe(true);
    });

    test('should return false for unsupported language', () => {
      const result = translationService.isLanguageSupported('xyz');

      expect(result).toBe(false);
    });
  });

  describe('translateBatch', () => {
    test('should translate batch of texts', async () => {
      const texts = [
        'Hello, how are you?',
        'The patient is doing well.',
        'Please take your medication.'
      ];
      const targetLanguage = 'es';

      const result = await translationService.translateBatch(texts, targetLanguage);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      result.forEach(text => {
        expect(text).toContain('[ES]');
      });
    });

    test('should throw an error for invalid texts array', async () => {
      const targetLanguage = 'es';

      await expect(translationService.translateBatch(null, targetLanguage))
        .rejects
        .toThrow('Invalid texts array provided for batch translation');
    });

    test('should throw an error for unsupported target language in batch translation', async () => {
      const texts = ['Hello, how are you?'];
      const invalidLanguage = 'xyz';

      await expect(translationService.translateBatch(texts, invalidLanguage))
        .rejects
        .toThrow('Unsupported target language: xyz');
    });
  });
});