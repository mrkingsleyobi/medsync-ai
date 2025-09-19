/**
 * Speech Service Tests
 * Tests for the speech service
 */

const SpeechService = require('../../src/services/speech.service.js');

// Mock file system operations
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn()
  }
}));

describe('Speech Service', () => {
  let speechService;

  beforeEach(() => {
    speechService = new SpeechService();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('speechToText', () => {
    test('should convert audio buffer to text', async () => {
      const audioBuffer = Buffer.from('fake audio data');

      const result = await speechService.speechToText(audioBuffer, 'en');

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.transcription).toContain('[en]');
      expect(result.confidence).toBe(0.95);
      expect(result.language).toBe('en');
    });

    test('should convert audio file to text', async () => {
      const audioFilePath = '/path/to/audio/file.wav';
      const mockAudioBuffer = Buffer.from('fake audio data');

      // Mock fs.readFile to return our fake audio buffer
      require('fs').promises.readFile.mockResolvedValue(mockAudioBuffer);

      const result = await speechService.speechToText(audioFilePath, 'es');

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.transcription).toContain('[es]');
      expect(result.language).toBe('es');
      expect(require('fs').promises.readFile).toHaveBeenCalledWith(audioFilePath);
    });

    test('should throw an error for missing audio data', async () => {
      await expect(speechService.speechToText(null))
        .rejects
        .toThrow('Audio data is required');
    });

    test('should throw an error for unsupported language', async () => {
      const audioBuffer = Buffer.from('fake audio data');
      const unsupportedLanguage = 'xyz';

      await expect(speechService.speechToText(audioBuffer, unsupportedLanguage))
        .rejects
        .toThrow('Unsupported language: xyz');
    });

    test('should use default language when none provided', async () => {
      const audioBuffer = Buffer.from('fake audio data');

      const result = await speechService.speechToText(audioBuffer);

      expect(result).toBeDefined();
      expect(result.language).toBe('en'); // Assuming default language is 'en'
    });
  });

  describe('processMedicalJournalEntry', () => {
    test('should process medical journal entry from audio buffer', async () => {
      const audioBuffer = Buffer.from('fake audio data');
      const context = { patientId: '123', visitId: '456' };

      const result = await speechService.processMedicalJournalEntry(audioBuffer, 'en', context);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.transcription).toContain('[en]');
      expect(result.processedEntry).toBeDefined();
      expect(result.context).toEqual(context);
    });

    test('should throw an error for missing audio data', async () => {
      await expect(speechService.processMedicalJournalEntry(null))
        .rejects
        .toThrow('Audio data is required');
    });
  });

  describe('getSupportedLanguages', () => {
    test('should return supported languages mapping', () => {
      const result = speechService.getSupportedLanguages();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });
  });

  describe('isLanguageSupported', () => {
    test('should return true for supported language', () => {
      const result = speechService.isLanguageSupported('en');

      expect(result).toBe(true);
    });

    test('should return false for unsupported language', () => {
      const result = speechService.isLanguageSupported('xyz');

      expect(result).toBe(false);
    });
  });

  describe('saveAudioFile', () => {
    test('should save audio file', async () => {
      const audioBuffer = Buffer.from('fake audio data');
      const filename = 'test-audio.wav';

      // Mock fs.mkdir and fs.writeFile to resolve successfully
      require('fs').promises.mkdir.mockResolvedValue(undefined);
      require('fs').promises.writeFile.mockResolvedValue(undefined);

      const result = await speechService.saveAudioFile(audioBuffer, filename);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(require('fs').promises.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('storage/audio'),
        { recursive: true }
      );
      expect(require('fs').promises.writeFile).toHaveBeenCalled();
    });
  });

  describe('saveTranscription', () => {
    test('should save transcription', async () => {
      const transcriptionResult = {
        transcription: 'Test transcription',
        confidence: 0.95,
        language: 'en'
      };
      const filename = 'test-transcription.json';

      // Mock fs.mkdir and fs.writeFile to resolve successfully
      require('fs').promises.mkdir.mockResolvedValue(undefined);
      require('fs').promises.writeFile.mockResolvedValue(undefined);

      const result = await speechService.saveTranscription(transcriptionResult, filename);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(require('fs').promises.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('storage/transcriptions'),
        { recursive: true }
      );
      expect(require('fs').promises.writeFile).toHaveBeenCalled();
    });
  });
});