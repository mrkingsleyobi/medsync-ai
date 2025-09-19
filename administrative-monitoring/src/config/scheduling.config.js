/**
 * Scheduling Service Configuration
 * Configuration for the intelligent scheduling service
 */

const config = {
  // Scheduling service settings
  service: {
    enabled: true,
    timezone: 'UTC',
    maxConcurrentTasks: 10,
    taskRetryLimit: 3,
    taskTimeout: 300000, // 5 minutes in milliseconds
    defaultPriority: 'medium'
  },

  // Task scheduling settings
  tasks: {
    // Documentation generation schedule
    documentationGeneration: {
      enabled: true,
      schedule: '0 1 * * *', // Daily at 1 AM
      timezone: 'UTC',
      priority: 'low'
    },

    // Resource optimization schedule
    resourceOptimization: {
      enabled: true,
      schedule: '*/30 * * * *', // Every 30 minutes
      timezone: 'UTC',
      priority: 'high'
    },

    // Analytics data collection schedule
    analyticsCollection: {
      enabled: true,
      schedule: '*/5 * * * *', // Every 5 minutes
      timezone: 'UTC',
      priority: 'medium'
    },

    // Usage reporting schedule
    usageReporting: {
      enabled: true,
      schedule: '0 0 * * 1', // Weekly on Monday at midnight
      timezone: 'UTC',
      priority: 'medium'
    },

    // System backup schedule
    systemBackup: {
      enabled: true,
      schedule: '0 2 * * 0', // Weekly on Sunday at 2 AM
      timezone: 'UTC',
      priority: 'high'
    }
  },

  // Calendar integration settings
  calendar: {
    googleCalendar: {
      enabled: false,
      clientId: null,
      clientSecret: null,
      redirectUri: null
    },
    outlookCalendar: {
      enabled: false,
      clientId: null,
      clientSecret: null,
      redirectUri: null
    },
    icsExport: {
      enabled: true,
      fileName: 'medisync-schedule.ics'
    }
  },

  // Notification settings
  notifications: {
    enabled: true,
    channels: ['email', 'sms', 'push'],
    reminderTime: 3600000, // 1 hour before task execution
    failureAlerts: true
  },

  // Security settings
  security: {
    auditLogging: true,
    taskEncryption: true,
    accessControl: true
  }
};

module.exports = config;