// MediSync Healthcare AI Platform - FACT MCP Security Manager
// Enhanced security and audit logging for the FACT MCP system

const crypto = require('crypto');
const winston = require('winston');

class SecurityManager {
  /**
   * Create a new security manager
   * @param {Object} config - Security configuration
   */
  constructor(config = {}) {
    this.config = {
      encryption: {
        enabled: true,
        algorithm: 'aes-256-cbc',
        ...config.encryption
      },
      audit: {
        enabled: true,
        logLevel: 'info',
        retentionDays: 90,
        ...config.audit
      },
      accessControl: {
        enabled: true,
        authenticationRequired: true,
        ...config.accessControl
      },
      compliance: {
        hipaa: {
          enabled: true,
          dataEncryption: true,
          auditLogging: true
        },
        fda: {
          enabled: true,
          validationRequired: true,
          evidenceTracking: true
        },
        gdpr: {
          enabled: true,
          dataMinimization: true,
          rightToErasure: true
        },
        ...config.compliance
      },
      ...config
    };

    this.auditLog = [];
    this.encryptionKey = this._generateEncryptionKey();
    this.logger = this._createAuditLogger();

    this.logger.info('Security manager initialized', {
      encryptionEnabled: this.config.encryption.enabled,
      auditEnabled: this.config.audit.enabled,
      accessControlEnabled: this.config.accessControl.enabled
    });
  }

  /**
   * Create audit logger instance
   * @returns {Object} Winston logger instance for audit logging
   * @private
   */
  _createAuditLogger() {
    return winston.createLogger({
      level: this.config.audit.logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'fact-mcp-security' },
      transports: [
        new winston.transports.File({
          filename: 'logs/fact-mcp-audit.log',
          level: this.config.audit.logLevel,
          maxsize: 10000000, // 10MB
          maxFiles: 5
        }),
        new winston.transports.File({
          filename: 'logs/fact-mcp-audit-error.log',
          level: 'error'
        })
      ]
    });
  }

  /**
   * Generate encryption key for data protection
   * @returns {Buffer} Encryption key
   * @private
   */
  _generateEncryptionKey() {
    // In a real implementation, this would be loaded from a secure key management system
    // For this implementation, we'll generate a key
    return crypto.randomBytes(32);
  }

  /**
   * Encrypt sensitive data
   * @param {string} data - Data to encrypt
   * @returns {Object} Encrypted data with IV and auth tag
   */
  encryptData(data) {
    if (!this.config.encryption.enabled) {
      return { data };
    }

    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.config.encryption.algorithm, this.encryptionKey, iv);

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        algorithm: this.config.encryption.algorithm
      };
    } catch (error) {
      this.logger.error('Failed to encrypt data', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Decrypt sensitive data
   * @param {Object} encryptedData - Encrypted data object
   * @returns {string} Decrypted data
   */
  decryptData(encryptedData) {
    if (!this.config.encryption.enabled) {
      return encryptedData.data;
    }

    try {
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const decipher = crypto.createDecipheriv(this.config.encryption.algorithm, this.encryptionKey, iv);

      let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logger.error('Failed to decrypt data', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Log security audit entry
   * @param {string} action - Action performed
   * @param {Object} details - Details of the action
   * @param {string} userId - User ID (if available)
   * @param {string} ipAddress - IP address (if available)
   * @returns {string} Audit entry ID
   */
  logAuditEntry(action, details = {}, userId = 'system', ipAddress = 'unknown') {
    if (!this.config.audit.enabled) {
      return null;
    }

    const auditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details,
      userId,
      ipAddress,
      compliance: this._getComplianceInfo(action, details)
    };

    this.auditLog.push(auditEntry);

    // Keep only the most recent audit entries based on retention policy
    this._maintainAuditLog();

    // Log to audit logger
    this.logger.info('Security audit entry created', {
      action,
      entryId: auditEntry.id,
      userId,
      ipAddress,
      compliance: auditEntry.compliance
    });

    return auditEntry.id;
  }

  /**
   * Get compliance information for an action
   * @param {string} action - Action performed
   * @param {Object} details - Action details
   * @returns {Object} Compliance information
   * @private
   */
  _getComplianceInfo(action, details) {
    const complianceInfo = {};

    // HIPAA compliance
    if (this.config.compliance.hipaa.enabled) {
      complianceInfo.hipaa = {
        dataEncrypted: this.config.compliance.hipaa.dataEncryption && this.config.encryption.enabled,
        auditLogged: this.config.compliance.hipaa.auditLogging && this.config.audit.enabled
      };
    }

    // FDA compliance
    if (this.config.compliance.fda.enabled) {
      complianceInfo.fda = {
        validationRequired: this.config.compliance.fda.validationRequired,
        evidenceTracked: this.config.compliance.fda.evidenceTracking
      };
    }

    // GDPR compliance
    if (this.config.compliance.gdpr.enabled) {
      complianceInfo.gdpr = {
        dataMinimized: this.config.compliance.gdpr.dataMinimization,
        rightToErasure: this.config.compliance.gdpr.rightToErasure
      };
    }

    return complianceInfo;
  }

  /**
   * Maintain audit log based on retention policy
   * @private
   */
  _maintainAuditLog() {
    const retentionCutoff = new Date();
    retentionCutoff.setDate(retentionCutoff.getDate() - this.config.audit.retentionDays);

    this.auditLog = this.auditLog.filter(entry =>
      new Date(entry.timestamp) >= retentionCutoff
    );

    // Also limit total entries
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-10000);
    }
  }

  /**
   * Get audit log entries
   * @param {Object} filter - Filter options
   * @returns {Array} Filtered audit log entries
   */
  getAuditLog(filter = {}) {
    let filteredLog = [...this.auditLog];

    if (filter.action) {
      filteredLog = filteredLog.filter(entry => entry.action === filter.action);
    }

    if (filter.userId) {
      filteredLog = filteredLog.filter(entry => entry.userId === filter.userId);
    }

    if (filter.startDate) {
      filteredLog = filteredLog.filter(entry => new Date(entry.timestamp) >= new Date(filter.startDate));
    }

    if (filter.endDate) {
      filteredLog = filteredLog.filter(entry => new Date(entry.timestamp) <= new Date(filter.endDate));
    }

    if (filter.compliance) {
      filteredLog = filteredLog.filter(entry => entry.compliance && entry.compliance[filter.compliance]);
    }

    // Sort by timestamp descending
    filteredLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filteredLog;
  }

  /**
   * Check user access permissions
   * @param {string} userId - User ID
   * @param {string} resource - Resource being accessed
   * @param {string} action - Action being performed
   * @returns {boolean} True if access is permitted
   */
  checkAccess(userId, resource, action) {
    if (!this.config.accessControl.enabled) {
      return true;
    }

    // In a real implementation, this would check against an access control system
    // For this implementation, we'll simulate access control
    const accessGranted = this._simulateAccessControl(userId, resource, action);

    if (!accessGranted) {
      this.logAuditEntry('access_denied', {
        resource,
        action,
        reason: 'insufficient_permissions'
      }, userId);
    }

    return accessGranted;
  }

  /**
   * Simulate access control check
   * @param {string} userId - User ID
   * @param {string} resource - Resource being accessed
   * @param {string} action - Action being performed
   * @returns {boolean} True if access is granted
   * @private
   */
  _simulateAccessControl(userId, resource, action) {
    // In a real implementation, this would check against a proper access control system
    // For this implementation, we'll grant access to all users for simplicity
    return true;
  }

  /**
   * Sanitize data for logging (remove sensitive information)
   * @param {Object} data - Data to sanitize
   * @returns {Object} Sanitized data
   */
  sanitizeForLogging(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };

    // Remove sensitive fields
    const sensitiveFields = [
      'password', 'secret', 'token', 'key', 'credentials',
      'ssn', 'social_security_number', 'patient_id', 'medical_record_number'
    ];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Get security configuration
   * @returns {Object} Security configuration
   */
  getConfiguration() {
    return {
      encryption: this.config.encryption,
      audit: this.config.audit,
      accessControl: this.config.accessControl,
      compliance: this.config.compliance
    };
  }

  /**
   * Get security statistics
   * @returns {Object} Security statistics
   */
  getStatistics() {
    return {
      auditLogEntries: this.auditLog.length,
      encryptionEnabled: this.config.encryption.enabled,
      auditEnabled: this.config.audit.enabled,
      accessControlEnabled: this.config.accessControl.enabled,
      compliance: {
        hipaa: this.config.compliance.hipaa.enabled,
        fda: this.config.compliance.fda.enabled,
        gdpr: this.config.compliance.gdpr.enabled
      }
    };
  }
}

module.exports = SecurityManager;