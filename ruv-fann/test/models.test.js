// MediSync Healthcare AI Platform - Healthcare-Specific Models Tests
// Test suite for healthcare-specific neural network models

const MedicalDiagnosisNN = require('../src/models/diagnosis-nn');
const DrugInteractionNN = require('../src/models/drug-interaction-nn');
const RiskAssessmentNN = require('../src/models/risk-assessment-nn');

describe('Healthcare-Specific Neural Network Models', () => {
  describe('Medical Diagnosis Neural Network', () => {
    test('should initialize diagnosis network', () => {
      const diagnosisNN = new MedicalDiagnosisNN({
        numInput: 50,
        numHidden: 100,
        numOutput: 25
      });

      expect(diagnosisNN).toBeInstanceOf(MedicalDiagnosisNN);
      expect(diagnosisNN.config.type).toBe('medical_diagnosis');
      expect(diagnosisNN.config.healthcareSpecialization).toBe('clinical_decision_support');
    });

    test('should add medical conditions and specialties', () => {
      const diagnosisNN = new MedicalDiagnosisNN();

      diagnosisNN.addMedicalCondition('hypertension');
      diagnosisNN.addMedicalCondition('diabetes');
      diagnosisNN.addMedicalSpecialty('cardiology');
      diagnosisNN.addMedicalSpecialty('endocrinology');

      const metadata = diagnosisNN.getDiagnosisMetadata();
      expect(metadata.conditions).toHaveLength(2);
      expect(metadata.specialties).toHaveLength(2);
      expect(metadata.conditions).toContain('hypertension');
      expect(metadata.specialties).toContain('cardiology');
    });

    test('should predict diagnoses', () => {
      const diagnosisNN = new MedicalDiagnosisNN({
        numInput: 10,
        numHidden: 20,
        numOutput: 5
      });

      // Add some conditions for testing
      diagnosisNN.addMedicalCondition('condition_0');
      diagnosisNN.addMedicalCondition('condition_1');

      // Simple prediction test
      const symptoms = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
      const result = diagnosisNN.predictDiagnosis(symptoms);

      expect(result).toBeDefined();
      expect(result.input).toHaveLength(10);
      expect(result.rawOutputs).toHaveLength(5);
      expect(result.diagnoses).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    test('should get enhanced statistics', () => {
      const diagnosisNN = new MedicalDiagnosisNN();

      const stats = diagnosisNN.getStatistics();
      expect(stats.diagnosisSpecific).toBeDefined();
      expect(stats.diagnosisSpecific.confidenceThreshold).toBe(0.85);
    });
  });

  describe('Drug Interaction Neural Network', () => {
    test('should initialize drug interaction network', () => {
      const drugNN = new DrugInteractionNN({
        numInput: 25,
        numHidden: 50,
        numOutput: 15
      });

      expect(drugNN).toBeInstanceOf(DrugInteractionNN);
      expect(drugNN.config.type).toBe('drug_interaction');
      expect(drugNN.config.healthcareSpecialization).toBe('pharmacovigilance');
    });

    test('should add drugs and interaction types', () => {
      const drugNN = new DrugInteractionNN();

      drugNN.addDrug('aspirin');
      drugNN.addDrug('warfarin');
      drugNN.addInteractionType('anticoagulant_interaction');
      drugNN.addInteractionType('nsaid_interaction');

      const metadata = drugNN.getInteractionMetadata();
      expect(metadata.drugDatabase).toHaveLength(2);
      expect(metadata.interactionTypes).toHaveLength(2);
      expect(metadata.drugPairs).toBe(2);
    });

    test('should predict drug interactions', () => {
      const drugNN = new DrugInteractionNN({
        numInput: 10,
        numHidden: 20,
        numOutput: 5
      });

      // Add some interaction types for testing
      drugNN.addInteractionType('interaction_0');
      drugNN.addInteractionType('interaction_1');

      // Simple prediction test
      const drugs = ['drug1', 'drug2'];
      const result = drugNN.predictInteractions(drugs);

      expect(result).toBeDefined();
      expect(result.drugs).toEqual(['drug1', 'drug2']);
      expect(result.input).toHaveLength(10);
      expect(result.rawOutputs).toHaveLength(5);
      expect(result.interactions).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    test('should get enhanced statistics', () => {
      const drugNN = new DrugInteractionNN();

      const stats = drugNN.getStatistics();
      expect(stats.drugInteractionSpecific).toBeDefined();
      expect(stats.drugInteractionSpecific.interactionThreshold).toBe(0.7);
    });
  });

  describe('Risk Assessment Neural Network', () => {
    test('should initialize risk assessment network', () => {
      const riskNN = new RiskAssessmentNN({
        numInput: 20,
        numHidden: 40,
        numOutput: 8
      });

      expect(riskNN).toBeInstanceOf(RiskAssessmentNN);
      expect(riskNN.config.type).toBe('risk_assessment');
      expect(riskNN.config.healthcareSpecialization).toBe('predictive_analytics');
    });

    test('should add risk categories', () => {
      const riskNN = new RiskAssessmentNN();

      riskNN.addRiskCategory('cardiovascular_risk');
      riskNN.addRiskCategory('diabetes_risk');

      const metadata = riskNN.getRiskMetadata();
      expect(metadata.categories).toHaveLength(2);
      expect(metadata.categories).toContain('cardiovascular_risk');
    });

    test('should assess patient risk', () => {
      const riskNN = new RiskAssessmentNN({
        numInput: 20,
        numHidden: 30,
        numOutput: 5
      });

      // Add some risk categories for testing
      riskNN.addRiskCategory('category_0');
      riskNN.addRiskCategory('category_1');

      // Simple patient data
      const patient = {
        age: 45,
        gender: 'male',
        bloodPressure: { systolic: 130, diastolic: 85 },
        heartRate: 75,
        bmi: 28
      };

      const result = riskNN.assessRisk(patient);

      expect(result).toBeDefined();
      expect(result.patient).toBe('unknown');
      expect(result.input).toHaveLength(20);
      expect(result.rawOutputs).toHaveLength(5);
      expect(result.riskAssessment).toBeDefined();
      expect(result.riskAssessment.overallRisk).toBeGreaterThanOrEqual(0);
      expect(result.riskAssessment.overallRisk).toBeLessThanOrEqual(1);
      expect(result.timestamp).toBeDefined();
    });

    test('should determine risk levels correctly', () => {
      const riskNN = new RiskAssessmentNN();

      expect(riskNN._determineRiskLevel(0.9)).toBe('high');
      expect(riskNN._determineRiskLevel(0.7)).toBe('medium');
      expect(riskNN._determineRiskLevel(0.4)).toBe('low');
      expect(riskNN._determineRiskLevel(0.1)).toBe('minimal');
    });

    test('should get enhanced statistics', () => {
      const riskNN = new RiskAssessmentNN();

      const stats = riskNN.getStatistics();
      expect(stats.riskAssessmentSpecific).toBeDefined();
      expect(stats.riskAssessmentSpecific.riskThresholds).toBeDefined();
    });
  });
});