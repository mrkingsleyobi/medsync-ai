/**
 * Education Service
 * Service for personalized health education
 */

const config = require('../config/education.config.js');
const fs = require('fs').promises;
const path = require('path');

class EducationService {
  constructor() {
    this.config = config;
    this.categories = config.categories;
    this.supportedFormats = config.content.supportedFormats;
  }

  /**
   * Get personalized education content
   * @param {Object} patientProfile - Patient profile for personalization
   * @param {string} category - Education category
   * @returns {Promise<Object>} Personalized education content
   */
  async getPersonalizedContent(patientProfile, category = null) {
    try {
      // Validate input
      if (!patientProfile) {
        throw new Error('Patient profile is required');
      }

      console.log('Getting personalized education content', {
        patientId: patientProfile.id,
        category: category
      });

      // Generate personalized content based on patient profile
      const personalizedContent = this.generatePersonalizedContent(patientProfile, category);

      console.log('Personalized education content generated', {
        contentItems: personalizedContent.length,
        category: category
      });

      return personalizedContent;
    } catch (error) {
      console.error('Failed to get personalized education content', {
        error: error.message,
        patientId: patientProfile ? patientProfile.id : null,
        category: category
      });
      throw error;
    }
  }

  /**
   * Generate personalized content based on patient profile
   * @param {Object} patientProfile - Patient profile
   * @param {string} category - Education category
   * @returns {Array} Personalized content items
   */
  generatePersonalizedContent(patientProfile, category) {
    // In a real implementation, this would use AI and patient data to generate content
    // For demonstration, we'll create sample content based on patient conditions

    const contentItems = [];

    // Check for chronic conditions
    if (patientProfile.conditions && patientProfile.conditions.length > 0) {
      for (const condition of patientProfile.conditions) {
        contentItems.push(this.createConditionContent(condition, patientProfile));
      }
    }

    // Check for medications
    if (patientProfile.medications && patientProfile.medications.length > 0) {
      for (const medication of patientProfile.medications) {
        contentItems.push(this.createMedicationContent(medication, patientProfile));
      }
    }

    // Add general preventive care content
    contentItems.push(this.createPreventiveCareContent(patientProfile));

    // Filter by category if specified
    if (category) {
      return contentItems.filter(item => item.category === category);
    }

    return contentItems;
  }

  /**
   * Create content for a medical condition
   * @param {Object} condition - Medical condition
   * @param {Object} patientProfile - Patient profile
   * @returns {Object} Content item
   */
  createConditionContent(condition, patientProfile) {
    return {
      id: `condition_${condition.id}_${Date.now()}`,
      title: `Managing Your ${condition.name}`,
      category: this.categories.CHRONIC_CONDITIONS,
      format: 'html',
      content: `<h2>Managing ${condition.name}</h2>
                <p>Here's important information about managing your ${condition.name.toLowerCase()}:</p>
                <ul>
                  <li>Take your medications as prescribed</li>
                  <li>Monitor your symptoms regularly</li>
                  <li>Follow up with your healthcare provider</li>
                  <li>Maintain a healthy lifestyle</li>
                </ul>`,
      personalized: true,
      condition: condition.name,
      difficulty: 'intermediate',
      estimatedReadingTime: 3,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Create content for a medication
   * @param {Object} medication - Medication
   * @param {Object} patientProfile - Patient profile
   * @returns {Object} Content item
   */
  createMedicationContent(medication, patientProfile) {
    return {
      id: `medication_${medication.id}_${Date.now()}`,
      title: `Understanding Your ${medication.name} Medication`,
      category: this.categories.MEDICATION_MANAGEMENT,
      format: 'html',
      content: `<h2>About ${medication.name}</h2>
                <p>Here's what you need to know about your ${medication.name} medication:</p>
                <ul>
                  <li>Take as directed by your healthcare provider</li>
                  <li>Be aware of potential side effects</li>
                  <li>Don't stop taking it without consulting your doctor</li>
                  <li>Store properly according to instructions</li>
                </ul>`,
      personalized: true,
      medication: medication.name,
      difficulty: 'basic',
      estimatedReadingTime: 2,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Create preventive care content
   * @param {Object} patientProfile - Patient profile
   * @returns {Object} Content item
   */
  createPreventiveCareContent(patientProfile) {
    const age = this.calculateAge(patientProfile.dob);
    let title = 'Preventive Care Recommendations';
    let content = '';

    if (age < 18) {
      title = 'Preventive Care for Children and Teens';
      content = `<h2>Preventive Care for Children and Teens</h2>
                 <p>Important preventive care measures for your age group:</p>
                 <ul>
                   <li>Regular checkups with your pediatrician</li>
                   <li>Vaccinations as scheduled</li>
                   <li>Healthy eating and physical activity</li>
                   <li>Adequate sleep and stress management</li>
                 </ul>`;
    } else if (age < 65) {
      title = 'Preventive Care for Adults';
      content = `<h2>Preventive Care for Adults</h2>
                 <p>Important preventive care measures for adults:</p>
                 <ul>
                   <li>Annual physical examinations</li>
                   <li>Screenings as recommended by your doctor</li>
                   <li>Maintaining a healthy weight</li>
                   <li>Regular exercise and balanced nutrition</li>
                 </ul>`;
    } else {
      title = 'Preventive Care for Seniors';
      content = `<h2>Preventive Care for Seniors</h2>
                 <p>Important preventive care measures for seniors:</p>
                 <ul>
                   <li>Regular health screenings</li>
                   <li>Medication management</li>
                   <li>Fall prevention strategies</li>
                   <li>Social engagement and mental health</li>
                 </ul>`;
    }

    return {
      id: `preventive_care_${Date.now()}`,
      title: title,
      category: this.categories.PREVENTIVE_CARE,
      format: 'html',
      content: content,
      personalized: true,
      ageGroup: age < 18 ? 'child' : age < 65 ? 'adult' : 'senior',
      difficulty: 'basic',
      estimatedReadingTime: 3,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Calculate age from date of birth
   * @param {string} dob - Date of birth (YYYY-MM-DD)
   * @returns {number} Age in years
   */
  calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Track user progress with education content
   * @param {string} userId - User ID
   * @param {string} contentId - Content ID
   * @param {Object} progress - Progress data
   * @returns {Promise<Object>} Progress tracking result
   */
  async trackProgress(userId, contentId, progress) {
    try {
      // Validate input
      if (!userId || !contentId) {
        throw new Error('User ID and Content ID are required');
      }

      console.log('Tracking user progress', {
        userId: userId,
        contentId: contentId,
        progress: progress
      });

      // In a real implementation, this would save progress to a database
      // For demonstration, we'll just return a success response
      const progressRecord = {
        userId: userId,
        contentId: contentId,
        progress: progress,
        timestamp: new Date().toISOString()
      };

      console.log('User progress tracked successfully', {
        userId: userId,
        contentId: contentId
      });

      return progressRecord;
    } catch (error) {
      console.error('Failed to track user progress', {
        error: error.message,
        userId: userId,
        contentId: contentId
      });
      throw error;
    }
  }

  /**
   * Get user progress for education content
   * @param {string} userId - User ID
   * @param {string} contentId - Content ID (optional)
   * @returns {Promise<Object>} User progress data
   */
  async getUserProgress(userId, contentId = null) {
    try {
      // Validate input
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log('Getting user progress', {
        userId: userId,
        contentId: contentId
      });

      // In a real implementation, this would retrieve progress from a database
      // For demonstration, we'll just return sample data
      const progressData = {
        userId: userId,
        overallProgress: 0.75, // 75% complete
        contentProgress: contentId ? { [contentId]: 1.0 } : {}, // 100% if specific content requested
        lastAccessed: new Date().toISOString()
      };

      console.log('User progress retrieved successfully', {
        userId: userId
      });

      return progressData;
    } catch (error) {
      console.error('Failed to get user progress', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Recommend education content based on user profile and history
   * @param {Object} patientProfile - Patient profile
   * @param {Array} userHistory - User's education history
   * @returns {Promise<Array>} Recommended content items
   */
  async recommendContent(patientProfile, userHistory = []) {
    try {
      // Validate input
      if (!patientProfile) {
        throw new Error('Patient profile is required');
      }

      console.log('Generating content recommendations', {
        patientId: patientProfile.id,
        historyItems: userHistory.length
      });

      // Generate recommendations based on patient profile and history
      const recommendations = this.generateRecommendations(patientProfile, userHistory);

      console.log('Content recommendations generated', {
        recommendationCount: recommendations.length
      });

      return recommendations;
    } catch (error) {
      console.error('Failed to generate content recommendations', {
        error: error.message,
        patientId: patientProfile ? patientProfile.id : null
      });
      throw error;
    }
  }

  /**
   * Generate content recommendations
   * @param {Object} patientProfile - Patient profile
   * @param {Array} userHistory - User's education history
   * @returns {Array} Recommended content items
   */
  generateRecommendations(patientProfile, userHistory) {
    // In a real implementation, this would use AI algorithms to generate recommendations
    // For demonstration, we'll create sample recommendations

    const recommendations = [];

    // Recommend content based on conditions not yet addressed
    if (patientProfile.conditions) {
      for (const condition of patientProfile.conditions) {
        // Check if user has already accessed content for this condition
        const hasAccessed = userHistory.some(item =>
          item.category === this.categories.CHRONIC_CONDITIONS &&
          item.condition === condition.name
        );

        if (!hasAccessed) {
          recommendations.push(this.createConditionContent(condition, patientProfile));
        }
      }
    }

    // Recommend preventive care content
    recommendations.push(this.createPreventiveCareContent(patientProfile));

    return recommendations.slice(0, this.config.recommendations.maxRecommendations);
  }
}

module.exports = EducationService;