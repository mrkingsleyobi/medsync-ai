/**
 * Researcher Dashboard Scripts
 * JavaScript functionality for the research integration researcher dashboard
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

    console.log('Researcher dashboard initialized');
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

    // Form submissions
    const literatureForm = document.querySelector('.literature-form');
    if (literatureForm) {
        literatureForm.addEventListener('submit', function(e) {
            e.preventDefault();
            runLiteratureAnalysis();
        });
    }

    const trialForm = document.querySelector('.trial-form');
    if (trialForm) {
        trialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            findClinicalTrials();
        });
    }

    // Button actions
    document.addEventListener('click', function(e) {
        // Refresh buttons
        if (e.target.classList.contains('btn-secondary') && e.target.textContent.includes('Refresh')) {
            refreshData();
        }

        // View details buttons
        if (e.target.classList.contains('btn-small') && e.target.textContent.includes('Details')) {
            viewTrialDetails(e.target);
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
 * Run literature analysis
 */
function runLiteratureAnalysis() {
    // Get form data
    const documentSource = document.getElementById('document-source').value;
    const analysisType = document.getElementById('analysis-type').value;
    const searchTerms = document.getElementById('search-terms').value;
    const dateRange = document.getElementById('date-range').value;

    // Validate input
    if (!documentSource) {
        showAlert('Please select a document source', 'error');
        return;
    }

    if (!analysisType) {
        showAlert('Please select an analysis type', 'error');
        return;
    }

    if (!searchTerms) {
        showAlert('Please enter search terms', 'error');
        return;
    }

    // Show loading state
    const runBtn = document.querySelector('.literature-form .btn-primary');
    const originalText = runBtn.innerHTML;
    runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    runBtn.disabled = true;

    // In a real implementation, this would call the backend API
    console.log('Running literature analysis with:', {
        documentSource,
        analysisType,
        searchTerms,
        dateRange
    });

    // Simulate API call
    setTimeout(() => {
        // Reset button
        runBtn.innerHTML = originalText;
        runBtn.disabled = false;

        // Show success message
        showAlert('Literature analysis completed successfully', 'success');

        // Update the literature results section with sample data
        updateLiteratureResults({
            documentCount: 47,
            processingTime: 2.3,
            accuracy: 89,
            entities: ['Diabetes', 'Insulin', 'Glucose', 'Metformin', 'HbA1c', 'Cardiovascular'],
            topics: [
                { name: 'Type 2 Diabetes Management', score: 92 },
                { name: 'Cardiovascular Complications', score: 78 },
                { name: 'Drug Interactions', score: 65 }
            ]
        });
    }, 2000);
}

/**
 * Update the literature results section with new data
 * @param {Object} data - The literature analysis data
 */
function updateLiteratureResults(data) {
    // Update result meta
    const resultMeta = document.querySelector('.result-meta');
    if (resultMeta) {
        resultMeta.innerHTML = `
            <span>Documents: ${data.documentCount}</span>
            <span>Processing Time: ${data.processingTime}s</span>
            <span>Accuracy: ${data.accuracy}%</span>
        `;
    }

    // Update entities
    const entityTags = document.querySelector('.entity-tags');
    if (entityTags) {
        entityTags.innerHTML = '';
        data.entities.forEach(entity => {
            const span = document.createElement('span');
            span.className = 'entity-tag';
            span.textContent = entity;
            entityTags.appendChild(span);
        });
    }

    // Update topics
    const topicList = document.querySelector('.topic-list');
    if (topicList) {
        topicList.innerHTML = '';
        data.topics.forEach(topic => {
            const topicItem = document.createElement('div');
            topicItem.className = 'topic-item';

            const topicName = document.createElement('div');
            topicName.className = 'topic-name';
            topicName.textContent = topic.name;  // Use textContent to prevent XSS

            const topicScore = document.createElement('div');
            topicScore.className = 'topic-score';
            topicScore.textContent = `${topic.score}%`;  // Use textContent to prevent XSS

            topicItem.appendChild(topicName);
            topicItem.appendChild(topicScore);
            topicList.appendChild(topicItem);
        });
    }

    // Show the literature results section
    const literatureResults = document.querySelector('.literature-results');
    if (literatureResults) {
        literatureResults.style.display = 'block';
    }
}

/**
 * Find clinical trials
 */
function findClinicalTrials() {
    // Get form data
    const patientId = document.getElementById('patient-id').value;
    const condition = document.getElementById('condition').value;
    const ageRange = document.getElementById('age-range').value;
    const location = document.getElementById('location').value;

    // Validate input
    if (!patientId) {
        showAlert('Please enter a patient ID', 'error');
        return;
    }

    if (!condition) {
        showAlert('Please enter a medical condition', 'error');
        return;
    }

    // Show loading state
    const findBtn = document.querySelector('.trial-form .btn-primary');
    const originalText = findBtn.innerHTML;
    findBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    findBtn.disabled = true;

    // In a real implementation, this would call the backend API
    console.log('Finding clinical trials for:', {
        patientId,
        condition,
        ageRange,
        location
    });

    // Simulate API call
    setTimeout(() => {
        // Reset button
        findBtn.innerHTML = originalText;
        findBtn.disabled = false;

        // Show success message
        showAlert('Clinical trial search completed successfully', 'success');
    }, 1500);
}

/**
 * View trial details
 * @param {HTMLElement} button - The view details button
 */
function viewTrialDetails(button) {
    // In a real implementation, this would open a modal with trial details
    console.log('Viewing trial details...');
    showAlert('Trial details would be displayed in a modal', 'info');
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

    // Create elements safely to prevent XSS
    const icon = document.createElement('i');
    icon.className = `fas fa-${getAlertIcon(type)}`;

    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;  // Use textContent instead of innerHTML

    const closeButton = document.createElement('button');
    closeButton.className = 'alert-close';
    closeButton.innerHTML = '&times;';  // This is safe as it's a static string

    alert.appendChild(icon);
    alert.appendChild(messageSpan);
    alert.appendChild(closeButton);

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
            return '#3498db';
        case 'error':
            return '#e74c3c';
        case 'warning':
            return '#f39c12';
        case 'info':
        default:
            return '#2c3e50';
    }
}