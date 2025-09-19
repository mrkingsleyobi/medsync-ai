/**
 * Authentication Controller
 * Controller for handling authentication and authorization requests
 */

const AuthService = require('../services/auth.service.js');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      // Register user
      const result = await this.authService.registerUser({
        email,
        password,
        firstName,
        lastName,
        role
      });

      // Return registration result
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for verification.',
        user: result.user,
        verificationToken: result.verificationToken
      });
    } catch (error) {
      console.error('User registration controller error', {
        error: error.message
      });

      // Handle specific error cases
      if (error.message.includes('Password')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to register user',
        message: error.message
      });
    }
  }

  /**
   * Authenticate user login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      // Authenticate user
      const result = await this.authService.authenticateUser(email, password);

      // Set cookies for tokens
      res.cookie('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return authentication result
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
        tokens: result.tokens
      });
    } catch (error) {
      console.error('User login controller error', {
        error: error.message
      });

      // Handle specific error cases
      if (error.message.includes('Invalid') || error.message.includes('verify')) {
        return res.status(401).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to authenticate user',
        message: error.message
      });
    }
  }

  /**
   * Verify user email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyEmail(req, res) {
    try {
      const { userId, token } = req.body;

      // Validate required fields
      if (!userId || !token) {
        return res.status(400).json({
          error: 'User ID and verification token are required'
        });
      }

      // Verify email
      const result = await this.authService.verifyEmail(userId, token);

      // Return verification result
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Email verification controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to verify email',
        message: error.message
      });
    }
  }

  /**
   * Request password reset
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      // Validate required fields
      if (!email) {
        return res.status(400).json({
          error: 'Email is required'
        });
      }

      // Generate password reset token
      const result = await this.authService.generatePasswordResetToken(email);

      // In a real implementation, you would send an email with the reset token
      // For demonstration, we'll just return the token

      // Return password reset result
      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to your email',
        resetToken: result.resetToken // In production, don't expose this!
      });
    } catch (error) {
      console.error('Password reset request controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to process password reset request',
        message: error.message
      });
    }
  }

  /**
   * Reset user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // Validate required fields
      if (!token || !newPassword) {
        return res.status(400).json({
          error: 'Reset token and new password are required'
        });
      }

      // Reset password
      const result = await this.authService.resetPassword(token, newPassword);

      // Return password reset result
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Password reset controller error', {
        error: error.message
      });

      // Handle specific error cases
      if (error.message.includes('Password')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to reset password',
        message: error.message
      });
    }
  }

  /**
   * Enable two-factor authentication
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async enableTwoFactorAuth(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated

      // Enable two-factor authentication
      const result = await this.authService.enableTwoFactorAuth(userId);

      // Return 2FA setup result
      res.status(200).json({
        success: true,
        message: 'Two-factor authentication enabled',
        secret: result.secret,
        qrCode: result.qrCode
      });
    } catch (error) {
      console.error('Two-factor authentication setup controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to enable two-factor authentication',
        message: error.message
      });
    }
  }

  /**
   * Verify two-factor authentication token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyTwoFactorToken(req, res) {
    try {
      const { secret, token } = req.body;
      const userId = req.user.userId; // Assuming user is authenticated

      // Validate required fields
      if (!secret || !token) {
        return res.status(400).json({
          error: 'Secret and token are required'
        });
      }

      // Verify two-factor token
      const isValid = await this.authService.verifyTwoFactorToken(userId, secret, token);

      // Return verification result
      if (isValid) {
        res.status(200).json({
          success: true,
          message: 'Two-factor token verified successfully'
        });
      } else {
        res.status(400).json({
          error: 'Invalid two-factor token'
        });
      }
    } catch (error) {
      console.error('Two-factor token verification controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to verify two-factor token',
        message: error.message
      });
    }
  }

  /**
   * Refresh JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      // Validate required fields
      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token is required'
        });
      }

      // Refresh token
      const result = await this.authService.refreshToken(refreshToken);

      // Set new access token cookie
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Return refresh result
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        accessToken: result.accessToken
      });
    } catch (error) {
      console.error('Token refresh controller error', {
        error: error.message
      });

      res.status(401).json({
        error: 'Failed to refresh token',
        message: error.message
      });
    }
  }

  /**
   * Logout user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logout(req, res) {
    try {
      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      // Return logout result
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to logout',
        message: error.message
      });
    }
  }

  /**
   * Check authentication status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async checkAuthStatus(req, res) {
    try {
      // If we reach this point, the user is authenticated
      res.status(200).json({
        success: true,
        authenticated: true,
        user: req.user
      });
    } catch (error) {
      console.error('Authentication status check controller error', {
        error: error.message
      });

      res.status(500).json({
        error: 'Failed to check authentication status',
        message: error.message
      });
    }
  }

  /**
   * Authorization middleware
   * @param {Array} requiredPermissions - Required permissions
   * @returns {Function} Middleware function
   */
  authorize(requiredPermissions = []) {
    return (req, res, next) => {
      try {
        // Get user from request (assumed to be set by authentication middleware)
        const user = req.user;

        // Check if user exists
        if (!user) {
          return res.status(401).json({
            error: 'Authentication required'
          });
        }

        // Check if permissions are required
        if (requiredPermissions.length > 0) {
          // Check if user has all required permissions
          const hasAllPermissions = requiredPermissions.every(permission =>
            this.authService.hasPermission(user, permission)
          );

          if (!hasAllPermissions) {
            return res.status(403).json({
              error: 'Insufficient permissions'
            });
          }
        }

        // User is authorized
        next();
      } catch (error) {
        console.error('Authorization middleware error', {
          error: error.message
        });

        res.status(500).json({
          error: 'Authorization check failed',
          message: error.message
        });
      }
    };
  }

  /**
   * Role-based authorization middleware
   * @param {string} requiredRole - Required role
   * @returns {Function} Middleware function
   */
  requireRole(requiredRole) {
    return (req, res, next) => {
      try {
        // Get user from request (assumed to be set by authentication middleware)
        const user = req.user;

        // Check if user exists
        if (!user) {
          return res.status(401).json({
            error: 'Authentication required'
          });
        }

        // Check if user has required role
        if (!this.authService.hasRole(user, requiredRole)) {
          return res.status(403).json({
            error: 'Insufficient role'
          });
        }

        // User has required role
        next();
      } catch (error) {
        console.error('Role-based authorization middleware error', {
          error: error.message
        });

        res.status(500).json({
          error: 'Role check failed',
          message: error.message
        });
      }
    };
  }
}

module.exports = AuthController;