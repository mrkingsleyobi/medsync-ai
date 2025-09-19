/**
 * Document Simplification Controller Tests
 * Tests for the document simplification controller
 */

const DocumentSimplificationController = require('../../src/controllers/document-simplification.controller.js');

// Mock the DocumentSimplificationService
jest.mock('../../src/services/document-simplification.service.js');

describe('Document Simplification Controller', () => {
  let documentSimplificationController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    documentSimplificationController = new DocumentSimplificationController();
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

  describe('simplifyDocument', () => {
    test('should simplify a medical document', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const level = 'basic';
      const simplifiedText = 'The patient had a heart attack.';

      mockReq.body = { documentText, level };

      // Mock the service method
      documentSimplificationController.documentSimplificationService.simplifyDocument.mockResolvedValue(simplifiedText);

      await documentSimplificationController.simplifyDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        originalLength: documentText.length,
        simplifiedLength: simplifiedText.length,
        level: level,
        simplifiedText: simplifiedText
      });
    });

    test('should return 400 if document text is missing', async () => {
      mockReq.body = {};

      await documentSimplificationController.simplifyDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Document text is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const errorMessage = 'Service error';

      mockReq.body = { documentText };

      // Mock the service method to throw an error
      documentSimplificationController.documentSimplificationService.simplifyDocument.mockRejectedValue(new Error(errorMessage));

      await documentSimplificationController.simplifyDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to simplify document',
        message: errorMessage
      });
    });
  });

  describe('analyzeComplexity', () => {
    test('should analyze document complexity', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const complexity = {
        wordCount: 7,
        sentenceCount: 1,
        avgWordsPerSentence: 7,
        complexTermCount: 1,
        estimatedReadingLevel: 12
      };

      mockReq.body = { documentText };

      // Mock the service method
      documentSimplificationController.documentSimplificationService.analyzeComplexity.mockReturnValue(complexity);

      await documentSimplificationController.analyzeComplexity(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        complexity: complexity
      });
    });

    test('should return 400 if document text is missing', async () => {
      mockReq.body = {};

      await documentSimplificationController.analyzeComplexity(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Document text is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const documentText = 'The patient was diagnosed with myocardial infarction.';
      const errorMessage = 'Service error';

      mockReq.body = { documentText };

      // Mock the service method to throw an error
      documentSimplificationController.documentSimplificationService.analyzeComplexity.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await documentSimplificationController.analyzeComplexity(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to analyze document complexity',
        message: errorMessage
      });
    });
  });

  describe('getAvailableLevels', () => {
    test('should return available simplification levels', () => {
      const levels = {
        BASIC: 'basic',
        INTERMEDIATE: 'intermediate',
        ADVANCED: 'advanced'
      };

      // Mock the service property
      documentSimplificationController.documentSimplificationService.simplificationLevels = levels;

      documentSimplificationController.getAvailableLevels(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        levels: Object.values(levels)
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service property to throw an error
      Object.defineProperty(documentSimplificationController.documentSimplificationService, 'simplificationLevels', {
        get: () => {
          throw new Error(errorMessage);
        }
      });

      documentSimplificationController.getAvailableLevels(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve simplification levels',
        message: errorMessage
      });
    });
  });
});