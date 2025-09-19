/**
 * Authentication Configuration
 * Configuration for the authentication and authorization system
 */

module.exports = {
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'medisync-patient-portal-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
    issuer: 'medisync-healthcare-ai-platform',
    audience: 'medisync-patient-portal'
  },

  // Password settings
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDuration: 30 // minutes
  },

  // Session settings
  session: {
    secret: process.env.SESSION_SECRET || 'medisync-session-secret',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  },

  // OAuth settings
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: '/auth/google/callback'
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackUrl: '/auth/facebook/callback'
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackUrl: '/auth/microsoft/callback'
    }
  },

  // Two-factor authentication settings
  twoFactor: {
    enabled: true,
    issuer: 'MediSync Patient Portal',
    digits: 6,
    window: 1, // number of time windows to check
    step: 30 // seconds
  },

  // Account verification settings
  verification: {
    emailVerificationRequired: true,
    phoneVerificationRequired: false,
    verificationTokenExpiry: 24 // hours
  },

  // Password reset settings
  passwordReset: {
    tokenExpiry: 1, // hours
    maxRequestsPerHour: 5
  },

  // Role-based access control
  roles: {
    PATIENT: 'patient',
    CAREGIVER: 'caregiver',
    PROVIDER: 'provider',
    ADMIN: 'admin'
  },

  // Permissions
  permissions: {
    READ_OWN_HEALTH_RECORDS: 'read:own_health_records',
    WRITE_OWN_HEALTH_RECORDS: 'write:own_health_records',
    READ_OWN_MEDICATIONS: 'read:own_medications',
    WRITE_OWN_MEDICATIONS: 'write:own_medications',
    READ_OWN_APPOINTMENTS: 'read:own_appointments',
    WRITE_OWN_APPOINTMENTS: 'write:own_appointments',
    READ_OWN_DOCUMENTS: 'read:own_documents',
    WRITE_OWN_DOCUMENTS: 'write:own_documents',
    READ_OWN_EDUCATION: 'read:own_education',
    WRITE_OWN_JOURNAL: 'write:own_journal',
    READ_OWN_MESSAGES: 'read:own_messages',
    WRITE_OWN_MESSAGES: 'write:own_messages'
  },

  // Security settings
  security: {
    encryptPasswords: true,
    hashAlgorithm: 'bcrypt',
    bcryptRounds: 12,
    sanitizeInput: true,
    validateOutput: true,
    auditLogging: true,
    rateLimiting: {
      authAttempts: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5 // limit each IP to 5 requests per windowMs
      },
      accountCreation: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3 // limit each IP to 3 account creations per windowMs
      }
    }
  },

  // Compliance settings
  compliance: {
    hipaaCompliant: true,
    gdprCompliant: true,
    dataRetentionDays: 365
  }
};