const config = require('../../src/config/visualization.config');

describe('Visualization Configuration', () => {
  describe('Engine Configuration', () => {
    it('should have engine name configured', () => {
      expect(config.engine.name).toBeDefined();
      expect(typeof config.engine.name).toBe('string');
      expect(config.engine.name).toBe('Research Visualization Engine');
    });

    it('should have engine version configured', () => {
      expect(config.engine.version).toBeDefined();
      expect(typeof config.engine.version).toBe('string');
    });

    it('should have max concurrent visualizations configured', () => {
      expect(config.engine.maxConcurrentVisualizations).toBeDefined();
      expect(typeof config.engine.maxConcurrentVisualizations).toBe('number');
      expect(config.engine.maxConcurrentVisualizations).toBeGreaterThan(0);
    });

    it('should have timeout configured', () => {
      expect(config.engine.timeout).toBeDefined();
      expect(typeof config.engine.timeout).toBe('number');
      expect(config.engine.timeout).toBeGreaterThan(0);
    });
  });

  describe('Chart Types Configuration', () => {
    it('should have citation network chart type configured', () => {
      expect(config.chartTypes.citationNetwork).toBeDefined();
      expect(typeof config.chartTypes.citationNetwork).toBe('object');
    });

    it('should have research trends chart type configured', () => {
      expect(config.chartTypes.researchTrends).toBeDefined();
      expect(typeof config.chartTypes.researchTrends).toBe('object');
    });

    it('should have collaboration map chart type configured', () => {
      expect(config.chartTypes.collaborationMap).toBeDefined();
      expect(typeof config.chartTypes.collaborationMap).toBe('object');
    });

    it('should have impact metrics chart type configured', () => {
      expect(config.chartTypes.impactMetrics).toBeDefined();
      expect(typeof config.chartTypes.impactMetrics).toBe('object');
    });

    it('should have trial matching results chart type configured', () => {
      expect(config.chartTypes.trialMatchingResults).toBeDefined();
      expect(typeof config.chartTypes.trialMatchingResults).toBe('object');
    });

    it('should have literature analysis chart type configured', () => {
      expect(config.chartTypes.literatureAnalysis).toBeDefined();
      expect(typeof config.chartTypes.literatureAnalysis).toBe('object');
    });

    it('should have research project timeline chart type configured', () => {
      expect(config.chartTypes.researchProjectTimeline).toBeDefined();
      expect(typeof config.chartTypes.researchProjectTimeline).toBe('object');
    });

    it('should have researcher network chart type configured', () => {
      expect(config.chartTypes.researcherNetwork).toBeDefined();
      expect(typeof config.chartTypes.researcherNetwork).toBe('object');
    });
  });

  describe('Components Configuration', () => {
    it('should have citation network visualization component configured', () => {
      expect(config.components.citationNetwork).toBeDefined();
      expect(typeof config.components.citationNetwork).toBe('object');
    });

    it('should have research trends visualization component configured', () => {
      expect(config.components.researchTrends).toBeDefined();
      expect(typeof config.components.researchTrends).toBe('object');
    });

    it('should have collaboration map visualization component configured', () => {
      expect(config.components.collaborationMap).toBeDefined();
      expect(typeof config.components.collaborationMap).toBe('object');
    });

    it('should have impact metrics visualization component configured', () => {
      expect(config.components.impactMetrics).toBeDefined();
      expect(typeof config.components.impactMetrics).toBe('object');
    });

    it('should have trial matching results visualization component configured', () => {
      expect(config.components.trialMatchingResults).toBeDefined();
      expect(typeof config.components.trialMatchingResults).toBe('object');
    });

    it('should have literature entities visualization component configured', () => {
      expect(config.components.literatureEntities).toBeDefined();
      expect(typeof config.components.literatureEntities).toBe('object');
    });

    it('should have literature topics visualization component configured', () => {
      expect(config.components.literatureTopics).toBeDefined();
      expect(typeof config.components.literatureTopics).toBe('object');
    });

    it('should have literature sentiment visualization component configured', () => {
      expect(config.components.literatureSentiment).toBeDefined();
      expect(typeof config.components.literatureSentiment).toBe('object');
    });
  });

  describe('Color Schemes Configuration', () => {
    it('should have citation network color scheme configured', () => {
      expect(config.colorSchemes.citationNetwork).toBeDefined();
      expect(typeof config.colorSchemes.citationNetwork).toBe('object');
    });

    it('should have research trends color scheme configured', () => {
      expect(config.colorSchemes.researchTrends).toBeDefined();
      expect(typeof config.colorSchemes.researchTrends).toBe('object');
    });

    it('should have collaboration map color scheme configured', () => {
      expect(config.colorSchemes.collaborationMap).toBeDefined();
      expect(typeof config.colorSchemes.collaborationMap).toBe('object');
    });

    it('should have impact metrics color scheme configured', () => {
      expect(config.colorSchemes.impactMetrics).toBeDefined();
      expect(typeof config.colorSchemes.impactMetrics).toBe('object');
    });

    it('should have trial matching color scheme configured', () => {
      expect(config.colorSchemes.trialMatching).toBeDefined();
      expect(typeof config.colorSchemes.trialMatching).toBe('object');
    });

    it('should have literature analysis color scheme configured', () => {
      expect(config.colorSchemes.literatureAnalysis).toBeDefined();
      expect(typeof config.colorSchemes.literatureAnalysis).toBe('object');
    });

    it('should have default color scheme configured', () => {
      expect(config.colorSchemes.default).toBeDefined();
      expect(typeof config.colorSchemes.default).toBe('object');
    });
  });

  describe('Chart Settings Configuration', () => {
    it('should have responsive setting configured', () => {
      expect(config.chartSettings.responsive).toBeDefined();
      expect(typeof config.chartSettings.responsive).toBe('boolean');
    });

    it('should have animations setting configured', () => {
      expect(config.chartSettings.animations).toBeDefined();
      expect(typeof config.chartSettings.animations).toBe('boolean');
    });

    it('should have show tooltips setting configured', () => {
      expect(config.chartSettings.showTooltips).toBeDefined();
      expect(typeof config.chartSettings.showTooltips).toBe('boolean');
    });

    it('should have show legend setting configured', () => {
      expect(config.chartSettings.showLegend).toBeDefined();
      expect(typeof config.chartSettings.showLegend).toBe('boolean');
    });

    it('should have font size setting configured', () => {
      expect(config.chartSettings.fontSize).toBeDefined();
      expect(typeof config.chartSettings.fontSize).toBe('number');
    });
  });

  describe('Export Configuration', () => {
    it('should have export enabled by default', () => {
      expect(config.export.enabled).toBeDefined();
      expect(typeof config.export.enabled).toBe('boolean');
    });

    it('should have export formats configured', () => {
      expect(config.export.formats).toBeDefined();
      expect(Array.isArray(config.export.formats)).toBe(true);
      expect(config.export.formats.length).toBeGreaterThan(0);
    });

    it('should have export quality configured', () => {
      expect(config.export.quality).toBeDefined();
      expect(typeof config.export.quality).toBe('string');
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