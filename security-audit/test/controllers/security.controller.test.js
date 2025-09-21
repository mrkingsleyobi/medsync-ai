# Security Controller Tests for MediSync Healthcare AI Platform

## Overview

This file contains unit tests for the security controller implementation.

## Tests

```javascript
const SecurityController = require('../../src/controllers/security.controller.js');

// Mock Express request and response objects
const mockRequest = (body = {}, user = null, ip = '127.0.0.1') => ({
  body,
  user,
  ip,
  get: jest.fn().mockReturnValue('Test User Agent')
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('SecurityController', () => {
  let securityController;

  beforeEach(() => {
    securityController = new SecurityController();
  });

  describe('encryptData', () => {
    test('should encrypt data successfully', async () => {
      const req = mockRequest({ data: 'test data' });
      const res = mockResponse();

      await securityController.encryptData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        encryptedData: expect.objectContaining({
          encryptedData: expect.any(String),
          iv: expect.any(String),
          tag: expect.any(String)
        })
      });
    });

    test('should return error for missing data', async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await securityController.encryptData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: data'
      });
    });

    test('should return error for invalid input', async () => {
      const req = mockRequest({ data: "'; DROP TABLE users; --" });
      const res = mockResponse();

      await securityController.encryptData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid input',
        details: expect.arrayContaining([
          expect.stringContaining('Potential SQL injection detected')
        ])
      });
    });
  });

  describe('decryptData', () => {
    test('should decrypt data successfully', async () => {
      // First encrypt some data
      const testData = 'test data';
      const encryptedData = securityController.securityService.encrypt(testData);

      const req = mockRequest(encryptedData);
      const res = mockResponse();

      await securityController.decryptData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        decryptedData: testData
      });
    });

    test('should return error for missing fields', async () => {
      const req = mockRequest({ encryptedData: 'test' });
      const res = mockResponse();

      await securityController.decryptData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: encryptedData, iv, tag'
      });
    });
  });

  describe('hashData', () => {
    test('should hash data successfully', async () => {
      const req = mockRequest({ data: 'test data' });
      const res = mockResponse();

      await securityController.hashData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        hashedData: expect.stringMatching(/^[a-f0-9]{64}$/)
      });
    });

    test('should return error for missing data', async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await securityController.hashData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: data'
      });
    });
  });

  describe('validatePassword', () => {
    test('should validate strong password successfully', async () => {
      const req = mockRequest({ password: 'StrongPass123!' });
      const res = mockResponse();

      await securityController.validatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        valid: true,
        errors: []
      });
    });

    test('should reject weak password', async () => {
      const req = mockRequest({ password: 'weak' });
      const res = mockResponse();

      await securityController.validatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        valid: false,
        errors: expect.arrayContaining([
          expect.stringContaining('Password must be at least')
        ])
      });
    });

    test('should return error for missing password', async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await securityController.validatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: password'
      });
    });
  });

  describe('generateTOTPSecret', () => {
    test('should generate TOTP secret successfully', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await securityController.generateTOTPSecret(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        secret: expect.any(String)
      });
    });
  });

  describe('verifyTOTPToken', () => {
    test('should verify TOTP token successfully', async () => {
      const req = mockRequest({ secret: 'testsecret', token: '123456' });
      const res = mockResponse();

      await securityController.verifyTOTPToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        valid: true
      });
    });

    test('should return error for missing fields', async () => {
      const req = mockRequest({ secret: 'testsecret' });
      const res = mockResponse();

      await securityController.verifyTOTPToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: secret, token'
      });
    });
  });

  describe('logSecurityEvent', () => {
    test('should log security event successfully', async () => {
      const req = mockRequest({
        eventType: 'test_event',
        eventData: { message: 'Test event' }
      });
      const res = mockResponse();

      await securityController.logSecurityEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Security event logged successfully'
      });
    });

    test('should return error for missing fields', async () => {
      const req = mockRequest({ eventType: 'test_event' });
      const res = mockResponse();

      await securityController.logSecurityEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: eventType, eventData'
      });
    });
  });
});