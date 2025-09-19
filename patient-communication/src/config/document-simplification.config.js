/**
 * Document Simplification Configuration
 * Configuration for the medical document simplification system
 */

module.exports = {
  // Simplification levels
  simplificationLevels: {
    BASIC: 'basic',        // 5th grade reading level
    INTERMEDIATE: 'intermediate', // 8th grade reading level
    ADVANCED: 'advanced'   // 10th grade reading level
  },

  // Reading level targets
  readingLevels: {
    basic: 5,
    intermediate: 8,
    advanced: 10
  },

  // Healthcare terminology mapping
  medicalTerms: {
    // Common medical terms and their simplified versions
    'myocardial infarction': 'heart attack',
    'hypertension': 'high blood pressure',
    'hyperlipidemia': 'high cholesterol',
    'diabetes mellitus': 'diabetes',
    'cerebrovascular accident': 'stroke',
    'congestive heart failure': 'weak heart',
    'chronic obstructive pulmonary disease': 'lung disease',
    'gastroesophageal reflux disease': 'acid reflux',
    'deep vein thrombosis': 'blood clot in leg',
    'atrial fibrillation': 'irregular heartbeat'
  },

  // Sentence complexity rules
  sentenceComplexity: {
    maxWordsPerSentence: 20,
    maxClausesPerSentence: 2,
    preferredSentenceLength: 15
  },

  // Paragraph structure
  paragraphStructure: {
    maxSentencesPerParagraph: 5,
    preferredParagraphLength: 3
  },

  // Formatting options
  formatting: {
    useBulletPoints: true,
    useShortParagraphs: true,
    highlightKeyTerms: true,
    preserveMedicalAccuracy: true
  },

  // Processing settings
  processing: {
    chunkSize: 1000, // Process documents in 1000-character chunks
    preserveFormatting: true,
    maintainContext: true
  },

  // API settings
  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
    rateLimit: 100 // requests per minute
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