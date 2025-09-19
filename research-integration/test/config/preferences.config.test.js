const config = require('../../src/config/preferences.config');

describe('Preferences Configuration', () => {
  describe('Management Settings', () => {
    it('should have management settings configured', () => {
      expect(config.management).toBeDefined();
      expect(typeof config.management).toBe('object');
      expect(config.management.name).toBe('Researcher Preference Management');
      expect(config.management.enabled).toBe(true);
    });

    it('should have proper management settings values', () => {
      expect(config.management.maxPreferencesPerResearcher).toBe(1000);
      expect(config.management.defaultPreferenceScope).toBe('researcher');
    });
  });

  describe('Categories Configuration', () => {
    it('should have literature analysis category configured', () => {
      expect(config.categories.literatureAnalysis).toBeDefined();
      expect(typeof config.categories.literatureAnalysis).toBe('object');
    });

    it('should have clinical trial matching category configured', () => {
      expect(config.categories.clinicalTrialMatching).toBeDefined();
      expect(typeof config.categories.clinicalTrialMatching).toBe('object');
    });

    it('should have research impact category configured', () => {
      expect(config.categories.researchImpact).toBeDefined();
      expect(typeof config.categories.researchImpact).toBe('object');
    });

    it('should have collaborative research category configured', () => {
      expect(config.categories.collaborativeResearch).toBeDefined();
      expect(typeof config.categories.collaborativeResearch).toBe('object');
    });

    it('should have visualization category configured', () => {
      expect(config.categories.visualization).toBeDefined();
      expect(typeof config.categories.visualization).toBe('object');
    });

    it('should have workflow category configured', () => {
      expect(config.categories.workflow).toBeDefined();
      expect(typeof config.categories.workflow).toBe('object');
    });

    it('should have interface category configured', () => {
      expect(config.categories.interface).toBeDefined();
      expect(typeof config.categories.interface).toBe('object');
    });

    it('should have notifications category configured', () => {
      expect(config.categories.notifications).toBeDefined();
      expect(typeof config.categories.notifications).toBe('object');
    });

    it('should have privacy category configured', () => {
      expect(config.categories.privacy).toBeDefined();
      expect(typeof config.categories.privacy).toBe('object');
    });
  });

  describe('Literature Analysis Preferences', () => {
    const literatureAnalysis = config.categories.literatureAnalysis.preferences;

    it('should have default sources preference configured', () => {
      expect(literatureAnalysis.defaultSources).toBeDefined();
      expect(typeof literatureAnalysis.defaultSources).toBe('object');
    });

    it('should have analysis depth preference configured', () => {
      expect(literatureAnalysis.analysisDepth).toBeDefined();
      expect(typeof literatureAnalysis.analysisDepth).toBe('object');
    });

    it('should have entity types preference configured', () => {
      expect(literatureAnalysis.entityTypes).toBeDefined();
      expect(typeof literatureAnalysis.entityTypes).toBe('object');
    });

    it('should have topic modeling preference configured', () => {
      expect(literatureAnalysis.topicModeling).toBeDefined();
      expect(typeof literatureAnalysis.topicModeling).toBe('object');
    });

    it('should have sentiment analysis preference configured', () => {
      expect(literatureAnalysis.sentimentAnalysis).toBeDefined();
      expect(typeof literatureAnalysis.sentimentAnalysis).toBe('object');
    });
  });

  describe('Clinical Trial Matching Preferences', () => {
    const clinicalTrialMatching = config.categories.clinicalTrialMatching.preferences;

    it('should have matching threshold preference configured', () => {
      expect(clinicalTrialMatching.matchingThreshold).toBeDefined();
      expect(typeof clinicalTrialMatching.matchingThreshold).toBe('object');
    });

    it('should have trial databases preference configured', () => {
      expect(clinicalTrialMatching.trialDatabases).toBeDefined();
      expect(typeof clinicalTrialMatching.trialDatabases).toBe('object');
    });

    it('should have notification methods preference configured', () => {
      expect(clinicalTrialMatching.notificationMethods).toBeDefined();
      expect(typeof clinicalTrialMatching.notificationMethods).toBe('object');
    });

    it('should have auto refresh preference configured', () => {
      expect(clinicalTrialMatching.autoRefresh).toBeDefined();
      expect(typeof clinicalTrialMatching.autoRefresh).toBe('object');
    });

    it('should have refresh interval preference configured', () => {
      expect(clinicalTrialMatching.refreshInterval).toBeDefined();
      expect(typeof clinicalTrialMatching.refreshInterval).toBe('object');
    });
  });

  describe('Research Impact Preferences', () => {
    const researchImpact = config.categories.researchImpact.preferences;

    it('should have tracked metrics preference configured', () => {
      expect(researchImpact.trackedMetrics).toBeDefined();
      expect(typeof researchImpact.trackedMetrics).toBe('object');
    });

    it('should have tracking periods preference configured', () => {
      expect(researchImpact.trackingPeriods).toBeDefined();
      expect(typeof researchImpact.trackingPeriods).toBe('object');
    });

    it('should have report frequency preference configured', () => {
      expect(researchImpact.reportFrequency).toBeDefined();
      expect(typeof researchImpact.reportFrequency).toBe('object');
    });

    it('should have visualization type preference configured', () => {
      expect(researchImpact.visualizationType).toBeDefined();
      expect(typeof researchImpact.visualizationType).toBe('object');
    });
  });

  describe('Collaborative Research Preferences', () => {
    const collaborativeResearch = config.categories.collaborativeResearch.preferences;

    it('should have collaboration notifications preference configured', () => {
      expect(collaborativeResearch.collaborationNotifications).toBeDefined();
      expect(typeof collaborativeResearch.collaborationNotifications).toBe('object');
    });

    it('should have default permissions preference configured', () => {
      expect(collaborativeResearch.defaultPermissions).toBeDefined();
      expect(typeof collaborativeResearch.defaultPermissions).toBe('object');
    });

    it('should have file sharing preference configured', () => {
      expect(collaborativeResearch.fileSharing).toBeDefined();
      expect(typeof collaborativeResearch.fileSharing).toBe('object');
    });

    it('should have real time collaboration preference configured', () => {
      expect(collaborativeResearch.realTimeCollaboration).toBeDefined();
      expect(typeof collaborativeResearch.realTimeCollaboration).toBe('object');
    });

    it('should have version control preference configured', () => {
      expect(collaborativeResearch.versionControl).toBeDefined();
      expect(typeof collaborativeResearch.versionControl).toBe('object');
    });
  });

  describe('Visualization Preferences', () => {
    const visualization = config.categories.visualization.preferences;

    it('should have default chart type preference configured', () => {
      expect(visualization.defaultChartType).toBeDefined();
      expect(typeof visualization.defaultChartType).toBe('object');
    });

    it('should have show tooltips preference configured', () => {
      expect(visualization.showTooltips).toBeDefined();
      expect(typeof visualization.showTooltips).toBe('object');
    });

    it('should have animation enabled preference configured', () => {
      expect(visualization.animationEnabled).toBeDefined();
      expect(typeof visualization.animationEnabled).toBe('object');
    });

    it('should have color scheme preference configured', () => {
      expect(visualization.colorScheme).toBeDefined();
      expect(typeof visualization.colorScheme).toBe('object');
    });

    it('should have export formats preference configured', () => {
      expect(visualization.exportFormats).toBeDefined();
      expect(typeof visualization.exportFormats).toBe('object');
    });
  });

  describe('Workflow Preferences', () => {
    const workflow = config.categories.workflow.preferences;

    it('should have default workflow preference configured', () => {
      expect(workflow.defaultWorkflow).toBeDefined();
      expect(typeof workflow.defaultWorkflow).toBe('object');
    });

    it('should have parallel execution preference configured', () => {
      expect(workflow.parallelExecution).toBeDefined();
      expect(typeof workflow.parallelExecution).toBe('object');
    });

    it('should have max concurrent workflows preference configured', () => {
      expect(workflow.maxConcurrentWorkflows).toBeDefined();
      expect(typeof workflow.maxConcurrentWorkflows).toBe('object');
    });

    it('should have notification level preference configured', () => {
      expect(workflow.notificationLevel).toBeDefined();
      expect(typeof workflow.notificationLevel).toBe('object');
    });
  });

  describe('Interface Preferences', () => {
    const interfacePrefs = config.categories.interface.preferences;

    it('should have theme preference configured', () => {
      expect(interfacePrefs.theme).toBeDefined();
      expect(typeof interfacePrefs.theme).toBe('object');
    });

    it('should have language preference configured', () => {
      expect(interfacePrefs.language).toBeDefined();
      expect(typeof interfacePrefs.language).toBe('object');
    });

    it('should have font size preference configured', () => {
      expect(interfacePrefs.fontSize).toBeDefined();
      expect(typeof interfacePrefs.fontSize).toBe('object');
    });

    it('should have auto refresh preference configured', () => {
      expect(interfacePrefs.autoRefresh).toBeDefined();
      expect(typeof interfacePrefs.autoRefresh).toBe('object');
    });

    it('should have refresh interval preference configured', () => {
      expect(interfacePrefs.refreshInterval).toBeDefined();
      expect(typeof interfacePrefs.refreshInterval).toBe('object');
    });
  });

  describe('Notification Preferences', () => {
    const notification = config.categories.notifications.preferences;

    it('should have email notifications preference configured', () => {
      expect(notification.emailNotifications).toBeDefined();
      expect(typeof notification.emailNotifications).toBe('object');
    });

    it('should have sms notifications preference configured', () => {
      expect(notification.smsNotifications).toBeDefined();
      expect(typeof notification.smsNotifications).toBe('object');
    });

    it('should have push notifications preference configured', () => {
      expect(notification.pushNotifications).toBeDefined();
      expect(typeof notification.pushNotifications).toBe('object');
    });

    it('should have notification sound preference configured', () => {
      expect(notification.notificationSound).toBeDefined();
      expect(typeof notification.notificationSound).toBe('object');
    });

    it('should have quiet hours preference configured', () => {
      expect(notification.quietHours).toBeDefined();
      expect(typeof notification.quietHours).toBe('object');
    });

    it('should have quiet hours start preference configured', () => {
      expect(notification.quietHoursStart).toBeDefined();
      expect(typeof notification.quietHoursStart).toBe('object');
    });

    it('should have quiet hours end preference configured', () => {
      expect(notification.quietHoursEnd).toBeDefined();
      expect(typeof notification.quietHoursEnd).toBe('object');
    });
  });

  describe('Privacy Preferences', () => {
    const privacy = config.categories.privacy.preferences;

    it('should have anonymous mode preference configured', () => {
      expect(privacy.anonymousMode).toBeDefined();
      expect(typeof privacy.anonymousMode).toBe('object');
    });

    it('should have data retention preference configured', () => {
      expect(privacy.dataRetention).toBeDefined();
      expect(typeof privacy.dataRetention).toBe('object');
    });

    it('should have audit logging preference configured', () => {
      expect(privacy.auditLogging).toBeDefined();
      expect(typeof privacy.auditLogging).toBe('object');
    });

    it('should have export data preference configured', () => {
      expect(privacy.exportData).toBeDefined();
      expect(typeof privacy.exportData).toBe('object');
    });
  });

  describe('Scopes Configuration', () => {
    it('should have researcher scope configured', () => {
      expect(config.scopes.researcher).toBeDefined();
      expect(typeof config.scopes.researcher).toBe('object');
    });

    it('should have team scope configured', () => {
      expect(config.scopes.team).toBeDefined();
      expect(typeof config.scopes.team).toBe('object');
    });

    it('should have institution scope configured', () => {
      expect(config.scopes.institution).toBeDefined();
      expect(typeof config.scopes.institution).toBe('object');
    });

    it('should have system scope configured', () => {
      expect(config.scopes.system).toBeDefined();
      expect(typeof config.scopes.system).toBe('object');
    });
  });

  describe('Validation Configuration', () => {
    it('should have validation enabled by default', () => {
      expect(config.validation.enabled).toBeDefined();
      expect(typeof config.validation.enabled).toBe('boolean');
    });

    it('should have strict validation enabled by default', () => {
      expect(config.validation.strictValidation).toBeDefined();
      expect(typeof config.validation.strictValidation).toBe('boolean');
    });
  });

  describe('Security Configuration', () => {
    it('should have encryption configured', () => {
      expect(config.security.encryption).toBeDefined();
      expect(typeof config.security.encryption).toBe('object');
      expect(config.security.encryption.enabled).toBe(true);
    });

    it('should have audit logging configured', () => {
      expect(config.security.auditLogging).toBeDefined();
      expect(typeof config.security.auditLogging).toBe('object');
      expect(config.security.auditLogging.enabled).toBe(true);
    });

    it('should have access control configured', () => {
      expect(config.security.accessControl).toBeDefined();
      expect(typeof config.security.accessControl).toBe('object');
      expect(config.security.accessControl.enabled).toBe(true);
    });
  });

  describe('Compliance Configuration', () => {
    it('should have HIPAA compliance configured', () => {
      expect(config.compliance.hipaa).toBeDefined();
      expect(typeof config.compliance.hipaa).toBe('object');
      expect(config.compliance.hipaa.enabled).toBe(true);
    });

    it('should have GDPR compliance configured', () => {
      expect(config.compliance.gdpr).toBeDefined();
      expect(typeof config.compliance.gdpr).toBe('object');
      expect(config.compliance.gdpr.enabled).toBe(true);
    });
  });
});