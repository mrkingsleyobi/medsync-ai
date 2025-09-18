// MediSync Healthcare AI Platform - Main Server
// This file implements the basic microservices architecture for MediSync

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');

// Import environment configuration
const { environmentConfig } = require('../config/environment');

// Import routes
const decisionSupportRoutes = require('./routes/decision-support');

// Create Express app
const app = express();
const PORT = environmentConfig.port;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Decision support routes
app.use('/api/decision-support', decisionSupportRoutes);

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'medisync-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production, log to the console
if (environmentConfig.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check endpoint accessed');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'MediSync API'
  });
});

// Basic routes for different services
app.get('/api/patients', (req, res) => {
  logger.info('Patients service endpoint accessed');
  res.status(200).json({
    message: 'Patients service - Coming Soon',
    service: 'Patient Communication Service'
  });
});

app.get('/api/clinical', (req, res) => {
  logger.info('Clinical service endpoint accessed');
  res.status(200).json({
    message: 'Clinical Decision Support Service',
    service: 'Clinical Decision Support Service',
    endpoints: [
      'POST /api/decision-support/generate - Generate clinical decision support',
      'GET /api/decision-support/history/:patientId - Get decision history for a patient',
      'GET /api/decision-support/alerts - Get active alerts',
      'POST /api/decision-support/alerts/:alertId/acknowledge - Acknowledge an alert'
    ]
  });
});

app.get('/api/research', (req, res) => {
  logger.info('Research service endpoint accessed');
  res.status(200).json({
    message: 'Research Integration Service - Coming Soon',
    service: 'Research Integration Service'
  });
});

app.get('/api/admin', (req, res) => {
  logger.info('Admin service endpoint accessed');
  res.status(200).json({
    message: 'Administrative Service - Coming Soon',
    service: 'Administrative Service'
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const response = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  };

  if (environmentConfig.nodeEnv !== 'production') {
    response.message = err.message;
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

// Start server only when this file is run directly
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    logger.info(`MediSync API server running on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`🚀 MediSync API server running on port ${PORT}`);
  });
}

module.exports = { app, server };
