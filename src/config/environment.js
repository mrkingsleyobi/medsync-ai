// MediSync Healthcare AI Platform - Environment Configuration
// This file handles environment variable configuration and validation
/* eslint-disable no-process-env */

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Environment configuration
const environmentConfig = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Security configuration
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  sessionSecret: process.env.SESSION_SECRET || 'medisync-secret-key-change-in-production',
  jwtSecret: process.env.JWT_SECRET || 'medisync-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Database configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/medisync',

  // Healthcare AI configuration
  neuralMeshPort: process.env.NEURAL_MESH_PORT || 3001,
  dashboardPort: process.env.DASHBOARD_PORT || 3002,

  // Logging configuration
  logLevel: process.env.LOG_LEVEL || 'info'
};

// Validate required environment variables
const validateEnvironment = () => {
  const required = [];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = {
  environmentConfig,
  validateEnvironment
};
