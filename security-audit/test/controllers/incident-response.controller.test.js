const IncidentResponseController = require('../../src/controllers/incident-response.controller.js');

// Mock Express request and response objects
const mockRequest = (params = {}, body = {}, query = {}) => ({
  params,
  body,
  query
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('IncidentResponseController', () => {
  let incidentResponseController;

  beforeEach(() => {
    incidentResponseController = new IncidentResponseController();
  });

  describe('createIncident', () => {
    test('should create incident successfully', async () => {
      const req = mockRequest({}, {
        incident: {
          type: 'data_breach',
          description: 'Unauthorized access to patient records',
          severity: 'high'
        }
      });
      const res = mockResponse();

      await incidentResponseController.createIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incident: expect.objectContaining({
          id: expect.stringMatching(/^INC-/),
          type: 'data_breach',
          description: 'Unauthorized access to patient records',
          severity: 'high',
          status: 'identified'
        })
      });
    });

    test('should return error for missing incident data', async () => {
      const req = mockRequest({}, {});
      const res = mockResponse();

      await incidentResponseController.createIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: incident'
      });
    });

    test('should return error for missing required fields', async () => {
      const req = mockRequest({}, {
        incident: {
          type: 'data_breach'
          // missing description
        }
      });
      const res = mockResponse();

      await incidentResponseController.createIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: type, description'
      });
    });

    test('should return error for invalid severity', async () => {
      const req = mockRequest({}, {
        incident: {
          type: 'test_incident',
          description: 'Test incident',
          severity: 'invalid'
        }
      });
      const res = mockResponse();

      await incidentResponseController.createIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid severity level',
        validSeverities: ['critical', 'high', 'medium', 'low']
      });
    });
  });

  describe('getIncident', () => {
    test('should retrieve existing incident', async () => {
      // First create an incident
      const createReq = mockRequest({}, {
        incident: {
          type: 'test_incident',
          description: 'Test incident'
        }
      });
      const createRes = mockResponse();
      await incidentResponseController.createIncident(createReq, createRes);
      const createdIncident = createRes.json.mock.calls[0][0].incident;

      // Then retrieve it
      const req = mockRequest({ incidentId: createdIncident.id });
      const res = mockResponse();

      await incidentResponseController.getIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incident: expect.objectContaining({
          id: createdIncident.id,
          type: 'test_incident'
        })
      });
    });

    test('should return error for missing incidentId', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await incidentResponseController.getIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameter: incidentId'
      });
    });

    test('should return error for non-existent incident', async () => {
      const req = mockRequest({ incidentId: 'non-existent-id' });
      const res = mockResponse();

      await incidentResponseController.getIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Incident not found',
        message: 'Incident with ID non-existent-id not found'
      });
    });
  });

  describe('getIncidents', () => {
    test('should retrieve all incidents', async () => {
      const req = mockRequest({}, {}, {});
      const res = mockResponse();

      await incidentResponseController.getIncidents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incidents: expect.any(Array)
      });
    });

    test('should filter incidents by status', async () => {
      const req = mockRequest({}, {}, { status: 'identified' });
      const res = mockResponse();

      await incidentResponseController.getIncidents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incidents: expect.any(Array)
      });
    });

    test('should filter incidents by severity', async () => {
      const req = mockRequest({}, {}, { severity: 'high' });
      const res = mockResponse();

      await incidentResponseController.getIncidents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incidents: expect.any(Array)
      });
    });
  });

  describe('updateIncident', () => {
    test('should update incident status successfully', async () => {
      // First create an incident
      const createReq = mockRequest({}, {
        incident: {
          type: 'test_incident',
          description: 'Test incident'
        }
      });
      const createRes = mockResponse();
      await incidentResponseController.createIncident(createReq, createRes);
      const createdIncident = createRes.json.mock.calls[0][0].incident;

      // Then update it
      const req = mockRequest({ incidentId: createdIncident.id }, {
        status: 'contained',
        updateData: { actor: 'test-user', details: 'Test containment' }
      });
      const res = mockResponse();

      await incidentResponseController.updateIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incident: expect.objectContaining({
          id: createdIncident.id,
          status: 'contained'
        })
      });
    });

    test('should return error for missing incidentId', async () => {
      const req = mockRequest({}, { status: 'contained' });
      const res = mockResponse();

      await incidentResponseController.updateIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameter: incidentId'
      });
    });

    test('should return error for missing status', async () => {
      const req = mockRequest({ incidentId: 'test-id' }, {});
      const res = mockResponse();

      await incidentResponseController.updateIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: status'
      });
    });

    test('should return error for invalid status', async () => {
      const req = mockRequest({ incidentId: 'test-id' }, { status: 'invalid' });
      const res = mockResponse();

      await incidentResponseController.updateIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid status',
        validStatuses: ['identified', 'contained', 'eradicated', 'recovered', 'closed']
      });
    });

    test('should return error for non-existent incident', async () => {
      const req = mockRequest({ incidentId: 'non-existent-id' }, { status: 'contained' });
      const res = mockResponse();

      await incidentResponseController.updateIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Incident not found',
        message: 'Incident with ID non-existent-id not found'
      });
    });
  });

  describe('addEvidence', () => {
    test('should add evidence to incident successfully', async () => {
      // First create an incident
      const createReq = mockRequest({}, {
        incident: {
          type: 'test_incident',
          description: 'Test incident'
        }
      });
      const createRes = mockResponse();
      await incidentResponseController.createIncident(createReq, createRes);
      const createdIncident = createRes.json.mock.calls[0][0].incident;

      // Then add evidence
      const req = mockRequest({ incidentId: createdIncident.id }, {
        evidence: {
          type: 'log_file',
          description: 'Test log file'
        }
      });
      const res = mockResponse();

      await incidentResponseController.addEvidence(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incident: expect.objectContaining({
          id: createdIncident.id,
          evidence: expect.arrayContaining([
            expect.objectContaining({
              type: 'log_file',
              description: 'Test log file'
            })
          ])
        })
      });
    });

    test('should return error for missing incidentId', async () => {
      const req = mockRequest({}, { evidence: {} });
      const res = mockResponse();

      await incidentResponseController.addEvidence(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameter: incidentId'
      });
    });

    test('should return error for missing evidence', async () => {
      const req = mockRequest({ incidentId: 'test-id' }, {});
      const res = mockResponse();

      await incidentResponseController.addEvidence(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: evidence'
      });
    });

    test('should return error for missing required evidence fields', async () => {
      const req = mockRequest({ incidentId: 'test-id' }, {
        evidence: {
          type: 'log_file'
          // missing description
        }
      });
      const res = mockResponse();

      await incidentResponseController.addEvidence(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: type, description'
      });
    });

    test('should return error for non-existent incident', async () => {
      const req = mockRequest({ incidentId: 'non-existent-id' }, {
        evidence: {
          type: 'log_file',
          description: 'Test log file'
        }
      });
      const res = mockResponse();

      await incidentResponseController.addEvidence(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Incident not found',
        message: 'Incident with ID non-existent-id not found'
      });
    });
  });

  describe('addCommunication', () => {
    test('should add communication to incident successfully', async () => {
      // First create an incident
      const createReq = mockRequest({}, {
        incident: {
          type: 'test_incident',
          description: 'Test incident'
        }
      });
      const createRes = mockResponse();
      await incidentResponseController.createIncident(createReq, createRes);
      const createdIncident = createRes.json.mock.calls[0][0].incident;

      // Then add communication
      const req = mockRequest({ incidentId: createdIncident.id }, {
        communication: {
          type: 'internal',
          subject: 'Test communication',
          content: 'Test content'
        }
      });
      const res = mockResponse();

      await incidentResponseController.addCommunication(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incident: expect.objectContaining({
          id: createdIncident.id,
          communications: expect.arrayContaining([
            expect.objectContaining({
              type: 'internal',
              subject: 'Test communication'
            })
          ])
        })
      });
    });

    test('should return error for missing incidentId', async () => {
      const req = mockRequest({}, { communication: {} });
      const res = mockResponse();

      await incidentResponseController.addCommunication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameter: incidentId'
      });
    });

    test('should return error for missing communication', async () => {
      const req = mockRequest({ incidentId: 'test-id' }, {});
      const res = mockResponse();

      await incidentResponseController.addCommunication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: communication'
      });
    });

    test('should return error for missing required communication fields', async () => {
      const req = mockRequest({ incidentId: 'test-id' }, {
        communication: {
          type: 'internal',
          subject: 'Test subject'
          // missing content
        }
      });
      const res = mockResponse();

      await incidentResponseController.addCommunication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: type, subject, content'
      });
    });

    test('should return error for invalid communication type', async () => {
      const req = mockRequest({ incidentId: 'test-id' }, {
        communication: {
          type: 'invalid',
          subject: 'Test subject',
          content: 'Test content'
        }
      });
      const res = mockResponse();

      await incidentResponseController.addCommunication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid communication type',
        validTypes: ['internal', 'external', 'regulatory']
      });
    });

    test('should return error for non-existent incident', async () => {
      const req = mockRequest({ incidentId: 'non-existent-id' }, {
        communication: {
          type: 'internal',
          subject: 'Test communication',
          content: 'Test content'
        }
      });
      const res = mockResponse();

      await incidentResponseController.addCommunication(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Incident not found',
        message: 'Incident with ID non-existent-id not found'
      });
    });
  });

  describe('assignIncident', () => {
    test('should assign incident successfully', async () => {
      // First create an incident
      const createReq = mockRequest({}, {
        incident: {
          type: 'test_incident',
          description: 'Test incident'
        }
      });
      const createRes = mockResponse();
      await incidentResponseController.createIncident(createReq, createRes);
      const createdIncident = createRes.json.mock.calls[0][0].incident;

      // Then assign it
      const req = mockRequest({ incidentId: createdIncident.id }, {
        assignee: 'test-analyst@medisync.example.com'
      });
      const res = mockResponse();

      await incidentResponseController.assignIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        incident: expect.objectContaining({
          id: createdIncident.id,
          assignedTo: 'test-analyst@medisync.example.com'
        })
      });
    });

    test('should return error for missing incidentId', async () => {
      const req = mockRequest({}, { assignee: 'test@example.com' });
      const res = mockResponse();

      await incidentResponseController.assignIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameter: incidentId'
      });
    });

    test('should return error for missing assignee', async () => {
      const req = mockRequest({ incidentId: 'test-id' }, {});
      const res = mockResponse();

      await incidentResponseController.assignIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required field: assignee'
      });
    });

    test('should return error for non-existent incident', async () => {
      const req = mockRequest({ incidentId: 'non-existent-id' }, {
        assignee: 'test-analyst@medisync.example.com'
      });
      const res = mockResponse();

      await incidentResponseController.assignIncident(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Incident not found',
        message: 'Incident with ID non-existent-id not found'
      });
    });
  });

  describe('generateReport', () => {
    test('should generate incident report successfully', async () => {
      // First create an incident
      const createReq = mockRequest({}, {
        incident: {
          type: 'test_incident',
          description: 'Test incident'
        }
      });
      const createRes = mockResponse();
      await incidentResponseController.createIncident(createReq, createRes);
      const createdIncident = createRes.json.mock.calls[0][0].incident;

      // Then generate report
      const req = mockRequest({ incidentId: createdIncident.id });
      const res = mockResponse();

      await incidentResponseController.generateReport(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        report: expect.objectContaining({
          incidentId: createdIncident.id,
          type: 'test_incident'
        })
      });
    });

    test('should return error for missing incidentId', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await incidentResponseController.generateReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameter: incidentId'
      });
    });

    test('should return error for non-existent incident', async () => {
      const req = mockRequest({ incidentId: 'non-existent-id' });
      const res = mockResponse();

      await incidentResponseController.generateReport(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Incident not found',
        message: 'Incident not found'
      });
    });
  });

  describe('getMetrics', () => {
    test('should return incident metrics', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await incidentResponseController.getMetrics(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        metrics: expect.objectContaining({
          totalIncidents: expect.any(Number),
          bySeverity: expect.any(Object),
          byStatus: expect.any(Object)
        })
      });
    });
  });
});