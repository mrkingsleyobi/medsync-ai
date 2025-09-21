/**
 * Document Simplification Service
 * Service for simplifying medical documents for patient understanding
 */

const config = require('../config/document-simplification.config.js');
const { JSDOM } = require('jsdom');
const winston = require('winston');

class DocumentSimplificationService {
  constructor() {
    this.config = config;
    this.medicalTerms = config.medicalTerms;
    this.simplificationLevels = config.simplificationLevels;
    this.logger = this._createLogger();
  }

  /**
   * Create logger instance
   * @returns {Object} Winston logger instance
   */
  _createLogger() {
    // In test environment, use a simple console logger to avoid fs issues
    if (process.env.NODE_ENV === 'test') {
      return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
          })
        ),
        defaultMeta: { service: 'document-simplification-service' },
        transports: [
          new winston.transports.Console()
        ]
      });
    }

    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'document-simplification-service' },
      transports: [
        new winston.transports.File({ filename: 'logs/document-simplification-service-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/document-simplification-service-combined.log' })
      ]
    });
  }

  /**
   * Simplify a medical document
   * @param {string} documentText - The medical document text to simplify
   * @param {string} level - The simplification level (basic, intermediate, advanced)
   * @returns {Promise<string>} Simplified document text
   */
  async simplifyDocument(documentText, level = 'basic') {
    try {
      // Validate input
      if (!documentText || typeof documentText !== 'string') {
        throw new Error('Invalid document text provided');
      }

      // Validate simplification level
      if (!this.simplificationLevels[level.toUpperCase()]) {
        throw new Error(`Invalid simplification level: ${level}`);
      }

      if (this.logger) {
        this.logger.info('Simplifying document', {
          originalLength: documentText.length,
          level: level
        });
      } else {
        console.log('Simplifying document', {
          originalLength: documentText.length,
          level: level
        });
      }

      // Process the document
      let simplifiedText = documentText;

      // 1. Replace complex medical terms with simpler ones
      simplifiedText = this.replaceMedicalTerms(simplifiedText);

      // 2. Simplify sentence structure
      simplifiedText = this.simplifySentenceStructure(simplifiedText);

      // 3. Adjust reading level based on requested level
      simplifiedText = this.adjustReadingLevel(simplifiedText, level);

      // 4. Format for better readability
      simplifiedText = this.formatForReadability(simplifiedText);

      if (this.logger) {
        this.logger.info('Document simplification completed', {
          originalLength: documentText.length,
          simplifiedLength: simplifiedText.length,
          level: level
        });
      } else {
        console.log('Document simplification completed', {
          originalLength: documentText.length,
          simplifiedLength: simplifiedText.length,
          level: level
        });
      }

      return simplifiedText;
    } catch (error) {
      if (this.logger) {
        this.logger.error('Document simplification failed', {
          error: error.message,
          documentLength: documentText ? documentText.length : 0
        });
      } else {
        console.error('Document simplification failed', {
          error: error.message,
          documentLength: documentText ? documentText.length : 0
        });
      }
      throw error;
    }
  }

  /**
   * Replace complex medical terms with simpler alternatives
   * @param {string} text - Text to process
   * @returns {string} Text with simplified medical terms
   */
  replaceMedicalTerms(text) {
    let processedText = text;

    // Replace medical terms using the mapping
    for (const [complexTerm, simpleTerm] of Object.entries(this.medicalTerms)) {
      const regex = new RegExp(`\\b${complexTerm}\\b`, 'gi');
      processedText = processedText.replace(regex, simpleTerm);
    }

    return processedText;
  }

  /**
   * Simplify sentence structure
   * @param {string} text - Text to process
   * @returns {string} Text with simplified sentence structure
   */
  simplifySentenceStructure(text) {
    // Split text into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);

    const simplifiedSentences = sentences.map(sentence => {
      // Break up long sentences
      if (sentence.split(' ').length > this.config.sentenceComplexity.maxWordsPerSentence) {
        return this.breakUpLongSentence(sentence);
      }
      return sentence;
    });

    return simplifiedSentences.join(' ');
  }

  /**
   * Break up long sentences into shorter ones
   * @param {string} sentence - Long sentence to break up
   * @returns {string} Shorter sentences
   */
  breakUpLongSentence(sentence) {
    const words = sentence.split(' ');
    const chunks = [];

    for (let i = 0; i < words.length; i += this.config.sentenceComplexity.preferredSentenceLength) {
      const chunk = words.slice(i, i + this.config.sentenceComplexity.preferredSentenceLength);
      chunks.push(chunk.join(' '));
    }

    return chunks.join('. ') + '.';
  }

  /**
   * Adjust reading level based on requested level
   * @param {string} text - Text to process
   * @param {string} level - Target reading level
   * @returns {string} Text adjusted to reading level
   */
  adjustReadingLevel(text, level) {
    // For now, we'll just return the text as-is
    // In a full implementation, this would use NLP libraries to adjust complexity
    return text;
  }

  /**
   * Format text for better readability
   * @param {string} text - Text to format
   * @returns {string} Formatted text
   */
  formatForReadability(text) {
    // Add line breaks for better readability
    let formattedText = text.replace(/([.!?])\s+/g, '$1\n\n');

    // Add bullet points for lists
    if (this.config.formatting.useBulletPoints) {
      formattedText = this.addBulletPoints(formattedText);
    }

    return formattedText;
  }

  /**
   * Add bullet points to lists in text
   * @param {string} text - Text to process
   * @returns {string} Text with bullet points
   */
  addBulletPoints(text) {
    // Simple implementation - in a full implementation, this would use NLP
    // to detect lists and add bullet points
    return text;
  }

  /**
   * Analyze document complexity
   * @param {string} documentText - Document to analyze
   * @returns {Object} Complexity metrics
   */
  analyzeComplexity(documentText) {
    // Handle empty document
    if (!documentText || documentText.trim() === '') {
      return {
        wordCount: 0,
        sentenceCount: 0,
        avgWordsPerSentence: NaN,
        complexTermCount: 0,
        estimatedReadingLevel: 5 // Minimum reading level
      };
    }

    const words = documentText.trim() !== '' ? documentText.trim().split(/\s+/) : [];
    const sentences = documentText.split(/(?<=[.!?])\s+/).filter(s => s.trim() !== '');

    // Handle case where there are no sentences
    const sentenceCount = sentences.length || 1;
    const wordCount = words.length;

    // Calculate average words per sentence
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

    // Count complex medical terms
    let complexTermCount = 0;
    if (documentText) {
      for (const complexTerm of Object.keys(this.medicalTerms)) {
        const regex = new RegExp(`\\b${complexTerm}\\b`, 'gi');
        const matches = documentText.match(regex);
        if (matches) {
          complexTermCount += matches.length;
        }
      }
    }

    return {
      wordCount: wordCount,
      sentenceCount: sentenceCount,
      avgWordsPerSentence: sentenceCount > 0 ? Math.round(avgWordsPerSentence * 100) / 100 : 0,
      complexTermCount: complexTermCount,
      estimatedReadingLevel: this.estimateReadingLevel(sentenceCount > 0 ? avgWordsPerSentence : 0)
    };
  }

  /**
   * Estimate reading level based on average words per sentence
   * @param {number} avgWordsPerSentence - Average words per sentence
   * @returns {number} Estimated reading level (grade)
   */
  estimateReadingLevel(avgWordsPerSentence) {
    // Simple estimation - more complex algorithms would be used in production
    if (avgWordsPerSentence <= 10) return 5;  // 5th grade
    if (avgWordsPerSentence <= 15) return 8;  // 8th grade
    if (avgWordsPerSentence <= 20) return 10; // 10th grade
    return 12; // 12th grade or higher
  }
}

module.exports = DocumentSimplificationService;