/**
 * Researcher Preference Controller Tests
 * Tests for the researcher preference controller
 */

const ResearcherPreferenceController = require('../../src/preferences/researcher-preference.controller.js');

// Mock the ResearcherPreferenceService
jest.mock('../../src/preferences/researcher-preference.service.js');

describe('Researcher Preference Controller', () => {
  let researcherPreferenceController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    researcherPreferenceController = new ResearcherPreferenceController();
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getResearcherPreferences', () => {
    test('should retrieve researcher preferences', () => {
      const researcherId = 'RES-12345';
      const preferences = {
        literatureAnalysis: {
          analysisDepth: 'comprehensive'
        }
      };

      mockReq.params = { researcherId };

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.getResearcherPreferences.mockReturnValue(preferences);

      researcherPreferenceController.getResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        researcherId: researcherId,
        scope: 'researcher',
        preferences: preferences
      });
    });

    test('should return 400 if researcher ID is missing', () => {
      mockReq.params = {};

      researcherPreferenceController.getResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Researcher ID is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const researcherId = 'RES-12345';
      const errorMessage = 'Service error';

      mockReq.params = { researcherId };

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.getResearcherPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.getResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve researcher preferences',
        message: errorMessage
      });
    });
  });

  describe('setResearcherPreference', () => {
    test('should set researcher preference', () => {
      const researcherId = 'RES-12345';
      const category = 'literatureAnalysis';
      const preferenceKey = 'analysisDepth';
      const value = 'comprehensive';
      const preferences = {
        literatureAnalysis: {
          analysisDepth: 'comprehensive'
        }
      };

      mockReq.params = { researcherId };
      mockReq.body = { category, preferenceKey, value };

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.setResearcherPreference.mockReturnValue(preferences);

      researcherPreferenceController.setResearcherPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Researcher preference updated successfully',
        researcherId: researcherId,
        scope: 'researcher',
        preferences: preferences
      });
    });

    test('should return 400 if researcher ID is missing', () => {
      mockReq.params = {};
      mockReq.body = {
        category: 'literatureAnalysis',
        preferenceKey: 'analysisDepth',
        value: 'comprehensive'
      };

      researcherPreferenceController.setResearcherPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Researcher ID is required'
      });
    });

    test('should return 400 if category is missing', () => {
      mockReq.params = { researcherId: 'RES-12345' };
      mockReq.body = {
        preferenceKey: 'analysisDepth',
        value: 'comprehensive'
      };

      researcherPreferenceController.setResearcherPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category is required'
      });
    });

    test('should return 400 if preference key is missing', () => {
      mockReq.params = { researcherId: 'RES-12345' };
      mockReq.body = {
        category: 'literatureAnalysis',
        value: 'comprehensive'
      };

      researcherPreferenceController.setResearcherPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preference key is required'
      });
    });

    test('should return 400 if value is missing', () => {
      mockReq.params = { researcherId: 'RES-12345' };
      mockReq.body = {
        category: 'literatureAnalysis',
        preferenceKey: 'analysisDepth'
      };

      researcherPreferenceController.setResearcherPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preference value is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const researcherId = 'RES-12345';
      const errorMessage = 'Service error';

      mockReq.params = { researcherId };
      mockReq.body = {
        category: 'literatureAnalysis',
        preferenceKey: 'analysisDepth',
        value: 'comprehensive'
      };

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.setResearcherPreference.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.setResearcherPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to update researcher preference',
        message: errorMessage
      });
    });
  });

  describe('updateResearcherPreferences', () => {
    test('should update researcher preferences', () => {
      const researcherId = 'RES-12345';
      const preferences = {
        literatureAnalysis: {
          analysisDepth: 'comprehensive'
        }
      };
      const updatedPreferences = {
        literatureAnalysis: {
          analysisDepth: 'comprehensive'
        }
      };

      mockReq.params = { researcherId };
      mockReq.body = { preferences };

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.updateResearcherPreferences.mockReturnValue(updatedPreferences);

      researcherPreferenceController.updateResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Researcher preferences updated successfully',
        researcherId: researcherId,
        scope: 'researcher',
        preferences: updatedPreferences
      });
    });

    test('should return 400 if researcher ID is missing', () => {
      mockReq.params = {};
      mockReq.body = {
        preferences: {
          literatureAnalysis: {
            analysisDepth: 'comprehensive'
          }
        }
      };

      researcherPreferenceController.updateResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Researcher ID is required'
      });
    });

    test('should return 400 if preferences object is missing', () => {
      mockReq.params = { researcherId: 'RES-12345' };
      mockReq.body = {};

      researcherPreferenceController.updateResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preferences object is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const researcherId = 'RES-12345';
      const errorMessage = 'Service error';

      mockReq.params = { researcherId };
      mockReq.body = {
        preferences: {
          literatureAnalysis: {
            analysisDepth: 'comprehensive'
          }
        }
      };

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.updateResearcherPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.updateResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to update researcher preferences',
        message: errorMessage
      });
    });
  });

  describe('resetResearcherPreferences', () => {
    test('should reset researcher preferences', () => {
      const researcherId = 'RES-12345';
      const preferences = {
        literatureAnalysis: {
          analysisDepth: 'comprehensive' // Default value
        }
      };

      mockReq.params = { researcherId };
      mockReq.body = {};

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.resetResearcherPreferences.mockReturnValue(preferences);

      researcherPreferenceController.resetResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Researcher preferences reset to defaults successfully',
        researcherId: researcherId,
        scope: 'researcher',
        preferences: preferences
      });
    });

    test('should return 400 if researcher ID is missing', () => {
      mockReq.params = {};
      mockReq.body = {};

      researcherPreferenceController.resetResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Researcher ID is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const researcherId = 'RES-12345';
      const errorMessage = 'Service error';

      mockReq.params = { researcherId };
      mockReq.body = {};

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.resetResearcherPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.resetResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to reset researcher preferences',
        message: errorMessage
      });
    });
  });

  describe('getAvailableCategories', () => {
    test('should retrieve available categories', () => {
      const categories = ['literatureAnalysis', 'clinicalTrialMatching'];

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.getAvailableCategories.mockReturnValue(categories);

      researcherPreferenceController.getAvailableCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        categories: categories
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.getAvailableCategories.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.getAvailableCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve preference categories',
        message: errorMessage
      });
    });
  });

  describe('getCategoryConfiguration', () => {
    test('should retrieve category configuration', () => {
      const category = 'literatureAnalysis';
      const configuration = {
        name: 'Literature Analysis',
        description: 'Preferences for literature analysis functionality'
      };

      mockReq.params = { category };

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.getCategoryConfiguration.mockReturnValue(configuration);

      researcherPreferenceController.getCategoryConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        category: category,
        configuration: configuration
      });
    });

    test('should return 404 if category configuration is not found', () => {
      const category = 'non-existent-category';

      mockReq.params = { category };

      // Mock the service method to return null
      researcherPreferenceController.researcherPreferenceService.getCategoryConfiguration.mockReturnValue(null);

      researcherPreferenceController.getCategoryConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category configuration not found'
      });
    });

    test('should return 400 if category is missing', () => {
      mockReq.params = {};

      researcherPreferenceController.getCategoryConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const category = 'literatureAnalysis';
      const errorMessage = 'Service error';

      mockReq.params = { category };

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.getCategoryConfiguration.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.getCategoryConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve category configuration',
        message: errorMessage
      });
    });
  });

  describe('getPreferenceConfiguration', () => {
    test('should retrieve preference configuration', () => {
      const category = 'literatureAnalysis';
      const preferenceKey = 'analysisDepth';
      const configuration = {
        name: 'Analysis Depth',
        description: 'Depth of literature analysis',
        type: 'string',
        defaultValue: 'comprehensive'
      };

      mockReq.params = { category, preferenceKey };

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.getPreferenceConfiguration.mockReturnValue(configuration);

      researcherPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        category: category,
        preference: preferenceKey,
        configuration: configuration
      });
    });

    test('should return 404 if preference configuration is not found', () => {
      const category = 'literatureAnalysis';
      const preferenceKey = 'non-existent-preference';

      mockReq.params = { category, preferenceKey };

      // Mock the service method to return null
      researcherPreferenceController.researcherPreferenceService.getPreferenceConfiguration.mockReturnValue(null);

      researcherPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preference configuration not found'
      });
    });

    test('should return 400 if category is missing', () => {
      mockReq.params = { preferenceKey: 'analysisDepth' };

      researcherPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category is required'
      });
    });

    test('should return 400 if preference key is missing', () => {
      mockReq.params = { category: 'literatureAnalysis' };

      researcherPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preference key is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const category = 'literatureAnalysis';
      const preferenceKey = 'analysisDepth';
      const errorMessage = 'Service error';

      mockReq.params = { category, preferenceKey };

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.getPreferenceConfiguration.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve preference configuration',
        message: errorMessage
      });
    });
  });

  describe('exportResearcherPreferences', () => {
    test('should export researcher preferences', () => {
      const researcherId = 'RES-12345';
      const exportedPreferences = {
        researcherId: 'RES-12345',
        preferences: {},
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };

      mockReq.params = { researcherId };

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.exportResearcherPreferences.mockReturnValue(exportedPreferences);

      researcherPreferenceController.exportResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Researcher preferences exported successfully',
        exportedPreferences: exportedPreferences
      });
    });

    test('should return 400 if researcher ID is missing', () => {
      mockReq.params = {};

      researcherPreferenceController.exportResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Researcher ID is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const researcherId = 'RES-12345';
      const errorMessage = 'Service error';

      mockReq.params = { researcherId };

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.exportResearcherPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.exportResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to export researcher preferences',
        message: errorMessage
      });
    });
  });

  describe('importResearcherPreferences', () => {
    test('should import researcher preferences', () => {
      const researcherId = 'RES-12345';
      const preferences = {
        literatureAnalysis: {
          analysisDepth: 'comprehensive'
        }
      };
      const importedPreferences = {
        researcherId: 'RES-12345',
        preferences: {
          literatureAnalysis: {
            analysisDepth: 'comprehensive'
          }
        },
        importedAt: new Date().toISOString()
      };

      mockReq.params = { researcherId };
      mockReq.body = { preferences };

      // Mock the service method
      researcherPreferenceController.researcherPreferenceService.importResearcherPreferences.mockReturnValue(importedPreferences);

      researcherPreferenceController.importResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Researcher preferences imported successfully',
        importedPreferences: importedPreferences
      });
    });

    test('should return 400 if researcher ID is missing', () => {
      mockReq.params = {};
      mockReq.body = {
        preferences: {
          literatureAnalysis: {
            analysisDepth: 'comprehensive'
          }
        }
      };

      researcherPreferenceController.importResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Researcher ID is required'
      });
    });

    test('should return 400 if preferences object is missing', () => {
      mockReq.params = { researcherId: 'RES-12345' };
      mockReq.body = {};

      researcherPreferenceController.importResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preferences object is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const researcherId = 'RES-12345';
      const errorMessage = 'Service error';

      mockReq.params = { researcherId };
      mockReq.body = {
        preferences: {
          literatureAnalysis: {
            analysisDepth: 'comprehensive'
          }
        }
      };

      // Mock the service method to throw an error
      researcherPreferenceController.researcherPreferenceService.importResearcherPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      researcherPreferenceController.importResearcherPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to import researcher preferences',
        message: errorMessage
      });
    });
  });
});