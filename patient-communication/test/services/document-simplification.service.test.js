/**
 * Document Simplification Service Tests
 * Tests for the document simplification service
 */

const DocumentSimplificationService = require('../../src/services/document-simplification.service.js');

describe('Document Simplification Service', () => {
  let documentSimplificationService;

  beforeEach(() => {
    documentSimplificationService = new DocumentSimplificationService();
  });

  describe('simplifyDocument', () => {
    test('should simplify a medical document', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction and hypertension.';
      const level = 'basic';

      const result = await documentSimplificationService.simplifyDocument(documentText, level);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('heart attack');
      expect(result).toContain('high blood pressure');
    });

    test('should throw an error for invalid document text', async () => {
      const level = 'basic';

      await expect(documentSimplificationService.simplifyDocument(null, level))
        .rejects
        .toThrow('Invalid document text provided');

      await expect(documentSimplificationService.simplifyDocument('', level))
        .rejects
        .toThrow('Invalid document text provided');
    });

    test('should throw an error for invalid simplification level', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const invalidLevel = 'invalid';

      await expect(documentSimplificationService.simplifyDocument(documentText, invalidLevel))
        .rejects
        .toThrow('Invalid simplification level: invalid');
    });
  });

  describe('replaceMedicalTerms', () => {
    test('should replace complex medical terms with simpler ones', () => {
      const text = 'The patient suffered from myocardial infarction and hypertension.';

      const result = documentSimplificationService.replaceMedicalTerms(text);

      expect(result).toContain('heart attack');
      expect(result).toContain('high blood pressure');
      expect(result).not.toContain('myocardial infarction');
      expect(result).not.toContain('hypertension');
    });

    test('should handle text without medical terms', () => {
      const text = 'The patient felt well today.';

      const result = documentSimplificationService.replaceMedicalTerms(text);

      expect(result).toBe(text);
    });
  });

  describe('analyzeComplexity', () => {
    test('should analyze document complexity', () => {
      const documentText = 'The patient was diagnosed with myocardial infarction. This is a serious condition.';

      const result = documentSimplificationService.analyzeComplexity(documentText);

      expect(result).toBeDefined();
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.sentenceCount).toBeGreaterThan(0);
      expect(result.avgWordsPerSentence).toBeGreaterThan(0);
      expect(result.complexTermCount).toBeGreaterThan(0);
      expect(result.estimatedReadingLevel).toBeGreaterThan(0);
    });

    test('should handle empty document', () => {
      const documentText = '';

      const result = documentSimplificationService.analyzeComplexity(documentText);

      expect(result.wordCount).toBe(0);
      expect(result.sentenceCount).toBe(0);
      expect(result.avgWordsPerSentence).toBeNaN();
      expect(result.complexTermCount).toBe(0);
      expect(result.estimatedReadingLevel).toBe(5);
    });
  });

  describe('estimateReadingLevel', () => {
    test('should estimate reading level for simple text', () => {
      const avgWordsPerSentence = 8;

      const result = documentSimplificationService.estimateReadingLevel(avgWordsPerSentence);

      expect(result).toBe(5); // 5th grade
    });

    test('should estimate reading level for medium complexity text', () => {
      const avgWordsPerSentence = 12;

      const result = documentSimplificationService.estimateReadingLevel(avgWordsPerSentence);

      expect(result).toBe(8); // 8th grade
    });

    test('should estimate reading level for complex text', () => {
      const avgWordsPerSentence = 25;

      const result = documentSimplificationService.estimateReadingLevel(avgWordsPerSentence);

      expect(result).toBe(12); // 12th grade
    });
  });
});