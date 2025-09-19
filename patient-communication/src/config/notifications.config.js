/**
 * Notifications Configuration
 * Configuration for the notification system
 */

module.exports = {
  // Notification channels
  channels: {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    IN_APP: 'in_app'
  },

  // Notification types
  types: {
    APPOINTMENT_REMINDER: 'appointment_reminder',
    MEDICATION_REMINDER: 'medication_reminder',
    HEALTH_ALERT: 'health_alert',
    EDUCATION_RECOMMENDATION: 'education_recommendation',
    DOCUMENT_AVAILABLE: 'document_available',
    MESSAGE_RECEIVED: 'message_received',
    SYSTEM_UPDATE: 'system_update',
    SECURITY_ALERT: 'security_alert'
  },

  // Notification priorities
  priorities: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
  },

  // Delivery settings
  delivery: {
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
    batchSize: 100,
    rateLimit: 1000 // notifications per hour
  },

  // Email settings
  email: {
    enabled: true,
    provider: 'smtp', // or 'sendgrid', 'mailgun', etc.
    fromAddress: 'noreply@medisync.health',
    templateDir: './templates/email',
    maxAttachments: 5,
    maxAttachmentSize: 10 * 1024 * 1024 // 10MB
  },

  // SMS settings
  sms: {
    enabled: true,
    provider: 'twilio', // or 'nexmo', 'plivo', etc.
    fromNumber: '+1234567890',
    maxMessageLength: 160,
    unicodeSupport: true
  },

  // Push notification settings
  push: {
    enabled: true,
    providers: {
      FCM: { // Firebase Cloud Messaging
        enabled: true,
        serverKey: process.env.FCM_SERVER_KEY
      },
      APNS: { // Apple Push Notification Service
        enabled: true,
        keyId: process.env.APNS_KEY_ID,
        teamId: process.env.APNS_TEAM_ID,
        bundleId: process.env.APNS_BUNDLE_ID
      }
    },
    maxPayloadSize: 4096 // 4KB
  },

  // In-app notification settings
  inApp: {
    enabled: true,
    maxNotificationsPerUser: 1000,
    retentionPeriod: 90, // days
    enableRichContent: true
  },

  // Scheduling settings
  scheduling: {
    enabled: true,
    defaultTimezone: 'UTC',
    maxFutureScheduling: 365, // days
    enableRecurring: true
  },

  // Templates
  templates: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ru', 'ar'],
    enableCustomTemplates: true
  },

  // Preferences
  preferences: {
    defaultChannel: 'email',
    enableChannelFallback: true,
    requireExplicitConsent: true,
    enableGlobalOptOut: true
  },

  // Security settings
  security: {
    encryptContent: true,
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