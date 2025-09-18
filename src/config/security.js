// MediSync Healthcare AI Platform - Security Configuration
// This file contains security settings and middleware for the platform

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Security middleware configuration
const securityConfig = {
  // Helmet configuration for HTTP headers security
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\''],
        scriptSrc: ['\'self\''],
        imgSrc: ['\'self\'', 'data:', 'https:'],
        connectSrc: ['\'self\''],
        fontSrc: ['\'self\'', 'https:', 'data:'],
        objectSrc: ['\'none\''],
        mediaSrc: ['\'self\''],
        frameSrc: ['\'none\'']
      }
    },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true
  },

  // CORS configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests',
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  },

  // API rate limiting (stricter for authentication endpoints)
  authRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
    message: {
      error: 'Too many authentication attempts',
      message: 'Too many authentication attempts from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  },

  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'medisync-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'medisync-jwt-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: 'MediSync Healthcare AI Platform',
    audience: 'medisync-users'
  },

  // Password requirements
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
  },

  // Healthcare compliance settings
  hipaa: {
    auditLogging: true,
    dataEncryption: true,
    accessControls: true,
    breachNotification: true
  }
};

// Security middleware functions
const securityMiddleware = {
  // Apply helmet security headers
  helmet: helmet(securityConfig.helmet),

  // Apply CORS middleware
  cors: cors(securityConfig.cors),

  // Apply general rate limiting
  rateLimit: rateLimit(securityConfig.rateLimit),

  // Apply authentication rate limiting
  authRateLimit: rateLimit(securityConfig.authRateLimit)
};

module.exports = {
  securityConfig,
  securityMiddleware
};
