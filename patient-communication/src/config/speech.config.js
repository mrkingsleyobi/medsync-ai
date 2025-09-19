/**
 * Speech Configuration
 * Configuration for the voice-to-text medical journaling system
 */

module.exports = {
  // Speech recognition settings
  speechRecognition: {
    enabled: true,
    defaultLanguage: 'en-US',
    supportedLanguages: {
      'en-US': 'English (United States)',
      'en-GB': 'English (United Kingdom)',
      'es-ES': 'Spanish (Spain)',
      'es-MX': 'Spanish (Mexico)',
      'fr-FR': 'French (France)',
      'de-DE': 'German (Germany)',
      'it-IT': 'Italian (Italy)',
      'pt-BR': 'Portuguese (Brazil)',
      'zh-CN': 'Chinese (Mandarin, China)',
      'ja-JP': 'Japanese (Japan)',
      'ko-KR': 'Korean (Korea)'
    },
    timeout: 30000, // 30 seconds
    retries: 3,
    rateLimit: 100 // requests per minute
  },

  // Audio processing settings
  audioProcessing: {
    sampleRate: 16000, // Hz
    channels: 1, // mono
    bitDepth: 16, // bits
    encoding: 'LINEAR16', // linear PCM
    maxAudioDuration: 300 // seconds (5 minutes)
  },

  // Medical journaling settings
  medicalJournaling: {
    enableMedicalTermRecognition: true,
    useMedicalVocabulary: true,
    contextAwareProcessing: true,
    preserveMedicalAccuracy: true,
    enableSymptomDetection: true,
    enableMedicationDetection: true,
    enableAllergyDetection: true
  },

  // Text processing settings
  textProcessing: {
    enableAutomaticPunctuation: true,
    enableProfanityFilter: true,
    enableWordTimeOffsets: true,
    enableSpeakerDiarization: false,
    maxAlternatives: 3
  },

  // Storage settings
  storage: {
    audioStorage: true,
    textStorage: true,
    transcriptionStorage: true,
    enableCompression: true,
    retentionPeriod: 30 // days
  },

  // Security settings
  security: {
    encryptAudio: true,
    encryptTranscriptions: true,
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