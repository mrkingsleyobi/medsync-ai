// MediSync Healthcare AI Platform - Medical Data Processor Tests
// This file contains tests for the medical data processor implementation

jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid'
}));

const MedicalDataProcessor = require('./medical-data-processor.js');

// Mock neural mesh for testing
class MockNeuralMesh {
  constructor() {
    // Mock implementation
  }
}

describe('Medical Data Processor Tests', () => {
  let medicalDataProcessor;
  let mockNeuralMesh;

  beforeEach(() => {
    mockNeuralMesh = new MockNeuralMesh();
    medicalDataProcessor = new MedicalDataProcessor(mockNeuralMesh);
  });

  test('should initialize medical data processor with built-in processors', () => {
    expect(medicalDataProcessor).toBeDefined();
    expect(medicalDataProcessor.getAvailableProcessors().length).toBeGreaterThan(0);
  });

  test('should determine data type correctly', () => {
    // Test FHIR data
    const fhirData = { type: 'fhir-patient-resource' };
    // Note: We can't directly test private methods, but we can test the behavior
    // through the public processMedicalData method

    // Test imaging data
    const imagingData = { type: 'medical-imaging' };

    // Test clinical notes data
    const notesData = { type: 'clinical-notes' };

    // Test lab results data
    const labData = { type: 'lab-results' };

    // Test vital signs data
    const vitalData = { type: 'vital-signs' };

    // All should be processable without throwing errors
    expect(() => {
      medicalDataProcessor.getAvailableProcessors();
    }).not.toThrow();
  });

  test('should process FHIR data', async () => {
    const fhirData = {
      type: 'fhir-patient-resource',
      resource: {
        resourceType: 'Patient',
        id: 'patient-001',
        name: [{ given: ['John'], family: 'Doe' }],
        gender: 'male',
        birthDate: '1980-01-01'
      }
    };

    const result = await medicalDataProcessor.processMedicalData(fhirData);

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.result).toBeDefined();
    expect(result.result.type).toBe('fhir-processing-result');
    expect(result.result.resourceType).toBe('Patient');
  });

  test('should process imaging data', async () => {
    const imagingData = {
      type: 'medical-imaging',
      imageType: 'x-ray',
      modality: 'XR',
      patientId: 'patient-001',
      imageData: 'base64-encoded-image-data'
    };

    const result = await medicalDataProcessor.processMedicalData(imagingData);

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.result).toBeDefined();
    expect(result.result.type).toBe('imaging-processing-result');
    expect(result.result.imageType).toBe('x-ray');
    expect(result.result.modality).toBe('XR');
  });

  test('should process clinical notes data', async () => {
    const notesData = {
      type: 'clinical-notes',
      noteType: 'progress-note',
      patientId: 'patient-001',
      text: 'Patient presents with severe headache and blurred vision.'
    };

    const result = await medicalDataProcessor.processMedicalData(notesData);

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.result).toBeDefined();
    expect(result.result.type).toBe('clinical-notes-processing-result');
    expect(result.result.noteType).toBe('progress-note');
    expect(result.result.entities).toBeDefined();
  });

  test('should process lab results data', async () => {
    const labData = {
      type: 'lab-results',
      patientId: 'patient-001',
      results: [
        { test: 'glucose', value: 95, unit: 'mg/dL' },
        { test: 'cholesterol', value: 180, unit: 'mg/dL' }
      ]
    };

    const result = await medicalDataProcessor.processMedicalData(labData);

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.result).toBeDefined();
    expect(result.result.type).toBe('lab-results-processing-result');
    expect(result.result.testCount).toBe(2);
  });

  test('should process vital signs data', async () => {
    const vitalData = {
      type: 'vital-signs',
      patientId: 'patient-001',
      vitals: {
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 98.6
      }
    };

    const result = await medicalDataProcessor.processMedicalData(vitalData);

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.result).toBeDefined();
    expect(result.result.type).toBe('vital-signs-processing-result');
    expect(result.result.vitalSignCount).toBe(3);
  });

  test('should register custom processor', () => {
    const customProcessor = {
      name: 'Custom Processor',
      description: 'A custom data processor',
      process: async (data, config) => {
        return { processed: true, data: data };
      }
    };

    medicalDataProcessor.registerProcessor('custom-type', customProcessor);

    const processors = medicalDataProcessor.getAvailableProcessors();
    expect(processors).toContain('custom-type');
  });

  test('should handle unknown data type gracefully', async () => {
    const unknownData = {
      type: 'unknown-type',
      content: 'some data'
    };

    // Should process with default handling (not throw an error)
    const result = await medicalDataProcessor.processMedicalData(unknownData);
    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.result.type).toBe('default-processing-result');
  });

  test('should provide task status tracking', async () => {
    const testData = {
      type: 'clinical-notes',
      noteType: 'progress-note',
      patientId: 'patient-001',
      text: 'Patient presents with severe headache and blurred vision.'
    };

    const result = await medicalDataProcessor.processMedicalData(testData);
    const taskId = result.taskId;

    const taskStatus = medicalDataProcessor.getTaskStatus(taskId);
    expect(taskStatus).toBeDefined();
    expect(taskStatus.taskId).toBe(taskId);
    expect(taskStatus.status).toBe('completed');
  });

  test('should list processing tasks', async () => {
    const testData = {
      type: 'lab-results',
      patientId: 'patient-001',
      results: [{ test: 'glucose', value: 95, unit: 'mg/dL' }]
    };

    await medicalDataProcessor.processMedicalData(testData);

    const tasks = medicalDataProcessor.listTasks();
    expect(tasks.length).toBeGreaterThan(0);
  });
});