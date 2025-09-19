/**
 * Preferences Configuration
 * Configuration for the patient preference management system
 */

module.exports = {
  // Preference categories
  categories: {
    COMMUNICATION: 'communication',
    PRIVACY: 'privacy',
    HEALTHCARE: 'healthcare',
    NOTIFICATIONS: 'notifications',
    ACCESSIBILITY: 'accessibility',
    PERSONALIZATION: 'personalization'
  },

  // Communication preferences
  communication: {
    preferredLanguage: {
      key: 'preferredLanguage',
      type: 'string',
      default: 'en',
      supportedValues: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ru', 'ar']
    },
    preferredCommunicationChannel: {
      key: 'preferredCommunicationChannel',
      type: 'string',
      default: 'email',
      supportedValues: ['email', 'sms', 'phone', 'portal']
    },
    communicationFrequency: {
      key: 'communicationFrequency',
      type: 'string',
      default: 'normal',
      supportedValues: ['low', 'normal', 'high']
    },
    receiveEducationalContent: {
      key: 'receiveEducationalContent',
      type: 'boolean',
      default: true
    },
    receiveHealthTips: {
      key: 'receiveHealthTips',
      type: 'boolean',
      default: true
    }
  },

  // Privacy preferences
  privacy: {
    shareDataWithResearchers: {
      key: 'shareDataWithResearchers',
      type: 'boolean',
      default: false
    },
    shareDataWithProviders: {
      key: 'shareDataWithProviders',
      type: 'boolean',
      default: true
    },
    allowDataExport: {
      key: 'allowDataExport',
      type: 'boolean',
      default: true
    },
    profileVisibility: {
      key: 'profileVisibility',
      type: 'string',
      default: 'private',
      supportedValues: ['private', 'connections', 'public']
    }
  },

  // Healthcare preferences
  healthcare: {
    preferredProvider: {
      key: 'preferredProvider',
      type: 'string',
      default: null
    },
    preferredPharmacy: {
      key: 'preferredPharmacy',
      type: 'string',
      default: null
    },
    preferredHospital: {
      key: 'preferredHospital',
      type: 'string',
      default: null
    },
    allowTelehealth: {
      key: 'allowTelehealth',
      type: 'boolean',
      default: true
    },
    appointmentReminders: {
      key: 'appointmentReminders',
      type: 'boolean',
      default: true
    }
  },

  // Notification preferences
  notifications: {
    emailNotifications: {
      key: 'emailNotifications',
      type: 'boolean',
      default: true
    },
    smsNotifications: {
      key: 'smsNotifications',
      type: 'boolean',
      default: false
    },
    pushNotifications: {
      key: 'pushNotifications',
      type: 'boolean',
      default: true
    },
    inAppNotifications: {
      key: 'inAppNotifications',
      type: 'boolean',
      default: true
    },
    doNotDisturb: {
      key: 'doNotDisturb',
      type: 'object',
      default: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    }
  },

  // Accessibility preferences
  accessibility: {
    fontSize: {
      key: 'fontSize',
      type: 'string',
      default: 'medium',
      supportedValues: ['small', 'medium', 'large', 'extra-large']
    },
    highContrast: {
      key: 'highContrast',
      type: 'boolean',
      default: false
    },
    screenReader: {
      key: 'screenReader',
      type: 'boolean',
      default: false
    },
    keyboardNavigation: {
      key: 'keyboardNavigation',
      type: 'boolean',
      default: true
    }
  },

  // Personalization preferences
  personalization: {
    theme: {
      key: 'theme',
      type: 'string',
      default: 'light',
      supportedValues: ['light', 'dark', 'auto']
    },
    dashboardLayout: {
      key: 'dashboardLayout',
      type: 'string',
      default: 'standard',
      supportedValues: ['standard', 'compact', 'detailed']
    },
    showHealthSummary: {
      key: 'showHealthSummary',
      type: 'boolean',
      default: true
    },
    showAppointments: {
      key: 'showAppointments',
      type: 'boolean',
      default: true
    },
    showDocuments: {
      key: 'showDocuments',
      type: 'boolean',
      default: true
    }
  },

  // Storage settings
  storage: {
    encryptPreferences: true,
    backupPreferences: true,
    retentionPeriod: 365 // days
  },

  // Security settings
  security: {
    encryptData: true,
    auditLogging: true,
    validateInput: true
  },

  // Compliance settings
  compliance: {
    hipaaCompliant: true,
    gdprCompliant: true,
    dataRetentionDays: 365
  }
};