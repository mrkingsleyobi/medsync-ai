const crypto = require('crypto');
const config = require('../config/security.config.js');

class SecurityService {
  constructor() {
    this.config = config;
    this.encryptionKey = this._generateOrRetrieveKey();
  }

  /**
   * Encrypt data using AES-256-GCM
   * @param {string} plaintext - Data to encrypt
   * @returns {Object} Encrypted data with IV and auth tag
   */
  encrypt(plaintext) {
    try {
      const algorithm = this.config.getEncryptionConfig().dataAtRest.algorithm;
      const key = this.encryptionKey;

      // Generate a random initialization vector
      const iv = crypto.randomBytes(
        this.config.getEncryptionConfig().dataAtRest.ivLength
      );

      // Create cipher
      const cipher = crypto.createCipherGCM(algorithm.split('-')[1], key, iv);

      // Encrypt the plaintext
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Get the authentication tag
      const tag = cipher.getAuthTag();

      return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   * @param {Object} encryptedData - Object containing encrypted data, IV, and auth tag
   * @returns {string} Decrypted plaintext
   */
  decrypt(encryptedData) {
    try {
      const algorithm = this.config.getEncryptionConfig().dataAtRest.algorithm;
      const key = this.encryptionKey;

      // Convert hex strings back to buffers
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const tag = Buffer.from(encryptedData.tag, 'hex');
      const encrypted = encryptedData.encryptedData;

      // Create decipher
      const decipher = crypto.createDecipherGCM(algorithm.split('-')[1], key, iv);
      decipher.setAuthTag(tag);

      // Decrypt the data
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Hash data using SHA-256
   * @param {string} data - Data to hash
   * @returns {string} Hashed data
   */
  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate a random salt
   * @param {number} length - Length of salt in bytes
   * @returns {string} Random salt
   */
  generateSalt(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a hash with salt
   * @param {string} data - Data to hash
   * @param {string} salt - Salt to use
   * @returns {string} Hashed data with salt
   */
  hashWithSalt(data, salt) {
    return crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
  }

  /**
   * Generate or retrieve encryption key
   * In production, this would retrieve the key from a secure key management system
   * @returns {Buffer} Encryption key
   */
  _generateOrRetrieveKey() {
    // In production, retrieve key from KMS or HSM
    // For demonstration, we'll generate a key
    return crypto.randomBytes(
      this.config.getEncryptionConfig().dataAtRest.keyLength / 8
    );
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  validatePassword(password) {
    const passwordConfig = this.config.getAuthenticationConfig().password;
    const errors = [];

    if (password.length < passwordConfig.minLength) {
      errors.push(`Password must be at least ${passwordConfig.minLength} characters long`);
    }

    if (passwordConfig.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (passwordConfig.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    if (passwordConfig.requireMixedCase &&
        (!/[a-z]/.test(password) || !/[A-Z]/.test(password))) {
      errors.push('Password must contain both uppercase and lowercase letters');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Generate TOTP secret for MFA
   * @returns {string} Base32 encoded secret
   */
  generateTOTPSecret() {
    // Generate a random secret
    const secret = crypto.randomBytes(20).toString('hex');
    // In production, this should be base32 encoded
    return secret;
  }

  /**
   * Verify TOTP token
   * @param {string} secret - TOTP secret
   * @param {string} token - TOTP token to verify
   * @returns {boolean} Whether token is valid
   */
  verifyTOTPToken(secret, token) {
    // In production, use a library like speakeasy to verify TOTP tokens
    // For demonstration, we'll just return true
    return true;
  }

  /**
   * Log security event
   * @param {string} eventType - Type of security event
   * @param {Object} eventData - Event data
   */
  logSecurityEvent(eventType, eventData) {
    const loggingConfig = this.config.getLoggingConfig().securityEvents;

    if (!loggingConfig.enabled) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType: eventType,
      severity: eventData.severity || 'info',
      source: eventData.source || 'unknown',
      message: eventData.message || '',
      userId: eventData.userId || null,
      ipAddress: eventData.ipAddress || null,
      userAgent: eventData.userAgent || null,
      // Mask PII in logs
      pii: this._maskPII(eventData.pii) || null
    };

    // In production, send to centralized logging system
    console.log(JSON.stringify(logEntry));
  }

  /**
   * Mask PII in log data
   * @param {Object} piiData - PII data to mask
   * @returns {Object} Masked PII data
   */
  _maskPII(piiData) {
    if (!piiData) {
      return null;
    }

    const masked = {};
    for (const [key, value] of Object.entries(piiData)) {
      if (typeof value === 'string') {
        // Mask strings longer than 3 characters
        if (value.length > 3) {
          masked[key] = value.substring(0, 2) + '*'.repeat(value.length - 2);
        } else {
          masked[key] = '*'.repeat(value.length);
        }
      } else {
        masked[key] = value;
      }
    }

    return masked;
  }

  /**
   * Check if IP is rate limited
   * @param {string} ipAddress - IP address to check
   * @returns {boolean} Whether IP is rate limited
   */
  isRateLimited(ipAddress) {
    const rateLimitConfig = this.config.getApiSecurityConfig().rateLimiting;

    if (!rateLimitConfig.enabled) {
      return false;
    }

    // In production, use a proper rate limiting implementation with Redis or similar
    // For demonstration, we'll just return false
    return false;
  }

  /**
   * Validate input data
   * @param {Object} data - Data to validate
   * @returns {Object} Validation result
   */
  validateInput(data) {
    const validationConfig = this.config.getApiSecurityConfig().inputValidation;

    if (!validationConfig.enabled) {
      return { valid: true };
    }

    const errors = [];

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(;.*?;)/,
      /(--|\#|\/\*)/
    ];

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        for (const pattern of sqlPatterns) {
          if (pattern.test(value)) {
            errors.push(`Invalid input in field '${key}': Potential SQL injection detected`);
          }
        }

        // Check for XSS patterns
        const xssPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /(<|&lt;)\/?([a-z]|\w)+/gi,
          /javascript:/gi
        ];

        for (const pattern of xssPatterns) {
          if (pattern.test(value)) {
            errors.push(`Invalid input in field '${key}': Potential XSS detected`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}

module.exports = SecurityService;