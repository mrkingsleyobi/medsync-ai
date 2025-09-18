// MediSync Healthcare AI Platform - Patient Schema
// This file defines the patient data schema for MongoDB

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Patient identification
  patientId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Unknown'],
    required: true
  },

  // Contact information
  contact: {
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },

  // Medical information
  medicalHistory: [{
    condition: {
      type: String,
      required: true
    },
    diagnosedDate: {
      type: Date,
      required: true
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Critical'],
      default: 'Moderate'
    },
    treatment: String,
    notes: String
  }],

  // Current medications
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    prescribedDate: Date,
    prescribingDoctor: String,
    notes: String
  }],

  // Allergies
  allergies: [{
    substance: {
      type: String,
      required: true
    },
    reaction: String,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Life-threatening']
    }
  }],

  // Healthcare providers
  healthcareProviders: [{
    providerId: String,
    name: String,
    specialty: String,
    relationship: {
      type: String,
      enum: ['Primary Care', 'Specialist', 'Emergency', 'Other']
    }
  }],

  // Emergency contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },

  // Insurance information
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    coverageType: String
  },

  // Consent and preferences
  consent: {
    hipaa: {
      type: Boolean,
      default: false
    },
    research: {
      type: Boolean,
      default: false
    },
    marketing: {
      type: Boolean,
      default: false
    }
  },

  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    communicationMethod: {
      type: String,
      enum: ['Email', 'Phone', 'Text', 'Portal'],
      default: 'Portal'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
patientSchema.index({ patientId: 1 });
patientSchema.index({ lastName: 1, firstName: 1 });
patientSchema.index({ dateOfBirth: 1 });
patientSchema.index({ 'contact.email': 1 });
patientSchema.index({ 'medicalHistory.condition': 1 });

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
});

// Ensure virtual fields are serialized
patientSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Patient', patientSchema);