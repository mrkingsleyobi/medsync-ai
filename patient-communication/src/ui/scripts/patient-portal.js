/**
 * Patient Portal JavaScript
 * Client-side functionality for the patient portal
 */

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const textEntryBtn = document.getElementById('text-entry-btn');
const voiceEntryBtn = document.getElementById('voice-entry-btn');
const textEntryForm = document.querySelector('.text-entry-form');
const voiceEntryForm = document.querySelector('.voice-entry-form');
const stopRecordingBtn = document.getElementById('stop-recording-btn');
const notificationsBtn = document.getElementById('notifications-btn');

// Initialize the portal
document.addEventListener('DOMContentLoaded', function() {
    console.log('Patient Portal initialized');

    // Set up navigation
    setupNavigation();

    // Set up journal entry methods
    setupJournalEntryMethods();

    // Set up notification handling
    setupNotifications();

    // Load initial data
    loadDashboardData();
});

// Set up navigation functionality
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            pageSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Show corresponding section
            const targetSection = document.getElementById(this.getAttribute('href').substring(1));
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Load data for the selected section
            loadSectionData(this.getAttribute('href').substring(1));
        });
    });
}

// Set up journal entry methods
function setupJournalEntryMethods() {
    if (textEntryBtn) {
        textEntryBtn.addEventListener('click', function() {
            textEntryForm.style.display = 'block';
            voiceEntryForm.style.display = 'none';
        });
    }

    if (voiceEntryBtn) {
        voiceEntryBtn.addEventListener('click', function() {
            textEntryForm.style.display = 'none';
            voiceEntryForm.style.display = 'block';
        });
    }

    if (stopRecordingBtn) {
        stopRecordingBtn.addEventListener('click', function() {
            // Simulate stopping recording
            console.log('Recording stopped');

            // Simulate transcription result
            const transcriptionTextarea = document.querySelector('.transcription-textarea');
            if (transcriptionTextarea) {
                transcriptionTextarea.value = "This is a simulated transcription of your voice entry. In a real implementation, this would be the result of speech-to-text processing.";
            }
        });
    }
}

// Set up notification handling
function setupNotifications() {
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            alert('Notifications panel would open here in a full implementation.');
        });
    }
}

// Load dashboard data
function loadDashboardData() {
    console.log('Loading dashboard data');

    // Simulate loading health metrics
    setTimeout(() => {
        console.log('Health metrics loaded');
    }, 500);
}

// Load data for a specific section
function loadSectionData(sectionId) {
    console.log(`Loading data for section: ${sectionId}`);

    switch (sectionId) {
        case 'documents':
            loadDocumentsData();
            break;
        case 'education':
            loadEducationData();
            break;
        case 'journal':
            loadJournalData();
            break;
        default:
            console.log(`No specific data loading for section: ${sectionId}`);
    }
}

// Load documents data
function loadDocumentsData() {
    console.log('Loading documents data');

    // Simulate API call
    setTimeout(() => {
        console.log('Documents data loaded');
    }, 300);
}

// Load education data
function loadEducationData() {
    console.log('Loading education data');

    // Simulate API call
    setTimeout(() => {
        console.log('Education data loaded');
    }, 300);
}

// Load journal data
function loadJournalData() {
    console.log('Loading journal data');

    // Simulate API call
    setTimeout(() => {
        console.log('Journal data loaded');
    }, 300);
}

// Utility functions for portal functionality

// Simplify document
function simplifyDocument(documentId) {
    console.log(`Simplifying document: ${documentId}`);
    alert('Document simplification would be processed here in a full implementation.');
}

// Translate document
function translateDocument(documentId, targetLanguage) {
    console.log(`Translating document: ${documentId} to ${targetLanguage}`);
    alert(`Document translation to ${targetLanguage} would be processed here in a full implementation.`);
}

// Save journal entry
function saveJournalEntry(entryData) {
    console.log('Saving journal entry', entryData);

    // Simulate API call
    setTimeout(() => {
        alert('Journal entry saved successfully!');
        // Reset forms
        document.querySelector('.journal-textarea').value = '';
        document.querySelector('.transcription-textarea').value = '';
    }, 500);
}

// View document
function viewDocument(documentId) {
    console.log(`Viewing document: ${documentId}`);
    alert('Document viewer would open here in a full implementation.');
}

// View education content
function viewEducationContent(contentId) {
    console.log(`Viewing education content: ${contentId}`);
    alert('Education content would be displayed here in a full implementation.');
}

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Global error occurred:', e.error);
});

// Global unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupNavigation,
        setupJournalEntryMethods,
        setupNotifications,
        loadDashboardData,
        loadSectionData,
        loadDocumentsData,
        loadEducationData,
        loadJournalData,
        simplifyDocument,
        translateDocument,
        saveJournalEntry,
        viewDocument,
        viewEducationContent
    };
}