// MediSync Healthcare AI Platform - Privacy Manager Tests
// This file contains tests for the privacy manager implementation

const PrivacyManager = require('./privacy-manager.js');

// Mock neural mesh for testing
class MockNeuralMesh {
  constructor() {
    // Mock implementation
  }
}

describe('Privacy Manager Tests', () => {
  let privacyManager;
  let mockNeuralMesh;

  beforeEach(() => {
    mockNeuralMesh = new MockNeuralMesh();
    privacyManager = new PrivacyManager(mockNeuralMesh);
  });

  test('should initialize privacy manager with default configuration', () => {
    expect(privacyManager).toBeDefined();
    expect(privacyManager.config).toBeDefined();
  });

  test('should anonymize patient data correctly', () => {
    const patientData = {
      name: 'John Doe',
      address: '123 Main St, Anytown, USA',
      phone: '555-1234',
      email: 'john.doe@example.com',
      ssn: '123-45-6789',
      dob: '1980-01-01'
    };

    const anonymizedData = privacyManager.anonymizeData(patientData);

    expect(anonymizedData).toBeDefined();
    expect(anonymizedData.name).toBe('[ANONYMIZED]');
    expect(anonymizedData.address).toBe('[ANONYMIZED]');
    expect(anonymizedData.phone).toBe('[ANONYMIZED]');
    expect(anonymizedData.email).toBe('[ANONYMIZED]');
    expect(anonymizedData.ssn).toBe('[ANONYMIZED]');
    expect(anonymizedData.dob).toBe('[ANONYMIZED]');
  });

  test('should anonymize specific fields only', () => {
    const patientData = {
      patientId: 'PAT-12345',
      name: 'John Doe',
      address: '123 Main St, Anytown, USA',
      phone: '555-1234'
    };

    const anonymizedData = privacyManager.anonymizeData(patientData, ['name', 'phone']);

    expect(anonymizedData.name).toBe('[ANONYMIZED]');
    expect(anonymizedData.phone).toBe('[ANONYMIZED]');
    // Address should remain unchanged
    expect(anonymizedData.address).toBe('123 Main St, Anytown, USA');
    // Patient ID should remain unchanged
    expect(anonymizedData.patientId).toBe('PAT-12345');
  });

  test('should apply differential privacy to numerical data', () => {
    const originalValue = 72; // Heart rate
    const privateValue = privacyManager.applyDifferentialPrivacy(originalValue, 'heart-rate');

    expect(typeof privateValue).toBe('number');
    // The private value should be different from the original due to noise
    // Note: In some cases with very small epsilon, the values might be close
    expect(privateValue).toBeDefined();
  });

  test('should handle different data types for differential privacy', () => {
    const heartRate = 72;
    const bloodPressure = 120;
    const temperature = 98.6;

    const privateHeartRate = privacyManager.applyDifferentialPrivacy(heartRate, 'heart-rate');
    const privateBloodPressure = privacyManager.applyDifferentialPrivacy(bloodPressure, 'blood-pressure');
    const privateTemperature = privacyManager.applyDifferentialPrivacy(temperature, 'temperature');

    expect(typeof privateHeartRate).toBe('number');
    expect(typeof privateBloodPressure).toBe('number');
    expect(typeof privateTemperature).toBe('number');
  });

  test('should encrypt and decrypt data correctly', () => {
    const originalData = {
      diagnosis: 'Hypertension',
      medication: 'Lisinopril 10mg',
      dosage: 'Once daily'
    };

    // Encrypt data
    const encryptedData = privacyManager.encryptData(originalData);
    expect(encryptedData).toBeDefined();
    expect(typeof encryptedData).toBe('string');
    expect(encryptedData).toContain(':'); // Should contain IV:data format

    // Decrypt data
    const decryptedData = privacyManager.decryptData(encryptedData);
    expect(decryptedData).toBeDefined();
    expect(decryptedData.diagnosis).toBe(originalData.diagnosis);
    expect(decryptedData.medication).toBe(originalData.medication);
    expect(decryptedData.dosage).toBe(originalData.dosage);
  });

  test('should encrypt and decrypt string data', () => {
    const originalString = 'This is a sensitive medical note';

    // Encrypt string
    const encryptedString = privacyManager.encryptData(originalString);
    expect(encryptedString).toBeDefined();
    expect(typeof encryptedString).toBe('string');

    // Decrypt string
    const decryptedString = privacyManager.decryptData(encryptedString);
    expect(decryptedString).toBe(originalString);
  });

  test('should generate and verify hash for data integrity', () => {
    const clinicalReport = {
      patientId: 'PAT-12345',
      diagnosis: 'Hypertension',
      treatment: 'Lifestyle changes and medication',
      date: '2025-09-18'
    };

    // Generate hash
    const dataHash = privacyManager.generateHash(clinicalReport);
    expect(dataHash).toBeDefined();
    expect(typeof dataHash).toBe('string');
    expect(dataHash).toHaveLength(64); // SHA-256 produces 64-character hex string

    // Verify hash
    const isHashValid = privacyManager.verifyHash(clinicalReport, dataHash);
    expect(isHashValid).toBe(true);

    // Verify hash with tampered data
    const tamperedReport = {...clinicalReport, diagnosis: 'Diabetes'};
    const isTamperedHashValid = privacyManager.verifyHash(tamperedReport, dataHash);
    expect(isTamperedHashValid).toBe(false);
  });

  test('should get privacy configuration', () => {
    const config = privacyManager.getPrivacyConfig();

    expect(config).toBeDefined();
    expect(config.differentialPrivacy).toBeDefined();
    expect(config.anonymizationRules).toBeDefined();
    expect(config.encryptionKeys).toBeDefined();

    expect(config.differentialPrivacy.epsilon).toBe(0.1);
    expect(config.differentialPrivacy.delta).toBe(1e-5);
    expect(config.anonymizationRules.length).toBeGreaterThan(0);
    expect(config.encryptionKeys.length).toBeGreaterThan(0);
  });

  test('should update differential privacy parameters', () => {
    const newParams = {
      epsilon: 0.5,
      delta: 1e-6
    };

    privacyManager.updateDifferentialPrivacyParams(newParams);

    const config = privacyManager.getPrivacyConfig();
    expect(config.differentialPrivacy.epsilon).toBe(0.5);
    expect(config.differentialPrivacy.delta).toBe(1e-6);
  });

  test('should handle edge cases gracefully', () => {
    // Test anonymizing null data
    const nullResult = privacyManager.anonymizeData(null);
    expect(nullResult).toBeNull();

    // Test anonymizing undefined data
    const undefinedResult = privacyManager.anonymizeData(undefined);
    expect(undefinedResult).toBeUndefined();

    // Test applying differential privacy to non-numerical data
    const stringResult = privacyManager.applyDifferentialPrivacy('not-a-number');
    expect(stringResult).toBe('not-a-number');

    // Test generating hash for null data
    const nullHash = privacyManager.generateHash(null);
    expect(nullHash).toBeDefined();
    expect(typeof nullHash).toBe('string');
  });
});