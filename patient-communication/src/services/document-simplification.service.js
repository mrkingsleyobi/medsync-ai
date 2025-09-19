/**
 * Document Simplification Service
 * Service for simplifying medical documents for patient understanding
 */

const config = require('../config/document-simplification.config.js');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

class DocumentSimplificationService {
  constructor() {
    this.config = config;
    this.medicalTerms = config.medicalTerms;
    this.simplificationLevels = config.simplificationLevels;
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

      console.log('Simplifying document', {
        originalLength: documentText.length,
        level: level
      });

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

      console.log('Document simplification completed', {
        originalLength: documentText.length,
        simplifiedLength: simplifiedText.length,
        level: level
      });

      return simplifiedText;
    } catch (error) {
      console.error('Document simplification failed', {
        error: error.message,
        documentLength: documentText ? documentText.length : 0
      });
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
    const words = documentText.split(/\s+/);
    const sentences = documentText.split(/(?<=[.!?])\s+/);

    // Calculate average words per sentence
    const avgWordsPerSentence = words.length / sentences.length;

    // Count complex medical terms
    let complexTermCount = 0;
    for (const complexTerm of Object.keys(this.medicalTerms)) {
      const regex = new RegExp(`\\b${complexTerm}\\b`, 'gi');
      const matches = documentText.match(regex);
      if (matches) {
        complexTermCount += matches.length;
      }
    }

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 100) / 100,
      complexTermCount: complexTermCount,
      estimatedReadingLevel: this.estimateReadingLevel(avgWordsPerSentence)
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