/**
 * Population Health Analytics Configuration
 * Configuration for the population health analytics service
 */

module.exports = {
  enabled: process.env.POPULATION_HEALTH_ANALYTICS_ENABLED !== 'false',
  models: {
    trendAnalysis: {
      enabled: true,
      version: '1.0.0',
      threshold: 0.75
    },
    resourceAllocation: {
      enabled: true,
      version: '1.0.0',
      threshold: 0.8
    },
    riskStratification: {
      enabled: true,
      version: '1.0.0',
      threshold: 0.7
    }
  },
  processing: {
    timeout: 60000, // 60 seconds
    maxRetries: 3
  }
};