/**
 * Admin Dashboard JavaScript
 * Handles interactivity for the administrative dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const tabButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Quick action buttons
    const generateDocsButton = document.getElementById('generate-docs');
    const optimizeResourcesButton = document.getElementById('optimize-resources');
    const generateReportButton = document.getElementById('generate-report');
    const viewLogsButton = document.getElementById('view-logs');

    if (generateDocsButton) {
        generateDocsButton.addEventListener('click', () => {
            showNotification('Documentation generation started', 'info');
            // In a real implementation, this would call the API
            simulateDocumentationGeneration();
        });
    }

    if (optimizeResourcesButton) {
        optimizeResourcesButton.addEventListener('click', () => {
            showNotification('Resource optimization started', 'info');
            // In a real implementation, this would call the API
            simulateResourceOptimization();
        });
    }

    if (generateReportButton) {
        generateReportButton.addEventListener('click', () => {
            showNotification('Usage report generation started', 'info');
            // In a real implementation, this would call the API
            simulateReportGeneration();
        });
    }

    if (viewLogsButton) {
        viewLogsButton.addEventListener('click', () => {
            showNotification('Opening logs viewer...', 'info');
            // In a real implementation, this would open a logs viewer
            setTimeout(() => {
                showNotification('Logs viewer opened in new tab', 'success');
            }, 1000);
        });
    }

    // Form submissions
    const scheduleTaskForm = document.getElementById('schedule-task-form');
    const billingForm = document.getElementById('billing-form');
    const alertConfigForm = document.getElementById('alert-config-form');

    if (scheduleTaskForm) {
        scheduleTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(scheduleTaskForm);
            const taskData = {
                name: formData.get('task-name'),
                schedule: formData.get('task-schedule'),
                description: formData.get('task-description')
            };

            showNotification(`Task "${taskData.name}" scheduled successfully`, 'success');
            scheduleTaskForm.reset();
        });
    }

    if (billingForm) {
        billingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(billingForm);
            const billingData = {
                customerId: formData.get('customer-id'),
                amount: parseFloat(formData.get('amount')),
                description: formData.get('description')
            };

            showNotification(`Payment of $${billingData.amount} processed for customer ${billingData.customerId}`, 'success');
            billingForm.reset();
        });
    }

    if (alertConfigForm) {
        alertConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Alert configuration updated successfully', 'success');
        });
    }

    // Alert actions
    const alertActionButtons = document.querySelectorAll('.alert-actions .btn-small');
    alertActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.toLowerCase();
            const alertItem = this.closest('.alert-item');
            const alertType = alertItem.querySelector('.alert-type').textContent;

            if (action === 'acknowledge') {
                showNotification(`Alert "${alertType}" acknowledged`, 'info');
                alertItem.style.opacity = '0.7';
            } else if (action === 'resolve') {
                showNotification(`Alert "${alertType}" resolved`, 'success');
                alertItem.style.display = 'none';
                updateActiveAlertsCount();
            }
        });
    });

    // Initialize dashboard
    initializeDashboard();
});

/**
 * Initialize dashboard with sample data
 */
function initializeDashboard() {
    // Update last updated time
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = new Date().toLocaleTimeString();
    }

    // Update resource usage
    updateResourceUsage();

    // Update active alerts count
    updateActiveAlertsCount();

    // Update scheduled tasks count
    updateScheduledTasksCount();

    // Set up periodic updates
    setInterval(updateDashboard, 30000); // Update every 30 seconds
}

/**
 * Update dashboard data
 */
function updateDashboard() {
    // Update last updated time
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = new Date().toLocaleTimeString();
    }

    // Update resource usage with random values for simulation
    updateResourceUsage();

    // Update active alerts count
    updateActiveAlertsCount();
}

/**
 * Update resource usage indicators
 */
function updateResourceUsage() {
    // Generate random values for simulation
    const cpuUsage = Math.floor(Math.random() * 30) + 30; // 30-60%
    const memoryUsage = Math.floor(Math.random() * 40) + 50; // 50-90%
    const diskUsage = Math.floor(Math.random() * 20) + 20; // 20-40%

    // Update CPU usage
    const cpuElement = document.getElementById('cpu-usage');
    if (cpuElement) {
        cpuElement.textContent = `${cpuUsage}%`;
    }

    // Update memory usage
    const memoryElement = document.getElementById('memory-usage');
    if (memoryElement) {
        memoryElement.textContent = `${memoryUsage}%`;
    }

    // Update disk usage
    const diskElement = document.getElementById('disk-usage');
    if (diskElement) {
        diskElement.textContent = `${diskUsage}%`;
    }

    // Update resource bars
    const cpuBar = document.querySelector('.resource-bar:nth-child(1) .bar-fill');
    if (cpuBar) {
        cpuBar.style.width = `${cpuUsage}%`;
    }

    const memoryBar = document.querySelector('.resource-bar:nth-child(2) .bar-fill');
    if (memoryBar) {
        memoryBar.style.width = `${memoryUsage}%`;
    }

    const diskBar = document.querySelector('.resource-bar:nth-child(3) .bar-fill');
    if (diskBar) {
        diskBar.style.width = `${diskUsage}%`;
    }
}

/**
 * Update active alerts count
 */
function updateActiveAlertsCount() {
    const activeAlerts = document.querySelectorAll('.alert-item:not([style*="display: none"])').length;
    const activeAlertsElement = document.getElementById('active-alerts');
    if (activeAlertsElement) {
        activeAlertsElement.textContent = activeAlerts;
    }
}

/**
 * Update scheduled tasks count
 */
function updateScheduledTasksCount() {
    // In a real implementation, this would fetch the actual count
    const scheduledTasksElement = document.getElementById('scheduled-tasks');
    if (scheduledTasksElement) {
        scheduledTasksElement.textContent = '12';
    }
}

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Simulate documentation generation
 */
function simulateDocumentationGeneration() {
    setTimeout(() => {
        showNotification('Documentation generated successfully', 'success');
    }, 2000);
}

/**
 * Simulate resource optimization
 */
function simulateResourceOptimization() {
    setTimeout(() => {
        showNotification('Resource optimization completed', 'success');
        // Update resource usage after optimization
        updateResourceUsage();
    }, 1500);
}

/**
 * Simulate report generation
 */
function simulateReportGeneration() {
    setTimeout(() => {
        showNotification('Usage report generated successfully', 'success');
    }, 2500);
}