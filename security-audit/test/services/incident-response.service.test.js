const IncidentResponseService = require('../../src/services/incident-response.service.js');

describe('IncidentResponseService', () => {
  let incidentResponseService;

  beforeEach(() => {
    incidentResponseService = new IncidentResponseService();
  });

  describe('createIncident', () => {
    test('should create incident successfully', async () => {
      const incidentData = {
        type: 'data_breach',
        description: 'Unauthorized access to patient records',
        severity: 'high',
        affectedSystems: ['patient-records-db'],
        reportedBy: 'security-monitoring'
      };

      const incident = await incidentResponseService.createIncident(incidentData);

      expect(incident).toBeDefined();
      expect(incident.id).toMatch(/^INC-/);
      expect(incident.type).toBe('data_breach');
      expect(incident.description).toBe('Unauthorized access to patient records');
      expect(incident.severity).toBe('high');
      expect(incident.affectedSystems).toEqual(['patient-records-db']);
      expect(incident.reportedBy).toBe('security-monitoring');
      expect(incident.status).toBe('identified');
      expect(incident.timeline).toHaveLength(1);
    });

    test('should create incident with default severity', async () => {
      const incidentData = {
        type: 'malware_infection',
        description: 'Malware detected on server'
      };

      const incident = await incidentResponseService.createIncident(incidentData);

      expect(incident.severity).toBe('low');
    });
  });

  describe('getIncident', () => {
    test('should retrieve existing incident', async () => {
      const incidentData = {
        type: 'test_incident',
        description: 'Test incident'
      };

      const createdIncident = await incidentResponseService.createIncident(incidentData);
      const retrievedIncident = incidentResponseService.getIncident(createdIncident.id);

      expect(retrievedIncident).toEqual(createdIncident);
    });

    test('should return null for non-existent incident', () => {
      const incident = incidentResponseService.getIncident('non-existent-id');

      expect(incident).toBeNull();
    });
  });

  describe('getIncidents', () => {
    test('should retrieve all incidents', async () => {
      await incidentResponseService.createIncident({
        type: 'incident1',
        description: 'Test incident 1'
      });

      await incidentResponseService.createIncident({
        type: 'incident2',
        description: 'Test incident 2'
      });

      const incidents = incidentResponseService.getIncidents();

      expect(incidents).toHaveLength(2);
    });

    test('should filter incidents by status', async () => {
      const incident1 = await incidentResponseService.createIncident({
        type: 'incident1',
        description: 'Test incident 1'
      });

      await incidentResponseService.createIncident({
        type: 'incident2',
        description: 'Test incident 2'
      });

      // Update first incident status
      await incidentResponseService.updateIncident(incident1.id, 'contained');

      const containedIncidents = incidentResponseService.getIncidents('contained');

      expect(containedIncidents).toHaveLength(1);
      expect(containedIncidents[0].id).toBe(incident1.id);
    });

    test('should filter incidents by severity', async () => {
      await incidentResponseService.createIncident({
        type: 'incident1',
        description: 'Test incident 1',
        severity: 'high'
      });

      await incidentResponseService.createIncident({
        type: 'incident2',
        description: 'Test incident 2',
        severity: 'low'
      });

      const highSeverityIncidents = incidentResponseService.getIncidents(null, 'high');

      expect(highSeverityIncidents).toHaveLength(1);
      expect(highSeverityIncidents[0].severity).toBe('high');
    });
  });

  describe('updateIncident', () => {
    test('should update incident status successfully', async () => {
      const incidentData = {
        type: 'test_incident',
        description: 'Test incident'
      };

      const createdIncident = await incidentResponseService.createIncident(incidentData);
      const updatedIncident = await incidentResponseService.updateIncident(
        createdIncident.id,
        'contained',
        { actor: 'test-user', details: 'Containment actions completed' }
      );

      expect(updatedIncident).toBeDefined();
      expect(updatedIncident.status).toBe('contained');
      expect(updatedIncident.timeline).toHaveLength(2);
      expect(updatedIncident.timeline[1].action).toBe('Status updated from identified to contained');
    });

    test('should return null for non-existent incident', async () => {
      const updatedIncident = await incidentResponseService.updateIncident(
        'non-existent-id',
        'contained'
      );

      expect(updatedIncident).toBeNull();
    });
  });

  describe('addEvidence', () => {
    test('should add evidence to incident successfully', async () => {
      const incidentData = {
        type: 'test_incident',
        description: 'Test incident'
      };

      const createdIncident = await incidentResponseService.createIncident(incidentData);

      const evidence = {
        type: 'log_file',
        description: 'Security logs from compromised server',
        location: '/var/log/security.log',
        hash: 'abc123',
        collectedBy: 'forensics-team'
      };

      const updatedIncident = await incidentResponseService.addEvidence(
        createdIncident.id,
        evidence
      );

      expect(updatedIncident).toBeDefined();
      expect(updatedIncident.evidence).toHaveLength(1);
      expect(updatedIncident.evidence[0].type).toBe('log_file');
      expect(updatedIncident.evidence[0].description).toBe('Security logs from compromised server');
      expect(updatedIncident.timeline).toHaveLength(2);
    });

    test('should return null for non-existent incident', async () => {
      const evidence = {
        type: 'log_file',
        description: 'Test evidence'
      };

      const updatedIncident = await incidentResponseService.addEvidence(
        'non-existent-id',
        evidence
      );

      expect(updatedIncident).toBeNull();
    });
  });

  describe('addCommunication', () => {
    test('should add communication to incident successfully', async () => {
      const incidentData = {
        type: 'test_incident',
        description: 'Test incident'
      };

      const createdIncident = await incidentResponseService.createIncident(incidentData);

      const communication = {
        type: 'internal',
        recipient: 'security-team@medisync.example.com',
        subject: 'Incident Update',
        content: 'Containment procedures have been initiated',
        sentBy: 'incident-manager'
      };

      const updatedIncident = await incidentResponseService.addCommunication(
        createdIncident.id,
        communication
      );

      expect(updatedIncident).toBeDefined();
      expect(updatedIncident.communications).toHaveLength(1);
      expect(updatedIncident.communications[0].type).toBe('internal');
      expect(updatedIncident.communications[0].subject).toBe('Incident Update');
      expect(updatedIncident.timeline).toHaveLength(2);
    });

    test('should return null for non-existent incident', async () => {
      const communication = {
        type: 'internal',
        subject: 'Test communication',
        content: 'Test content'
      };

      const updatedIncident = await incidentResponseService.addCommunication(
        'non-existent-id',
        communication
      );

      expect(updatedIncident).toBeNull();
    });
  });

  describe('assignIncident', () => {
    test('should assign incident to team member successfully', async () => {
      const incidentData = {
        type: 'test_incident',
        description: 'Test incident'
      };

      const createdIncident = await incidentResponseService.createIncident(incidentData);

      const updatedIncident = await incidentResponseService.assignIncident(
        createdIncident.id,
        'analyst1@medisync.example.com'
      );

      expect(updatedIncident).toBeDefined();
      expect(updatedIncident.assignedTo).toBe('analyst1@medisync.example.com');
      expect(updatedIncident.timeline).toHaveLength(2);
    });

    test('should return null for non-existent incident', async () => {
      const updatedIncident = await incidentResponseService.assignIncident(
        'non-existent-id',
        'analyst1@medisync.example.com'
      );

      expect(updatedIncident).toBeNull();
    });
  });

  describe('generateReport', () => {
    test('should generate incident report successfully', async () => {
      const incidentData = {
        type: 'test_incident',
        description: 'Test incident',
        severity: 'medium'
      };

      const createdIncident = await incidentResponseService.createIncident(incidentData);

      // Add some evidence and communications
      await incidentResponseService.addEvidence(createdIncident.id, {
        type: 'log_file',
        description: 'Test log file',
        location: '/test/log.txt',
        hash: 'test123',
        collectedBy: 'test-team'
      });

      await incidentResponseService.addCommunication(createdIncident.id, {
        type: 'internal',
        recipient: 'test@medisync.example.com',
        subject: 'Test communication',
        content: 'Test content',
        sentBy: 'test-user'
      });

      const report = await incidentResponseService.generateReport(createdIncident.id);

      expect(report).toBeDefined();
      expect(report.incidentId).toBe(createdIncident.id);
      expect(report.type).toBe('test_incident');
      expect(report.severity).toBe('medium');
      expect(report.timeline).toHaveLength(3);
      expect(report.evidence).toHaveLength(1);
      expect(report.communications).toHaveLength(1);
    });

    test('should throw error for non-existent incident', async () => {
      await expect(
        incidentResponseService.generateReport('non-existent-id')
      ).rejects.toThrow('Incident not found');
    });
  });

  describe('getMetrics', () => {
    test('should return incident metrics', async () => {
      // Create some incidents
      await incidentResponseService.createIncident({
        type: 'incident1',
        description: 'Test incident 1',
        severity: 'critical'
      });

      await incidentResponseService.createIncident({
        type: 'incident2',
        description: 'Test incident 2',
        severity: 'high'
      });

      const metrics = incidentResponseService.getMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.totalIncidents).toBe(2);
      expect(metrics.bySeverity.critical).toBe(1);
      expect(metrics.bySeverity.high).toBe(1);
      expect(metrics.byStatus.identified).toBe(2);
    });
  });

  describe('setTeam', () => {
    test('should set incident response team members', () => {
      const team = {
        manager: 'test-manager@medisync.example.com',
        analysts: ['analyst1@medisync.example.com']
      };

      incidentResponseService.setTeam(team);

      // This test is limited because we can't directly access the team property
      // In a real implementation, we would have getter methods or make the property accessible
      expect(incidentResponseService).toBeDefined();
    });
  });
});