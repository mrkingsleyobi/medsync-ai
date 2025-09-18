// MediSync Healthcare AI Platform - Privacy Manager
// This file implements privacy-preserving computation for the neural mesh

const winston = require('winston');
const crypto = require('crypto');

/**
 * Privacy Manager Class
 * Implements privacy-preserving computation techniques for healthcare data
 */
class PrivacyManager {
  /**
   * Create a new Privacy Manager
   * @param {Object} neuralMesh - Reference to the neural mesh
   * @param {Object} config - Privacy configuration
   */
  constructor(neuralMesh, config = {}) {
    this.neuralMesh = neuralMesh;
    this.config = config;
    this.logger = this._createLogger();
    this.encryptionKeys = new Map();
    this.anonymizationRules = new Map();
    this.differentialPrivacyParams = config.differentialPrivacy || {
      epsilon: 0.1,
      delta: 1e-5
    };

    // Initialize privacy techniques
    this._initializePrivacyTechniques();

    this.logger.info('Privacy Manager created', {
      service: 'privacy-manager',
      differentialPrivacy: this.differentialPrivacyParams
    });
  }

  /**
   * Create logger instance
   * @returns {Object} Winston logger instance
   */
  _createLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'privacy-manager' },
      transports: [
        new winston.transports.File({ filename: 'logs/privacy-manager-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/privacy-manager-combined.log' })
      ]
    });
  }

  /**
   * Initialize privacy techniques
   * @private
   */
  _initializePrivacyTechniques() {
    // Register anonymization rules for common PHI fields
    this._registerAnonymizationRules();

    // Generate initial encryption keys
    this._generateEncryptionKeys();

    this.logger.info('Privacy techniques initialized');
  }

  /**
   * Register anonymization rules for PHI fields
   * @private
   */
  _registerAnonymizationRules() {
    // Patient identifiers
    this.anonymizationRules.set('patient-id', this._anonymizePatientId.bind(this));
    this.anonymizationRules.set('name', this._anonymizeName.bind(this));
    this.anonymizationRules.set('address', this._anonymizeAddress.bind(this));
    this.anonymizationRules.set('phone', this._anonymizePhone.bind(this));
    this.anonymizationRules.set('email', this._anonymizeEmail.bind(this));
    this.anonymizationRules.set('ssn', this._anonymizeSSN.bind(this));
    this.anonymizationRules.set('dob', this._anonymizeDOB.bind(this));

    // Medical identifiers
    this.anonymizationRules.set('medical-record-number', this._anonymizeMRN.bind(this));
    this.anonymizationRules.set('insurance-id', this._anonymizeInsuranceId.bind(this));

    this.logger.info('Anonymization rules registered', {
      ruleCount: this.anonymizationRules.size
    });
  }

  /**
   * Generate encryption keys
   * @private
   */
  _generateEncryptionKeys() {
    // Generate AES-256 key for data encryption (32 bytes for 256-bit key)
    const aesKey = crypto.randomBytes(32);
    this.encryptionKeys.set('aes-256', aesKey);

    // Generate RSA key pair for key exchange
    // In a real implementation, we would use a proper key generation library
    // For this demo, we'll store placeholder keys
    this.encryptionKeys.set('rsa-public', 'public-key-placeholder');
    this.encryptionKeys.set('rsa-private', 'private-key-placeholder');

    this.logger.info('Encryption keys generated');
  }

  /**
   * Anonymize patient data by removing or transforming PHI
   * @param {Object} data - Patient data to anonymize
   * @param {Array} fieldsToAnonymize - Specific fields to anonymize
   * @returns {Object} Anonymized data
   */
  anonymizeData(data, fieldsToAnonymize = []) {
    if (!data) {
      return data;
    }

    const anonymizedData = JSON.parse(JSON.stringify(data)); // Deep copy

    // If no specific fields specified, apply all rules
    const fields = fieldsToAnonymize.length > 0 ? fieldsToAnonymize : Array.from(this.anonymizationRules.keys());

    for (const field of fields) {
      const rule = this.anonymizationRules.get(field);
      if (rule && anonymizedData[field] !== undefined) {
        try {
          anonymizedData[field] = rule(anonymizedData[field]);
        } catch (error) {
          this.logger.warn('Failed to anonymize field', {
            field,
            error: error.message
          });
        }
      }
    }

    // Recursively anonymize nested objects
    for (const [key, value] of Object.entries(anonymizedData)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        anonymizedData[key] = this.anonymizeData(value, fieldsToAnonymize);
      } else if (Array.isArray(value)) {
        anonymizedData[key] = value.map(item => {
          if (typeof item === 'object' && item !== null) {
            return this.anonymizeData(item, fieldsToAnonymize);
          }
          return item;
        });
      }
    }

    this.logger.info('Data anonymized successfully', {
      originalFields: Object.keys(data),
      anonymizedFields: fields
    });

    return anonymizedData;
  }

  /**
   * Anonymize patient ID
   * @param {string} patientId - Patient ID to anonymize
   * @returns {string} Anonymized patient ID
   * @private
   */
  _anonymizePatientId(patientId) {
    // Hash the patient ID to preserve uniqueness while removing identifying information
    return crypto.createHash('sha256').update(patientId).digest('hex').substring(0, 16);
  }

  /**
   * Anonymize name
   * @param {string} name - Name to anonymize
   * @returns {string} Anonymized name
   * @private
   */
  _anonymizeName(name) {
    // Replace with generic placeholder
    return '[ANONYMIZED]';
  }

  /**
   * Anonymize address
   * @param {string} address - Address to anonymize
   * @returns {string} Anonymized address
   * @private
   */
  _anonymizeAddress(address) {
    // Replace with generic placeholder
    return '[ANONYMIZED]';
  }

  /**
   * Anonymize phone number
   * @param {string} phone - Phone number to anonymize
   * @returns {string} Anonymized phone number
   * @private
   */
  _anonymizePhone(phone) {
    // Replace with generic placeholder
    return '[ANONYMIZED]';
  }

  /**
   * Anonymize email
   * @param {string} email - Email to anonymize
   * @returns {string} Anonymized email
   * @private
   */
  _anonymizeEmail(email) {
    // Replace with generic placeholder
    return '[ANONYMIZED]';
  }

  /**
   * Anonymize SSN
   * @param {string} ssn - SSN to anonymize
   * @returns {string} Anonymized SSN
   * @private
   */
  _anonymizeSSN(ssn) {
    // Replace with generic placeholder
    return '[ANONYMIZED]';
  }

  /**
   * Anonymize date of birth
   * @param {string} dob - Date of birth to anonymize
   * @returns {string} Anonymized date of birth
   * @private
   */
  _anonymizeDOB(dob) {
    // Replace with generic placeholder
    return '[ANONYMIZED]';
  }

  /**
   * Anonymize medical record number
   * @param {string} mrn - MRN to anonymize
   * @returns {string} Anonymized MRN
   * @private
   */
  _anonymizeMRN(mrn) {
    // Hash the MRN to preserve uniqueness while removing identifying information
    return crypto.createHash('sha256').update(mrn).digest('hex').substring(0, 16);
  }

  /**
   * Anonymize insurance ID
   * @param {string} insuranceId - Insurance ID to anonymize
   * @returns {string} Anonymized insurance ID
   * @private
   */
  _anonymizeInsuranceId(insuranceId) {
    // Hash the insurance ID to preserve uniqueness while removing identifying information
    return crypto.createHash('sha256').update(insuranceId).digest('hex').substring(0, 16);
  }

  /**
   * Apply differential privacy to numerical data
   * @param {number} value - Numerical value to perturb
   * @param {string} dataType - Type of data (for parameter selection)
   * @returns {number} Differentially private value
   */
  applyDifferentialPrivacy(value, dataType = 'general') {
    if (typeof value !== 'number') {
      return value;
    }

    // Get sensitivity based on data type
    const sensitivity = this._getSensitivity(dataType);

    // Generate Laplace noise
    const noise = this._generateLaplaceNoise(sensitivity, this.differentialPrivacyParams.epsilon);

    // Add noise to the value
    const privateValue = value + noise;

    this.logger.info('Differential privacy applied', {
      originalValue: value,
      privateValue: privateValue,
      noise: noise,
      sensitivity: sensitivity
    });

    return privateValue;
  }

  /**
   * Get sensitivity for differential privacy based on data type
   * @param {string} dataType - Type of data
   * @returns {number} Sensitivity value
   * @private
   */
  _getSensitivity(dataType) {
    // Sensitivity values for different data types
    const sensitivities = {
      'heart-rate': 30, // Normal range 30-200 bpm
      'blood-pressure': 50, // Normal range 90-140 mmHg
      'temperature': 10, // Normal range 95-105°F
      'glucose': 200, // Normal range 70-200 mg/dL
      'cholesterol': 300, // Normal range 150-400 mg/dL
      'general': 100 // Default sensitivity
    };

    return sensitivities[dataType] || sensitivities['general'];
  }

  /**
   * Generate Laplace noise for differential privacy
   * @param {number} sensitivity - Sensitivity of the function
   * @param {number} epsilon - Privacy parameter
   * @returns {number} Laplace noise
   * @private
   */
  _generateLaplaceNoise(sensitivity, epsilon) {
    // Generate uniform random number in (0, 1)
    const u = Math.random() - 0.5; // Uniform in (-0.5, 0.5)

    // Generate Laplace noise: scale = sensitivity / epsilon
    const scale = sensitivity / epsilon;
    const noise = -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));

    return noise;
  }

  /**
   * Encrypt data using AES-256
   * @param {string|Object} data - Data to encrypt
   * @param {string} keyId - Key identifier
   * @returns {string} Encrypted data (base64 encoded)
   */
  encryptData(data, keyId = 'aes-256') {
    try {
      const key = this.encryptionKeys.get(keyId);
      if (!key) {
        throw new Error(`Encryption key ${keyId} not found`);
      }

      // Convert data to string if it's an object
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);

      // Generate random IV
      const iv = crypto.randomBytes(16);

      // Create cipher
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

      // Encrypt data
      let encrypted = cipher.update(dataString, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Prepend IV to encrypted data
      const result = iv.toString('base64') + ':' + encrypted;

      this.logger.info('Data encrypted successfully', {
        keyId,
        dataSize: dataString.length
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to encrypt data', {
        error: error.message,
        keyId
      });
      throw error;
    }
  }

  /**
   * Decrypt data using AES-256
   * @param {string} encryptedData - Encrypted data (base64 encoded with IV)
   * @param {string} keyId - Key identifier
   * @returns {string|Object} Decrypted data
   */
  decryptData(encryptedData, keyId = 'aes-256') {
    try {
      const key = this.encryptionKeys.get(keyId);
      if (!key) {
        throw new Error(`Decryption key ${keyId} not found`);
      }

      // Split IV and encrypted data
      const parts = encryptedData.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'base64');
      const encrypted = parts[1];

      // Create decipher
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

      // Decrypt data
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      // Try to parse as JSON, otherwise return as string
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      this.logger.error('Failed to decrypt data', {
        error: error.message,
        keyId
      });
      throw error;
    }
  }

  /**
   * Generate secure hash of data for integrity verification
   * @param {string|Object} data - Data to hash
   * @returns {string} SHA-256 hash
   */
  generateHash(data) {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Verify data integrity using hash
   * @param {string|Object} data - Data to verify
   * @param {string} hash - Expected hash
   * @returns {boolean} True if hash matches
   */
  verifyHash(data, hash) {
    const computedHash = this.generateHash(data);
    return computedHash === hash;
  }

  /**
   * Get privacy configuration
   * @returns {Object} Privacy configuration
   */
  getPrivacyConfig() {
    return {
      differentialPrivacy: this.differentialPrivacyParams,
      anonymizationRules: Array.from(this.anonymizationRules.keys()),
      encryptionKeys: Array.from(this.encryptionKeys.keys())
    };
  }

  /**
   * Update differential privacy parameters
   * @param {Object} params - New differential privacy parameters
   */
  updateDifferentialPrivacyParams(params) {
    if (params.epsilon) {
      this.differentialPrivacyParams.epsilon = params.epsilon;
    }
    if (params.delta) {
      this.differentialPrivacyParams.delta = params.delta;
    }

    this.logger.info('Differential privacy parameters updated', {
      epsilon: this.differentialPrivacyParams.epsilon,
      delta: this.differentialPrivacyParams.delta
    });
  }
}

module.exports = PrivacyManager;