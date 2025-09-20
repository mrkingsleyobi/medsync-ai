# Security Controller for MediSync Healthcare AI Platform

## Overview

This controller provides REST API endpoints for the security features implemented in the security service.

## Implementation

```javascript
const SecurityService = require('../services/security.service.js');

class SecurityController {
  constructor() {
    this.securityService = new SecurityService();
  }

  /**
   * Encrypt data endpoint
   * POST /api/security/encrypt
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async encryptData(req, res) {
    try {
      // Validate input
      const validation = this.securityService.validateInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Invalid input',
          details: validation.errors
        });
      }

      // Check rate limiting
      if (this.securityService.isRateLimited(req.ip)) {
        return res.status(429).json({
          error: 'Too many requests',
          message: this.config.getApiSecurityConfig().rateLimiting.message
        });
      }

      const { data } = req.body;

      if (!data) {
        return res.status(400).json({
          error: 'Missing required field: data'
        });
      }

      // Encrypt data
      const encryptedData = this.securityService.encrypt(data);

      // Log security event
      this.securityService.logSecurityEvent('data_encrypted', {
        severity: 'info',
        source: 'api',
        message: 'Data encrypted successfully',
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(200).json({
        success: true,
        encryptedData: encryptedData
      });
    } catch (error) {
      // Log security event
      this.securityService.logSecurityEvent('data_encryption_failed', {
        severity: 'error',
        source: 'api',
        message: `Data encryption failed: ${error.message}`,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(500).json({
        error: 'Encryption failed',
        message: error.message
      });
    }
  }

  /**
   * Decrypt data endpoint
   * POST /api/security/decrypt
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async decryptData(req, res) {
    try {
      // Validate input
      const validation = this.securityService.validateInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Invalid input',
          details: validation.errors
        });
      }

      // Check rate limiting
      if (this.securityService.isRateLimited(req.ip)) {
        return res.status(429).json({
          error: 'Too many requests',
          message: this.config.getApiSecurityConfig().rateLimiting.message
        });
      }

      const { encryptedData, iv, tag } = req.body;

      if (!encryptedData || !iv || !tag) {
        return res.status(400).json({
          error: 'Missing required fields: encryptedData, iv, tag'
        });
      }

      // Decrypt data
      const decryptedData = this.securityService.decrypt({
        encryptedData,
        iv,
        tag
      });

      // Log security event
      this.securityService.logSecurityEvent('data_decrypted', {
        severity: 'info',
        source: 'api',
        message: 'Data decrypted successfully',
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(200).json({
        success: true,
        decryptedData: decryptedData
      });
    } catch (error) {
      // Log security event
      this.securityService.logSecurityEvent('data_decryption_failed', {
        severity: 'error',
        source: 'api',
        message: `Data decryption failed: ${error.message}`,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(500).json({
        error: 'Decryption failed',
        message: error.message
      });
    }
  }

  /**
   * Hash data endpoint
   * POST /api/security/hash
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async hashData(req, res) {
    try {
      // Validate input
      const validation = this.securityService.validateInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Invalid input',
          details: validation.errors
        });
      }

      // Check rate limiting
      if (this.securityService.isRateLimited(req.ip)) {
        return res.status(429).json({
          error: 'Too many requests',
          message: this.config.getApiSecurityConfig().rateLimiting.message
        });
      }

      const { data } = req.body;

      if (!data) {
        return res.status(400).json({
          error: 'Missing required field: data'
        });
      }

      // Hash data
      const hashedData = this.securityService.hash(data);

      // Log security event
      this.securityService.logSecurityEvent('data_hashed', {
        severity: 'info',
        source: 'api',
        message: 'Data hashed successfully',
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(200).json({
        success: true,
        hashedData: hashedData
      });
    } catch (error) {
      // Log security event
      this.securityService.logSecurityEvent('data_hashing_failed', {
        severity: 'error',
        source: 'api',
        message: `Data hashing failed: ${error.message}`,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(500).json({
        error: 'Hashing failed',
        message: error.message
      });
    }
  }

  /**
   * Validate password endpoint
   * POST /api/security/validate-password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async validatePassword(req, res) {
    try {
      // Validate input
      const validation = this.securityService.validateInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Invalid input',
          details: validation.errors
        });
      }

      // Check rate limiting
      if (this.securityService.isRateLimited(req.ip)) {
        return res.status(429).json({
          error: 'Too many requests',
          message: this.config.getApiSecurityConfig().rateLimiting.message
        });
      }

      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          error: 'Missing required field: password'
        });
      }

      // Validate password
      const validationResult = this.securityService.validatePassword(password);

      // Log security event
      this.securityService.logSecurityEvent('password_validated', {
        severity: 'info',
        source: 'api',
        message: 'Password validation completed',
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(200).json({
        success: true,
        valid: validationResult.valid,
        errors: validationResult.errors
      });
    } catch (error) {
      // Log security event
      this.securityService.logSecurityEvent('password_validation_failed', {
        severity: 'error',
        source: 'api',
        message: `Password validation failed: ${error.message}`,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(500).json({
        error: 'Password validation failed',
        message: error.message
      });
    }
  }

  /**
   * Generate TOTP secret endpoint
   * POST /api/security/totp-secret
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateTOTPSecret(req, res) {
    try {
      // Check rate limiting
      if (this.securityService.isRateLimited(req.ip)) {
        return res.status(429).json({
          error: 'Too many requests',
          message: this.config.getApiSecurityConfig().rateLimiting.message
        });
      }

      // Generate TOTP secret
      const secret = this.securityService.generateTOTPSecret();

      // Log security event
      this.securityService.logSecurityEvent('totp_secret_generated', {
        severity: 'info',
        source: 'api',
        message: 'TOTP secret generated successfully',
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(200).json({
        success: true,
        secret: secret
      });
    } catch (error) {
      // Log security event
      this.securityService.logSecurityEvent('totp_secret_generation_failed', {
        severity: 'error',
        source: 'api',
        message: `TOTP secret generation failed: ${error.message}`,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(500).json({
        error: 'TOTP secret generation failed',
        message: error.message
      });
    }
  }

  /**
   * Verify TOTP token endpoint
   * POST /api/security/verify-totp
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyTOTPToken(req, res) {
    try {
      // Validate input
      const validation = this.securityService.validateInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Invalid input',
          details: validation.errors
        });
      }

      // Check rate limiting
      if (this.securityService.isRateLimited(req.ip)) {
        return res.status(429).json({
          error: 'Too many requests',
          message: this.config.getApiSecurityConfig().rateLimiting.message
        });
      }

      const { secret, token } = req.body;

      if (!secret || !token) {
        return res.status(400).json({
          error: 'Missing required fields: secret, token'
        });
      }

      // Verify TOTP token
      const isValid = this.securityService.verifyTOTPToken(secret, token);

      // Log security event
      this.securityService.logSecurityEvent('totp_token_verified', {
        severity: 'info',
        source: 'api',
        message: `TOTP token verification ${isValid ? 'successful' : 'failed'}`,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(200).json({
        success: true,
        valid: isValid
      });
    } catch (error) {
      // Log security event
      this.securityService.logSecurityEvent('totp_token_verification_failed', {
        severity: 'error',
        source: 'api',
        message: `TOTP token verification failed: ${error.message}`,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(500).json({
        error: 'TOTP token verification failed',
        message: error.message
      });
    }
  }

  /**
   * Log security event endpoint
   * POST /api/security/log-event
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logSecurityEvent(req, res) {
    try {
      // Validate input
      const validation = this.securityService.validateInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Invalid input',
          details: validation.errors
        });
      }

      const { eventType, eventData } = req.body;

      if (!eventType || !eventData) {
        return res.status(400).json({
          error: 'Missing required fields: eventType, eventData'
        });
      }

      // Log security event
      this.securityService.logSecurityEvent(eventType, {
        ...eventData,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(200).json({
        success: true,
        message: 'Security event logged successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to log security event',
        message: error.message
      });
    }
  }
}

module.exports = SecurityController;