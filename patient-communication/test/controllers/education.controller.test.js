/**
 * Education Controller Tests
 * Tests for the education controller
 */

const EducationController = require('../../src/controllers/education.controller.js');

// Mock the EducationService
jest.mock('../../src/services/education.service.js');

describe('Education Controller', () => {
  let educationController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    educationController = new EducationController();
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

  describe('getPersonalizedContent', () => {
    test('should get personalized education content', async () => {
      const patientProfile = { id: '123', conditions: ['diabetes'] };
      const category = 'chronic_conditions';
      const content = [
        { id: 'content_1', title: 'Managing Diabetes', category: 'chronic_conditions' },
        { id: 'content_2', title: 'Healthy Eating', category: 'nutrition' }
      ];

      mockReq.body = { patientProfile, category };

      // Mock the service method
      educationController.educationService.getPersonalizedContent.mockResolvedValue(content);

      await educationController.getPersonalizedContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        contentCount: content.length,
        content: content,
        category: category
      });
    });

    test('should return 400 if patient profile is missing', async () => {
      mockReq.body = {};

      await educationController.getPersonalizedContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Patient profile is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const patientProfile = { id: '123' };
      const errorMessage = 'Service error';

      mockReq.body = { patientProfile };

      // Mock the service method to throw an error
      educationController.educationService.getPersonalizedContent.mockRejectedValue(new Error(errorMessage));

      await educationController.getPersonalizedContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to get personalized education content',
        message: errorMessage
      });
    });
  });

  describe('trackProgress', () => {
    test('should track user progress', async () => {
      const userId = 'user_123';
      const contentId = 'content_123';
      const progress = { percentage: 0.5, timeSpent: 120 };
      const progressRecord = {
        userId: userId,
        contentId: contentId,
        progress: progress,
        timestamp: new Date().toISOString()
      };

      mockReq.body = { userId, contentId, progress };

      // Mock the service method
      educationController.educationService.trackProgress.mockResolvedValue(progressRecord);

      await educationController.trackProgress(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        progressRecord: progressRecord
      });
    });

    test('should return 400 if userId is missing', async () => {
      mockReq.body = { contentId: 'content_123' };

      await educationController.trackProgress(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User ID and Content ID are required'
      });
    });

    test('should return 400 if contentId is missing', async () => {
      mockReq.body = { userId: 'user_123' };

      await educationController.trackProgress(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User ID and Content ID are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const contentId = 'content_123';
      const errorMessage = 'Service error';

      mockReq.body = { userId, contentId };

      // Mock the service method to throw an error
      educationController.educationService.trackProgress.mockRejectedValue(new Error(errorMessage));

      await educationController.trackProgress(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to track user progress',
        message: errorMessage
      });
    });
  });

  describe('getUserProgress', () => {
    test('should get user progress', async () => {
      const userId = 'user_123';
      const progressData = {
        userId: userId,
        overallProgress: 0.75,
        contentProgress: { 'content_1': 1.0 },
        lastAccessed: new Date().toISOString()
      };

      mockReq.query = { userId };

      // Mock the service method
      educationController.educationService.getUserProgress.mockResolvedValue(progressData);

      await educationController.getUserProgress(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        progressData: progressData
      });
    });

    test('should return 400 if userId is missing', async () => {
      mockReq.query = {};

      await educationController.getUserProgress(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const errorMessage = 'Service error';

      mockReq.query = { userId };

      // Mock the service method to throw an error
      educationController.educationService.getUserProgress.mockRejectedValue(new Error(errorMessage));

      await educationController.getUserProgress(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to get user progress',
        message: errorMessage
      });
    });
  });

  describe('recommendContent', () => {
    test('should recommend education content', async () => {
      const patientProfile = { id: '123', conditions: ['diabetes'] };
      const userHistory = [{ id: 'content_1', category: 'chronic_conditions' }];
      const recommendations = [
        { id: 'content_2', title: 'Managing Diabetes', category: 'chronic_conditions' },
        { id: 'content_3', title: 'Healthy Eating', category: 'nutrition' }
      ];

      mockReq.body = { patientProfile, userHistory };

      // Mock the service method
      educationController.educationService.recommendContent.mockResolvedValue(recommendations);

      await educationController.recommendContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        recommendationCount: recommendations.length,
        recommendations: recommendations
      });
    });

    test('should return 400 if patient profile is missing', async () => {
      mockReq.body = {};

      await educationController.recommendContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Patient profile is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const patientProfile = { id: '123' };
      const errorMessage = 'Service error';

      mockReq.body = { patientProfile };

      // Mock the service method to throw an error
      educationController.educationService.recommendContent.mockRejectedValue(new Error(errorMessage));

      await educationController.recommendContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to generate content recommendations',
        message: errorMessage
      });
    });
  });

  describe('getAvailableCategories', () => {
    test('should return available education categories', () => {
      const categories = {
        CHRONIC_CONDITIONS: 'chronic_conditions',
        MEDICATION_MANAGEMENT: 'medication_management',
        PREVENTIVE_CARE: 'preventive_care',
        NUTRITION: 'nutrition',
        EXERCISE: 'exercise'
      };

      // Mock the service property
      educationController.educationService.categories = categories;

      educationController.getAvailableCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        categories: categories
      });
    });

    test('should return 500 if service throws an error', () => {
      const errorMessage = 'Service error';

      // Mock the service property to throw an error
      Object.defineProperty(educationController.educationService, 'categories', {
        get: () => {
          throw new Error(errorMessage);
        }
      });

      educationController.getAvailableCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve education categories',
        message: errorMessage
      });
    });
  });
});