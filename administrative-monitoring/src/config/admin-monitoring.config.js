/**
 * Administrative & Monitoring Services Configuration
 * Configuration for administrative and monitoring services
 */

const config = {
  // Documentation system configuration
  documentation: {
    enabled: true,
    outputDir: './docs/generated',
    formats: ['markdown', 'html', 'pdf'],
    updateInterval: 3600000, // 1 hour in milliseconds
    includeServices: ['patient-communication', 'clinical-decision', 'research-integration'],
    templates: {
      api: 'templates/api-documentation.hbs',
      architecture: 'templates/architecture-documentation.hbs',
      userGuide: 'templates/user-guide.hbs'
    }
  },

  // Scheduling service configuration
  scheduling: {
    enabled: true,
    defaultTimezone: 'UTC',
    maxConcurrentTasks: 10,
    taskRetryLimit: 3,
    taskTimeout: 300000, // 5 minutes in milliseconds
    notificationChannels: ['email', 'sms', 'push'],
    calendarIntegration: {
      googleCalendar: false,
      outlookCalendar: false,
      icsExport: true
    }
  },

  // Resource allocation configuration
  resourceAllocation: {
    enabled: true,
    optimizationInterval: 60000, // 1 minute in milliseconds
    cpuThreshold: 80,
    memoryThreshold: 85,
    diskThreshold: 90,
    autoScale: true,
    maxInstances: 20,
    minInstances: 2
  },

  // Billing support configuration
  billing: {
    enabled: true,
    currency: 'USD',
    billingCycle: 'monthly',
    invoiceGenerationDay: 1,
    paymentMethods: ['credit_card', 'bank_transfer', 'paypal'],
    taxCalculation: true,
    lateFeePercentage: 1.5,
    dunningProcess: true
  },

  // Monitoring dashboard configuration
  monitoring: {
    enabled: true,
    refreshInterval: 5000, // 5 seconds in milliseconds
    retentionPeriod: 2592000000, // 30 days in milliseconds
    alertThresholds: {
      cpu: 85,
      memory: 85,
      disk: 90,
      network: 95,
      responseTime: 2000, // milliseconds
      errorRate: 5 // percentage
    },
    metrics: {
      system: true,
      application: true,
      database: true,
      aiModels: true,
      userActivity: true
    }
  },

  // Performance analytics configuration
  analytics: {
    enabled: true,
    collectionInterval: 300000, // 5 minutes in milliseconds
    retentionPeriod: 31536000000, // 1 year in milliseconds
    reporting: {
      daily: true,
      weekly: true,
      monthly: true,
      custom: true
    },
    metrics: {
      responseTime: true,
      throughput: true,
      errorRate: true,
      userSatisfaction: true,
      aiAccuracy: true,
      resourceUtilization: true
    }
  },

  // Usage reporting configuration
  usageReporting: {
    enabled: true,
    reportFormats: ['csv', 'json', 'pdf'],
    schedule: '0 0 * * 1', // Weekly on Monday at midnight
    retentionPeriod: 31536000000, // 1 year in milliseconds
    include: {
      userActivity: true,
      resourceUsage: true,
      featureAdoption: true,
      aiModelUsage: true
    }
  },

  // Alerting and notification configuration
  alerting: {
    enabled: true,
    notificationMethods: ['email', 'sms', 'push', 'webhook'],
    escalationPolicy: {
      level1: { time: 5, channels: ['email'] }, // 5 minutes
      level2: { time: 15, channels: ['email', 'sms'] }, // 15 minutes
      level3: { time: 30, channels: ['email', 'sms', 'push'] } // 30 minutes
    },
    alertCategories: {
      critical: { priority: 1, requiresAcknowledgment: true },
      high: { priority: 2, requiresAcknowledgment: true },
      medium: { priority: 3, requiresAcknowledgment: false },
      low: { priority: 4, requiresAcknowledgment: false }
    },
    suppression: {
      enabled: true,
      window: 3600000, // 1 hour in milliseconds
      maxAlerts: 10
    }
  },

  // Security and compliance
  security: {
    auditLogging: true,
    dataEncryption: true,
    accessControl: true,
    compliance: {
      hipaa: true,
      gdpr: true,
      sox: false
    }
  },

  // Integration settings
  integrations: {
    slack: {
      enabled: false,
      webhookUrl: null
    },
    pagerDuty: {
      enabled: false,
      apiKey: null
    },
    datadog: {
      enabled: false,
      apiKey: null
    }
  }
};

module.exports = config;