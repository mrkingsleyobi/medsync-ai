const IncidentResponseService = require('../services/incident-response.service.js');

class IncidentResponseController {
  constructor() {
    this.incidentResponseService = new IncidentResponseService();

    // Set up initial team members (in production, this would come from a database or config)
    this.incidentResponseService.setTeam({
      manager: 'security-manager@medisync.example.com',
      analysts: [
        'analyst1@medisync.example.com',
        'analyst2@medisync.example.com'
      ],
      administrators: [
        'admin1@medisync.example.com',
        'admin2@medisync.example.com'
      ],
      developers: [
        'dev1@medisync.example.com',
        'dev2@medisync.example.com'
      ],
      legal: 'legal@medisync.example.com',
      pr: 'pr@medisync.example.com',
      executives: [
        'ceo@medisync.example.com',
        'cto@medisync.example.com'
      ]
    });
  }

  /**
   * Create incident endpoint
   * POST /api/incidents
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createIncident(req, res) {
    try {
      const { incident } = req.body;

      if (!incident) {
        return res.status(400).json({
          error: 'Missing required field: incident'
        });
      }

      // Validate required fields
      if (!incident.type || !incident.description) {
        return res.status(400).json({
          error: 'Missing required fields: type, description'
        });
      }

      // Validate severity
      const validSeverities = ['critical', 'high', 'medium', 'low'];
      if (incident.severity && !validSeverities.includes(incident.severity)) {
        return res.status(400).json({
          error: 'Invalid severity level',
          validSeverities: validSeverities
        });
      }

      // Create incident
      const createdIncident = await this.incidentResponseService.createIncident(incident);

      res.status(201).json({
        success: true,
        incident: createdIncident
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to create incident',
        message: error.message
      });
    }
  }

  /**
   * Get incident endpoint
   * GET /api/incidents/:incidentId
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getIncident(req, res) {
    try {
      const { incidentId } = req.params;

      if (!incidentId) {
        return res.status(400).json({
          error: 'Missing required parameter: incidentId'
        });
      }

      const incident = this.incidentResponseService.getIncident(incidentId);

      if (!incident) {
        return res.status(404).json({
          error: 'Incident not found',
          message: `Incident with ID ${incidentId} not found`
        });
      }

      res.status(200).json({
        success: true,
        incident: incident
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve incident',
        message: error.message
      });
    }
  }

  /**
   * Get incidents endpoint
   * GET /api/incidents
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getIncidents(req, res) {
    try {
      const { status, severity } = req.query;
      const incidents = this.incidentResponseService.getIncidents(status, severity);

      res.status(200).json({
        success: true,
        incidents: incidents
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve incidents',
        message: error.message
      });
    }
  }

  /**
   * Update incident endpoint
   * PUT /api/incidents/:incidentId
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateIncident(req, res) {
    try {
      const { incidentId } = req.params;
      const { status, updateData } = req.body;

      if (!incidentId) {
        return res.status(400).json({
          error: 'Missing required parameter: incidentId'
        });
      }

      if (!status) {
        return res.status(400).json({
          error: 'Missing required field: status'
        });
      }

      // Validate status
      const validStatuses = ['identified', 'contained', 'eradicated', 'recovered', 'closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status',
          validStatuses: validStatuses
        });
      }

      const updatedIncident = await this.incidentResponseService.updateIncident(
        incidentId,
        status,
        updateData
      );

      if (!updatedIncident) {
        return res.status(404).json({
          error: 'Incident not found',
          message: `Incident with ID ${incidentId} not found`
        });
      }

      res.status(200).json({
        success: true,
        incident: updatedIncident
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update incident',
        message: error.message
      });
    }
  }

  /**
   * Add evidence endpoint
   * POST /api/incidents/:incidentId/evidence
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async addEvidence(req, res) {
    try {
      const { incidentId } = req.params;
      const { evidence } = req.body;

      if (!incidentId) {
        return res.status(400).json({
          error: 'Missing required parameter: incidentId'
        });
      }

      if (!evidence) {
        return res.status(400).json({
          error: 'Missing required field: evidence'
        });
      }

      // Validate required fields
      if (!evidence.type || !evidence.description) {
        return res.status(400).json({
          error: 'Missing required fields: type, description'
        });
      }

      const updatedIncident = await this.incidentResponseService.addEvidence(
        incidentId,
        evidence
      );

      if (!updatedIncident) {
        return res.status(404).json({
          error: 'Incident not found',
          message: `Incident with ID ${incidentId} not found`
        });
      }

      res.status(200).json({
        success: true,
        incident: updatedIncident
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to add evidence',
        message: error.message
      });
    }
  }

  /**
   * Add communication endpoint
   * POST /api/incidents/:incidentId/communications
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async addCommunication(req, res) {
    try {
      const { incidentId } = req.params;
      const { communication } = req.body;

      if (!incidentId) {
        return res.status(400).json({
          error: 'Missing required parameter: incidentId'
        });
      }

      if (!communication) {
        return res.status(400).json({
          error: 'Missing required field: communication'
        });
      }

      // Validate required fields
      if (!communication.type || !communication.subject || !communication.content) {
        return res.status(400).json({
          error: 'Missing required fields: type, subject, content'
        });
      }

      // Validate communication type
      const validTypes = ['internal', 'external', 'regulatory'];
      if (!validTypes.includes(communication.type)) {
        return res.status(400).json({
          error: 'Invalid communication type',
          validTypes: validTypes
        });
      }

      const updatedIncident = await this.incidentResponseService.addCommunication(
        incidentId,
        communication
      );

      if (!updatedIncident) {
        return res.status(404).json({
          error: 'Incident not found',
          message: `Incident with ID ${incidentId} not found`
        });
      }

      res.status(200).json({
        success: true,
        incident: updatedIncident
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to add communication',
        message: error.message
      });
    }
  }

  /**
   * Assign incident endpoint
   * POST /api/incidents/:incidentId/assign
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async assignIncident(req, res) {
    try {
      const { incidentId } = req.params;
      const { assignee } = req.body;

      if (!incidentId) {
        return res.status(400).json({
          error: 'Missing required parameter: incidentId'
        });
      }

      if (!assignee) {
        return res.status(400).json({
          error: 'Missing required field: assignee'
        });
      }

      const updatedIncident = await this.incidentResponseService.assignIncident(
        incidentId,
        assignee
      );

      if (!updatedIncident) {
        return res.status(404).json({
          error: 'Incident not found',
          message: `Incident with ID ${incidentId} not found`
        });
      }

      res.status(200).json({
        success: true,
        incident: updatedIncident
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to assign incident',
        message: error.message
      });
    }
  }

  /**
   * Generate report endpoint
   * GET /api/incidents/:incidentId/report
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateReport(req, res) {
    try {
      const { incidentId } = req.params;

      if (!incidentId) {
        return res.status(400).json({
          error: 'Missing required parameter: incidentId'
        });
      }

      const report = await this.incidentResponseService.generateReport(incidentId);

      res.status(200).json({
        success: true,
        report: report
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Incident not found',
          message: 'Incident not found'
        });
      }

      res.status(500).json({
        error: 'Failed to generate report',
        message: error.message
      });
    }
  }

  /**
   * Get metrics endpoint
   * GET /api/incidents/metrics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMetrics(req, res) {
    try {
      const metrics = this.incidentResponseService.getMetrics();

      res.status(200).json({
        success: true,
        metrics: metrics
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve metrics',
        message: error.message
      });
    }
  }
}

module.exports = IncidentResponseController;