const fs = require('fs').promises;
const path = require('path');
const config = require('../config/security.config.js');

class IncidentResponseService {
  constructor() {
    this.config = config;
    this.incidents = [];
    this.team = {
      manager: null,
      analysts: [],
      administrators: [],
      developers: [],
      legal: null,
      pr: null,
      executives: []
    };
  }

  /**
   * Create a new incident
   * @param {Object} incidentData - Incident data
   * @returns {Object} Created incident
   */
  async createIncident(incidentData) {
    try {
      const incident = {
        id: this._generateIncidentId(),
        timestamp: new Date().toISOString(),
        status: 'identified',
        severity: incidentData.severity || 'low',
        type: incidentData.type,
        description: incidentData.description,
        affectedSystems: incidentData.affectedSystems || [],
        reportedBy: incidentData.reportedBy || 'system',
        assignedTo: null,
        timeline: [{
          timestamp: new Date().toISOString(),
          action: 'Incident created',
          actor: 'system'
        }],
        evidence: [],
        communications: [],
        containment: {
          shortTerm: false,
          longTerm: false
        },
        eradication: false,
        recovery: false,
        lessonsLearned: null
      };

      this.incidents.push(incident);

      // Notify team based on severity
      await this._notifyTeam(incident);

      // Log incident creation
      console.log(`Incident ${incident.id} created: ${incident.type} - ${incident.description}`);

      return incident;
    } catch (error) {
      throw new Error(`Failed to create incident: ${error.message}`);
    }
  }

  /**
   * Get incident by ID
   * @param {string} incidentId - Incident ID
   * @returns {Object|null} Incident or null if not found
   */
  getIncident(incidentId) {
    return this.incidents.find(incident => incident.id === incidentId) || null;
  }

  /**
   * Get all incidents
   * @param {string} status - Filter by status (optional)
   * @param {string} severity - Filter by severity (optional)
   * @returns {Array} Array of incidents
   */
  getIncidents(status, severity) {
    let filteredIncidents = this.incidents;

    if (status) {
      filteredIncidents = filteredIncidents.filter(incident => incident.status === status);
    }

    if (severity) {
      filteredIncidents = filteredIncidents.filter(incident => incident.severity === severity);
    }

    return filteredIncidents;
  }

  /**
   * Update incident status
   * @param {string} incidentId - Incident ID
   * @param {string} status - New status
   * @param {Object} updateData - Additional update data
   * @returns {Object|null} Updated incident or null if not found
   */
  async updateIncident(incidentId, status, updateData = {}) {
    try {
      const incident = this.getIncident(incidentId);
      if (!incident) {
        return null;
      }

      // Update status
      const oldStatus = incident.status;
      incident.status = status;

      // Add to timeline
      incident.timeline.push({
        timestamp: new Date().toISOString(),
        action: `Status updated from ${oldStatus} to ${status}`,
        actor: updateData.actor || 'system',
        details: updateData.details || null
      });

      // Handle status-specific actions
      switch (status) {
        case 'contained':
          await this._handleContainment(incident, updateData);
          break;
        case 'eradicated':
          await this._handleEradication(incident, updateData);
          break;
        case 'recovered':
          await this._handleRecovery(incident, updateData);
          break;
        case 'closed':
          await this._handleClosure(incident, updateData);
          break;
      }

      // Notify team of status update
      await this._notifyTeam(incident);

      // Log status update
      console.log(`Incident ${incidentId} status updated to ${status}`);

      return incident;
    } catch (error) {
      throw new Error(`Failed to update incident: ${error.message}`);
    }
  }

  /**
   * Add evidence to incident
   * @param {string} incidentId - Incident ID
   * @param {Object} evidence - Evidence data
   * @returns {Object|null} Updated incident or null if not found
   */
  async addEvidence(incidentId, evidence) {
    try {
      const incident = this.getIncident(incidentId);
      if (!incident) {
        return null;
      }

      const evidenceEntry = {
        id: this._generateEvidenceId(),
        timestamp: new Date().toISOString(),
        type: evidence.type,
        description: evidence.description,
        location: evidence.location,
        hash: evidence.hash,
        collectedBy: evidence.collectedBy,
        chainOfCustody: [{
          timestamp: new Date().toISOString(),
          actor: evidence.collectedBy,
          action: 'Collected'
        }]
      };

      incident.evidence.push(evidenceEntry);

      // Add to timeline
      incident.timeline.push({
        timestamp: new Date().toISOString(),
        action: 'Evidence added',
        actor: evidence.collectedBy,
        details: evidence.description
      });

      // Log evidence addition
      console.log(`Evidence added to incident ${incidentId}: ${evidence.description}`);

      return incident;
    } catch (error) {
      throw new Error(`Failed to add evidence: ${error.message}`);
    }
  }

  /**
   * Add communication to incident
   * @param {string} incidentId - Incident ID
   * @param {Object} communication - Communication data
   * @returns {Object|null} Updated incident or null if not found
   */
  async addCommunication(incidentId, communication) {
    try {
      const incident = this.getIncident(incidentId);
      if (!incident) {
        return null;
      }

      const communicationEntry = {
        id: this._generateCommunicationId(),
        timestamp: new Date().toISOString(),
        type: communication.type, // internal, external, regulatory
        recipient: communication.recipient,
        subject: communication.subject,
        content: communication.content,
        sentBy: communication.sentBy,
        status: 'sent'
      };

      incident.communications.push(communicationEntry);

      // Add to timeline
      incident.timeline.push({
        timestamp: new Date().toISOString(),
        action: `Communication sent (${communication.type})`,
        actor: communication.sentBy,
        details: communication.subject
      });

      // Log communication
      console.log(`Communication added to incident ${incidentId}: ${communication.subject}`);

      return incident;
    } catch (error) {
      throw new Error(`Failed to add communication: ${error.message}`);
    }
  }

  /**
   * Assign incident to team member
   * @param {string} incidentId - Incident ID
   * @param {string} teamMember - Team member to assign to
   * @returns {Object|null} Updated incident or null if not found
   */
  async assignIncident(incidentId, teamMember) {
    try {
      const incident = this.getIncident(incidentId);
      if (!incident) {
        return null;
      }

      incident.assignedTo = teamMember;

      // Add to timeline
      incident.timeline.push({
        timestamp: new Date().toISOString(),
        action: `Assigned to ${teamMember}`,
        actor: 'system'
      });

      // Notify assigned team member
      await this._notifyAssignee(incident, teamMember);

      // Log assignment
      console.log(`Incident ${incidentId} assigned to ${teamMember}`);

      return incident;
    } catch (error) {
      throw new Error(`Failed to assign incident: ${error.message}`);
    }
  }

  /**
   * Generate incident report
   * @param {string} incidentId - Incident ID
   * @returns {Object} Incident report
   */
  async generateReport(incidentId) {
    try {
      const incident = this.getIncident(incidentId);
      if (!incident) {
        throw new Error('Incident not found');
      }

      const report = {
        incidentId: incident.id,
        timestamp: incident.timestamp,
        status: incident.status,
        severity: incident.severity,
        type: incident.type,
        description: incident.description,
        affectedSystems: incident.affectedSystems,
        reportedBy: incident.reportedBy,
        assignedTo: incident.assignedTo,
        timeline: incident.timeline,
        evidence: incident.evidence,
        communications: incident.communications,
        duration: this._calculateDuration(incident),
        impact: this._assessImpact(incident),
        recommendations: this._generateRecommendations(incident)
      };

      // Save report to file
      const reportPath = path.join(__dirname, `../../reports/incident-${incidentId}.json`);
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      // Log report generation
      console.log(`Incident report generated for ${incidentId}`);

      return report;
    } catch (error) {
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }

  /**
   * Generate incident ID
   * @returns {string} Incident ID
   */
  _generateIncidentId() {
    return `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Generate evidence ID
   * @returns {string} Evidence ID
   */
  _generateEvidenceId() {
    return `EVID-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  /**
   * Generate communication ID
   * @returns {string} Communication ID
   */
  _generateCommunicationId() {
    return `COMM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  /**
   * Notify incident response team
   * @param {Object} incident - Incident to notify about
   */
  async _notifyTeam(incident) {
    // In production, this would send notifications via email, SMS, or other channels
    // For demonstration, we'll just log the notification

    const notification = {
      timestamp: new Date().toISOString(),
      type: 'INCIDENT_NOTIFICATION',
      incident: {
        id: incident.id,
        severity: incident.severity,
        type: incident.type,
        description: incident.description
      },
      recipients: this._getRecipients(incident.severity),
      channels: ['email', 'sms']
    };

    console.log('Sending incident notification:', JSON.stringify(notification, null, 2));
  }

  /**
   * Get recipients based on severity
   * @param {string} severity - Incident severity
   * @returns {Array} Recipients
   */
  _getRecipients(severity) {
    const recipients = [];

    switch (severity) {
      case 'critical':
        recipients.push(...this.team.analysts, ...this.team.administrators, this.team.manager, ...this.team.executives);
        break;
      case 'high':
        recipients.push(...this.team.analysts, ...this.team.administrators, this.team.manager);
        break;
      case 'medium':
        recipients.push(...this.team.analysts, this.team.manager);
        break;
      case 'low':
        recipients.push(...this.team.analysts);
        break;
    }

    return recipients;
  }

  /**
   * Notify assigned team member
   * @param {Object} incident - Incident
   * @param {string} assignee - Assignee
   */
  async _notifyAssignee(incident, assignee) {
    // In production, this would send a notification to the assignee
    // For demonstration, we'll just log the notification

    const notification = {
      timestamp: new Date().toISOString(),
      type: 'INCIDENT_ASSIGNMENT',
      incident: {
        id: incident.id,
        severity: incident.severity,
        type: incident.type,
        description: incident.description
      },
      assignee: assignee,
      channels: ['email']
    };

    console.log('Sending assignment notification:', JSON.stringify(notification, null, 2));
  }

  /**
   * Handle containment actions
   * @param {Object} incident - Incident
   * @param {Object} updateData - Update data
   */
  async _handleContainment(incident, updateData) {
    // In production, this would implement actual containment measures
    // For demonstration, we'll just log the action

    console.log(`Containment actions for incident ${incident.id}:`, updateData.containmentActions || 'Standard procedures');
  }

  /**
   * Handle eradication actions
   * @param {Object} incident - Incident
   * @param {Object} updateData - Update data
   */
  async _handleEradication(incident, updateData) {
    // In production, this would implement actual eradication measures
    // For demonstration, we'll just log the action

    console.log(`Eradication actions for incident ${incident.id}:`, updateData.eradicationActions || 'Standard procedures');
  }

  /**
   * Handle recovery actions
   * @param {Object} incident - Incident
   * @param {Object} updateData - Update data
   */
  async _handleRecovery(incident, updateData) {
    // In production, this would implement actual recovery measures
    // For demonstration, we'll just log the action

    console.log(`Recovery actions for incident ${incident.id}:`, updateData.recoveryActions || 'Standard procedures');
  }

  /**
   * Handle incident closure
   * @param {Object} incident - Incident
   * @param {Object} updateData - Update data
   */
  async _handleClosure(incident, updateData) {
    // Generate final report
    await this.generateReport(incident.id);

    // In production, this would implement actual closure measures
    // For demonstration, we'll just log the action

    console.log(`Incident ${incident.id} closed:`, updateData.closureNotes || 'Standard closure');
  }

  /**
   * Calculate incident duration
   * @param {Object} incident - Incident
   * @returns {number} Duration in minutes
   */
  _calculateDuration(incident) {
    const startTime = new Date(incident.timestamp);
    const endTime = new Date();
    return Math.round((endTime - startTime) / (1000 * 60));
  }

  /**
   * Assess incident impact
   * @param {Object} incident - Incident
   * @returns {Object} Impact assessment
   */
  _assessImpact(incident) {
    // In production, this would implement actual impact assessment
    // For demonstration, we'll return a basic assessment

    return {
      systems: incident.affectedSystems.length,
      data: incident.evidence.filter(e => e.type === 'data').length > 0,
      users: 'unknown',
      financial: 'unknown',
      reputational: 'unknown'
    };
  }

  /**
   * Generate recommendations
   * @param {Object} incident - Incident
   * @returns {Array} Recommendations
   */
  _generateRecommendations(incident) {
    // In production, this would implement actual recommendation generation
    // For demonstration, we'll return generic recommendations

    return [
      'Review and update security policies',
      'Enhance monitoring and detection capabilities',
      'Provide additional training to relevant personnel',
      'Implement additional security controls based on root cause',
      'Conduct lessons learned session with incident response team'
    ];
  }

  /**
   * Set incident response team members
   * @param {Object} team - Team members
   */
  setTeam(team) {
    this.team = { ...this.team, ...team };
  }

  /**
   * Get incident metrics
   * @returns {Object} Incident metrics
   */
  getMetrics() {
    const totalIncidents = this.incidents.length;
    const bySeverity = {
      critical: this.incidents.filter(i => i.severity === 'critical').length,
      high: this.incidents.filter(i => i.severity === 'high').length,
      medium: this.incidents.filter(i => i.severity === 'medium').length,
      low: this.incidents.filter(i => i.severity === 'low').length
    };
    const byStatus = {
      identified: this.incidents.filter(i => i.status === 'identified').length,
      contained: this.incidents.filter(i => i.status === 'contained').length,
      eradicated: this.incidents.filter(i => i.status === 'eradicated').length,
      recovered: this.incidents.filter(i => i.status === 'recovered').length,
      closed: this.incidents.filter(i => i.status === 'closed').length
    };

    return {
      totalIncidents,
      bySeverity,
      byStatus,
      avgResolutionTime: this._calculateAvgResolutionTime()
    };
  }

  /**
   * Calculate average resolution time
   * @returns {number} Average resolution time in minutes
   */
  _calculateAvgResolutionTime() {
    const closedIncidents = this.incidents.filter(i => i.status === 'closed');
    if (closedIncidents.length === 0) {
      return 0;
    }

    const totalDuration = closedIncidents.reduce((sum, incident) => {
      return sum + this._calculateDuration(incident);
    }, 0);

    return Math.round(totalDuration / closedIncidents.length);
  }
}

module.exports = IncidentResponseService;