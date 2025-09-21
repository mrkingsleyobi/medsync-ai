/**
 * Authentication Controller Tests
 * Tests for the authentication controller
 */

const AuthController = require('../../src/controllers/auth.controller.js');

// Mock the AuthService
jest.mock('../../src/services/auth.service.js');

describe('Authentication Controller', () => {
  let authController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    authController = new AuthController();
    mockReq = {
      body: {},
      params: {},
      query: {},
      cookies: {},
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn()
    };
  });

  describe('register', () => {
    test('should register a new user', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const firstName = 'Test';
      const lastName = 'User';
      const result = {
        user: { id: 'user_123', email, firstName, lastName },
        verificationToken: 'verification_token'
      };

      mockReq.body = { email, password, firstName, lastName };

      // Mock the service method
      authController.authService.registerUser.mockResolvedValue(result);

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully. Please check your email for verification.',
        user: result.user,
        verificationToken: result.verificationToken
      });
    });

    test('should return 400 if email is missing', async () => {
      mockReq.body = { password: 'Password123!' };

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email and password are required'
      });
    });

    test('should return 400 if password is missing', async () => {
      mockReq.body = { email: 'test@example.com' };

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email and password are required'
      });
    });

    test('should return 400 if password is weak', async () => {
      const email = 'test@example.com';
      const weakPassword = 'weak';
      const errorMessage = 'Password must be at least 8 characters long';

      mockReq.body = { email, password: weakPassword };

      // Mock the service method to throw an error
      authController.authService.registerUser.mockRejectedValue(new Error(errorMessage));

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws an error', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const errorMessage = 'Service error';

      mockReq.body = { email, password };

      // Mock the service method to throw an error
      authController.authService.registerUser.mockRejectedValue(new Error(errorMessage));

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to register user',
        message: errorMessage
      });
    });
  });

  describe('login', () => {
    test('should authenticate user login', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const result = {
        user: { id: 'user_123', email },
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token'
        }
      };

      mockReq.body = { email, password };

      // Mock the service method
      authController.authService.authenticateUser.mockResolvedValue(result);

      await authController.login(mockReq, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', result.tokens.accessToken, expect.any(Object));
      expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', result.tokens.refreshToken, expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        user: result.user,
        tokens: result.tokens
      });
    });

    test('should return 400 if email is missing', async () => {
      mockReq.body = { password: 'Password123!' };

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email and password are required'
      });
    });

    test('should return 401 if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrong_password';
      const errorMessage = 'Invalid email or password';

      mockReq.body = { email, password };

      // Mock the service method to throw an error
      authController.authService.authenticateUser.mockRejectedValue(new Error(errorMessage));

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws an error', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const errorMessage = 'Service error';

      mockReq.body = { email, password };

      // Mock the service method to throw an error
      authController.authService.authenticateUser.mockRejectedValue(new Error(errorMessage));

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to authenticate user',
        message: errorMessage
      });
    });
  });

  describe('verifyEmail', () => {
    test('should verify user email', async () => {
      const userId = 'user_123';
      const token = 'verification_token';
      const result = { message: 'Email verified successfully' };

      mockReq.body = { userId, token };

      // Mock the service method
      authController.authService.verifyEmail.mockResolvedValue(result);

      await authController.verifyEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message
      });
    });

    test('should return 400 if userId is missing', async () => {
      mockReq.body = { token: 'verification_token' };

      await authController.verifyEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User ID and verification token are required'
      });
    });

    test('should return 400 if token is missing', async () => {
      mockReq.body = { userId: 'user_123' };

      await authController.verifyEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User ID and verification token are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const token = 'verification_token';
      const errorMessage = 'Service error';

      mockReq.body = { userId, token };

      // Mock the service method to throw an error
      authController.authService.verifyEmail.mockRejectedValue(new Error(errorMessage));

      await authController.verifyEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to verify email',
        message: errorMessage
      });
    });
  });

  describe('requestPasswordReset', () => {
    test('should request password reset', async () => {
      const email = 'test@example.com';
      const result = { resetToken: 'reset_token' };

      mockReq.body = { email };

      // Mock the service method
      authController.authService.generatePasswordResetToken.mockResolvedValue(result);

      await authController.requestPasswordReset(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset instructions sent to your email',
        resetToken: result.resetToken
      });
    });

    test('should return 400 if email is missing', async () => {
      mockReq.body = {};

      await authController.requestPasswordReset(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Service error';

      mockReq.body = { email };

      // Mock the service method to throw an error
      authController.authService.generatePasswordResetToken.mockRejectedValue(new Error(errorMessage));

      await authController.requestPasswordReset(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to process password reset request',
        message: errorMessage
      });
    });
  });

  describe('resetPassword', () => {
    test('should reset user password', async () => {
      const token = 'reset_token';
      const newPassword = 'NewPassword123!';
      const result = { message: 'Password reset successfully' };

      mockReq.body = { token, newPassword };

      // Mock the service method
      authController.authService.resetPassword.mockResolvedValue(result);

      await authController.resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message
      });
    });

    test('should return 400 if token is missing', async () => {
      mockReq.body = { newPassword: 'NewPassword123!' };

      await authController.resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Reset token and new password are required'
      });
    });

    test('should return 400 if newPassword is missing', async () => {
      mockReq.body = { token: 'reset_token' };

      await authController.resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Reset token and new password are required'
      });
    });

    test('should return 400 if new password is weak', async () => {
      const token = 'reset_token';
      const weakPassword = 'weak';
      const errorMessage = 'Password must be at least 8 characters long';

      mockReq.body = { token, newPassword: weakPassword };

      // Mock the service method to throw an error
      authController.authService.resetPassword.mockRejectedValue(new Error(errorMessage));

      await authController.resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });

    test('should return 500 if service throws an error', async () => {
      const token = 'reset_token';
      const newPassword = 'NewPassword123!';
      const errorMessage = 'Service error';

      mockReq.body = { token, newPassword };

      // Mock the service method to throw an error
      authController.authService.resetPassword.mockRejectedValue(new Error(errorMessage));

      await authController.resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to reset password',
        message: errorMessage
      });
    });
  });

  describe('enableTwoFactorAuth', () => {
    test('should enable two-factor authentication', async () => {
      const userId = 'user_123';
      const result = {
        secret: 'SECRET123',
        qrCode: 'otpauth://totp/Test'
      };

      mockReq.user = { userId };

      // Mock the service method
      authController.authService.enableTwoFactorAuth.mockResolvedValue(result);

      await authController.enableTwoFactorAuth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Two-factor authentication enabled',
        secret: result.secret,
        qrCode: result.qrCode
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const errorMessage = 'Service error';

      mockReq.user = { userId };

      // Mock the service method to throw an error
      authController.authService.enableTwoFactorAuth.mockRejectedValue(new Error(errorMessage));

      await authController.enableTwoFactorAuth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to enable two-factor authentication',
        message: errorMessage
      });
    });
  });

  describe('verifyTwoFactorToken', () => {
    test('should verify two-factor token successfully', async () => {
      const userId = 'user_123';
      const secret = 'SECRET123';
      const token = '123456';

      mockReq.user = { userId };
      mockReq.body = { secret, token };

      // Mock the service method to return true
      authController.authService.verifyTwoFactorToken.mockResolvedValue(true);

      await authController.verifyTwoFactorToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Two-factor token verified successfully'
      });
    });

    test('should return 400 if secret is missing', async () => {
      const userId = 'user_123';
      mockReq.user = { userId };
      mockReq.body = { token: '123456' };

      await authController.verifyTwoFactorToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Secret and token are required'
      });
    });

    test('should return 400 if token is missing', async () => {
      const userId = 'user_123';
      mockReq.user = { userId };
      mockReq.body = { secret: 'SECRET123' };

      await authController.verifyTwoFactorToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Secret and token are required'
      });
    });

    test('should return 400 if token is invalid', async () => {
      const userId = 'user_123';
      const secret = 'SECRET123';
      const token = '123456';

      mockReq.user = { userId };
      mockReq.body = { secret, token };

      // Mock the service method to return false
      authController.authService.verifyTwoFactorToken.mockResolvedValue(false);

      await authController.verifyTwoFactorToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid two-factor token'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const secret = 'SECRET123';
      const token = '123456';
      const errorMessage = 'Service error';

      mockReq.user = { userId };
      mockReq.body = { secret, token };

      // Mock the service method to throw an error
      authController.authService.verifyTwoFactorToken.mockRejectedValue(new Error(errorMessage));

      await authController.verifyTwoFactorToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to verify two-factor token',
        message: errorMessage
      });
    });
  });

  describe('refreshToken', () => {
    test('should refresh JWT token from cookies', async () => {
      const refreshToken = 'refresh_token';
      const result = { accessToken: 'new_access_token' };

      mockReq.cookies = { refreshToken };

      // Mock the service method
      authController.authService.refreshToken.mockResolvedValue(result);

      await authController.refreshToken(mockReq, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', result.accessToken, expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Token refreshed successfully',
        accessToken: result.accessToken
      });
    });

    test('should refresh JWT token from body', async () => {
      const refreshToken = 'refresh_token';
      const result = { accessToken: 'new_access_token' };

      mockReq.body = { refreshToken };

      // Mock the service method
      authController.authService.refreshToken.mockResolvedValue(result);

      await authController.refreshToken(mockReq, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', result.accessToken, expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Token refreshed successfully',
        accessToken: result.accessToken
      });
    });

    test('should return 400 if refresh token is missing', async () => {
      mockReq.cookies = {};
      mockReq.body = {};

      await authController.refreshToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Refresh token is required'
      });
    });

    test('should return 401 if refresh token is invalid', async () => {
      const refreshToken = 'invalid_token';
      const errorMessage = 'Invalid or expired refresh token';

      mockReq.cookies = { refreshToken };

      // Mock the service method to throw an error
      authController.authService.refreshToken.mockRejectedValue(new Error(errorMessage));

      await authController.refreshToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to refresh token',
        message: errorMessage
      });
    });
  });

  describe('logout', () => {
    test('should logout user', async () => {
      await authController.logout(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const errorMessage = 'Service error';

      // Mock the clearCookie method to throw an error
      mockRes.clearCookie.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await authController.logout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to logout',
        message: errorMessage
      });
    });
  });

  describe('checkAuthStatus', () => {
    test('should check authentication status', async () => {
      const user = { id: 'user_123', email: 'test@example.com' };

      mockReq.user = user;

      await authController.checkAuthStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        authenticated: true,
        user: user
      });
    });

    test('should return 500 if service throws an error', async () => {
      const errorMessage = 'Service error';

      // Mock the req.user property to throw an error
      Object.defineProperty(mockReq, 'user', {
        get: () => {
          throw new Error(errorMessage);
        }
      });

      await authController.checkAuthStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to check authentication status',
        message: errorMessage
      });
    });
  });

  describe('authorize', () => {
    test('should call next() if user is authorized', () => {
      const requiredPermissions = ['read_health_records'];
      const user = { id: 'user_123', role: 'patient' };
      const next = jest.fn();

      mockReq.user = user;

      // Mock the service method to return true
      authController.authService.hasPermission.mockReturnValue(true);

      const middleware = authController.authorize(requiredPermissions);
      middleware(mockReq, mockRes, next);

      expect(next).toHaveBeenCalled();
    });

    test('should return 401 if user is not authenticated', () => {
      const requiredPermissions = ['read_health_records'];

      mockReq.user = null;

      const middleware = authController.authorize(requiredPermissions);
      middleware(mockReq, mockRes, () => {});

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Authentication required'
      });
    });

    test('should return 403 if user does not have required permissions', () => {
      const requiredPermissions = ['admin_access'];
      const user = { id: 'user_123', role: 'patient' };

      mockReq.user = user;

      // Mock the service method to return false
      authController.authService.hasPermission.mockReturnValue(false);

      const middleware = authController.authorize(requiredPermissions);
      middleware(mockReq, mockRes, () => {});

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions'
      });
    });
  });

  describe('requireRole', () => {
    test('should call next() if user has required role', () => {
      const requiredRole = 'patient';
      const user = { id: 'user_123', role: 'patient' };
      const next = jest.fn();

      mockReq.user = user;

      // Mock the service method to return true
      authController.authService.hasRole.mockReturnValue(true);

      const middleware = authController.requireRole(requiredRole);
      middleware(mockReq, mockRes, next);

      expect(next).toHaveBeenCalled();
    });

    test('should return 401 if user is not authenticated', () => {
      const requiredRole = 'patient';

      mockReq.user = null;

      const middleware = authController.requireRole(requiredRole);
      middleware(mockReq, mockRes, () => {});

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Authentication required'
      });
    });

    test('should return 403 if user does not have required role', () => {
      const requiredRole = 'admin';
      const user = { id: 'user_123', role: 'patient' };

      mockReq.user = user;

      // Mock the service method to return false
      authController.authService.hasRole.mockReturnValue(false);

      const middleware = authController.requireRole(requiredRole);
      middleware(mockReq, mockRes, () => {});

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Insufficient role'
      });
    });
  });
});