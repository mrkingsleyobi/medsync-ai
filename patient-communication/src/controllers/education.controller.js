/**
 * Education Controller
 * Controller for handling personalized health education requests
 */

const EducationService = require('../services/education.service.js');

class EducationController {
  constructor() {
    this.educationService = new EducationService();
  }

  /**
   * Get personalized education content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPersonalizedContent(req, res) {
    try {
      const { patientProfile, category } = req.body;

      // Validate required fields
      if (!patientProfile) {
        return res.status(400).json({
          error: 'Patient profile is required'
        });
      }

      // Get personalized content
      const content = await this.educationService.getPersonalizedContent(patientProfile, category);

      // Return the personalized content
      res.status(200).json({
        success: true,
        contentCount: content.length,
        content: content,
        category: category
      });
    } catch (error) {
      console.error('Get personalized content controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to get personalized education content',
        message: error.message
      });
    }
  }

  /**
   * Track user progress with education content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async trackProgress(req, res) {
    try {
      const { userId, contentId, progress } = req.body;

      // Validate required fields
      if (!userId || !contentId) {
        return res.status(400).json({
          error: 'User ID and Content ID are required'
        });
      }

      // Track progress
      const progressRecord = await this.educationService.trackProgress(userId, contentId, progress);

      // Return the progress record
      res.status(200).json({
        success: true,
        progressRecord: progressRecord
      });
    } catch (error) {
      console.error('Track progress controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to track user progress',
        message: error.message
      });
    }
  }

  /**
   * Get user progress for education content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserProgress(req, res) {
    try {
      const { userId, contentId } = req.query;

      // Validate required fields
      if (!userId) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      // Get user progress
      const progressData = await this.educationService.getUserProgress(userId, contentId);

      // Return the progress data
      res.status(200).json({
        success: true,
        progressData: progressData
      });
    } catch (error) {
      console.error('Get user progress controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to get user progress',
        message: error.message
      });
    }
  }

  /**
   * Recommend education content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async recommendContent(req, res) {
    try {
      const { patientProfile, userHistory } = req.body;

      // Validate required fields
      if (!patientProfile) {
        return res.status(400).json({
          error: 'Patient profile is required'
        });
      }

      // Recommend content
      const recommendations = await this.educationService.recommendContent(patientProfile, userHistory || []);

      // Return the recommendations
      res.status(200).json({
        success: true,
        recommendationCount: recommendations.length,
        recommendations: recommendations
      });
    } catch (error) {
      console.error('Recommend content controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to generate content recommendations',
        message: error.message
      });
    }
  }

  /**
   * Get available education categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAvailableCategories(req, res) {
    try {
      const categories = this.educationService.categories;

      res.status(200).json({
        success: true,
        categories: categories
      });
    } catch (error) {
      console.error('Get available categories controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to retrieve education categories',
        message: error.message
      });
    }
  }
}

module.exports = EducationController;