/**
 * Healthcare System Integration Configuration
 * Configuration for healthcare system integration services
 */

const config = {
  // FHIR API integration settings
  fhir: {
    enabled: true,
    baseUrl: 'https://fhir.example.com/fhir',
    version: 'R4',
    authentication: {
      type: 'oauth2',
      clientId: 'medisync-client',
      clientSecret: 'secret-key',
      tokenUrl: 'https://fhir.example.com/oauth2/token'
    },
    resources: {
      patient: true,
      observation: true,
      condition: true,
      medication: true,
      allergy: true,
      procedure: true,
      diagnosticReport: true,
      imagingStudy: true
    },
    batchSize: 100,
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    rateLimit: 100 // requests per minute
  },

  // HL7 message processing settings
  hl7: {
    enabled: true,
    version: '2.5.1',
    encoding: 'ER7',
    defaultSegmentTerminator: '\r',
    defaultFieldSeparator: '|',
    defaultComponentSeparator: '^',
    defaultSubcomponentSeparator: '&',
    defaultRepetitionSeparator: '~',
    defaultEscapeCharacter: '\\',
    validation: {
      enabled: true,
      strictMode: false,
      schemaValidation: true
    },
    processing: {
      maxMessageSize: 1048576, // 1 MB
      concurrentProcessing: 10,
      timeout: 30000, // 30 seconds
      retryAttempts: 3
    }
  },

  // DICOM integration settings
  dicom: {
    enabled: true,
    server: {
      host: 'dicom.example.com',
      port: 104,
      aeTitle: 'MEDISYNC'
    },
    storage: {
      enabled: true,
      path: './dicom-storage',
      maxSize: 10737418240, // 10 GB
      retentionPeriod: 7776000000, // 90 days in milliseconds
      compression: {
        enabled: true,
        format: 'jpeg2000',
        quality: 85
      }
    },
    processing: {
      enabled: true,
      anonymization: true,
      thumbnailGeneration: true,
      metadataExtraction: true,
      timeout: 60000 // 60 seconds
    }
  },

  // EHR data synchronization settings
  sync: {
    enabled: true,
    frequency: 300000, // 5 minutes in milliseconds
    batchSize: 1000,
    conflictResolution: 'last-write-wins',
    incrementalSync: true,
    fullSyncSchedule: '0 2 * * 0', // Weekly on Sunday at 2 AM
    retryPolicy: {
      maxAttempts: 5,
      backoffMultiplier: 2,
      initialDelay: 1000, // 1 second
      maxDelay: 60000 // 1 minute
    }
  },

  // Patient record matching settings
  matching: {
    enabled: true,
    algorithms: {
      deterministic: true,
      probabilistic: true,
      machineLearning: true
    },
    fields: {
      firstName: { weight: 0.2, threshold: 0.9 },
      lastName: { weight: 0.2, threshold: 0.9 },
      dateOfBirth: { weight: 0.15, threshold: 1.0 },
      gender: { weight: 0.05, threshold: 1.0 },
      address: { weight: 0.15, threshold: 0.8 },
      phone: { weight: 0.1, threshold: 0.9 },
      email: { weight: 0.05, threshold: 0.9 },
      medicalRecordNumber: { weight: 0.1, threshold: 1.0 }
    },
    confidenceThreshold: 0.85,
    maxCandidates: 10
  },

  // Image processing pipeline settings
  imageProcessing: {
    enabled: true,
    formats: ['DICOM', 'JPEG', 'PNG', 'TIFF'],
    maxSize: 104857600, // 100 MB
    thumbnail: {
      enabled: true,
      width: 256,
      height: 256,
      quality: 85
    },
    annotation: {
      enabled: true,
      formats: ['JSON', 'XML'],
      maxSize: 10485760 // 10 MB
    },
    aiAnalysis: {
      enabled: true,
      models: {
        radiology: true,
        pathology: true,
        dermatology: true
      },
      confidenceThreshold: 0.9,
      timeout: 120000 // 2 minutes
    }
  },

  // Security and compliance settings
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM',
      keyLength: 256,
      ivLength: 12
    },
    audit: {
      enabled: true,
      logLevel: 'info',
      retention: 31536000000 // 1 year in milliseconds
    },
    compliance: {
      hipaa: true,
      gdpr: true,
      fda: true
    }
  },

  // Performance settings
  performance: {
    caching: {
      enabled: true,
      ttl: 300000, // 5 minutes in milliseconds
      maxSize: 10000
    },
    concurrency: {
      maxWorkers: 10,
      queueSize: 1000
    }
  }
};

module.exports = config;