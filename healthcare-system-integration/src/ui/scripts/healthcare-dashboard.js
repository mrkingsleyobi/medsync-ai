/**
 * Healthcare Dashboard JavaScript
 * Handles interactivity for the healthcare integration dashboard
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
    const syncEhrButton = document.getElementById('sync-ehr');
    const processHl7Button = document.getElementById('process-hl7');
    const integrateDicomButton = document.getElementById('integrate-dicom');
    const matchPatientsButton = document.getElementById('match-patients');

    if (syncEhrButton) {
        syncEhrButton.addEventListener('click', () => {
            showNotification('EHR data synchronization started', 'info');
            // In a real implementation, this would call the API
            simulateEhrSync();
        });
    }

    if (processHl7Button) {
        processHl7Button.addEventListener('click', () => {
            showNotification('HL7 message processing started', 'info');
            // In a real implementation, this would call the API
            simulateHl7Processing();
        });
    }

    if (integrateDicomButton) {
        integrateDicomButton.addEventListener('click', () => {
            showNotification('DICOM integration started', 'info');
            // In a real implementation, this would call the API
            simulateDicomIntegration();
        });
    }

    if (matchPatientsButton) {
        matchPatientsButton.addEventListener('click', () => {
            showNotification('Patient record matching started', 'info');
            // In a real implementation, this would call the API
            simulatePatientMatching();
        });
    }

    // Form submissions
    const fhirConfigForm = document.getElementById('fhir-config-form');
    const hl7ConfigForm = document.getElementById('hl7-config-form');
    const dicomConfigForm = document.getElementById('dicom-config-form');
    const syncConfigForm = document.getElementById('sync-config-form');
    const matchingConfigForm = document.getElementById('matching-config-form');
    const imagingConfigForm = document.getElementById('imaging-config-form');

    if (fhirConfigForm) {
        fhirConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('FHIR configuration updated successfully', 'success');
        });
    }

    if (hl7ConfigForm) {
        hl7ConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('HL7 configuration updated successfully', 'success');
        });
    }

    if (dicomConfigForm) {
        dicomConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('DICOM configuration updated successfully', 'success');
        });
    }

    if (syncConfigForm) {
        syncConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Synchronization configuration updated successfully', 'success');
        });
    }

    if (matchingConfigForm) {
        matchingConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Patient matching configuration updated successfully', 'success');
        });
    }

    if (imagingConfigForm) {
        imagingConfigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Image processing configuration updated successfully', 'success');
        });
    }

    // Range sliders with value display
    const rangeInputs = document.querySelectorAll('input[type="number"][min][max]');
    rangeInputs.forEach(input => {
        const rangeValue = document.createElement('span');
        rangeValue.className = 'range-value';
        rangeValue.textContent = input.value + (input.id.includes('threshold') ? '%' : '');
        input.parentNode.appendChild(rangeValue);

        input.addEventListener('input', () => {
            rangeValue.textContent = input.value + (input.id.includes('threshold') ? '%' : '');
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

    // Update system metrics
    updateSystemMetrics();

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

    // Update system metrics
    updateSystemMetrics();
}

/**
 * Update system metrics
 */
function updateSystemMetrics() {
    // Update FHIR records
    const fhirRecordsElement = document.getElementById('fhir-records');
    if (fhirRecordsElement) {
        fhirRecordsElement.textContent = (Math.floor(Math.random() * 1000) + 1000).toLocaleString();
    }

    // Update HL7 messages
    const hl7MessagesElement = document.getElementById('hl7-messages');
    if (hl7MessagesElement) {
        hl7MessagesElement.textContent = (Math.floor(Math.random() * 500) + 500).toLocaleString();
    }

    // Update DICOM images
    const dicomImagesElement = document.getElementById('dicom-images');
    if (dicomImagesElement) {
        dicomImagesElement.textContent = (Math.floor(Math.random() * 100) + 50).toLocaleString();
    }

    // Update matching records
    const matchingRecordsElement = document.getElementById('matching-records');
    if (matchingRecordsElement) {
        matchingRecordsElement.textContent = (Math.floor(Math.random() * 50) + 20).toLocaleString();
    }

    // Update processed images
    const processedImagesElement = document.getElementById('processed-images');
    if (processedImagesElement) {
        processedImagesElement.textContent = (Math.floor(Math.random() * 100) + 50).toLocaleString();
    }

    // Update response time
    const responseTimeElement = document.getElementById('response-time');
    if (responseTimeElement) {
        responseTimeElement.textContent = (Math.floor(Math.random() * 100) + 50) + 'ms';
    }

    // Update success rate
    const successRateElement = document.getElementById('success-rate');
    if (successRateElement) {
        successRateElement.textContent = (99 + Math.random() * 0.9).toFixed(1) + '%';
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
 * Simulate EHR synchronization
 */
function simulateEhrSync() {
    setTimeout(() => {
        showNotification('EHR data synchronization completed successfully', 'success');
        // Update sync timestamp
        const lastSyncElement = document.getElementById('last-sync');
        if (lastSyncElement) {
            lastSyncElement.textContent = 'Just now';
        }
    }, 2000);
}

/**
 * Simulate HL7 message processing
 */
function simulateHl7Processing() {
    setTimeout(() => {
        showNotification('HL7 messages processed successfully', 'success');
    }, 1500);
}

/**
 * Simulate DICOM integration
 */
function simulateDicomIntegration() {
    setTimeout(() => {
        showNotification('DICOM integration completed successfully', 'success');
    }, 2500);
}

/**
 * Simulate patient matching
 */
function simulatePatientMatching() {
    setTimeout(() => {
        showNotification('Patient record matching completed successfully', 'success');
    }, 1000);
}