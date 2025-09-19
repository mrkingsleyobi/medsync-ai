/**
 * IoT Dashboard JavaScript
 * Handles interactivity for the IoT and wearable integration dashboard
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
    const refreshDataButton = document.getElementById('refresh-data');
    const generateAlertsButton = document.getElementById('generate-alerts');
    const runAnalyticsButton = document.getElementById('run-analytics');
    const predictHealthButton = document.getElementById('predict-health');

    if (refreshDataButton) {
        refreshDataButton.addEventListener('click', () => {
            showNotification('Refreshing health data...', 'info');
            // In a real implementation, this would call the API
            simulateDataRefresh();
        });
    }

    if (generateAlertsButton) {
        generateAlertsButton.addEventListener('click', () => {
            showNotification('Generating health alerts...', 'info');
            // In a real implementation, this would call the API
            simulateAlertGeneration();
        });
    }

    if (runAnalyticsButton) {
        runAnalyticsButton.addEventListener('click', () => {
            showNotification('Running population analytics...', 'info');
            // In a real implementation, this would call the API
            simulateAnalyticsRun();
        });
    }

    if (predictHealthButton) {
        predictHealthButton.addEventListener('click', () => {
            showNotification('Generating health predictions...', 'info');
            // In a real implementation, this would call the API
            simulateHealthPrediction();
        });
    }

    // Form submissions
    const deviceManagementForm = document.getElementById('device-management-form');
    const monitoringConfigForm = document.getElementById('monitoring-config-form');
    const alertConfigForm = document.getElementById('alert-config-form');
    const predictionConfigForm = document.getElementById('prediction-config-form');

    if (deviceManagementForm) {
        deviceManagementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(deviceManagementForm);
            const deviceData = {
                type: formData.get('device-type'),
                model: formData.get('device-model'),
                id: formData.get('device-id')
            };

            showNotification(`Device "${deviceData.model}" added successfully`, 'success');
            deviceManagementForm.reset();
        });
    }

    if (monitoringConfigForm) {
        monitoringConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Monitoring configuration updated successfully', 'success');
        });
    }

    if (alertConfigForm) {
        alertConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Alert configuration updated successfully', 'success');
        });
    }

    if (predictionConfigForm) {
        predictionConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Prediction configuration updated successfully', 'success');
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

    // Update vitals
    updateVitals();

    // Update activity metrics
    updateActivityMetrics();

    // Update active alerts count
    updateActiveAlertsCount();

    // Update connected devices count
    updateConnectedDevicesCount();

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

    // Update vitals
    updateVitals();

    // Update activity metrics
    updateActivityMetrics();

    // Update active alerts count
    updateActiveAlertsCount();
}

/**
 * Update vitals indicators
 */
function updateVitals() {
    // Generate random values for simulation
    const heartRate = Math.floor(Math.random() * 20) + 65; // 65-85 bpm
    const systolic = Math.floor(Math.random() * 15) + 110; // 110-125 mmHg
    const diastolic = Math.floor(Math.random() * 10) + 70; // 70-80 mmHg
    const glucose = Math.floor(Math.random() * 20) + 90; // 90-110 mg/dL
    const temperature = (Math.random() * 1 + 98.0).toFixed(1); // 98.0-99.0 °F

    // Update heart rate
    const heartRateElement = document.getElementById('heart-rate');
    if (heartRateElement) {
        heartRateElement.textContent = heartRate;
    }

    // Update blood pressure
    const bloodPressureElement = document.getElementById('blood-pressure');
    if (bloodPressureElement) {
        bloodPressureElement.textContent = `${systolic}/${diastolic}`;
    }

    // Update glucose
    const glucoseElement = document.getElementById('glucose');
    if (glucoseElement) {
        glucoseElement.textContent = glucose;
    }

    // Update temperature
    const temperatureElement = document.getElementById('temperature');
    if (temperatureElement) {
        temperatureElement.textContent = temperature;
    }

    // Update current readings
    const currentHeartRateElement = document.getElementById('current-heart-rate');
    if (currentHeartRateElement) {
        currentHeartRateElement.textContent = heartRate;
    }

    const currentBloodPressureElement = document.getElementById('current-blood-pressure');
    if (currentBloodPressureElement) {
        currentBloodPressureElement.textContent = `${systolic}/${diastolic}`;
    }

    const currentGlucoseElement = document.getElementById('current-glucose');
    if (currentGlucoseElement) {
        currentGlucoseElement.textContent = glucose;
    }

    const currentTemperatureElement = document.getElementById('current-temperature');
    if (currentTemperatureElement) {
        currentTemperatureElement.textContent = temperature;
    }
}

/**
 * Update activity metrics
 */
function updateActivityMetrics() {
    // Generate random values for simulation
    const steps = Math.floor(Math.random() * 3000) + 7000; // 7000-10000 steps
    const calories = Math.floor(Math.random() * 200) + 300; // 300-500 calories
    const sleep = (Math.random() * 1.5 + 6.0).toFixed(1); // 6.0-7.5 hours
    const activeMinutes = Math.floor(Math.random() * 30) + 30; // 30-60 minutes

    // Update steps
    const stepsElement = document.getElementById('steps');
    if (stepsElement) {
        stepsElement.textContent = steps.toLocaleString();
    }

    // Update calories
    const caloriesElement = document.getElementById('calories');
    if (caloriesElement) {
        caloriesElement.textContent = calories;
    }

    // Update sleep
    const sleepElement = document.getElementById('sleep');
    if (sleepElement) {
        sleepElement.textContent = sleep;
    }

    // Update active minutes
    const activeMinutesElement = document.getElementById('active-minutes');
    if (activeMinutesElement) {
        activeMinutesElement.textContent = activeMinutes;
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
 * Update connected devices count
 */
function updateConnectedDevicesCount() {
    // In a real implementation, this would fetch the actual count
    const connectedDevicesElement = document.getElementById('connected-devices');
    if (connectedDevicesElement) {
        connectedDevicesElement.textContent = '24';
    }

    // Update data points
    const dataPointsElement = document.getElementById('data-points');
    if (dataPointsElement) {
        dataPointsElement.textContent = '1.2M';
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
            notification.style.backgroundColor = '#8b5cf6';
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
 * Simulate data refresh
 */
function simulateDataRefresh() {
    setTimeout(() => {
        showNotification('Health data refreshed successfully', 'success');
        // Update dashboard data
        updateDashboard();
    }, 1500);
}

/**
 * Simulate alert generation
 */
function simulateAlertGeneration() {
    setTimeout(() => {
        showNotification('Health alerts generated successfully', 'success');
        // Update active alerts count
        updateActiveAlertsCount();
    }, 1000);
}

/**
 * Simulate analytics run
 */
function simulateAnalyticsRun() {
    setTimeout(() => {
        showNotification('Population analytics completed successfully', 'success');
    }, 2500);
}

/**
 * Simulate health prediction
 */
function simulateHealthPrediction() {
    setTimeout(() => {
        showNotification('Health predictions generated successfully', 'success');
    }, 2000);
}