/**
 * Provider Preference Controller Tests
 * Tests for the provider preference controller
 */

const ProviderPreferenceController = require('../../src/preferences/provider-preference.controller.js');

// Mock the ProviderPreferenceService
jest.mock('../../src/preferences/provider-preference.service.js');

describe('Provider Preference Controller', () => {
  let providerPreferenceController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    providerPreferenceController = new ProviderPreferenceController();
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

  describe('getProviderPreferences', () => {
    test('should retrieve provider preferences', async () => {
      const providerId = 'PROV-12345';
      const preferences = {
        decisionSupport: {
          confidenceThreshold: 0.8
        }
      };

      mockReq.params = { providerId };

      // Mock the service method
      providerPreferenceController.providerPreferenceService.getProviderPreferences.mockReturnValue(preferences);

      await providerPreferenceController.getProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        providerId: providerId,
        scope: 'provider',
        preferences: preferences
      });
    });

    test('should return 400 if provider ID is missing', async () => {
      mockReq.params = {};

      await providerPreferenceController.getProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Provider ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const providerId = 'PROV-12345';
      const errorMessage = 'Service error';

      mockReq.params = { providerId };

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.getProviderPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await providerPreferenceController.getProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve provider preferences',
        message: errorMessage
      });
    });
  });

  describe('setProviderPreference', () => {
    test('should set provider preference', async () => {
      const providerId = 'PROV-12345';
      const category = 'decisionSupport';
      const preferenceKey = 'confidenceThreshold';
      const value = 0.9;
      const preferences = {
        decisionSupport: {
          confidenceThreshold: 0.9
        }
      };

      mockReq.params = { providerId };
      mockReq.body = { category, preferenceKey, value };

      // Mock the service method
      providerPreferenceController.providerPreferenceService.setProviderPreference.mockReturnValue(preferences);

      await providerPreferenceController.setProviderPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Provider preference updated successfully',
        providerId: providerId,
        scope: 'provider',
        preferences: preferences
      });
    });

    test('should return 400 if provider ID is missing', async () => {
      mockReq.params = {};
      mockReq.body = {
        category: 'decisionSupport',
        preferenceKey: 'confidenceThreshold',
        value: 0.9
      };

      await providerPreferenceController.setProviderPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Provider ID is required'
      });
    });

    test('should return 400 if category is missing', async () => {
      mockReq.params = { providerId: 'PROV-12345' };
      mockReq.body = {
        preferenceKey: 'confidenceThreshold',
        value: 0.9
      };

      await providerPreferenceController.setProviderPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category is required'
      });
    });

    test('should return 400 if preference key is missing', async () => {
      mockReq.params = { providerId: 'PROV-12345' };
      mockReq.body = {
        category: 'decisionSupport',
        value: 0.9
      };

      await providerPreferenceController.setProviderPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preference key is required'
      });
    });

    test('should return 400 if value is missing', async () => {
      mockReq.params = { providerId: 'PROV-12345' };
      mockReq.body = {
        category: 'decisionSupport',
        preferenceKey: 'confidenceThreshold'
      };

      await providerPreferenceController.setProviderPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preference value is required'
      });
    });

    test('should return 400 if service throws validation error', async () => {
      const providerId = 'PROV-12345';
      const category = 'decisionSupport';
      const preferenceKey = 'confidenceThreshold';
      const value = 'invalid';
      const errorMessage = 'Preference confidenceThreshold must be a number';

      mockReq.params = { providerId };
      mockReq.body = { category, preferenceKey, value };

      // Mock the service method to throw a validation error
      providerPreferenceController.providerPreferenceService.setProviderPreference.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await providerPreferenceController.setProviderPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws other error', async () => {
      const providerId = 'PROV-12345';
      const category = 'decisionSupport';
      const preferenceKey = 'confidenceThreshold';
      const value = 0.9;
      const errorMessage = 'Internal service error';

      mockReq.params = { providerId };
      mockReq.body = { category, preferenceKey, value };

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.setProviderPreference.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await providerPreferenceController.setProviderPreference(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to update provider preference',
        message: errorMessage
      });
    });
  });

  describe('updateProviderPreferences', () => {
    test('should update provider preferences', async () => {
      const providerId = 'PROV-12345';
      const preferences = {
        decisionSupport: {
          confidenceThreshold: 0.85,
          autoGenerateDecisions: true
        }
      };
      const updatedPreferences = {
        decisionSupport: {
          confidenceThreshold: 0.85,
          autoGenerateDecisions: true
        }
      };

      mockReq.params = { providerId };
      mockReq.body = { preferences };

      // Mock the service method
      providerPreferenceController.providerPreferenceService.updateProviderPreferences.mockReturnValue(updatedPreferences);

      await providerPreferenceController.updateProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Provider preferences updated successfully',
        providerId: providerId,
        scope: 'provider',
        preferences: updatedPreferences
      });
    });

    test('should return 400 if provider ID is missing', async () => {
      mockReq.params = {};
      mockReq.body = { preferences: {} };

      await providerPreferenceController.updateProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Provider ID is required'
      });
    });

    test('should return 400 if preferences object is missing', async () => {
      mockReq.params = { providerId: 'PROV-12345' };
      mockReq.body = {};

      await providerPreferenceController.updateProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preferences object is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const providerId = 'PROV-12345';
      const preferences = {};
      const errorMessage = 'Service error';

      mockReq.params = { providerId };
      mockReq.body = { preferences };

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.updateProviderPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await providerPreferenceController.updateProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to update provider preferences',
        message: errorMessage
      });
    });
  });

  describe('resetProviderPreferences', () => {
    test('should reset provider preferences', async () => {
      const providerId = 'PROV-12345';
      const preferences = {
        decisionSupport: {
          confidenceThreshold: 0.8
        }
      };

      mockReq.params = { providerId };
      mockReq.body = {};

      // Mock the service method
      providerPreferenceController.providerPreferenceService.resetProviderPreferences.mockReturnValue(preferences);

      await providerPreferenceController.resetProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Provider preferences reset to defaults successfully',
        providerId: providerId,
        scope: 'provider',
        preferences: preferences
      });
    });

    test('should return 400 if provider ID is missing', async () => {
      mockReq.params = {};
      mockReq.body = {};

      await providerPreferenceController.resetProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Provider ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const providerId = 'PROV-12345';
      const errorMessage = 'Service error';

      mockReq.params = { providerId };
      mockReq.body = {};

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.resetProviderPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await providerPreferenceController.resetProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to reset provider preferences',
        message: errorMessage
      });
    });
  });

  describe('getAvailableCategories', () => {
    test('should retrieve available preference categories', () => {
      const categories = ['decisionSupport', 'alerts', 'visualization'];

      // Mock the service method
      providerPreferenceController.providerPreferenceService.getAvailableCategories.mockReturnValue(categories);

      providerPreferenceController.getAvailableCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        categories: categories
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.getAvailableCategories.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      providerPreferenceController.getAvailableCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve preference categories',
        message: errorMessage
      });
    });
  });

  describe('getCategoryConfiguration', () => {
    test('should retrieve category configuration', () => {
      const category = 'decisionSupport';
      const configuration = {
        name: 'Decision Support',
        preferences: {}
      };

      mockReq.params = { category };

      // Mock the service method
      providerPreferenceController.providerPreferenceService.getCategoryConfiguration.mockReturnValue(configuration);

      providerPreferenceController.getCategoryConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        category: category,
        configuration: configuration
      });
    });

    test('should return 404 if category configuration is not found', () => {
      const category = 'non-existent';

      mockReq.params = { category };

      // Mock the service method to return null
      providerPreferenceController.providerPreferenceService.getCategoryConfiguration.mockReturnValue(null);

      providerPreferenceController.getCategoryConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category configuration not found'
      });
    });

    test('should return 400 if category is missing', () => {
      mockReq.params = {};

      providerPreferenceController.getCategoryConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const category = 'decisionSupport';
      const errorMessage = 'Service error';

      mockReq.params = { category };

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.getCategoryConfiguration.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      providerPreferenceController.getCategoryConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve category configuration',
        message: errorMessage
      });
    });
  });

  describe('getPreferenceConfiguration', () => {
    test('should retrieve preference configuration', () => {
      const category = 'decisionSupport';
      const preferenceKey = 'confidenceThreshold';
      const configuration = {
        name: 'Confidence Threshold',
        type: 'number',
        defaultValue: 0.8
      };

      mockReq.params = { category, preferenceKey };

      // Mock the service method
      providerPreferenceController.providerPreferenceService.getPreferenceConfiguration.mockReturnValue(configuration);

      providerPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        category: category,
        preference: preferenceKey,
        configuration: configuration
      });
    });

    test('should return 404 if preference configuration is not found', () => {
      const category = 'decisionSupport';
      const preferenceKey = 'non-existent';

      mockReq.params = { category, preferenceKey };

      // Mock the service method to return null
      providerPreferenceController.providerPreferenceService.getPreferenceConfiguration.mockReturnValue(null);

      providerPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preference configuration not found'
      });
    });

    test('should return 400 if category is missing', () => {
      mockReq.params = { preferenceKey: 'confidenceThreshold' };

      providerPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category is required'
      });
    });

    test('should return 400 if preference key is missing', () => {
      mockReq.params = { category: 'decisionSupport' };

      providerPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preference key is required'
      });
    });

    test('should return 500 if service throws an error', () => {
      const category = 'decisionSupport';
      const preferenceKey = 'confidenceThreshold';
      const errorMessage = 'Service error';

      mockReq.params = { category, preferenceKey };

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.getPreferenceConfiguration.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      providerPreferenceController.getPreferenceConfiguration(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve preference configuration',
        message: errorMessage
      });
    });
  });

  describe('exportProviderPreferences', () => {
    test('should export provider preferences', async () => {
      const providerId = 'PROV-12345';
      const exportedPreferences = {
        providerId: 'PROV-12345',
        preferences: {},
        exportedAt: '2023-01-01T00:00:00Z',
        version: '1.0.0'
      };

      mockReq.params = { providerId };

      // Mock the service method
      providerPreferenceController.providerPreferenceService.exportProviderPreferences.mockReturnValue(exportedPreferences);

      await providerPreferenceController.exportProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Provider preferences exported successfully',
        exportedPreferences: exportedPreferences
      });
    });

    test('should return 400 if provider ID is missing', async () => {
      mockReq.params = {};

      await providerPreferenceController.exportProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Provider ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const providerId = 'PROV-12345';
      const errorMessage = 'Service error';

      mockReq.params = { providerId };

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.exportProviderPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await providerPreferenceController.exportProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to export provider preferences',
        message: errorMessage
      });
    });
  });

  describe('importProviderPreferences', () => {
    test('should import provider preferences', async () => {
      const providerId = 'PROV-12345';
      const preferences = {
        decisionSupport: {
          confidenceThreshold: 0.9
        }
      };
      const importedPreferences = {
        providerId: 'PROV-12345',
        importedAt: '2023-01-01T00:00:00Z'
      };

      mockReq.params = { providerId };
      mockReq.body = { preferences };

      // Mock the service method
      providerPreferenceController.providerPreferenceService.importProviderPreferences.mockReturnValue(importedPreferences);

      await providerPreferenceController.importProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Provider preferences imported successfully',
        importedPreferences: importedPreferences
      });
    });

    test('should return 400 if provider ID is missing', async () => {
      mockReq.params = {};
      mockReq.body = { preferences: {} };

      await providerPreferenceController.importProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Provider ID is required'
      });
    });

    test('should return 400 if preferences object is missing', async () => {
      mockReq.params = { providerId: 'PROV-12345' };
      mockReq.body = {};

      await providerPreferenceController.importProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preferences object is required'
      });
    });

    test('should return 400 if service throws validation error', async () => {
      const providerId = 'PROV-12345';
      const preferences = {};
      const errorMessage = 'Invalid preferences structure in import data';

      mockReq.params = { providerId };
      mockReq.body = { preferences };

      // Mock the service method to throw a validation error
      providerPreferenceController.providerPreferenceService.importProviderPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await providerPreferenceController.importProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws other error', async () => {
      const providerId = 'PROV-12345';
      const preferences = {};
      const errorMessage = 'Internal service error';

      mockReq.params = { providerId };
      mockReq.body = { preferences };

      // Mock the service method to throw an error
      providerPreferenceController.providerPreferenceService.importProviderPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await providerPreferenceController.importProviderPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to import provider preferences',
        message: errorMessage
      });
    });
  });
});