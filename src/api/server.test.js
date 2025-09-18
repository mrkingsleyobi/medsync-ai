// MediSync Healthcare AI Platform - Server Tests
// This file contains basic tests for the server setup

const request = require('supertest');
const { app, server } = require('./server');

describe('MediSync API Server', () => {
  afterAll(done => {
    server.close(done);
  });

  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.service).toBe('MediSync API');
    });
  });

  describe('GET /api/patients', () => {
    it('should return 200 and patients service message', async () => {
      const response = await request(app).get('/api/patients');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Patients service - Coming Soon');
      expect(response.body.service).toBe('Patient Communication Service');
    });
  });

  describe('GET /api/clinical', () => {
    it('should return 200 and clinical service message', async () => {
      const response = await request(app).get('/api/clinical');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Clinical Decision Support Service - Coming Soon');
      expect(response.body.service).toBe('Clinical Decision Support Service');
    });
  });

  describe('GET /api/research', () => {
    it('should return 200 and research service message', async () => {
      const response = await request(app).get('/api/research');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Research Integration Service - Coming Soon');
      expect(response.body.service).toBe('Research Integration Service');
    });
  });

  describe('GET /api/admin', () => {
    it('should return 200 and admin service message', async () => {
      const response = await request(app).get('/api/admin');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Administrative Service - Coming Soon');
      expect(response.body.service).toBe('Administrative Service');
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });
});
