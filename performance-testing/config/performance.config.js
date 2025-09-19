/**
 * Performance Testing Configuration
 * Configuration for load and stress testing of MediSync services
 */

// Load Testing Configuration
const loadTestingConfig = {
  // Test duration in seconds
  duration: 300, // 5 minutes

  // Test ramp-up period in seconds
  rampUpPeriod: 60, // 1 minute

  // Target requests per second
  targetRPS: 1000,

  // Concurrency settings
  concurrency: {
    initial: 10,
    max: 1000,
    step: 50
  },

  // Test scenarios
  scenarios: [
    {
      name: 'patient-communication',
      weight: 25,
      endpoints: [
        { path: '/api/patients/login', method: 'POST', weight: 30 },
        { path: '/api/patients/medical-documents/simplify', method: 'POST', weight: 25 },
        { path: '/api/patients/voice-journal/transcribe', method: 'POST', weight: 20 },
        { path: '/api/patients/education/personalize', method: 'POST', weight: 15 },
        { path: '/api/patients/notifications', method: 'GET', weight: 10 }
      ]
    },
    {
      name: 'clinical-decision-support',
      weight: 20,
      endpoints: [
        { path: '/api/clinical-decisions/diagnose', method: 'POST', weight: 40 },
        { path: '/api/clinical-decisions/treatment-recommendations', method: 'POST', weight: 30 },
        { path: '/api/clinical-decisions/risk-assessment', method: 'POST', weight: 20 },
        { path: '/api/clinical-decisions/monitoring', method: 'POST', weight: 10 }
      ]
    },
    {
      name: 'research-integration',
      weight: 15,
      endpoints: [
        { path: '/api/research/literature-analysis', method: 'POST', weight: 35 },
        { path: '/api/research/clinical-trial-matching', method: 'POST', weight: 30 },
        { path: '/api/research/impact-tracking', method: 'POST', weight: 20 },
        { path: '/api/research/projects', method: 'POST', weight: 15 }
      ]
    },
    {
      name: 'iot-wearable-integration',
      weight: 15,
      endpoints: [
        { path: '/api/iot/wearables/integrate', method: 'POST', weight: 25 },
        { path: '/api/iot/sensors/process', method: 'POST', weight: 25 },
        { path: '/api/iot/monitoring/real-time', method: 'POST', weight: 20 },
        { path: '/api/iot/warnings/early', method: 'POST', weight: 15 },
        { path: '/api/iot/analytics/population', method: 'POST', weight: 10 },
        { path: '/api/iot/predictions/health', method: 'POST', weight: 5 }
      ]
    },
    {
      name: 'healthcare-system-integration',
      weight: 10,
      endpoints: [
        { path: '/api/healthcare/fhir/sync', method: 'POST', weight: 30 },
        { path: '/api/healthcare/hl7/process', method: 'POST', weight: 25 },
        { path: '/api/healthcare/dicom/integrate', method: 'POST', weight: 20 },
        { path: '/api/healthcare/ehr/sync', method: 'POST', weight: 15 },
        { path: '/api/healthcare/matching/patients', method: 'POST', weight: 10 }
      ]
    },
    {
      name: 'administrative-monitoring',
      weight: 10,
      endpoints: [
        { path: '/api/admin/users', method: 'GET', weight: 25 },
        { path: '/api/admin/system/metrics', method: 'GET', weight: 25 },
        { path: '/api/admin/logs', method: 'GET', weight: 20 },
        { path: '/api/admin/reports/generate', method: 'POST', weight: 15 },
        { path: '/api/admin/alerts', method: 'GET', weight: 10 },
        { path: '/api/admin/settings', method: 'PUT', weight: 5 }
      ]
    },
    {
      name: 'security-audit',
      weight: 5,
      endpoints: [
        { path: '/api/security/encrypt', method: 'POST', weight: 30 },
        { path: '/api/security/decrypt', method: 'POST', weight: 30 },
        { path: '/api/security/hash', method: 'POST', weight: 20 },
        { path: '/api/security/validate', method: 'POST', weight: 10 },
        { path: '/api/security/events', method: 'POST', weight: 10 }
      ]
    }
  ],

  // Response time thresholds (in milliseconds)
  responseTimeThresholds: {
    p50: 100,
    p90: 250,
    p95: 500,
    p99: 1000
  },

  // Error rate threshold (percentage)
  errorRateThreshold: 1.0
};

// Stress Testing Configuration
const stressTestingConfig = {
  // Test duration in seconds
  duration: 600, // 10 minutes

  // Spike test parameters
  spike: {
    // Baseline RPS
    baselineRPS: 100,

    // Spike RPS
    spikeRPS: 5000,

    // Duration of spike in seconds
    spikeDuration: 60,

    // Recovery time in seconds
    recoveryTime: 120
  },

  // Soak test parameters
  soak: {
    // Test duration in seconds
    duration: 7200, // 2 hours

    // Target RPS
    targetRPS: 500,

    // Maximum acceptable error rate (%)
    maxErrorRate: 0.5,

    // Maximum acceptable response time (ms)
    maxResponseTime: 1000
  },

  // Breakpoint test parameters
  breakpoint: {
    // Starting RPS
    startRPS: 100,

    // RPS increment per step
    stepRPS: 100,

    // Duration per step in seconds
    stepDuration: 120,

    // Maximum RPS to test
    maxRPS: 10000
  },

  // Resource monitoring
  monitoring: {
    // CPU usage threshold (%)
    cpuThreshold: 80,

    // Memory usage threshold (%)
    memoryThreshold: 85,

    // Disk I/O threshold (MB/s)
    diskIOThreshold: 100,

    // Network I/O threshold (MB/s)
    networkIOThreshold: 100
  }
};

// Scalability Testing Configuration
const scalabilityTestingConfig = {
  // Horizontal scaling test
  horizontal: {
    // Number of instances to test
    instances: [1, 2, 4, 8, 16],

    // Test duration per instance count (seconds)
    durationPerInstance: 300, // 5 minutes

    // Target RPS per instance
    targetRPSPerInstance: 250
  },

  // Vertical scaling test
  vertical: {
    // CPU cores to test
    cpuCores: [1, 2, 4, 8],

    // Memory configurations to test (GB)
    memory: [1, 2, 4, 8],

    // Test duration per configuration (seconds)
    durationPerConfig: 300 // 5 minutes
  },

  // Auto-scaling test
  autoScaling: {
    // Minimum instances
    minInstances: 1,

    // Maximum instances
    maxInstances: 20,

    // Scale-up threshold (% CPU)
    scaleUpThreshold: 70,

    // Scale-down threshold (% CPU)
    scaleDownThreshold: 30,

    // Test duration (seconds)
    duration: 3600 // 1 hour
  }
};

// Test Data Configuration
const testDataConfig = {
  // Patient data samples
  patientData: {
    count: 10000,
    fields: {
      id: 'PAT-XXXXX',
      name: 'John Doe',
      age: 35,
      gender: 'male',
      conditions: ['hypertension', 'diabetes'],
      medications: ['lisinopril', 'metformin']
    }
  },

  // Medical document samples
  medicalDocuments: {
    count: 1000,
    types: ['discharge_summary', 'consultation_note', 'lab_report', 'imaging_report'],
    avgLength: 5000, // words
    complexity: 'medium'
  },

  // Clinical data samples
  clinicalData: {
    count: 5000,
    vitals: {
      heartRate: { min: 40, max: 180 },
      bloodPressure: { systolic: { min: 80, max: 200 }, diastolic: { min: 50, max: 120 } },
      temperature: { min: 35.0, max: 42.0 },
      oxygenSaturation: { min: 80, max: 100 }
    }
  }
};

// Reporting Configuration
const reportingConfig = {
  // Report formats
  formats: ['html', 'json', 'csv'],

  // Metrics to include
  metrics: [
    'requests_per_second',
    'response_time',
    'error_rate',
    'throughput',
    'concurrency',
    'cpu_usage',
    'memory_usage',
    'disk_io',
    'network_io'
  ],

  // Real-time monitoring
  realtime: {
    interval: 5, // seconds
    dashboard: true
  }
};

// Export configuration
module.exports = {
  loadTestingConfig,
  stressTestingConfig,
  scalabilityTestingConfig,
  testDataConfig,
  reportingConfig
};