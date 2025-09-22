/**
 * Speech Controller
 * Controller for handling speech recognition requests
 */

const SpeechService = require('../services/speech.service.js');
const fs = require('fs').promises;
const path = require('path');

class SpeechController {
  constructor() {
    this.speechService = new SpeechService();
  }

  /**
   * Convert speech to text
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async speechToText(req, res) {
    try {
      const { languageCode } = req.body;
      const audioFile = req.file;

      // Validate required fields
      if (!audioFile) {
        return res.status(400).json({
          error: 'Audio file is required'
        });
      }

      // Validate language
      if (languageCode && !this.speechService.isLanguageSupported(languageCode)) {
        return res.status(400).json({
          error: `Unsupported language: ${languageCode}`,
          supportedLanguages: this.speechService.getSupportedLanguages()
        });
      }

      // Read audio file
      const audioBuffer = await fs.readFile(audioFile.path);

      // Convert speech to text
      const transcriptionResult = await this.speechService.speechToText(audioBuffer, languageCode);

      // Clean up temporary file
      await fs.unlink(audioFile.path);

      // Return the transcription result
      res.status(200).json({
        success: true,
        transcription: transcriptionResult.transcription,
        confidence: transcriptionResult.confidence,
        language: transcriptionResult.language,
        audioDuration: transcriptionResult.audioDuration,
        wordCount: transcriptionResult.wordCount
      });
    } catch (error) {
      if (this.speechService && this.speechService.logger) {
        this.speechService.logger.error('Speech to text controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Clean up temporary file if it exists
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Failed to clean up temporary file', {
            error: unlinkError.message
          });
        }
      }

      res.status(500).json({
        error: 'Failed to convert speech to text',
        message: error.message
      });
    }
  }

  /**
   * Process medical journal entry from speech
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async processMedicalJournalEntry(req, res) {
    try {
      const { languageCode, context } = req.body;
      const audioFile = req.file;

      // Validate required fields
      if (!audioFile) {
        return res.status(400).json({
          error: 'Audio file is required'
        });
      }

      // Validate language
      if (languageCode && !this.speechService.isLanguageSupported(languageCode)) {
        return res.status(400).json({
          error: `Unsupported language: ${languageCode}`,
          supportedLanguages: this.speechService.getSupportedLanguages()
        });
      }

      // Read audio file
      const audioBuffer = await fs.readFile(audioFile.path);

      // Process medical journal entry
      const result = await this.speechService.processMedicalJournalEntry(audioBuffer, languageCode, context);

      // Clean up temporary file
      await fs.unlink(audioFile.path);

      // Return the processed result
      res.status(200).json({
        success: true,
        transcription: result.transcription,
        confidence: result.confidence,
        processedEntry: result.processedEntry,
        context: result.context
      });
    } catch (error) {
      if (this.speechService && this.speechService.logger) {
        this.speechService.logger.error('Medical journal entry processing controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Clean up temporary file if it exists
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Failed to clean up temporary file', {
            error: unlinkError.message
          });
        }
      }

      res.status(500).json({
        error: 'Failed to process medical journal entry',
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
      const supportedLanguages = this.speechService.getSupportedLanguages();

      res.status(200).json({
        success: true,
        supportedLanguages: supportedLanguages
      });
    } catch (error) {
      if (this.speechService && this.speechService.logger) {
        this.speechService.logger.error('Get supported languages controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve supported languages',
        message: error.message
      });
    }
  }

  /**
   * Save audio file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async saveAudioFile(req, res) {
    try {
      const audioFile = req.file;

      // Validate required fields
      if (!audioFile) {
        return res.status(400).json({
          error: 'Audio file is required'
        });
      }

      // Read audio file
      const audioBuffer = await fs.readFile(audioFile.path);

      // Generate filename
      const filename = `audio_${Date.now()}.wav`;

      // Save audio file
      const filePath = await this.speechService.saveAudioFile(audioBuffer, filename);

      // Clean up temporary file
      await fs.unlink(audioFile.path);

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Audio file saved successfully',
        filePath: filePath,
        filename: filename
      });
    } catch (error) {
      if (this.speechService && this.speechService.logger) {
        this.speechService.logger.error('Save audio file controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      // Clean up temporary file if it exists
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Failed to clean up temporary file', {
            error: unlinkError.message
          });
        }
      }

      res.status(500).json({
        error: 'Failed to save audio file',
        message: error.message
      });
    }
  }
}

module.exports = SpeechController;