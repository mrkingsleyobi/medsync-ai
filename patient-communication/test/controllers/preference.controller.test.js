/**
 * Preference Controller Tests
 * Tests for the preference controller
 */

const PreferenceController = require('../../src/controllers/preference.controller.js');

// Mock the PreferenceService
jest.mock('../../src/services/preference.service.js');

describe('Preference Controller', () => {
  let preferenceController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    preferenceController = new PreferenceController();
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { userId: 'user_123' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getUserPreferences', () => {
    test('should get all user preferences', async () => {
      const userId = 'user_123';
      const preferences = {
        userId: userId,
        categories: {
          communication: { preferredLanguage: 'en' },
          privacy: { shareDataWithResearchers: false }
        }
      };

      mockReq.user = { userId };

      // Mock the service method
      preferenceController.preferenceService.getUserPreferences.mockResolvedValue(preferences);

      await preferenceController.getUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        preferences: preferences
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const errorMessage = 'Service error';

      mockReq.user = { userId };

      // Mock the service method to throw an error
      preferenceController.preferenceService.getUserPreferences.mockRejectedValue(new Error(errorMessage));

      await preferenceController.getUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve user preferences',
        message: errorMessage
      });
    });
  });

  describe('getUserPreferencesByCategory', () => {
    test('should get user preferences by category', async () => {
      const userId = 'user_123';
      const category = 'communication';
      const preferences = {
        userId: userId,
        category: category,
        preferences: { preferredLanguage: 'en' }
      };

      mockReq.user = { userId };
      mockReq.params = { category };

      // Mock the service method
      preferenceController.preferenceService.getUserPreferencesByCategory.mockResolvedValue(preferences);

      await preferenceController.getUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        preferences: preferences
      });
    });

    test('should return 400 if category is missing', async () => {
      mockReq.params = {};

      await preferenceController.getUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category is required'
      });
    });

    test('should return 400 if category is invalid', async () => {
      const userId = 'user_123';
      const category = 'invalid';
      const errorMessage = 'Invalid preference category: invalid';

      mockReq.user = { userId };
      mockReq.params = { category };

      // Mock the service method to throw an error
      preferenceController.preferenceService.getUserPreferencesByCategory.mockRejectedValue(new Error(errorMessage));

      await preferenceController.getUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const category = 'communication';
      const errorMessage = 'Service error';

      mockReq.user = { userId };
      mockReq.params = { category };

      // Mock the service method to throw an error
      preferenceController.preferenceService.getUserPreferencesByCategory.mockRejectedValue(new Error(errorMessage));

      await preferenceController.getUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve user preferences by category',
        message: errorMessage
      });
    });
  });

  describe('updateUserPreferences', () => {
    test('should update user preferences', async () => {
      const userId = 'user_123';
      const preferences = {
        categories: {
          communication: { preferredLanguage: 'es' },
          privacy: { shareDataWithResearchers: true }
        }
      };
      const result = {
        message: 'Preferences updated successfully',
        preferences: preferences,
        updatedAt: new Date().toISOString()
      };

      mockReq.user = { userId };
      mockReq.body = { preferences };

      // Mock the service method
      preferenceController.preferenceService.updateUserPreferences.mockResolvedValue(result);

      await preferenceController.updateUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        preferences: result.preferences,
        updatedAt: result.updatedAt
      });
    });

    test('should return 400 if preferences are missing', async () => {
      mockReq.body = {};

      await preferenceController.updateUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preferences are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const preferences = { categories: { communication: { preferredLanguage: 'es' } } };
      const errorMessage = 'Service error';

      mockReq.user = { userId };
      mockReq.body = { preferences };

      // Mock the service method to throw an error
      preferenceController.preferenceService.updateUserPreferences.mockRejectedValue(new Error(errorMessage));

      await preferenceController.updateUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to update user preferences',
        message: errorMessage
      });
    });
  });

  describe('updateUserPreferencesByCategory', () => {
    test('should update user preferences by category', async () => {
      const userId = 'user_123';
      const category = 'communication';
      const preferences = { preferredLanguage: 'es' };
      const result = {
        message: `Preferences for category ${category} updated successfully`,
        category: category,
        preferences: preferences,
        updatedAt: new Date().toISOString()
      };

      mockReq.user = { userId };
      mockReq.params = { category };
      mockReq.body = { preferences };

      // Mock the service method
      preferenceController.preferenceService.updateUserPreferencesByCategory.mockResolvedValue(result);

      await preferenceController.updateUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        category: result.category,
        preferences: result.preferences,
        updatedAt: result.updatedAt
      });
    });

    test('should return 400 if category is missing', async () => {
      mockReq.params = {};
      mockReq.body = { preferences: { preferredLanguage: 'es' } };

      await preferenceController.updateUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category and preferences are required'
      });
    });

    test('should return 400 if preferences are missing', async () => {
      mockReq.params = { category: 'communication' };
      mockReq.body = {};

      await preferenceController.updateUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Category and preferences are required'
      });
    });

    test('should return 400 if category is invalid', async () => {
      const userId = 'user_123';
      const category = 'invalid';
      const preferences = { preferredLanguage: 'es' };
      const errorMessage = 'Invalid preference category: invalid';

      mockReq.user = { userId };
      mockReq.params = { category };
      mockReq.body = { preferences };

      // Mock the service method to throw an error
      preferenceController.preferenceService.updateUserPreferencesByCategory.mockRejectedValue(new Error(errorMessage));

      await preferenceController.updateUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const category = 'communication';
      const preferences = { preferredLanguage: 'es' };
      const errorMessage = 'Service error';

      mockReq.user = { userId };
      mockReq.params = { category };
      mockReq.body = { preferences };

      // Mock the service method to throw an error
      preferenceController.preferenceService.updateUserPreferencesByCategory.mockRejectedValue(new Error(errorMessage));

      await preferenceController.updateUserPreferencesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to update user preferences by category',
        message: errorMessage
      });
    });
  });

  describe('resetUserPreferences', () => {
    test('should reset user preferences to defaults', async () => {
      const userId = 'user_123';
      const result = {
        message: 'Preferences reset to defaults successfully',
        preferences: {
          userId: userId,
          categories: {
            communication: { preferredLanguage: 'en' },
            privacy: { shareDataWithResearchers: false }
          }
        },
        updatedAt: new Date().toISOString()
      };

      mockReq.user = { userId };

      // Mock the service method
      preferenceController.preferenceService.resetUserPreferences.mockResolvedValue(result);

      await preferenceController.resetUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        preferences: result.preferences,
        updatedAt: result.updatedAt
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const errorMessage = 'Service error';

      mockReq.user = { userId };

      // Mock the service method to throw an error
      preferenceController.preferenceService.resetUserPreferences.mockRejectedValue(new Error(errorMessage));

      await preferenceController.resetUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to reset user preferences',
        message: errorMessage
      });
    });
  });

  describe('exportUserPreferences', () => {
    test('should export user preferences', async () => {
      const userId = 'user_123';
      const result = {
        message: 'Preferences exported successfully',
        preferences: {
          userId: userId,
          categories: {
            communication: { preferredLanguage: 'en' },
            privacy: { shareDataWithResearchers: false }
          }
        },
        exportedAt: new Date().toISOString()
      };

      mockReq.user = { userId };

      // Mock the service method
      preferenceController.preferenceService.exportUserPreferences.mockResolvedValue(result);

      await preferenceController.exportUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        preferences: result.preferences,
        exportedAt: result.exportedAt
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const errorMessage = 'Service error';

      mockReq.user = { userId };

      // Mock the service method to throw an error
      preferenceController.preferenceService.exportUserPreferences.mockRejectedValue(new Error(errorMessage));

      await preferenceController.exportUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to export user preferences',
        message: errorMessage
      });
    });
  });

  describe('importUserPreferences', () => {
    test('should import user preferences', async () => {
      const userId = 'user_123';
      const preferences = {
        categories: {
          communication: { preferredLanguage: 'es' },
          privacy: { shareDataWithResearchers: true }
        }
      };
      const result = {
        message: 'Preferences imported successfully',
        preferences: preferences,
        importedAt: new Date().toISOString()
      };

      mockReq.user = { userId };
      mockReq.body = { preferences };

      // Mock the service method
      preferenceController.preferenceService.importUserPreferences.mockResolvedValue(result);

      await preferenceController.importUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        preferences: result.preferences,
        importedAt: result.importedAt
      });
    });

    test('should return 400 if preferences are missing', async () => {
      mockReq.body = {};

      await preferenceController.importUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preferences are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const preferences = { categories: { communication: { preferredLanguage: 'es' } } };
      const errorMessage = 'Service error';

      mockReq.user = { userId };
      mockReq.body = { preferences };

      // Mock the service method to throw an error
      preferenceController.preferenceService.importUserPreferences.mockRejectedValue(new Error(errorMessage));

      await preferenceController.importUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to import user preferences',
        message: errorMessage
      });
    });
  });

  describe('getPreferenceCategories', () => {
    test('should get available preference categories', () => {
      const categories = {
        COMMUNICATION: 'communication',
        PRIVACY: 'privacy',
        HEALTHCARE: 'healthcare'
      };

      // Mock the service property
      preferenceController.preferenceService.categories = categories;

      preferenceController.getPreferenceCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        categories: categories
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service property to throw an error
      Object.defineProperty(preferenceController.preferenceService, 'categories', {
        get: () => {
          throw new Error(errorMessage);
        }
      });

      preferenceController.getPreferenceCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve preference categories',
        message: errorMessage
      });
    });
  });

  describe('getDefaultPreferences', () => {
    test('should get default preferences', () => {
      const defaultPreferences = {
        communication: { preferredLanguage: 'en' },
        privacy: { shareDataWithResearchers: false },
        healthcare: { allowTelehealth: true }
      };

      // Mock the service methods
      preferenceController.preferenceService.getDefaultCommunicationPreferences.mockReturnValue(defaultPreferences.communication);
      preferenceController.preferenceService.getDefaultPrivacyPreferences.mockReturnValue(defaultPreferences.privacy);
      preferenceController.preferenceService.getDefaultHealthcarePreferences.mockReturnValue(defaultPreferences.healthcare);

      preferenceController.getDefaultPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        defaultPreferences: defaultPreferences
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock one of the service methods to throw an error
      preferenceController.preferenceService.getDefaultCommunicationPreferences.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      preferenceController.getDefaultPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve default preferences',
        message: errorMessage
      });
    });
  });
});