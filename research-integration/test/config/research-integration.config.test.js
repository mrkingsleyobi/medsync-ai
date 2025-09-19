const config = require('../../src/config/research-integration.config');

describe('Research Integration Configuration', () => {
  describe('Integration Settings', () => {
    it('should have integration settings configured', () => {
      expect(config.integration).toBeDefined();
      expect(typeof config.integration).toBe('object');
      expect(config.integration.name).toBe('Research Integration Service');
      expect(config.integration.enabled).toBe(true);
    });

    it('should have proper integration settings values', () => {
      expect(config.integration.maxConcurrentResearchTasks).toBe(50);
      expect(config.integration.timeout).toBe(60000);
    });
  });

  describe('Literature Analysis Settings', () => {
    it('should have literature analysis settings configured', () => {
      expect(config.literatureAnalysis).toBeDefined();
      expect(typeof config.literatureAnalysis).toBe('object');
      expect(config.literatureAnalysis.enabled).toBe(true);
    });

    it('should have proper literature analysis model settings', () => {
      expect(config.literatureAnalysis.analysisModels).toBeDefined();
      expect(typeof config.literatureAnalysis.analysisModels).toBe('object');
      expect(config.literatureAnalysis.analysisModels.entityExtraction).toBe('medical-entity-extractor-v1');
    });
  });

  describe('Clinical Trial Matching Settings', () => {
    it('should have clinical trial matching settings configured', () => {
      expect(config.clinicalTrialMatching).toBeDefined();
      expect(typeof config.clinicalTrialMatching).toBe('object');
      expect(config.clinicalTrialMatching.enabled).toBe(true);
    });

    it('should have proper trial matching threshold', () => {
      expect(config.clinicalTrialMatching.matchingThreshold).toBe(0.8);
    });

    it('should have trial databases configured', () => {
      expect(Array.isArray(config.clinicalTrialMatching.trialDatabases)).toBe(true);
      expect(config.clinicalTrialMatching.trialDatabases.length).toBeGreaterThan(0);
    });
  });

  describe('Research Impact Settings', () => {
    it('should have research impact settings configured', () => {
      expect(config.researchImpact).toBeDefined();
      expect(typeof config.researchImpact).toBe('object');
      expect(config.researchImpact.enabled).toBe(true);
    });

    it('should have metrics tracking configured', () => {
      expect(config.researchImpact.metrics).toBeDefined();
      expect(typeof config.researchImpact.metrics).toBe('object');
      expect(config.researchImpact.metrics.citations).toBe(true);
    });
  });

  describe('Collaborative Research Settings', () => {
    it('should have collaborative research settings configured', () => {
      expect(config.collaborativeResearch).toBeDefined();
      expect(typeof config.collaborativeResearch).toBe('object');
      expect(config.collaborativeResearch.enabled).toBe(true);
    });

    it('should have file sharing settings configured', () => {
      expect(config.collaborativeResearch.fileSharing).toBeDefined();
      expect(typeof config.collaborativeResearch.fileSharing).toBe('object');
    });

    it('should have real-time collaboration settings configured', () => {
      expect(config.collaborativeResearch.realTimeCollaboration).toBeDefined();
      expect(typeof config.collaborativeResearch.realTimeCollaboration).toBe('object');
      expect(config.collaborativeResearch.realTimeCollaboration.enabled).toBe(true);
    });
  });

  describe('Workflow Settings', () => {
    it('should have workflow settings configured', () => {
      expect(config.workflows).toBeDefined();
      expect(typeof config.workflows).toBe('object');
      expect(config.workflows.enabled).toBe(true);
    });

    it('should have workflow types defined', () => {
      expect(config.workflows.workflowTypes).toBeDefined();
      expect(typeof config.workflows.workflowTypes).toBe('object');
    });
  });

  describe('Visualization Settings', () => {
    it('should have visualization settings configured', () => {
      expect(config.visualization).toBeDefined();
      expect(typeof config.visualization).toBe('object');
      expect(config.visualization.enabled).toBe(true);
    });

    it('should have chart types configured', () => {
      expect(Array.isArray(config.visualization.chartTypes)).toBe(true);
      expect(config.visualization.chartTypes.length).toBeGreaterThan(0);
    });
  });

  describe('Preference Settings', () => {
    it('should have preference settings configured', () => {
      expect(config.preferences).toBeDefined();
      expect(typeof config.preferences).toBe('object');
      expect(config.preferences.enabled).toBe(true);
    });

    it('should have preference categories configured', () => {
      expect(Array.isArray(config.preferences.preferenceCategories)).toBe(true);
      expect(config.preferences.preferenceCategories.length).toBeGreaterThan(0);
    });
  });

  describe('Security Settings', () => {
    it('should have security settings configured', () => {
      expect(config.security).toBeDefined();
      expect(typeof config.security).toBe('object');
    });

    it('should have encryption enabled', () => {
      expect(config.security.encryption.enabled).toBe(true);
      expect(config.security.encryption.algorithm).toBe('AES-256-GCM');
    });

    it('should have audit logging configured', () => {
      expect(config.security.auditLogging.enabled).toBe(true);
      expect(config.security.auditLogging.retentionDays).toBe(365);
    });
  });

  describe('Compliance Settings', () => {
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