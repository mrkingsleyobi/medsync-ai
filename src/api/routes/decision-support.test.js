// MediSync Healthcare AI Platform - Decision Support API Tests
// This file contains tests for the decision support API endpoints

const request = require('supertest');
const { app } = require('../server');

describe('Decision Support API', () => {
  // Test generating clinical decision support
  describe('POST /api/decision-support/generate', () => {
    it('should generate diagnosis support decision successfully', async () => {
      const response = await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            patientId: 'PAT-12345',
            symptoms: ['headache', 'blurred vision'],
            vitalSigns: {
              bloodPressure: '160/100'
            }
          },
          decisionConfig: {
            decisionType: 'diagnosis-support'
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('decisionId');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('recommendations');
      expect(response.body.recommendations.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('confidence');
      expect(response.body.confidence).toBeGreaterThan(0.8);
    });

    it('should generate treatment recommendation decision successfully', async () => {
      const response = await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            patientId: 'PAT-12345',
            condition: 'hypertension'
          },
          decisionConfig: {
            decisionType: 'treatment-recommendation'
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('decisionId');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('recommendations');
      expect(response.body.recommendations.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('confidence');
      expect(response.body.confidence).toBeGreaterThan(0.8);
    });

    it('should generate risk assessment decision successfully', async () => {
      const response = await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            patientId: 'PAT-12345',
            vitalSigns: {
              bloodPressure: '160/100',
              heartRate: 110
            },
            riskFactors: ['smoking', 'family-history']
          },
          decisionConfig: {
            decisionType: 'risk-assessment'
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('decisionId');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('recommendations');
      expect(response.body.recommendations.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('confidence');
      expect(response.body.confidence).toBeGreaterThan(0.8);
    });

    it('should generate drug interaction decision successfully', async () => {
      const response = await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            patientId: 'PAT-12345',
            medications: ['warfarin', 'aspirin']
          },
          decisionConfig: {
            decisionType: 'drug-interaction'
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('decisionId');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('alerts');
      expect(response.body.alerts.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('confidence');
      expect(response.body.confidence).toBeGreaterThan(0.8);
    });

    it('should generate clinical alert decision successfully', async () => {
      const response = await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            patientId: 'PAT-12345',
            vitalSigns: {
              bloodPressure: '190/110',
              heartRate: 160
            },
            symptoms: ['chest pain']
          },
          decisionConfig: {
            decisionType: 'clinical-alert'
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('decisionId');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('alerts');
      expect(response.body.alerts.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('confidence');
      expect(response.body.confidence).toBeGreaterThan(0.9);
    });

    it('should return 400 for missing patient context', async () => {
      const response = await request(app)
        .post('/api/decision-support/generate')
        .send({
          decisionConfig: {}
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
    });

    it('should return 400 for missing patientId', async () => {
      const response = await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            symptoms: ['headache']
          },
          decisionConfig: {}
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
    });
  });

  // Test getting decision history
  describe('GET /api/decision-support/history/:patientId', () => {
    it('should retrieve decision history for a patient', async () => {
      // First, generate a decision to ensure there's history
      await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            patientId: 'PAT-67890',
            symptoms: ['fever']
          },
          decisionConfig: {
            decisionType: 'diagnosis-support'
          }
        });

      const response = await request(app)
        .get('/api/decision-support/history/PAT-67890')
        .expect(200);

      expect(response.body).toHaveProperty('patientId', 'PAT-67890');
      expect(response.body).toHaveProperty('decisions');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.decisions)).toBe(true);
    });
  });

  // Test getting active alerts
  describe('GET /api/decision-support/alerts', () => {
    it('should retrieve active alerts', async () => {
      // First, generate a decision that creates alerts
      await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            patientId: 'PAT-11111',
            vitalSigns: {
              bloodPressure: '190/110'
            }
          },
          decisionConfig: {
            decisionType: 'risk-assessment'
          }
        });

      const response = await request(app)
        .get('/api/decision-support/alerts')
        .expect(200);

      expect(response.body).toHaveProperty('alerts');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.alerts)).toBe(true);
    });
  });

  // Test acknowledging alerts
  describe('POST /api/decision-support/alerts/:alertId/acknowledge', () => {
    it('should acknowledge an alert successfully', async () => {
      // First, generate a decision that creates alerts
      await request(app)
        .post('/api/decision-support/generate')
        .send({
          patientContext: {
            patientId: 'PAT-22222',
            vitalSigns: {
              bloodPressure: '190/110'
            }
          },
          decisionConfig: {
            decisionType: 'risk-assessment'
          }
        });

      // Get the alerts to find an alert ID
      const alertsResponse = await request(app)
        .get('/api/decision-support/alerts');

      const { alertId } = alertsResponse.body.alerts[0];

      const response = await request(app)
        .post(`/api/decision-support/alerts/${alertId}/acknowledge`)
        .expect(200);

      expect(response.body).toHaveProperty('alertId', alertId);
      expect(response.body).toHaveProperty('acknowledged', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent alert', async () => {
      const response = await request(app)
        .post('/api/decision-support/alerts/non-existent-alert/acknowledge')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
