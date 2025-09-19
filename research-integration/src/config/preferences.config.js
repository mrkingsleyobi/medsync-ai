/**
 * Researcher Preference Management Configuration
 * Configuration for researcher preference management system
 */

module.exports = {
  // Preference management settings
  management: {
    name: 'Researcher Preference Management',
    version: '1.0.0',
    description: 'System for managing research integration researcher preferences',
    enabled: true,
    maxPreferencesPerResearcher: 1000,
    defaultPreferenceScope: 'researcher'
  },

  // Preference categories
  categories: {
    literatureAnalysis: {
      name: 'Literature Analysis',
      description: 'Preferences for literature analysis functionality',
      preferences: {
        defaultSources: {
          name: 'Default Sources',
          description: 'Default sources for literature analysis',
          type: 'array',
          defaultValue: ['pubmed', 'ieee', 'nature'],
          options: ['pubmed', 'ieee', 'nature', 'science', 'springer', 'elsevier', 'clinicaltrials']
        },

        analysisDepth: {
          name: 'Analysis Depth',
          description: 'Depth of literature analysis',
          type: 'string',
          defaultValue: 'comprehensive',
          options: ['basic', 'intermediate', 'comprehensive', 'full']
        },

        entityTypes: {
          name: 'Entity Types',
          description: 'Types of entities to extract',
          type: 'array',
          defaultValue: ['disease', 'drug', 'gene', 'protein'],
          options: ['disease', 'drug', 'gene', 'protein', 'symptom', 'treatment', 'diagnosis']
        },

        topicModeling: {
          name: 'Topic Modeling',
          description: 'Enable topic modeling in analysis',
          type: 'boolean',
          defaultValue: true
        },

        sentimentAnalysis: {
          name: 'Sentiment Analysis',
          description: 'Enable sentiment analysis in analysis',
          type: 'boolean',
          defaultValue: true
        }
      }
    },

    clinicalTrialMatching: {
      name: 'Clinical Trial Matching',
      description: 'Preferences for clinical trial matching functionality',
      preferences: {
        matchingThreshold: {
          name: 'Matching Threshold',
          description: 'Minimum threshold for trial matching',
          type: 'number',
          defaultValue: 0.8,
          min: 0.5,
          max: 0.99,
          step: 0.05
        },

        trialDatabases: {
          name: 'Trial Databases',
          description: 'Databases to search for clinical trials',
          type: 'array',
          defaultValue: ['clinicaltrials.gov', 'who.int/trialsearch'],
          options: [
            'clinicaltrials.gov',
            'who.int/trialsearch',
            'euctr.europa.eu',
            'jrct.niph.go.jp',
            'anzctr.org.au'
          ]
        },

        notificationMethods: {
          name: 'Notification Methods',
          description: 'Methods for receiving trial notifications',
          type: 'array',
          defaultValue: ['dashboard', 'email'],
          options: ['dashboard', 'email', 'sms', 'push']
        },

        autoRefresh: {
          name: 'Auto-refresh',
          description: 'Automatically refresh trial matches',
          type: 'boolean',
          defaultValue: true
        },

        refreshInterval: {
          name: 'Refresh Interval',
          description: 'Interval for refreshing trial matches (in minutes)',
          type: 'number',
          defaultValue: 60,
          min: 10,
          max: 1440
        }
      }
    },

    researchImpact: {
      name: 'Research Impact',
      description: 'Preferences for research impact tracking',
      preferences: {
        trackedMetrics: {
          name: 'Tracked Metrics',
          description: 'Metrics to track for research impact',
          type: 'array',
          defaultValue: ['citations', 'downloads', 'socialMediaMentions'],
          options: ['citations', 'downloads', 'socialMediaMentions', 'clinicalAdoption', 'patientOutcomes']
        },

        trackingPeriods: {
          name: 'Tracking Periods',
          description: 'Periods for tracking research impact',
          type: 'array',
          defaultValue: ['shortTerm', 'mediumTerm'],
          options: ['shortTerm', 'mediumTerm', 'longTerm']
        },

        reportFrequency: {
          name: 'Report Frequency',
          description: 'Frequency of impact reports',
          type: 'string',
          defaultValue: 'monthly',
          options: ['weekly', 'monthly', 'quarterly', 'annually']
        },

        visualizationType: {
          name: 'Visualization Type',
          description: 'Type of visualization for impact data',
          type: 'string',
          defaultValue: 'trend',
          options: ['trend', 'comparison', 'distribution']
        }
      }
    },

    collaborativeResearch: {
      name: 'Collaborative Research',
      description: 'Preferences for collaborative research features',
      preferences: {
        collaborationNotifications: {
          name: 'Collaboration Notifications',
          description: 'Enable notifications for collaboration activities',
          type: 'boolean',
          defaultValue: true
        },

        defaultPermissions: {
          name: 'Default Permissions',
          description: 'Default permissions for new collaborators',
          type: 'string',
          defaultValue: 'read',
          options: ['read', 'write', 'admin']
        },

        fileSharing: {
          name: 'File Sharing',
          description: 'Enable file sharing in collaborations',
          type: 'boolean',
          defaultValue: true
        },

        realTimeCollaboration: {
          name: 'Real-time Collaboration',
          description: 'Enable real-time collaborative editing',
          type: 'boolean',
          defaultValue: true
        },

        versionControl: {
          name: 'Version Control',
          description: 'Enable version control for shared documents',
          type: 'boolean',
          defaultValue: true
        }
      }
    },

    visualization: {
      name: 'Visualization',
      description: 'Preferences for research data visualization',
      preferences: {
        defaultChartType: {
          name: 'Default Chart Type',
          description: 'Default chart type for visualizations',
          type: 'string',
          defaultValue: 'line',
          options: ['line', 'bar', 'pie', 'radar', 'network', 'map']
        },

        showTooltips: {
          name: 'Show Tooltips',
          description: 'Display tooltips on visualizations',
          type: 'boolean',
          defaultValue: true
        },

        animationEnabled: {
          name: 'Animation Enabled',
          description: 'Enable animations in visualizations',
          type: 'boolean',
          defaultValue: true
        },

        colorScheme: {
          name: 'Color Scheme',
          description: 'Color scheme for visualizations',
          type: 'string',
          defaultValue: 'default',
          options: ['default', 'high-contrast', 'colorblind-friendly']
        },

        exportFormats: {
          name: 'Export Formats',
          description: 'Preferred formats for exporting visualizations',
          type: 'array',
          defaultValue: ['png', 'pdf'],
          options: ['png', 'jpg', 'pdf', 'svg', 'csv', 'json']
        }
      }
    },

    workflow: {
      name: 'Workflow',
      description: 'Preferences for research workflows',
      preferences: {
        defaultWorkflow: {
          name: 'Default Workflow',
          description: 'Default workflow for research tasks',
          type: 'string',
          defaultValue: 'literatureReview',
          options: [
            'literatureReview',
            'clinicalTrialMatching',
            'researchImpactAnalysis',
            'collaborativeResearch'
          ]
        },

        parallelExecution: {
          name: 'Parallel Execution',
          description: 'Execute workflow steps in parallel',
          type: 'boolean',
          defaultValue: true
        },

        maxConcurrentWorkflows: {
          name: 'Max Concurrent Workflows',
          description: 'Maximum number of concurrent workflows',
          type: 'number',
          defaultValue: 5,
          min: 1,
          max: 20
        },

        notificationLevel: {
          name: 'Notification Level',
          description: 'Level of workflow notifications',
          type: 'string',
          defaultValue: 'summary',
          options: ['none', 'summary', 'detailed', 'all']
        }
      }
    },

    interface: {
      name: 'Interface',
      description: 'Preferences for user interface',
      preferences: {
        theme: {
          name: 'Theme',
          description: 'User interface theme',
          type: 'string',
          defaultValue: 'light',
          options: ['light', 'dark', 'auto']
        },

        language: {
          name: 'Language',
          description: 'Interface language',
          type: 'string',
          defaultValue: 'en',
          options: ['en', 'es', 'fr', 'de', 'zh']
        },

        fontSize: {
          name: 'Font Size',
          description: 'Interface font size',
          type: 'string',
          defaultValue: 'medium',
          options: ['small', 'medium', 'large']
        },

        autoRefresh: {
          name: 'Auto-refresh',
          description: 'Automatically refresh dashboard data',
          type: 'boolean',
          defaultValue: true
        },

        refreshInterval: {
          name: 'Refresh Interval',
          description: 'Dashboard refresh interval (in seconds)',
          type: 'number',
          defaultValue: 30,
          min: 10,
          max: 300
        }
      }
    },

    notifications: {
      name: 'Notifications',
      description: 'Preferences for system notifications',
      preferences: {
        emailNotifications: {
          name: 'Email Notifications',
          description: 'Receive email notifications',
          type: 'boolean',
          defaultValue: true
        },

        smsNotifications: {
          name: 'SMS Notifications',
          description: 'Receive SMS notifications',
          type: 'boolean',
          defaultValue: false
        },

        pushNotifications: {
          name: 'Push Notifications',
          description: 'Receive push notifications',
          type: 'boolean',
          defaultValue: true
        },

        notificationSound: {
          name: 'Notification Sound',
          description: 'Play sound for notifications',
          type: 'boolean',
          defaultValue: true
        },

        quietHours: {
          name: 'Quiet Hours',
          description: 'Enable quiet hours for notifications',
          type: 'boolean',
          defaultValue: false
        },

        quietHoursStart: {
          name: 'Quiet Hours Start',
          description: 'Start time for quiet hours',
          type: 'string',
          defaultValue: '22:00'
        },

        quietHoursEnd: {
          name: 'Quiet Hours End',
          description: 'End time for quiet hours',
          type: 'string',
          defaultValue: '07:00'
        }
      }
    },

    privacy: {
      name: 'Privacy',
      description: 'Preferences for privacy and data handling',
      preferences: {
        anonymousMode: {
          name: 'Anonymous Mode',
          description: 'Hide researcher identifiers in shared data',
          type: 'boolean',
          defaultValue: false
        },

        dataRetention: {
          name: 'Data Retention',
          description: 'Data retention period (in days)',
          type: 'number',
          defaultValue: 365,
          min: 30,
          max: 3650
        },

        auditLogging: {
          name: 'Audit Logging',
          description: 'Enable detailed audit logging',
          type: 'boolean',
          defaultValue: true
        },

        exportData: {
          name: 'Export Data',
          description: 'Allow exporting of personal research data',
          type: 'boolean',
          defaultValue: true
        }
      }
    }
  },

  // Preference scopes
  scopes: {
    researcher: {
      name: 'Researcher',
      description: 'Preferences specific to individual researcher',
      inheritable: false
    },

    team: {
      name: 'Team',
      description: 'Preferences for research team',
      inheritable: true
    },

    institution: {
      name: 'Institution',
      description: 'Preferences for entire institution',
      inheritable: true
    },

    system: {
      name: 'System',
      description: 'System-wide default preferences',
      inheritable: true
    }
  },

  // Preference validation
  validation: {
    enabled: true,
    strictValidation: true,
    logValidationErrors: true
  },

  // Security settings
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM'
    },
    auditLogging: {
      enabled: true,
      retentionDays: 365
    },
    accessControl: {
      enabled: true,
      roleBasedAccess: true
    }
  },

  // Compliance settings
  compliance: {
    hipaa: {
      enabled: true,
      dataEncryption: true,
      auditLogging: true
    },
    gdpr: {
      enabled: true,
      dataProtection: true,
      consentManagement: true
    }
  }
};