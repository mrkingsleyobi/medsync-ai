/**
 * Authentication Service
 * Service for handling user authentication and authorization
 */

const config = require('../config/auth.config.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const crypto = require('crypto');

class AuthService {
  constructor() {
    this.config = config;
    this.roles = config.roles;
    this.permissions = config.permissions;
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  async registerUser(userData) {
    try {
      // Validate input
      if (!userData || !userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }

      console.log('Registering new user', {
        email: userData.email
      });

      // Validate password strength
      this.validatePasswordStrength(userData.password);

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Generate verification token
      const verificationToken = this.generateVerificationToken();

      // Create user object
      const user = {
        id: this.generateUserId(),
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || this.roles.PATIENT,
        verified: false,
        verificationToken: verificationToken,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        failedLoginAttempts: 0,
        lockedUntil: null
      };

      // In a real implementation, this would save to a database
      // For demonstration, we'll just return the user object
      console.log('User registered successfully', {
        userId: user.id,
        email: user.email
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          verified: user.verified
        },
        verificationToken: verificationToken
      };
    } catch (error) {
      console.error('User registration failed', {
        error: error.message,
        email: userData ? userData.email : null
      });
      throw error;
    }
  }

  /**
   * Authenticate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result
   */
  async authenticateUser(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      console.log('Authenticating user', {
        email: email
      });

      // In a real implementation, this would retrieve user from database
      // For demonstration, we'll create a mock user
      const user = this.getMockUser(email);

      // Check if user exists
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if account is locked
      if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        throw new Error('Account is locked. Please try again later.');
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password);
      if (!isValidPassword) {
        // Increment failed login attempts
        await this.incrementFailedLoginAttempts(user.id);
        throw new Error('Invalid email or password');
      }

      // Reset failed login attempts
      await this.resetFailedLoginAttempts(user.id);

      // Check if account is verified
      if (this.config.verification.emailVerificationRequired && !user.verified) {
        throw new Error('Please verify your email address before logging in');
      }

      // Update last login
      user.lastLogin = new Date().toISOString();

      // Generate JWT tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      console.log('User authenticated successfully', {
        userId: user.id,
        email: user.email
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      };
    } catch (error) {
      console.error('User authentication failed', {
        error: error.message,
        email: email
      });
      throw error;
    }
  }

  /**
   * Verify user email
   * @param {string} userId - User ID
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Verification result
   */
  async verifyEmail(userId, token) {
    try {
      // Validate input
      if (!userId || !token) {
        throw new Error('User ID and verification token are required');
      }

      console.log('Verifying user email', {
        userId: userId
      });

      // In a real implementation, this would retrieve user from database
      // For demonstration, we'll assume verification is successful
      console.log('Email verified successfully', {
        userId: userId
      });

      return {
        success: true,
        message: 'Email verified successfully'
      };
    } catch (error) {
      console.error('Email verification failed', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Generate password reset token
   * @param {string} email - User email
   * @returns {Promise<Object>} Password reset token
   */
  async generatePasswordResetToken(email) {
    try {
      // Validate input
      if (!email) {
        throw new Error('Email is required');
      }

      console.log('Generating password reset token', {
        email: email
      });

      // In a real implementation, this would retrieve user from database
      // For demonstration, we'll create a mock token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + this.config.passwordReset.tokenExpiry * 60 * 60 * 1000);

      console.log('Password reset token generated', {
        email: email
      });

      return {
        success: true,
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry
      };
    } catch (error) {
      console.error('Password reset token generation failed', {
        error: error.message,
        email: email
      });
      throw error;
    }
  }

  /**
   * Reset user password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password reset result
   */
  async resetPassword(token, newPassword) {
    try {
      // Validate input
      if (!token || !newPassword) {
        throw new Error('Reset token and new password are required');
      }

      // Validate password strength
      this.validatePasswordStrength(newPassword);

      console.log('Resetting user password');

      // In a real implementation, this would verify token and update password in database
      // For demonstration, we'll assume success
      const hashedPassword = await this.hashPassword(newPassword);

      console.log('Password reset successfully');

      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('Password reset failed', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Enable two-factor authentication
   * @param {string} userId - User ID
   * @returns {Promise<Object>} 2FA setup result
   */
  async enableTwoFactorAuth(userId) {
    try {
      // Validate input
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log('Enabling two-factor authentication', {
        userId: userId
      });

      // Generate secret for TOTP
      const secret = speakeasy.generateSecret({
        name: `${this.config.twoFactor.issuer}:${userId}`,
        issuer: this.config.twoFactor.issuer
      });

      // In a real implementation, this would save secret to database
      // For demonstration, we'll just return the secret
      console.log('Two-factor authentication enabled', {
        userId: userId
      });

      return {
        success: true,
        secret: secret.base32,
        qrCode: secret.otpauth_url
      };
    } catch (error) {
      console.error('Two-factor authentication setup failed', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Verify two-factor authentication token
   * @param {string} userId - User ID
   * @param {string} secret - TOTP secret
   * @param {string} token - TOTP token
   * @returns {Promise<boolean>} Verification result
   */
  async verifyTwoFactorToken(userId, secret, token) {
    try {
      // Validate input
      if (!userId || !secret || !token) {
        throw new Error('User ID, secret, and token are required');
      }

      // Verify token
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: this.config.twoFactor.window,
        step: this.config.twoFactor.step
      });

      return verified;
    } catch (error) {
      console.error('Two-factor token verification failed', {
        error: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Validate JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  validateToken(token) {
    try {
      // Validate input
      if (!token) {
        throw new Error('Token is required');
      }

      // Verify token
      const decoded = jwt.verify(token, this.config.jwt.secret, {
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience
      });

      return decoded;
    } catch (error) {
      console.error('Token validation failed', {
        error: error.message
      });
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Refresh JWT token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New access token
   */
  async refreshToken(refreshToken) {
    try {
      // Validate input
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.config.jwt.secret, {
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience
      });

      // Generate new access token
      const user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };

      const newAccessToken = this.generateAccessToken(user);

      return {
        success: true,
        accessToken: newAccessToken
      };
    } catch (error) {
      console.error('Token refresh failed', {
        error: error.message
      });
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Check if user has required role
   * @param {Object} user - User object
   * @param {string} requiredRole - Required role
   * @returns {boolean} Authorization result
   */
  hasRole(user, requiredRole) {
    if (!user || !user.role) {
      return false;
    }

    // Define role hierarchy
    const roleHierarchy = {
      [this.roles.PATIENT]: 1,
      [this.roles.CAREGIVER]: 2,
      [this.roles.PROVIDER]: 3,
      [this.roles.ADMIN]: 4
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  /**
   * Check if user has required permission
   * @param {Object} user - User object
   * @param {string} permission - Required permission
   * @returns {boolean} Authorization result
   */
  hasPermission(user, permission) {
    if (!user || !user.role) {
      return false;
    }

    // Define role-based permissions
    const rolePermissions = {
      [this.roles.PATIENT]: [
        this.permissions.READ_OWN_HEALTH_RECORDS,
        this.permissions.WRITE_OWN_HEALTH_RECORDS,
        this.permissions.READ_OWN_MEDICATIONS,
        this.permissions.WRITE_OWN_MEDICATIONS,
        this.permissions.READ_OWN_APPOINTMENTS,
        this.permissions.WRITE_OWN_APPOINTMENTS,
        this.permissions.READ_OWN_DOCUMENTS,
        this.permissions.WRITE_OWN_DOCUMENTS,
        this.permissions.READ_OWN_EDUCATION,
        this.permissions.WRITE_OWN_JOURNAL,
        this.permissions.READ_OWN_MESSAGES,
        this.permissions.WRITE_OWN_MESSAGES
      ],
      [this.roles.CAREGIVER]: [
        this.permissions.READ_OWN_HEALTH_RECORDS,
        this.permissions.WRITE_OWN_HEALTH_RECORDS,
        this.permissions.READ_OWN_MEDICATIONS,
        this.permissions.WRITE_OWN_MEDICATIONS,
        this.permissions.READ_OWN_APPOINTMENTS,
        this.permissions.WRITE_OWN_APPOINTMENTS,
        this.permissions.READ_OWN_DOCUMENTS,
        this.permissions.WRITE_OWN_DOCUMENTS,
        this.permissions.READ_OWN_EDUCATION,
        this.permissions.WRITE_OWN_JOURNAL,
        this.permissions.READ_OWN_MESSAGES,
        this.permissions.WRITE_OWN_MESSAGES
      ],
      [this.roles.PROVIDER]: [
        this.permissions.READ_OWN_HEALTH_RECORDS,
        this.permissions.WRITE_OWN_HEALTH_RECORDS,
        this.permissions.READ_OWN_MEDICATIONS,
        this.permissions.WRITE_OWN_MEDICATIONS,
        this.permissions.READ_OWN_APPOINTMENTS,
        this.permissions.WRITE_OWN_APPOINTMENTS,
        this.permissions.READ_OWN_DOCUMENTS,
        this.permissions.WRITE_OWN_DOCUMENTS,
        this.permissions.READ_OWN_EDUCATION,
        this.permissions.WRITE_OWN_JOURNAL,
        this.permissions.READ_OWN_MESSAGES,
        this.permissions.WRITE_OWN_MESSAGES
      ],
      [this.roles.ADMIN]: Object.values(this.permissions)
    };

    return rolePermissions[user.role].includes(permission);
  }

  // Helper methods

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   */
  validatePasswordStrength(password) {
    if (password.length < this.config.password.minLength) {
      throw new Error(`Password must be at least ${this.config.password.minLength} characters long`);
    }

    if (this.config.password.requireUppercase && !/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (this.config.password.requireLowercase && !/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (this.config.password.requireNumbers && !/\d/.test(password)) {
      throw new Error('Password must contain at least one number');
    }

    if (this.config.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new Error('Password must contain at least one special character');
    }
  }

  /**
   * Hash password
   * @param {string} password - Password to hash
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, this.config.security.bcryptRounds);
  }

  /**
   * Verify password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} Verification result
   */
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate verification token
   * @returns {string} Verification token
   */
  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate user ID
   * @returns {string} User ID
   */
  generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate access token
   * @param {Object} user - User object
   * @returns {string} JWT access token
   */
  generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      this.config.jwt.secret,
      {
        expiresIn: this.config.jwt.expiresIn,
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience
      }
    );
  }

  /**
   * Generate refresh token
   * @param {Object} user - User object
   * @returns {string} JWT refresh token
   */
  generateRefreshToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      this.config.jwt.secret,
      {
        expiresIn: this.config.jwt.refreshExpiresIn,
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience
      }
    );
  }

  /**
   * Increment failed login attempts
   * @param {string} userId - User ID
   */
  async incrementFailedLoginAttempts(userId) {
    // In a real implementation, this would update the user in the database
    console.log(`Incrementing failed login attempts for user ${userId}`);
  }

  /**
   * Reset failed login attempts
   * @param {string} userId - User ID
   */
  async resetFailedLoginAttempts(userId) {
    // In a real implementation, this would update the user in the database
    console.log(`Resetting failed login attempts for user ${userId}`);
  }

  /**
   * Get mock user for demonstration
   * @param {string} email - User email
   * @returns {Object} Mock user object
   */
  getMockUser(email) {
    // In a real implementation, this would retrieve user from database
    // For demonstration, we'll return a mock user if email matches
    if (email === 'patient@example.com') {
      return {
        id: 'user_1234567890',
        email: 'patient@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', // bcrypt hash of "Password123!"
        firstName: 'John',
        lastName: 'Doe',
        role: this.roles.PATIENT,
        verified: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        lastLogin: null,
        failedLoginAttempts: 0,
        lockedUntil: null
      };
    }
    return null;
  }
}

module.exports = AuthService;