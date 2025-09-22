/**
 * Preferences Configuration
 * Configuration for user and system preferences
 */

module.exports = {
  // Preference categories
  categories: {
    literatureAnalysis: {
      name: 'Literature Analysis',
      description: 'Settings for literature analysis and research discovery',
      preferences: {
        defaultSources: {
          name: 'Default Sources',
          description: 'Default research sources to include in analysis',
          type: 'array',
          options: ['PubMed', 'arXiv', 'IEEE Xplore', 'ACM Digital Library', 'SpringerLink'],
          defaultValue: ['PubMed', 'arXiv'],
          required: true
        },
        analysisDepth: {
          name: 'Analysis Depth',
          description: 'Depth of analysis for each document',
          type: 'string',
          options: ['basic', 'standard', 'comprehensive'],
          defaultValue: 'standard',
          required: true
        },
        entityTypes: {
          name: 'Entity Types',
          description: 'Types of entities to extract from literature',
          type: 'array',
          options: ['PERSON', 'ORG', 'GPE', 'DATE', 'MONEY'],
          defaultValue: ['PERSON', 'ORG', 'GPE'],
          required: true
        },
        topicModeling: {
          name: 'Topic Modeling',
          description: 'Enable topic modeling analysis',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        sentimentAnalysis: {
          name: 'Sentiment Analysis',
          description: 'Enable sentiment analysis',
          type: 'boolean',
          defaultValue: true,
          required: true
        }
      }
    },
    clinicalTrialMatching: {
      name: 'Clinical Trial Matching',
      description: 'Settings for clinical trial matching',
      preferences: {
        matchingThreshold: {
          name: 'Matching Threshold',
          description: 'Minimum confidence threshold for trial matches',
          type: 'number',
          min: 0,
          max: 1,
          defaultValue: 0.7,
          required: true
        },
        trialDatabases: {
          name: 'Trial Databases',
          description: 'Clinical trial databases to search',
          type: 'array',
          options: ['clinicaltrials.gov', 'euclinicaltrials.eu'],
          defaultValue: ['clinicaltrials.gov'],
          required: true
        },
        notificationMethods: {
          name: 'Notification Methods',
          description: 'Methods for sending trial match notifications',
          type: 'array',
          options: ['email', 'sms', 'push'],
          defaultValue: ['email'],
          required: true
        },
        autoRefresh: {
          name: 'Auto Refresh',
          description: 'Automatically refresh trial data',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        refreshInterval: {
          name: 'Refresh Interval',
          description: 'Refresh interval in minutes',
          type: 'number',
          min: 5,
          max: 1440,
          defaultValue: 60,
          required: true
        }
      }
    },
    researchImpact: {
      name: 'Research Impact',
      description: 'Settings for research impact analysis',
      preferences: {
        trackedMetrics: {
          name: 'Tracked Metrics',
          description: 'Impact metrics to track',
          type: 'array',
          options: ['citations', 'downloads', 'social_mentions', 'usage_statistics'],
          defaultValue: ['citations', 'downloads'],
          required: true
        },
        trackingPeriods: {
          name: 'Tracking Periods',
          description: 'Time periods for impact tracking',
          type: 'array',
          options: ['30_days', '90_days', '1_year', 'all_time'],
          defaultValue: ['30_days', '90_days', '1_year'],
          required: true
        },
        reportFrequency: {
          name: 'Report Frequency',
          description: 'Frequency of impact reports',
          type: 'string',
          options: ['daily', 'weekly', 'monthly'],
          defaultValue: 'weekly',
          required: true
        },
        visualizationType: {
          name: 'Visualization Type',
          description: 'Type of visualization for impact data',
          type: 'string',
          options: ['dashboard', 'chart', 'table'],
          defaultValue: 'dashboard',
          required: true
        }
      }
    },
    collaborativeResearch: {
      name: 'Collaborative Research',
      description: 'Settings for research collaboration features',
      preferences: {
        collaborationNotifications: {
          name: 'Collaboration Notifications',
          description: 'Enable collaboration notifications',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        defaultPermissions: {
          name: 'Default Permissions',
          description: 'Default permissions for new collaborations',
          type: 'string',
          options: ['read', 'write', 'admin'],
          defaultValue: 'read',
          required: true
        },
        fileSharing: {
          name: 'File Sharing',
          description: 'Enable file sharing in collaborations',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        realTimeCollaboration: {
          name: 'Real-time Collaboration',
          description: 'Enable real-time collaboration features',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        versionControl: {
          name: 'Version Control',
          description: 'Enable version control for shared documents',
          type: 'boolean',
          defaultValue: true,
          required: true
        }
      }
    },
    visualization: {
      name: 'Visualization',
      description: 'Settings for data visualization',
      preferences: {
        defaultChartType: {
          name: 'Default Chart Type',
          description: 'Default chart type for visualizations',
          type: 'string',
          options: ['bar', 'line', 'pie', 'scatter', 'heatmap'],
          defaultValue: 'bar',
          required: true
        },
        showTooltips: {
          name: 'Show Tooltips',
          description: 'Show tooltips on hover',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        animationEnabled: {
          name: 'Animation Enabled',
          description: 'Enable chart animations',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        colorScheme: {
          name: 'Color Scheme',
          description: 'Default color scheme',
          type: 'string',
          options: ['default', 'medical', 'research'],
          defaultValue: 'default',
          required: true
        },
        exportFormats: {
          name: 'Export Formats',
          description: 'Preferred export formats',
          type: 'array',
          options: ['png', 'svg', 'pdf', 'json'],
          defaultValue: ['png', 'pdf'],
          required: true
        }
      }
    },
    notification: {
      name: 'Notifications',
      description: 'System notification preferences',
      preferences: {
        emailNotifications: {
          name: 'Email Notifications',
          description: 'Enable/disable email notifications',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        smsNotifications: {
          name: 'SMS Notifications',
          description: 'Enable/disable SMS notifications',
          type: 'boolean',
          defaultValue: false,
          required: true
        },
        pushNotifications: {
          name: 'Push Notifications',
          description: 'Enable/disable push notifications',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        notificationSound: {
          name: 'Notification Sound',
          description: 'Enable notification sounds',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        quietHours: {
          name: 'Quiet Hours',
          description: 'Enable quiet hours for notifications',
          type: 'boolean',
          defaultValue: false,
          required: true
        },
        quietHoursStart: {
          name: 'Quiet Hours Start',
          description: 'Start time for quiet hours',
          type: 'string',
          defaultValue: '22:00',
          required: true
        },
        quietHoursEnd: {
          name: 'Quiet Hours End',
          description: 'End time for quiet hours',
          type: 'string',
          defaultValue: '08:00',
          required: true
        }
      }
    },
    workflow: {
      name: 'Workflow',
      description: 'Workflow execution preferences',
      preferences: {
        defaultWorkflow: {
          name: 'Default Workflow',
          description: 'Default workflow to use for new projects',
          type: 'object',
          defaultValue: {
            type: 'literatureReview',
            version: '1.0'
          },
          required: true
        },
        parallelExecution: {
          name: 'Parallel Execution',
          description: 'Enable parallel execution of workflow steps',
          type: 'object',
          defaultValue: {
            enabled: true,
            maxParallelSteps: 5
          },
          required: true
        },
        maxConcurrentWorkflows: {
          name: 'Maximum Concurrent Workflows',
          description: 'Maximum number of workflows that can run concurrently',
          type: 'object',
          defaultValue: {
            limit: 10,
            autoScale: true
          },
          required: true
        },
        notificationLevel: {
          name: 'Notification Level',
          description: 'Level of notifications for workflow execution',
          type: 'object',
          defaultValue: {
            level: 'important',
            includeErrors: true,
            includeCompletions: false
          },
          required: true
        }
      }
    },
    interface: {
      name: 'Interface',
      description: 'User interface preferences',
      preferences: {
        theme: {
          name: 'Theme',
          description: 'User interface theme',
          type: 'string',
          options: ['light', 'dark', 'auto'],
          defaultValue: 'auto',
          required: true
        },
        language: {
          name: 'Language',
          description: 'Interface language',
          type: 'string',
          options: ['en', 'es', 'fr', 'de', 'zh'],
          defaultValue: 'en',
          required: true
        },
        fontSize: {
          name: 'Font Size',
          description: 'Interface font size',
          type: 'string',
          options: ['small', 'medium', 'large'],
          defaultValue: 'medium',
          required: true
        },
        autoRefresh: {
          name: 'Auto Refresh',
          description: 'Automatically refresh data',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        refreshInterval: {
          name: 'Refresh Interval',
          description: 'Data refresh interval in seconds',
          type: 'number',
          min: 30,
          max: 300,
          defaultValue: 60,
          required: true
        }
      }
    },
    privacy: {
      name: 'Privacy',
      description: 'Privacy and data protection preferences',
      preferences: {
        anonymousMode: {
          name: 'Anonymous Mode',
          description: 'Enable anonymous mode for research activities',
          type: 'boolean',
          defaultValue: false,
          required: true
        },
        dataRetention: {
          name: 'Data Retention',
          description: 'Data retention period',
          type: 'string',
          options: ['30_days', '90_days', '1_year', 'indefinite'],
          defaultValue: '1_year',
          required: true
        },
        auditLogging: {
          name: 'Audit Logging',
          description: 'Enable detailed audit logging',
          type: 'boolean',
          defaultValue: true,
          required: true
        },
        exportData: {
          name: 'Export Data',
          description: 'Allow data export',
          type: 'boolean',
          defaultValue: true,
          required: true
        }
      }
    }
  },

  // Preference scopes
  scopes: {
    system: {
      name: 'System',
      description: 'System-wide default preferences',
      editable: false
    },
    team: {
      name: 'Team',
      description: 'Team-level preferences',
      editable: true
    },
    user: {
      name: 'User',
      description: 'Individual user preferences',
      editable: true
    },
    project: {
      name: 'Project',
      description: 'Project-specific preferences',
      editable: true
    },
    researcher: {
      name: 'Researcher',
      description: 'Researcher-specific preferences',
      editable: true
    },
    institution: {
      name: 'Institution',
      description: 'Institution-level preferences',
      editable: true
    }
  },

  // Validation configuration
  validation: {
    enabled: true,
    strictValidation: true,
    maxPreferenceStringLength: 1000,
    maxPreferenceArrayLength: 100,
    maxPreferenceObjectDepth: 5
  }
};
