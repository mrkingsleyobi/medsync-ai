# Security Service Tests for MediSync Healthcare AI Platform

## Overview

This file contains unit tests for the security service implementation.

## Tests

```javascript
const SecurityService = require('../../src/services/security.service.js');

describe('SecurityService', () => {
  let securityService;

  beforeEach(() => {
    securityService = new SecurityService();
  });

  describe('encrypt and decrypt', () => {
    test('should encrypt and decrypt data correctly', () => {
      const plaintext = 'This is a test message';
      const encryptedData = securityService.encrypt(plaintext);
      const decryptedData = securityService.decrypt(encryptedData);

      expect(decryptedData).toBe(plaintext);
      expect(encryptedData.encryptedData).toBeDefined();
      expect(encryptedData.iv).toBeDefined();
      expect(encryptedData.tag).toBeDefined();
    });

    test('should throw error when decrypting with invalid data', () => {
      const invalidEncryptedData = {
        encryptedData: 'invalid',
        iv: 'invalid',
        tag: 'invalid'
      };

      expect(() => {
        securityService.decrypt(invalidEncryptedData);
      }).toThrow();
    });
  });

  describe('hash', () => {
    test('should hash data correctly', () => {
      const data = 'test data';
      const hashedData = securityService.hash(data);

      expect(hashedData).toHaveLength(64); // SHA-256 produces 64-character hex string
      expect(hashedData).toMatch(/^[a-f0-9]{64}$/);
    });

    test('should produce different hashes for different data', () => {
      const data1 = 'test data 1';
      const data2 = 'test data 2';
      const hash1 = securityService.hash(data1);
      const hash2 = securityService.hash(data2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateSalt', () => {
    test('should generate salt of correct length', () => {
      const salt = securityService.generateSalt();
      expect(salt).toHaveLength(64); // 32 bytes = 64 hex characters
    });

    test('should generate different salts each time', () => {
      const salt1 = securityService.generateSalt();
      const salt2 = securityService.generateSalt();

      expect(salt1).not.toBe(salt2);
    });
  });

  describe('hashWithSalt', () => {
    test('should hash data with salt correctly', () => {
      const data = 'test data';
      const salt = securityService.generateSalt();
      const hashedData = securityService.hashWithSalt(data, salt);

      expect(hashedData).toHaveLength(128); // PBKDF2 with SHA-512 produces 128-character hex string
      expect(hashedData).toMatch(/^[a-f0-9]{128}$/);
    });
  });

  describe('validatePassword', () => {
    test('should validate strong password correctly', () => {
      const strongPassword = 'StrongPass123!';
      const validationResult = securityService.validatePassword(strongPassword);

      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });

    test('should reject password that is too short', () => {
      const shortPassword = 'Short1!';
      const validationResult = securityService.validatePassword(shortPassword);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toContain('Password must be at least 12 characters long');
    });

    test('should reject password without numbers', () => {
      const passwordWithoutNumbers = 'StrongPassword!';
      const validationResult = securityService.validatePassword(passwordWithoutNumbers);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toContain('Password must contain at least one number');
    });

    test('should reject password without special characters', () => {
      const passwordWithoutSpecialChars = 'StrongPass123';
      const validationResult = securityService.validatePassword(passwordWithoutSpecialChars);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toContain('Password must contain at least one special character');
    });

    test('should reject password without mixed case', () => {
      const passwordWithoutMixedCase = 'strongpass123!';
      const validationResult = securityService.validatePassword(passwordWithoutMixedCase);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toContain('Password must contain both uppercase and lowercase letters');
    });
  });

  describe('generateTOTPSecret', () => {
    test('should generate TOTP secret', () => {
      const secret = securityService.generateTOTPSecret();

      expect(secret).toBeDefined();
      expect(typeof secret).toBe('string');
    });
  });

  describe('verifyTOTPToken', () => {
    test('should verify TOTP token', () => {
      const secret = 'testsecret';
      const token = '123456';
      const isValid = securityService.verifyTOTPToken(secret, token);

      expect(isValid).toBe(true);
    });
  });

  describe('isRateLimited', () => {
    test('should check if IP is rate limited', () => {
      const isLimited = securityService.isRateLimited('127.0.0.1');

      expect(isLimited).toBe(false);
    });
  });

  describe('validateInput', () => {
    test('should validate clean input', () => {
      const cleanInput = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      const validationResult = securityService.validateInput(cleanInput);

      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });

    test('should detect SQL injection patterns', () => {
      const maliciousInput = {
        name: "John'; DROP TABLE users; --",
        email: 'john@example.com'
      };
      const validationResult = securityService.validateInput(maliciousInput);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toContain("Invalid input in field 'name': Potential SQL injection detected");
    });

    test('should detect XSS patterns', () => {
      const maliciousInput = {
        name: '<script>alert("XSS")</script>',
        email: 'john@example.com'
      };
      const validationResult = securityService.validateInput(maliciousInput);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toContain("Invalid input in field 'name': Potential XSS detected");
    });
  });
});