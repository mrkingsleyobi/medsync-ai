/**
 * Researcher Preference Service Tests
 * Tests for the researcher preference service
 */

const ResearcherPreferenceService = require('../../src/preferences/researcher-preference.service.js');

describe('Researcher Preference Service', () => {
  let researcherPreferenceService;

  beforeEach(() => {
    researcherPreferenceService = new ResearcherPreferenceService();
  });

  describe('getResearcherPreferences', () => {
    test('should retrieve researcher preferences correctly', () => {
      const researcherId = 'RES-12345';
      const preferences = researcherPreferenceService.getResearcherPreferences(researcherId);

      expect(preferences).toBeDefined();
      expect(preferences.researcherId).toBe('system'); // Default system preferences
      expect(preferences.preferences).toBeDefined();
    });

    test('should throw an error for missing researcher ID', () => {
      expect(() => researcherPreferenceService.getResearcherPreferences(null))
        .toThrow('Researcher ID is required');
    });
  });

  describe('setResearcherPreference', () => {
    test('should set a researcher preference correctly', () => {
      const researcherId = 'RES-12345';
      const category = 'literatureAnalysis';
      const preferenceKey = 'analysisDepth';
      const value = 'comprehensive';

      const preferences = researcherPreferenceService.setResearcherPreference(
        researcherId,
        category,
        preferenceKey,
        value
      );

      expect(preferences).toBeDefined();
      expect(preferences.preferences[category][preferenceKey]).toBe(value);
    });

    test('should throw an error for missing researcher ID', () => {
      expect(() => researcherPreferenceService.setResearcherPreference(null, 'literatureAnalysis', 'analysisDepth', 'comprehensive'))
        .toThrow('Researcher ID is required');
    });

    test('should throw an error for missing category', () => {
      expect(() => researcherPreferenceService.setResearcherPreference('RES-12345', null, 'analysisDepth', 'comprehensive'))
        .toThrow('Category is required');
    });

    test('should throw an error for missing preference key', () => {
      expect(() => researcherPreferenceService.setResearcherPreference('RES-12345', 'literatureAnalysis', null, 'comprehensive'))
        .toThrow('Preference key is required');
    });

    test('should validate preference value type', () => {
      expect(() => researcherPreferenceService.setResearcherPreference('RES-12345', 'literatureAnalysis', 'analysisDepth', 123))
        .toThrow('Preference analysisDepth must be a string');
    });

    test('should validate preference value options', () => {
      expect(() => researcherPreferenceService.setResearcherPreference('RES-12345', 'literatureAnalysis', 'analysisDepth', 'invalid-option'))
        .toThrow('Preference analysisDepth must be one of: basic, intermediate, comprehensive, full');
    });
  });

  describe('updateResearcherPreferences', () => {
    test('should update multiple researcher preferences correctly', () => {
      const researcherId = 'RES-12345';
      const preferences = {
        literatureAnalysis: {
          analysisDepth: 'comprehensive',
          topicModeling: false
        },
        clinicalTrialMatching: {
          matchingThreshold: 0.9
        }
      };

      const updatedPreferences = researcherPreferenceService.updateResearcherPreferences(
        researcherId,
        preferences
      );

      expect(updatedPreferences).toBeDefined();
      expect(updatedPreferences.preferences.literatureAnalysis.analysisDepth).toBe('comprehensive');
      expect(updatedPreferences.preferences.literatureAnalysis.topicModeling).toBe(false);
      expect(updatedPreferences.preferences.clinicalTrialMatching.matchingThreshold).toBe(0.9);
    });

    test('should throw an error for missing researcher ID', () => {
      expect(() => researcherPreferenceService.updateResearcherPreferences(null, {}))
        .toThrow('Researcher ID is required');
    });

    test('should throw an error for missing preferences object', () => {
      expect(() => researcherPreferenceService.updateResearcherPreferences('RES-12345', null))
        .toThrow('Preferences object is required');
    });
  });

  describe('resetResearcherPreferences', () => {
    test('should reset researcher preferences to defaults', () => {
      const researcherId = 'RES-12345';

      // First set a custom preference
      researcherPreferenceService.setResearcherPreference(
        researcherId,
        'literatureAnalysis',
        'analysisDepth',
        'comprehensive'
      );

      // Then reset preferences
      const preferences = researcherPreferenceService.resetResearcherPreferences(researcherId);

      expect(preferences).toBeDefined();
      // Should be back to default value
      expect(preferences.preferences.literatureAnalysis.analysisDepth).toBe('comprehensive'); // Default value
    });

    test('should throw an error for missing researcher ID', () => {
      expect(() => researcherPreferenceService.resetResearcherPreferences(null))
        .toThrow('Researcher ID is required');
    });
  });

  describe('getAvailableCategories', () => {
    test('should return available preference categories', () => {
      const categories = researcherPreferenceService.getAvailableCategories();

      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories).toContain('literatureAnalysis');
      expect(categories).toContain('clinicalTrialMatching');
      expect(categories).toContain('researchImpact');
      expect(categories).toContain('collaborativeResearch');
      expect(categories).toContain('visualization');
      expect(categories).toContain('workflow');
      expect(categories).toContain('interface');
      expect(categories).toContain('notifications');
      expect(categories).toContain('privacy');
    });
  });

  describe('getCategoryConfiguration', () => {
    test('should retrieve category configuration correctly', () => {
      const configuration = researcherPreferenceService.getCategoryConfiguration('literatureAnalysis');

      expect(configuration).toBeDefined();
      expect(configuration.name).toBe('Literature Analysis');
      expect(configuration.preferences).toBeDefined();
    });

    test('should return null for non-existent category configuration', () => {
      const configuration = researcherPreferenceService.getCategoryConfiguration('non-existent-category');
      expect(configuration).toBeNull();
    });
  });

  describe('getPreferenceConfiguration', () => {
    test('should retrieve preference configuration correctly', () => {
      const configuration = researcherPreferenceService.getPreferenceConfiguration('literatureAnalysis', 'analysisDepth');

      expect(configuration).toBeDefined();
      expect(configuration.name).toBe('Analysis Depth');
      expect(configuration.type).toBe('string');
    });

    test('should return null for non-existent preference configuration', () => {
      const configuration = researcherPreferenceService.getPreferenceConfiguration('literatureAnalysis', 'non-existent-preference');
      expect(configuration).toBeNull();
    });
  });

  describe('exportResearcherPreferences', () => {
    test('should export researcher preferences correctly', () => {
      const researcherId = 'RES-12345';
      const exportedPreferences = researcherPreferenceService.exportResearcherPreferences(researcherId);

      expect(exportedPreferences).toBeDefined();
      expect(exportedPreferences.researcherId).toBe(researcherId);
      expect(exportedPreferences.preferences).toBeDefined();
      expect(exportedPreferences.exportedAt).toBeDefined();
      expect(exportedPreferences.version).toBe('1.0.0');
    });

    test('should throw an error for missing researcher ID', () => {
      expect(() => researcherPreferenceService.exportResearcherPreferences(null))
        .toThrow('Researcher ID is required');
    });
  });

  describe('importResearcherPreferences', () => {
    test('should import researcher preferences correctly', () => {
      const researcherId = 'RES-12345';
      const importedPreferences = {
        preferences: {
          literatureAnalysis: {
            analysisDepth: 'comprehensive'
          }
        }
      };

      const result = researcherPreferenceService.importResearcherPreferences(
        researcherId,
        importedPreferences
      );

      expect(result).toBeDefined();
      expect(result.researcherId).toBe(researcherId);
      expect(result.preferences.preferences.literatureAnalysis.analysisDepth).toBe('comprehensive');
      expect(result.importedAt).toBeDefined();
    });

    test('should throw an error for missing researcher ID', () => {
      expect(() => researcherPreferenceService.importResearcherPreferences(null, {}))
        .toThrow('Researcher ID is required');
    });

    test('should throw an error for missing preferences object', () => {
      expect(() => researcherPreferenceService.importResearcherPreferences('RES-12345', null))
        .toThrow('Imported preferences object is required');
    });

    test('should throw an error for invalid preferences structure', () => {
      expect(() => researcherPreferenceService.importResearcherPreferences('RES-12345', { invalid: 'structure' }))
        .toThrow('Invalid preferences structure in import data');
    });
  });
});