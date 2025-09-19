/**
 * Provider Dashboard Scripts
 * JavaScript functionality for the clinical decision support provider dashboard
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();

    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the dashboard
 */
function initDashboard() {
    // Show the overview section by default
    showSection('overview');

    // Load initial data
    loadDashboardData();

    console.log('Provider dashboard initialized');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item a');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });

    // Form submission
    const decisionForm = document.querySelector('.decision-form');
    if (decisionForm) {
        decisionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateDecisionSupport();
        });
    }

    // Button actions
    document.addEventListener('click', function(e) {
        // Acknowledge alert buttons
        if (e.target.classList.contains('btn-primary') && e.target.textContent.includes('Acknowledge')) {
            acknowledgeAlert(e.target);
        }

        // View details buttons
        if (e.target.classList.contains('btn-secondary') && e.target.textContent.includes('View Details')) {
            viewAlertDetails(e.target);
        }

        // Refresh buttons
        if (e.target.classList.contains('btn-secondary') && e.target.textContent.includes('Refresh')) {
            refreshData();
        }
    });
}

/**
 * Show a specific section and hide others
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
        }
    });
}

/**
 * Load dashboard data
 */
function loadDashboardData() {
    // In a real implementation, this would fetch data from the backend
    console.log('Loading dashboard data...');

    // Simulate loading data
    setTimeout(() => {
        console.log('Dashboard data loaded');
    }, 500);
}

/**
 * Generate decision support
 */
function generateDecisionSupport() {
    // Get form data
    const patientId = document.getElementById('patient-id').value;
    const decisionType = document.getElementById('decision-type').value;
    const symptoms = document.getElementById('patient-symptoms').value;
    const condition = document.getElementById('patient-condition').value;

    // Validate input
    if (!patientId) {
        showAlert('Please enter a patient ID', 'error');
        return;
    }

    if (!decisionType) {
        showAlert('Please select a decision type', 'error');
        return;
    }

    // Show loading state
    const generateBtn = document.querySelector('.decision-form .btn-primary');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    generateBtn.disabled = true;

    // In a real implementation, this would call the backend API
    console.log('Generating decision support for:', {
        patientId,
        decisionType,
        symptoms,
        condition
    });

    // Simulate API call
    setTimeout(() => {
        // Reset button
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;

        // Show success message
        showAlert('Decision support generated successfully', 'success');

        // Update the decision result section with sample data
        updateDecisionResult({
            patientId,
            decisionType,
            confidence: 92,
            processingTime: 42,
            recommendations: [
                'Check blood pressure and consider antihypertensive therapy',
                'Monitor for signs of target organ damage',
                'Recommend lifestyle modifications'
            ],
            evidence: [
                'Headache and blurred vision are common symptoms of hypertension',
                'Blood pressure reading of 160/100 confirms hypertension'
            ]
        });
    }, 1500);
}

/**
 * Update the decision result section with new data
 * @param {Object} data - The decision result data
 */
function updateDecisionResult(data) {
    // Update result meta
    const resultMeta = document.querySelector('.result-meta');
    if (resultMeta) {
        resultMeta.innerHTML = `
            <span>Patient: ${data.patientId}</span>
            <span>Confidence: ${data.confidence}%</span>
            <span>Time: ${data.processingTime}ms</span>
        `;
    }

    // Update recommendations
    const recommendationsList = document.querySelector('.recommendations ul');
    if (recommendationsList) {
        recommendationsList.innerHTML = '';
        data.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
    }

    // Update evidence
    const evidenceList = document.querySelector('.evidence ul');
    if (evidenceList) {
        evidenceList.innerHTML = '';
        data.evidence.forEach(ev => {
            const li = document.createElement('li');
            li.textContent = ev;
            evidenceList.appendChild(li);
        });
    }

    // Show the decision result section
    const decisionResult = document.querySelector('.decision-result');
    if (decisionResult) {
        decisionResult.style.display = 'block';
    }
}

/**
 * Acknowledge an alert
 * @param {HTMLElement} button - The acknowledge button
 */
function acknowledgeAlert(button) {
    const alertItem = button.closest('.alert-item');
    if (alertItem) {
        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // In a real implementation, this would call the backend API
        console.log('Acknowledging alert...');

        // Simulate API call
        setTimeout(() => {
            // Remove the alert item
            alertItem.style.opacity = '0';
            setTimeout(() => {
                alertItem.remove();
                showAlert('Alert acknowledged successfully', 'success');
            }, 300);
        }, 800);
    }
}

/**
 * View alert details
 * @param {HTMLElement} button - The view details button
 */
function viewAlertDetails(button) {
    // In a real implementation, this would open a modal with alert details
    console.log('Viewing alert details...');
    showAlert('Alert details would be displayed in a modal', 'info');
}

/**
 * Refresh data
 */
function refreshData() {
    console.log('Refreshing data...');
    showAlert('Data refreshed successfully', 'success');

    // In a real implementation, this would reload data from the backend
}

/**
 * Show an alert message
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, error, info, warning)
 */
function showAlert(message, type) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `;

    // Style the alert
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getAlertColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Add close button style
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
    `;

    // Add to document
    document.body.appendChild(alert);

    // Animate in
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
    }, 100);

    // Auto close after 5 seconds
    setTimeout(() => {
        closeAlert(alert);
    }, 5000);

    // Close button event
    closeBtn.addEventListener('click', () => {
        closeAlert(alert);
    });
}

/**
 * Close an alert
 * @param {HTMLElement} alert - The alert element to close
 */
function closeAlert(alert) {
    alert.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 300);
}

/**
 * Get alert icon based on type
 * @param {string} type - The alert type
 * @returns {string} The icon class
 */
function getAlertIcon(type) {
    switch (type) {
        case 'success':
            return 'check-circle';
        case 'error':
            return 'exclamation-circle';
        case 'warning':
            return 'exclamation-triangle';
        case 'info':
        default:
            return 'info-circle';
    }
}

/**
 * Get alert color based on type
 * @param {string} type - The alert type
 * @returns {string} The background color
 */
function getAlertColor(type) {
    switch (type) {
        case 'success':
            return '#4CAF50';
        case 'error':
            return '#f44336';
        case 'warning':
            return '#ff9800';
        case 'info':
        default:
            return '#2196F3';
    }
}