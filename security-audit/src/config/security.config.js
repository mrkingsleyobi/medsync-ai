# Security Configuration for MediSync Healthcare AI Platform

## Overview

This configuration file contains security settings for the MediSync platform, implementing the recommendations from the security audit.

## Encryption Settings

```javascript
class SecurityConfig {
  constructor() {
    // Data encryption settings
    this.encryption = {
      // AES-256 encryption for data at rest
      dataAtRest: {
        algorithm: 'AES-256-GCM',
        keyLength: 256,
        ivLength: 12,
        tagLength: 16,
        keyRotation: {
          enabled: true,
          interval: '30d', // Rotate keys every 30 days
          notification: true
        }
      },

      // TLS 1.3 for data in transit
      dataInTransit: {
        protocol: 'TLSv1.3',
        cipherSuites: [
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'TLS_AES_128_GCM_SHA256'
        ],
        minVersion: 'TLSv1.3'
      },

      // Key management
      keyManagement: {
        provider: 'AWS KMS', // In production, use HSM or cloud KMS
        region: 'us-east-1',
        keyAliases: {
          patientData: 'alias/medisync/patient-data-key',
          medicalRecords: 'alias/medisync/medical-records-key',
          auditLogs: 'alias/medisync/audit-logs-key'
        }
      }
    };

    // Authentication settings
    this.authentication = {
      // Multi-factor authentication
      mfa: {
        enabled: true,
        providers: ['TOTP', 'SMS', 'Email'],
        requiredForAdmins: true,
        requiredForSensitiveOps: true
      },

      // OAuth 2.0 settings
      oauth: {
        enabled: true,
        providers: ['Google', 'Microsoft'],
        tokenExpiration: '1h',
        refreshTokenExpiration: '30d'
      },

      // Password policies
      password: {
        minLength: 12,
        requireNumbers: true,
        requireSpecialChars: true,
        requireMixedCase: true,
        maxAge: '90d',
        history: 12 // Prevent reuse of last 12 passwords
      }
    };

    // API security settings
    this.apiSecurity = {
      // Rate limiting
      rateLimiting: {
        enabled: true,
        windowMs: 900000, // 15 minutes
        maxRequests: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        statusCode: 429
      },

      // Input validation
      inputValidation: {
        enabled: true,
        sanitize: true,
        maxPayloadSize: '10mb'
      },

      // CORS settings
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://medisync.example.com'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      }
    };

    // Logging and monitoring
    this.logging = {
      // Security event logging
      securityEvents: {
        enabled: true,
        level: 'info',
        format: 'json',
        retention: '1y', // Retain logs for 1 year
        piiHandling: 'masked' // Mask PII in logs
      },

      // Audit logging
      auditLogs: {
        enabled: true,
        level: 'info',
        format: 'json',
        retention: '7y', // Retain audit logs for 7 years (HIPAA requirement)
        piiHandling: 'excluded' // Exclude PII from audit logs
      }
    };

    // Compliance settings
    this.compliance = {
      // HIPAA settings
      hipaa: {
        enabled: true,
        businessAssociateAgreement: true,
        riskAssessmentInterval: '1y',
        trainingInterval: '6mo'
      },

      // GDPR settings
      gdpr: {
        enabled: true,
        dataProcessingAgreement: true,
        rightToErasure: true,
        dataPortability: true,
        privacyByDesign: true
      }
    };
  }

  /**
   * Get encryption configuration
   * @returns {Object} Encryption configuration
   */
  getEncryptionConfig() {
    return this.encryption;
  }

  /**
   * Get authentication configuration
   * @returns {Object} Authentication configuration
   */
  getAuthenticationConfig() {
    return this.authentication;
  }

  /**
   * Get API security configuration
   * @returns {Object} API security configuration
   */
  getApiSecurityConfig() {
    return this.apiSecurity;
  }

  /**
   * Get logging configuration
   * @returns {Object} Logging configuration
   */
  getLoggingConfig() {
    return this.logging;
  }

  /**
   * Get compliance configuration
   * @returns {Object} Compliance configuration
   */
  getComplianceConfig() {
    return this.compliance;
  }
}

module.exports = new SecurityConfig();