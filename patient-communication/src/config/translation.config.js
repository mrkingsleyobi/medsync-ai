/**
 * Translation Configuration
 * Configuration for the multi-lingual support system
 */

module.exports = {
  // Supported languages
  supportedLanguages: {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ru': 'Russian',
    'ar': 'Arabic'
  },

  // Default language
  defaultLanguage: 'en',

  // Translation service settings
  translationService: {
    provider: 'google', // or 'microsoft', 'amazon'
    timeout: 30000, // 30 seconds
    retries: 3,
    rateLimit: 100 // requests per minute
  },

  // Healthcare-specific translation settings
  healthcareTranslation: {
    preserveMedicalTerms: true,
    useMedicalGlossaries: true,
    contextAwareTranslation: true,
    maintainMedicalAccuracy: true
  },

  // Text-to-speech settings
  textToSpeech: {
    enabled: true,
    defaultVoice: 'female',
    supportedVoices: ['male', 'female'],
    speakingRate: 1.0,
    pitch: 0.0
  },

  // Speech-to-text settings
  speechToText: {
    enabled: true,
    languageDetection: true,
    profanityFilter: true,
    enableAutomaticPunctuation: true
  },

  // Processing settings
  processing: {
    batchSize: 1000, // Process text in 1000-character chunks
    preserveFormatting: true,
    maintainContext: true
  },

  // Security settings
  security: {
    sanitizeInput: true,
    validateOutput: true,
    auditLogging: true
  },

  // Compliance settings
  compliance: {
    hipaaCompliant: true,
    gdprCompliant: true,
    dataRetentionDays: 30
  }
};