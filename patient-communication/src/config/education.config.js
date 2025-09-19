/**
 * Education Configuration
 * Configuration for the personalized health education system
 */

module.exports = {
  // Education content settings
  content: {
    supportedFormats: ['text', 'html', 'pdf', 'video'],
    defaultFormat: 'html',
    maxContentLength: 1000000, // 1MB
    enableMultimedia: true,
    enableInteractiveContent: true
  },

  // Personalization settings
  personalization: {
    enableConditionBasedContent: true,
    enableMedicationBasedContent: true,
    enableAllergyBasedContent: true,
    enableAgeBasedContent: true,
    enableGenderBasedContent: true,
    enableRiskBasedContent: true,
    enablePreferenceBasedContent: true
  },

  // Content categories
  categories: {
    PREVENTIVE_CARE: 'preventive_care',
    CHRONIC_CONDITIONS: 'chronic_conditions',
    MEDICATION_MANAGEMENT: 'medication_management',
    NUTRITION_AND_EXERCISE: 'nutrition_and_exercise',
    MENTAL_HEALTH: 'mental_health',
    PROCEDURES_AND_TESTS: 'procedures_and_tests',
    SYMPTOM_MANAGEMENT: 'symptom_management',
    EMERGENCY_CARE: 'emergency_care'
  },

  // Education delivery settings
  delivery: {
    enablePushNotifications: true,
    enableEmailDelivery: true,
    enableInAppDelivery: true,
    deliverySchedule: 'adaptive', // or 'fixed'
    maxDailyDeliveries: 5,
    enableContentReminders: true
  },

  // Assessment and feedback settings
  assessment: {
    enableKnowledgeChecks: true,
    enableProgressTracking: true,
    enableFeedbackCollection: true,
    enableGamification: true,
    enableRewards: true
  },

  // Content recommendation settings
  recommendations: {
    enableAIRecommendations: true,
    enableCollaborativeFiltering: true,
    enableContentBasedFiltering: true,
    enableHybridApproach: true,
    maxRecommendations: 10
  },

  // Storage settings
  storage: {
    contentStorage: true,
    userProgressStorage: true,
    assessmentStorage: true,
    feedbackStorage: true,
    enableCompression: true,
    retentionPeriod: 365 // days
  },

  // Security settings
  security: {
    encryptContent: true,
    encryptUserProgress: true,
    sanitizeInput: true,
    validateOutput: true,
    auditLogging: true
  },

  // Compliance settings
  compliance: {
    hipaaCompliant: true,
    gdprCompliant: true,
    dataRetentionDays: 365
  }
};