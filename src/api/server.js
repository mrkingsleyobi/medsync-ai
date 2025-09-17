// MediSync Healthcare AI Platform - Main Server
// This file implements the basic microservices architecture for MediSync

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
if (process.env.NODE_ENV !== 'production') {
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
    message: 'Clinical Decision Support Service - Coming Soon',
    service: 'Clinical Decision Support Service'
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
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`MediSync API server running on port ${PORT}`);
  console.log(`🚀 MediSync API server running on port ${PORT}`);
});

module.exports = app;