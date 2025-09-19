/**
 * Speech Service
 * Service for voice-to-text medical journaling
 */

const config = require('../config/speech.config.js');
const fs = require('fs').promises;
const path = require('path');

class SpeechService {
  constructor() {
    this.config = config;
    this.supportedLanguages = config.speechRecognition.supportedLanguages;
    this.defaultLanguage = config.speechRecognition.defaultLanguage;
  }

  /**
   * Convert speech to text
   * @param {Buffer|String} audioData - Audio data (buffer or file path)
   * @param {string} languageCode - Language code for speech recognition
   * @returns {Promise<Object>} Transcription result
   */
  async speechToText(audioData, languageCode = null) {
    try {
      // Validate input
      if (!audioData) {
        throw new Error('Audio data is required');
      }

      // Validate language
      if (languageCode && !this.supportedLanguages[languageCode]) {
        throw new Error(`Unsupported language: ${languageCode}`);
      }

      const language = languageCode || this.defaultLanguage;

      console.log('Converting speech to text', {
        language: language,
        audioType: typeof audioData
      });

      // Process audio data
      let audioBuffer;
      if (typeof audioData === 'string') {
        // If audioData is a file path, read the file
        audioBuffer = await fs.readFile(audioData);
      } else {
        // If audioData is already a buffer, use it directly
        audioBuffer = audioData;
      }

      // In a real implementation, this would call a speech recognition API
      // For now, we'll simulate the transcription
      const transcriptionResult = this.simulateSpeechToText(audioBuffer, language);

      console.log('Speech to text conversion completed', {
        audioLength: audioBuffer.length,
        transcriptionLength: transcriptionResult.transcription.length,
        language: language
      });

      return transcriptionResult;
    } catch (error) {
      console.error('Speech to text conversion failed', {
        error: error.message,
        audioType: typeof audioData
      });
      throw error;
    }
  }

  /**
   * Simulate speech to text conversion (for demonstration purposes)
   * @param {Buffer} audioBuffer - Audio data buffer
   * @param {string} language - Language code
   * @returns {Object} Simulated transcription result
   */
  simulateSpeechToText(audioBuffer, language) {
    // In a real implementation, this would call a speech recognition API
    // For demonstration, we'll create a simulated result
    const audioDuration = Math.round(audioBuffer.length / 10000); // Simulate duration based on buffer size

    return {
      transcription: `[${language}] Simulated transcription of medical journal entry. Patient reports feeling well today. No new symptoms noted. Medications taken as prescribed.`,
      confidence: 0.95,
      language: language,
      audioDuration: audioDuration,
      wordCount: 25,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process medical journal entry from speech
   * @param {Buffer|String} audioData - Audio data (buffer or file path)
   * @param {string} languageCode - Language code for speech recognition
   * @param {Object} context - Medical context for processing
   * @returns {Promise<Object>} Processed medical journal entry
   */
  async processMedicalJournalEntry(audioData, languageCode = null, context = {}) {
    try {
      // Validate input
      if (!audioData) {
        throw new Error('Audio data is required');
      }

      // Convert speech to text
      const transcriptionResult = await this.speechToText(audioData, languageCode);

      // Process the transcription for medical content
      const processedEntry = this.processMedicalContent(transcriptionResult.transcription, context);

      console.log('Medical journal entry processing completed', {
        transcriptionLength: transcriptionResult.transcription.length,
        processedEntry: processedEntry
      });

      return {
        ...transcriptionResult,
        processedEntry: processedEntry,
        context: context
      };
    } catch (error) {
      console.error('Medical journal entry processing failed', {
        error: error.message,
        audioType: typeof audioData
      });
      throw error;
    }
  }

  /**
   * Process medical content from transcription
   * @param {string} transcription - Transcribed text
   * @param {Object} context - Medical context
   * @returns {Object} Processed medical content
   */
  processMedicalContent(transcription, context) {
    // In a real implementation, this would use NLP to extract medical entities
    // For demonstration, we'll create a simulated result
    return {
      symptoms: ['feeling well'],
      medications: ['prescribed medications'],
      allergies: [],
      vitalSigns: {},
      notes: transcription,
      entities: [
        { type: 'CONDITION', text: 'feeling well', confidence: 0.9 },
        { type: 'MEDICATION', text: 'medications', confidence: 0.8 }
      ]
    };
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
   * Save audio file
   * @param {Buffer} audioBuffer - Audio data buffer
   * @param {string} filename - Filename for the audio file
   * @returns {Promise<string>} Path to saved audio file
   */
  async saveAudioFile(audioBuffer, filename) {
    try {
      // Create audio directory if it doesn't exist
      const audioDir = path.join(__dirname, '..', '..', 'storage', 'audio');
      await fs.mkdir(audioDir, { recursive: true });

      // Generate file path
      const filePath = path.join(audioDir, filename);

      // Save audio file
      await fs.writeFile(filePath, audioBuffer);

      console.log('Audio file saved', {
        filePath: filePath,
        fileSize: audioBuffer.length
      });

      return filePath;
    } catch (error) {
      console.error('Failed to save audio file', {
        error: error.message,
        filename: filename
      });
      throw error;
    }
  }

  /**
   * Save transcription
   * @param {Object} transcriptionResult - Transcription result
   * @param {string} filename - Filename for the transcription
   * @returns {Promise<string>} Path to saved transcription file
   */
  async saveTranscription(transcriptionResult, filename) {
    try {
      // Create transcription directory if it doesn't exist
      const transcriptionDir = path.join(__dirname, '..', '..', 'storage', 'transcriptions');
      await fs.mkdir(transcriptionDir, { recursive: true });

      // Generate file path
      const filePath = path.join(transcriptionDir, filename);

      // Save transcription file
      await fs.writeFile(filePath, JSON.stringify(transcriptionResult, null, 2));

      console.log('Transcription saved', {
        filePath: filePath
      });

      return filePath;
    } catch (error) {
      console.error('Failed to save transcription', {
        error: error.message,
        filename: filename
      });
      throw error;
    }
  }
}

module.exports = SpeechService;