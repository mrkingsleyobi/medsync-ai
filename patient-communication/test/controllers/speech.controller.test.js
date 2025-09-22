/**
 * Speech Controller Tests
 * Tests for the speech controller
 */

const SpeechController = require('../../src/controllers/speech.controller.js');

// Mock the SpeechService
jest.mock('../../src/services/speech.service.js');

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    unlink: jest.fn()
  }
}));

// Mock Date.now to return a fixed timestamp for predictable filenames
const originalDateNow = Date.now;
Date.now = jest.fn(() => 1234567890);

describe('Speech Controller', () => {
  let speechController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    speechController = new SpeechController();
    mockReq = {
      body: {},
      params: {},
      query: {},
      file: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('speechToText', () => {
    test('should convert speech to text', async () => {
      const languageCode = 'en';
      const audioFile = { path: '/tmp/audio.wav' };
      const audioBuffer = Buffer.from('fake audio data');
      const transcriptionResult = {
        transcription: 'Hello, how are you?',
        confidence: 0.95,
        language: 'en',
        audioDuration: 3,
        wordCount: 4
      };

      mockReq.body = { languageCode };
      mockReq.file = audioFile;

      // Mock the service methods and fs
      require('fs').promises.readFile.mockResolvedValue(audioBuffer);
      speechController.speechService.isLanguageSupported.mockReturnValue(true);
      speechController.speechService.speechToText.mockResolvedValue(transcriptionResult);

      await speechController.speechToText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        transcription: transcriptionResult.transcription,
        confidence: transcriptionResult.confidence,
        language: transcriptionResult.language,
        audioDuration: transcriptionResult.audioDuration,
        wordCount: transcriptionResult.wordCount
      });
    });

    test('should return 400 if audio file is missing', async () => {
      mockReq.body = { languageCode: 'en' };

      await speechController.speechToText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Audio file is required'
      });
    });

    test('should return 400 if language is not supported', async () => {
      const audioFile = { path: '/tmp/audio.wav' };
      const languageCode = 'xyz';
      const supportedLanguages = { en: 'English', es: 'Spanish' };

      mockReq.body = { languageCode };
      mockReq.file = audioFile;

      // Mock the service methods
      speechController.speechService.isLanguageSupported.mockReturnValue(false);
      speechController.speechService.getSupportedLanguages.mockReturnValue(supportedLanguages);

      await speechController.speechToText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: `Unsupported language: ${languageCode}`,
        supportedLanguages: supportedLanguages
      });
    });

    test('should return 500 if service throws an error', async () => {
      const audioFile = { path: '/tmp/audio.wav' };
      const errorMessage = 'Service error';

      mockReq.file = audioFile;

      // Mock the service methods and fs
      require('fs').promises.readFile.mockResolvedValue(Buffer.from('fake audio data'));
      speechController.speechService.speechToText.mockRejectedValue(new Error(errorMessage));

      await speechController.speechToText(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to convert speech to text',
        message: errorMessage
      });
    });

    test('should clean up temporary file if service throws an error', async () => {
      const audioFile = { path: '/tmp/audio.wav' };
      const errorMessage = 'Service error';

      mockReq.file = audioFile;

      // Mock the service methods and fs
      require('fs').promises.readFile.mockResolvedValue(Buffer.from('fake audio data'));
      speechController.speechService.speechToText.mockRejectedValue(new Error(errorMessage));

      await speechController.speechToText(mockReq, mockRes);

      expect(require('fs').promises.unlink).toHaveBeenCalledWith(audioFile.path);
    });
  });

  describe('processMedicalJournalEntry', () => {
    test('should process medical journal entry from speech', async () => {
      const languageCode = 'en';
      const context = { patientId: '123' };
      const audioFile = { path: '/tmp/audio.wav' };
      const audioBuffer = Buffer.from('fake audio data');
      const result = {
        transcription: 'Patient reports feeling well today.',
        confidence: 0.95,
        processedEntry: { symptoms: ['feeling well'] },
        context: context
      };

      mockReq.body = { languageCode, context };
      mockReq.file = audioFile;

      // Mock the service methods and fs
      require('fs').promises.readFile.mockResolvedValue(audioBuffer);
      speechController.speechService.isLanguageSupported.mockReturnValue(true);
      speechController.speechService.processMedicalJournalEntry.mockResolvedValue(result);

      await speechController.processMedicalJournalEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        transcription: result.transcription,
        confidence: result.confidence,
        processedEntry: result.processedEntry,
        context: result.context
      });
    });

    test('should return 400 if audio file is missing', async () => {
      mockReq.body = { languageCode: 'en' };

      await speechController.processMedicalJournalEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Audio file is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const audioFile = { path: '/tmp/audio.wav' };
      const errorMessage = 'Service error';

      mockReq.file = audioFile;

      // Mock the service methods and fs
      require('fs').promises.readFile.mockResolvedValue(Buffer.from('fake audio data'));
      speechController.speechService.processMedicalJournalEntry.mockRejectedValue(new Error(errorMessage));

      await speechController.processMedicalJournalEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to process medical journal entry',
        message: errorMessage
      });
    });
  });

  describe('getSupportedLanguages', () => {
    test('should return supported languages', () => {
      const supportedLanguages = { en: 'English', es: 'Spanish', fr: 'French' };

      // Mock the service method
      speechController.speechService.getSupportedLanguages.mockReturnValue(supportedLanguages);

      speechController.getSupportedLanguages(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        supportedLanguages: supportedLanguages
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      speechController.speechService.getSupportedLanguages.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      speechController.getSupportedLanguages(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve supported languages',
        message: errorMessage
      });
    });
  });

  describe('saveAudioFile', () => {
    test('should save audio file', async () => {
      const audioFile = { path: '/tmp/audio.wav' };
      const audioBuffer = Buffer.from('fake audio data');
      const filePath = '/storage/audio/audio_1234567890.wav';
      const filename = 'audio_1234567890.wav';

      mockReq.file = audioFile;

      // Mock the service methods and fs
      require('fs').promises.readFile.mockResolvedValue(audioBuffer);
      speechController.speechService.saveAudioFile.mockResolvedValue(filePath);

      await speechController.saveAudioFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Audio file saved successfully',
        filePath: filePath,
        filename: filename
      });
    });

    test('should return 400 if audio file is missing', async () => {
      await speechController.saveAudioFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Audio file is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const audioFile = { path: '/tmp/audio.wav' };
      const errorMessage = 'Service error';

      mockReq.file = audioFile;

      // Mock the service methods and fs
      require('fs').promises.readFile.mockResolvedValue(Buffer.from('fake audio data'));
      speechController.speechService.saveAudioFile.mockRejectedValue(new Error(errorMessage));

      await speechController.saveAudioFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to save audio file',
        message: errorMessage
      });
    });
  });
});