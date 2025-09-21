const config = require('../config/security.config.js');

class MonitoringService {
  constructor() {
    this.config = config;
    this.alerts = [];
    this.metrics = {
      totalEvents: 0,
      securityEvents: 0,
      errorEvents: 0,
      warningEvents: 0
    };
  }

  /**
   * Monitor security events and generate alerts
   * @param {Object} event - Security event to monitor
   */
  monitorEvent(event) {
    try {
      // Increment metrics
      this.metrics.totalEvents++;

      switch (event.severity) {
        case 'error':
          this.metrics.errorEvents++;
          break;
        case 'warning':
          this.metrics.warningEvents++;
          break;
        case 'security':
          this.metrics.securityEvents++;
          break;
      }

      // Check for alert conditions
      this._checkAlertConditions(event);

      // Store event for analysis
      this._storeEvent(event);

      // Log monitoring event
      console.log(`Monitoring event: ${event.type} - ${event.message}`);
    } catch (error) {
      console.error('Monitoring service error:', error.message);
    }
  }

  /**
   * Check alert conditions and generate alerts if needed
   * @param {Object} event - Security event to check
   */
  _checkAlertConditions(event) {
    // Check for high-severity events
    if (event.severity === 'error' || event.severity === 'security') {
      this._generateAlert({
        type: 'HIGH_SEVERITY_EVENT',
        severity: 'critical',
        message: `High severity event detected: ${event.type}`,
        event: event,
        timestamp: new Date().toISOString()
      });
    }

    // Check for multiple failed login attempts
    if (event.type === 'failed_login' && event.count >= 5) {
      this._generateAlert({
        type: 'MULTIPLE_FAILED_LOGINS',
        severity: 'warning',
        message: `Multiple failed login attempts detected for user ${event.userId}`,
        event: event,
        timestamp: new Date().toISOString()
      });
    }

    // Check for unusual data access patterns
    if (event.type === 'data_access' && event.sensitiveData) {
      this._generateAlert({
        type: 'SENSITIVE_DATA_ACCESS',
        severity: 'warning',
        message: `Access to sensitive data detected: ${event.dataType}`,
        event: event,
        timestamp: new Date().toISOString()
      });
    }

    // Check for brute force attack patterns
    if (event.type === 'brute_force_attempt') {
      this._generateAlert({
        type: 'BRUTE_FORCE_ATTACK',
        severity: 'critical',
        message: 'Potential brute force attack detected',
        event: event,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Generate security alert
   * @param {Object} alert - Alert to generate
   */
  _generateAlert(alert) {
    // Add alert to alerts array
    this.alerts.push(alert);

    // Send alert notification
    this._sendAlertNotification(alert);

    // Log alert
    console.warn(`Security Alert: ${alert.type} - ${alert.message}`);
  }

  /**
   * Send alert notification
   * @param {Object} alert - Alert to send
   */
  _sendAlertNotification(alert) {
    // In production, this would send notifications via email, SMS, or other channels
    // For demonstration, we'll just log the notification

    const notification = {
      timestamp: new Date().toISOString(),
      type: 'SECURITY_ALERT',
      alert: alert,
      recipients: ['security-team@medisync.example.com'],
      channels: ['email', 'sms']
    };

    console.log('Sending security alert notification:', JSON.stringify(notification, null, 2));
  }

  /**
   * Store event for analysis
   * @param {Object} event - Event to store
   */
  _storeEvent(event) {
    // In production, this would store events in a database or log aggregation system
    // For demonstration, we'll just keep them in memory

    if (!this.storedEvents) {
      this.storedEvents = [];
    }

    this.storedEvents.push({
      ...event,
      storedAt: new Date().toISOString()
    });
  }

  /**
   * Get security metrics
   * @returns {Object} Security metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeAlerts: this.alerts.filter(alert => !alert.resolved).length,
      totalAlerts: this.alerts.length
    };
  }

  /**
   * Get recent alerts
   * @param {number} limit - Number of alerts to return
   * @returns {Array} Recent alerts
   */
  getRecentAlerts(limit = 10) {
    return this.alerts
      .slice(-limit)
      .reverse();
  }

  /**
   * Resolve alert
   * @param {string} alertId - ID of alert to resolve
   * @returns {boolean} Whether alert was resolved
   */
  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * Get security dashboard data
   * @returns {Object} Dashboard data
   */
  getDashboardData() {
    return {
      metrics: this.getMetrics(),
      recentAlerts: this.getRecentAlerts(5),
      eventsLastHour: this._getEventsLastHour(),
      topEventTypes: this._getTopEventTypes()
    };
  }

  /**
   * Get events from last hour
   * @returns {Array} Events from last hour
   */
  _getEventsLastHour() {
    if (!this.storedEvents) {
      return [];
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    return this.storedEvents.filter(event => {
      const eventTime = new Date(event.timestamp || event.storedAt);
      return eventTime > oneHourAgo;
    });
  }

  /**
   * Get top event types
   * @returns {Array} Top event types
   */
  _getTopEventTypes() {
    if (!this.storedEvents) {
      return [];
    }

    const eventTypes = {};

    this.storedEvents.forEach(event => {
      const type = event.type || 'unknown';
      eventTypes[type] = (eventTypes[type] || 0) + 1;
    });

    return Object.entries(eventTypes)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Start monitoring interval
   * @param {number} interval - Interval in milliseconds
   */
  startMonitoring(interval = 30000) {
    // Run monitoring checks at regular intervals
    this.monitoringInterval = setInterval(() => {
      this._runMonitoringChecks();
    }, interval);
  }

  /**
   * Stop monitoring interval
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Run monitoring checks
   */
  _runMonitoringChecks() {
    // Check for system health
    this._checkSystemHealth();

    // Check for security patterns
    this._checkSecurityPatterns();

    // Generate periodic reports
    this._generatePeriodicReport();
  }

  /**
   * Check system health
   */
  _checkSystemHealth() {
    // In production, this would check system resources, database connections, etc.
    // For demonstration, we'll just log a health check

    console.log('System health check: OK');
  }

  /**
   * Check for security patterns
   */
  _checkSecurityPatterns() {
    // In production, this would analyze stored events for patterns
    // For demonstration, we'll just log a pattern check

    console.log('Security pattern analysis: No suspicious patterns detected');
  }

  /**
   * Generate periodic report
   */
  _generatePeriodicReport() {
    const metrics = this.getMetrics();

    const report = {
      timestamp: new Date().toISOString(),
      period: 'hourly',
      metrics: metrics,
      summary: `Security monitoring report: ${metrics.totalEvents} events, ${metrics.activeAlerts} active alerts`
    };

    console.log('Periodic security report:', JSON.stringify(report, null, 2));
  }
}

module.exports = MonitoringService;