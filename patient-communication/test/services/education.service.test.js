/**
 * Education Service Tests
 * Tests for the education service
 */

const EducationService = require('../../src/services/education.service.js');

describe('Education Service', () => {
  let educationService;

  beforeEach(() => {
    educationService = new EducationService();
  });

  describe('getPersonalizedContent', () => {
    test('should generate personalized content for patient with conditions', async () => {
      const patientProfile = {
        id: '123',
        conditions: [{ id: '1', name: 'Diabetes' }],
        medications: [{ id: '1', name: 'Metformin' }],
        dob: '1980-01-01'
      };

      const result = await educationService.getPersonalizedContent(patientProfile);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      // Should have content for condition, medication, and preventive care
      expect(result.some(item => item.category === educationService.categories.CHRONIC_CONDITIONS)).toBe(true);
      expect(result.some(item => item.category === educationService.categories.MEDICATION_MANAGEMENT)).toBe(true);
      expect(result.some(item => item.category === educationService.categories.PREVENTIVE_CARE)).toBe(true);
    });

    test('should generate personalized content for patient with specific category', async () => {
      const patientProfile = {
        id: '123',
        conditions: [{ id: '1', name: 'Diabetes' }],
        dob: '1980-01-01'
      };
      const category = educationService.categories.CHRONIC_CONDITIONS;

      const result = await educationService.getPersonalizedContent(patientProfile, category);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      // Should only have content for the specified category
      expect(result.every(item => item.category === category)).toBe(true);
    });

    test('should throw an error for missing patient profile', async () => {
      await expect(educationService.getPersonalizedContent(null))
        .rejects
        .toThrow('Patient profile is required');
    });
  });

  describe('calculateAge', () => {
    test('should calculate age correctly', () => {
      const dob = '1990-01-01';
      const age = educationService.calculateAge(dob);

      expect(typeof age).toBe('number');
      expect(age).toBeGreaterThan(0);
    });
  });

  describe('trackProgress', () => {
    test('should track user progress', async () => {
      const userId = '123';
      const contentId = 'content_1';
      const progress = { percentage: 0.5, timeSpent: 120 };

      const result = await educationService.trackProgress(userId, contentId, progress);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.userId).toBe(userId);
      expect(result.contentId).toBe(contentId);
      expect(result.progress).toEqual(progress);
    });

    test('should throw an error for missing userId', async () => {
      await expect(educationService.trackProgress(null, 'content_1', {}))
        .rejects
        .toThrow('User ID and Content ID are required');
    });

    test('should throw an error for missing contentId', async () => {
      await expect(educationService.trackProgress('123', null, {}))
        .rejects
        .toThrow('User ID and Content ID are required');
    });
  });

  describe('getUserProgress', () => {
    test('should get user progress', async () => {
      const userId = '123';

      const result = await educationService.getUserProgress(userId);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.userId).toBe(userId);
      expect(typeof result.overallProgress).toBe('number');
    });

    test('should get user progress for specific content', async () => {
      const userId = '123';
      const contentId = 'content_1';

      const result = await educationService.getUserProgress(userId, contentId);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.userId).toBe(userId);
    });

    test('should throw an error for missing userId', async () => {
      await expect(educationService.getUserProgress(null))
        .rejects
        .toThrow('User ID is required');
    });
  });

  describe('recommendContent', () => {
    test('should recommend content based on patient profile', async () => {
      const patientProfile = {
        id: '123',
        conditions: [{ id: '1', name: 'Diabetes' }],
        dob: '1980-01-01'
      };
      const userHistory = [];

      const result = await educationService.recommendContent(patientProfile, userHistory);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should throw an error for missing patient profile', async () => {
      await expect(educationService.recommendContent(null))
        .rejects
        .toThrow('Patient profile is required');
    });
  });
});