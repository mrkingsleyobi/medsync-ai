// MediSync Agent Monitoring Dashboard JavaScript

class Dashboard {
    constructor() {
        this.updateInterval = 5000; // Update every 5 seconds
        this.updateTimer = null;
        this.initialize();
    }

    async initialize() {
        this.startAutoUpdate();
        await this.updateDashboard();
    }

    startAutoUpdate() {
        this.updateTimer = setInterval(() => {
            this.updateDashboard();
        }, this.updateInterval);
    }

    stopAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }

    async updateDashboard() {
        try {
            // Update health status
            await this.updateHealthStatus();

            // Update metrics
            await this.updateMetrics();

            // Update agents
            await this.updateAgents();

            // Update alerts
            await this.updateAlerts();

            // Update last updated time
            this.updateLastUpdated();

        } catch (error) {
            console.error('Dashboard update error:', error);
            this.showErrorMessage('Failed to update dashboard');
        }
    }

    async updateHealthStatus() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();

            const statusIndicator = document.getElementById('statusIndicator');
            const statusText = document.getElementById('statusText');

            if (data.status === 'healthy') {
                statusIndicator.className = 'status-indicator healthy';
                statusText.textContent = 'System Operational';
            } else {
                statusIndicator.className = 'status-indicator critical';
                statusText.textContent = 'System Issues Detected';
            }
        } catch (error) {
            console.error('Health status update error:', error);
        }
    }

    async updateMetrics() {
        try {
            const response = await fetch('/api/metrics');
            const data = await response.json();

            const metrics = data.metrics;

            // Update total agents
            document.getElementById('totalAgents').textContent = metrics.totalAgents || 0;

            // Update active tasks (sum of all agent tasks)
            let totalTasks = 0;
            if (metrics.agentMetrics) {
                metrics.agentMetrics.forEach(agent => {
                    totalTasks += agent.tasksProcessed || 0;
                });
            }
            document.getElementById('activeTasks').textContent = totalTasks;

            // Update system health
            const systemHealth = document.getElementById('systemHealth');
            systemHealth.textContent = metrics.systemHealth || 'Unknown';
            systemHealth.className = 'metric-value ' + (metrics.systemHealth === 'operational' ? 'healthy' : 'warning');

            // Update active alerts
            let alertCount = 0;
            if (metrics.queenAgentMetrics && metrics.queenAgentMetrics.activeAlerts !== undefined) {
                alertCount = metrics.queenAgentMetrics.activeAlerts;
            }
            document.getElementById('activeAlerts').textContent = alertCount;
            document.getElementById('activeAlerts').className = 'metric-value ' + (alertCount > 0 ? 'warning' : 'healthy');

        } catch (error) {
            console.error('Metrics update error:', error);
        }
    }

    async updateAgents() {
        try {
            const response = await fetch('/api/agents');
            const data = await response.json();

            const agentsGrid = document.getElementById('agentsGrid');
            agentsGrid.innerHTML = '';

            if (data.agents && data.agents.length > 0) {
                data.agents.forEach(agent => {
                    const agentCard = this.createAgentCard(agent);
                    agentsGrid.appendChild(agentCard);
                });
            } else {
                agentsGrid.innerHTML = '<p class="no-data">No agents registered</p>';
            }
        } catch (error) {
            console.error('Agents update error:', error);
            document.getElementById('agentsGrid').innerHTML = '<p class="error">Failed to load agents</p>';
        }
    }

    createAgentCard(agent) {
        const card = document.createElement('div');
        card.className = `agent-card ${agent.status || 'unknown'}`;

        const tasksProcessed = agent.metrics?.tasksProcessed || 0;
        const errors = agent.metrics?.errors || 0;
        const avgProcessingTime = agent.metrics?.averageProcessingTime || 0;

        card.innerHTML = `
            <h4>${agent.agentId || 'Unknown Agent'}</h4>
            <div class="agent-details">
                <div><strong>Type:</strong> ${agent.type || 'Unknown'}</div>
                <div><strong>Status:</strong> ${agent.status || 'Unknown'}</div>
                <div><strong>Tasks Processed:</strong> ${tasksProcessed}</div>
                <div><strong>Errors:</strong> ${errors}</div>
                <div><strong>Avg Processing Time:</strong> ${avgProcessingTime.toFixed(2)}ms</div>
                <div><strong>Last Activity:</strong> ${agent.lastActivity ? new Date(agent.lastActivity).toLocaleString() : 'Never'}</div>
            </div>
        `;

        return card;
    }

    async updateAlerts() {
        try {
            const response = await fetch('/api/alerts');
            const data = await response.json();

            const alertsList = document.getElementById('alertsList');
            alertsList.innerHTML = '';

            if (data.alerts && data.alerts.length > 0) {
                data.alerts.forEach(alert => {
                    const alertItem = this.createAlertItem(alert);
                    alertsList.appendChild(alertItem);
                });
            } else {
                alertsList.innerHTML = '<p class="no-data">No active alerts</p>';
            }
        } catch (error) {
            console.error('Alerts update error:', error);
            document.getElementById('alertsList').innerHTML = '<p class="error">Failed to load alerts</p>';
        }
    }

    createAlertItem(alert) {
        const item = document.createElement('div');
        item.className = `alert-item ${alert.severity || 'medium'}`;

        const timestamp = alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Unknown time';

        item.innerHTML = `
            <div class="alert-header">
                <div class="alert-type">${alert.type || 'Unknown Alert'}</div>
                <div class="alert-severity ${alert.severity || 'medium'}">${alert.severity || 'medium'}</div>
            </div>
            <div class="alert-message">${alert.message || 'No message provided'}</div>
            <div class="alert-timestamp">${timestamp}</div>
        `;

        return item;
    }

    updateLastUpdated() {
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    }

    showErrorMessage(message) {
        // In a real implementation, we might show a toast notification or similar
        console.error('Dashboard Error:', message);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();

    // Handle page visibility changes to pause/resume updates
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            dashboard.stopAutoUpdate();
        } else {
            dashboard.startAutoUpdate();
            dashboard.updateDashboard(); // Immediate update when page becomes visible
        }
    });
});