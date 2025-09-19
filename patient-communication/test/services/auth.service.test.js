/**
 * Authentication Service Tests
 * Tests for the authentication service
 */

const AuthService = require('../../src/services/auth.service.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock speakeasy
jest.mock('speakeasy', () => ({
  generateSecret: jest.fn(),
  totp: {
    verify: jest.fn()
  }
}));

describe('Authentication Service', () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    test('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const result = await authService.registerUser(userData);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.firstName).toBe(userData.firstName);
      expect(result.user.lastName).toBe(userData.lastName);
      expect(result.verificationToken).toBeDefined();
    });

    test('should throw an error for missing email', async () => {
      const userData = {
        password: 'Password123!'
      };

      await expect(authService.registerUser(userData))
        .rejects
        .toThrow('Email and password are required');
    });

    test('should throw an error for missing password', async () => {
      const userData = {
        email: 'test@example.com'
      };

      await expect(authService.registerUser(userData))
        .rejects
        .toThrow('Email and password are required');
    });

    test('should validate password strength', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'weak'
      };

      await expect(authService.registerUser(userData))
        .rejects
        .toThrow('Password must be at least 8 characters long');
    });
  });

  describe('authenticateUser', () => {
    test('should authenticate a valid user', async () => {
      const email = 'patient@example.com';
      const password = 'Password123!';

      const result = await authService.authenticateUser(email, password);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    test('should throw an error for missing email', async () => {
      await expect(authService.authenticateUser(null, 'Password123!'))
        .rejects
        .toThrow('Email and password are required');
    });

    test('should throw an error for missing password', async () => {
      await expect(authService.authenticateUser('test@example.com', null))
        .rejects
        .toThrow('Email and password are required');
    });

    test('should throw an error for invalid credentials', async () => {
      const email = 'invalid@example.com';
      const password = 'Password123!';

      await expect(authService.authenticateUser(email, password))
        .rejects
        .toThrow('Invalid email or password');
    });
  });

  describe('verifyEmail', () => {
    test('should verify user email', async () => {
      const userId = 'user_123';
      const token = 'verification_token';

      const result = await authService.verifyEmail(userId, token);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Email verified successfully');
    });

    test('should throw an error for missing user ID', async () => {
      await expect(authService.verifyEmail(null, 'verification_token'))
        .rejects
        .toThrow('User ID and verification token are required');
    });

    test('should throw an error for missing token', async () => {
      await expect(authService.verifyEmail('user_123', null))
        .rejects
        .toThrow('User ID and verification token are required');
    });
  });

  describe('generatePasswordResetToken', () => {
    test('should generate password reset token', async () => {
      const email = 'test@example.com';

      const result = await authService.generatePasswordResetToken(email);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.resetToken).toBeDefined();
      expect(result.resetTokenExpiry).toBeDefined();
    });

    test('should throw an error for missing email', async () => {
      await expect(authService.generatePasswordResetToken(null))
        .rejects
        .toThrow('Email is required');
    });
  });

  describe('resetPassword', () => {
    test('should reset user password', async () => {
      const token = 'reset_token';
      const newPassword = 'NewPassword123!';

      const result = await authService.resetPassword(token, newPassword);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Password reset successfully');
    });

    test('should throw an error for missing token', async () => {
      await expect(authService.resetPassword(null, 'NewPassword123!'))
        .rejects
        .toThrow('Reset token and new password are required');
    });

    test('should throw an error for missing new password', async () => {
      await expect(authService.resetPassword('reset_token', null))
        .rejects
        .toThrow('Reset token and new password are required');
    });

    test('should validate new password strength', async () => {
      const token = 'reset_token';
      const weakPassword = 'weak';

      await expect(authService.resetPassword(token, weakPassword))
        .rejects
        .toThrow('Password must be at least 8 characters long');
    });
  });

  describe('enableTwoFactorAuth', () => {
    test('should enable two-factor authentication', async () => {
      const userId = 'user_123';
      const mockSecret = {
        base32: 'SECRET123',
        otpauth_url: 'otpauth://totp/Test'
      };

      // Mock speakeasy.generateSecret
      require('speakeasy').generateSecret.mockReturnValue(mockSecret);

      const result = await authService.enableTwoFactorAuth(userId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.secret).toBe(mockSecret.base32);
      expect(result.qrCode).toBe(mockSecret.otpauth_url);
    });

    test('should throw an error for missing user ID', async () => {
      await expect(authService.enableTwoFactorAuth(null))
        .rejects
        .toThrow('User ID is required');
    });
  });

  describe('verifyTwoFactorToken', () => {
    test('should verify two-factor token', async () => {
      const userId = 'user_123';
      const secret = 'SECRET123';
      const token = '123456';

      // Mock speakeasy.totp.verify to return true
      require('speakeasy').totp.verify.mockReturnValue(true);

      const result = await authService.verifyTwoFactorToken(userId, secret, token);

      expect(result).toBe(true);
    });

    test('should throw an error for missing user ID', async () => {
      await expect(authService.verifyTwoFactorToken(null, 'SECRET123', '123456'))
        .rejects
        .toThrow('User ID, secret, and token are required');
    });

    test('should throw an error for missing secret', async () => {
      await expect(authService.verifyTwoFactorToken('user_123', null, '123456'))
        .rejects
        .toThrow('User ID, secret, and token are required');
    });

    test('should throw an error for missing token', async () => {
      await expect(authService.verifyTwoFactorToken('user_123', 'SECRET123', null))
        .rejects
        .toThrow('User ID, secret, and token are required');
    });
  });

  describe('validateToken', () => {
    test('should validate a valid JWT token', () => {
      const user = {
        id: 'user_123',
        email: 'test@example.com',
        role: 'patient'
      };

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        authService.config.jwt.secret,
        {
          expiresIn: '1h',
          issuer: authService.config.jwt.issuer,
          audience: authService.config.jwt.audience
        }
      );

      const result = authService.validateToken(token);

      expect(result).toBeDefined();
      expect(result.userId).toBe(user.id);
      expect(result.email).toBe(user.email);
      expect(result.role).toBe(user.role);
    });

    test('should throw an error for missing token', () => {
      expect(() => {
        authService.validateToken(null);
      }).toThrow('Token is required');
    });

    test('should throw an error for invalid token', () => {
      expect(() => {
        authService.validateToken('invalid_token');
      }).toThrow('Invalid or expired token');
    });
  });

  describe('refreshToken', () => {
    test('should refresh a valid refresh token', async () => {
      const user = {
        id: 'user_123',
        email: 'test@example.com',
        role: 'patient'
      };

      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        authService.config.jwt.secret,
        {
          expiresIn: '7d',
          issuer: authService.config.jwt.issuer,
          audience: authService.config.jwt.audience
        }
      );

      const result = await authService.refreshToken(refreshToken);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.accessToken).toBeDefined();
    });

    test('should throw an error for missing refresh token', async () => {
      await expect(authService.refreshToken(null))
        .rejects
        .toThrow('Refresh token is required');
    });

    test('should throw an error for invalid refresh token', async () => {
      await expect(authService.refreshToken('invalid_token'))
        .rejects
        .toThrow('Invalid or expired refresh token');
    });
  });

  describe('hasRole', () => {
    test('should return true for user with required role', () => {
      const user = { role: authService.roles.ADMIN };
      const requiredRole = authService.roles.PATIENT;

      const result = authService.hasRole(user, requiredRole);

      expect(result).toBe(true);
    });

    test('should return false for user without required role', () => {
      const user = { role: authService.roles.PATIENT };
      const requiredRole = authService.roles.ADMIN;

      const result = authService.hasRole(user, requiredRole);

      expect(result).toBe(false);
    });

    test('should return false for user without role', () => {
      const user = {};
      const requiredRole = authService.roles.PATIENT;

      const result = authService.hasRole(user, requiredRole);

      expect(result).toBe(false);
    });
  });

  describe('hasPermission', () => {
    test('should return true for user with required permission', () => {
      const user = { role: authService.roles.PATIENT };
      const permission = authService.permissions.READ_OWN_HEALTH_RECORDS;

      const result = authService.hasPermission(user, permission);

      expect(result).toBe(true);
    });

    test('should return false for user without required permission', () => {
      const user = { role: authService.roles.PATIENT };
      const permission = authService.permissions.ADMIN_ACCESS;

      const result = authService.hasPermission(user, permission);

      expect(result).toBe(false);
    });

    test('should return false for user without role', () => {
      const user = {};
      const permission = authService.permissions.READ_OWN_HEALTH_RECORDS;

      const result = authService.hasPermission(user, permission);

      expect(result).toBe(false);
    });
  });
});