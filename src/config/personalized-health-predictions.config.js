/**
 * Personalized Health Predictions Configuration
 * Configuration for the personalized health predictions service
 */

const config = {
  enabled: process.env.PERSONALIZED_HEALTH_PREDICTIONS_ENABLED !== 'false',
  models: {
    diabetes: {
      enabled: true,
      version: '1.0.0',
      threshold: 0.7
    },
    hypertension: {
      enabled: true,
      version: '1.0.0',
      threshold: 0.6
    },
    cardiovascular: {
      enabled: true,
      version: '1.0.0',
      threshold: 0.65
    }
  },
  processing: {
    timeout: 30000, // 30 seconds
    maxRetries: 3
  }
};

module.exports = config;
