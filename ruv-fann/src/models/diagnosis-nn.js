// MediSync Healthcare AI Platform - Medical Diagnosis Neural Network
// Specialized neural network for medical diagnosis tasks

const HealthcareNeuralNetwork = require('../healthcare-nn');

class MedicalDiagnosisNN extends HealthcareNeuralNetwork {
  /**
   * Create a medical diagnosis neural network
   * @param {Object} config - Configuration for the diagnosis network
   */
  constructor(config = {}) {
    const diagnosisConfig = {
      type: 'medical_diagnosis',
      healthcareSpecialization: 'clinical_decision_support',
      numInput: config.numInput || 100, // Symptoms, test results, patient history
      numHidden: config.numHidden || 200, // Complex pattern recognition
      numOutput: config.numOutput || 50, // Possible diagnoses
      learningRate: config.learningRate || 0.3,
      activationFunction: config.activationFunction || 'sigmoid',
      confidenceThreshold: config.confidenceThreshold || 0.85,
      ...config
    };

    super(diagnosisConfig);

    this.diagnosisMetadata = {
      specialties: [],
      conditions: [],
      lastUpdated: null
    };

    console.log('Medical diagnosis neural network initialized', {
      inputFeatures: this.config.numInput,
      possibleDiagnoses: this.config.numOutput,
      confidenceThreshold: this.config.confidenceThreshold
    });
  }

  /**
   * Train the diagnosis network with medical data
   * @param {Array} trainingData - Medical training data
   * @param {Object} options - Training options
   * @returns {Object} Training results
   */
  train(trainingData, options = {}) {
    // Preprocess medical data
    const processedData = this._preprocessMedicalData(trainingData);

    console.log('Training medical diagnosis network', {
      originalDataSize: trainingData.length,
      processedDataSize: processedData.length,
      conditions: processedData[0]?.output?.length || 0
    });

    const trainingOptions = {
      epochs: options.epochs || 2000,
      targetError: options.targetError || 0.001,
      logInterval: options.logInterval || 200,
      ...options
    };

    return super.train(processedData, trainingOptions);
  }

  /**
   * Preprocess medical training data
   * @param {Array} data - Raw medical data
   * @returns {Array} Processed data
   * @private
   */
  _preprocessMedicalData(data) {
    return data.map(item => ({
      input: this._normalizeSymptoms(item.symptoms || item.input),
      output: this._encodeDiagnoses(item.diagnoses || item.output)
    }));
  }

  /**
   * Normalize symptom data to network input format
   * @param {Array} symptoms - Symptom data
   * @returns {Array} Normalized input array
   * @private
   */
  _normalizeSymptoms(symptoms) {
    // Ensure input array has correct length
    const normalized = new Array(this.config.numInput).fill(0);

    if (Array.isArray(symptoms)) {
      // Map symptoms to input neurons
      symptoms.forEach((symptom, index) => {
        if (index < normalized.length) {
          normalized[index] = typeof symptom === 'number' ? symptom : 1;
        }
      });
    } else if (typeof symptoms === 'object') {
      // Handle object-based symptoms
      Object.keys(symptoms).forEach((key, index) => {
        if (index < normalized.length) {
          normalized[index] = symptoms[key];
        }
      });
    }

    return normalized;
  }

  /**
   * Encode diagnoses for network output
   * @param {Array} diagnoses - Diagnosis data
   * @returns {Array} Encoded output array
   * @private
   */
  _encodeDiagnoses(diagnoses) {
    // Ensure output array has correct length
    const encoded = new Array(this.config.numOutput).fill(0);

    if (Array.isArray(diagnoses)) {
      diagnoses.forEach((diagnosis, index) => {
        if (index < encoded.length) {
          encoded[index] = typeof diagnosis === 'number' ? diagnosis : 1;
        }
      });
    }

    return encoded;
  }

  /**
   * Predict diagnoses for patient symptoms
   * @param {Array|Object} symptoms - Patient symptoms
   * @param {Object} options - Prediction options
   * @returns {Object} Diagnosis predictions with confidence
   */
  predictDiagnosis(symptoms, options = {}) {
    const normalizedInput = this._normalizeSymptoms(symptoms);
    const rawOutputs = this.predict(normalizedInput);

    // Post-process outputs to get meaningful diagnoses
    const diagnoses = this._postProcessDiagnoses(rawOutputs, options);

    return {
      input: normalizedInput,
      rawOutputs,
      diagnoses,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Post-process network outputs to get diagnoses
   * @param {Array} outputs - Raw network outputs
   * @param {Object} options - Processing options
   * @returns {Array} Processed diagnoses with confidence
   * @private
   */
  _postProcessDiagnoses(outputs, options = {}) {
    const threshold = options.threshold || this.config.confidenceThreshold;
    const maxResults = options.maxResults || 10;

    const diagnoses = outputs
      .map((confidence, index) => ({
        id: index,
        confidence,
        condition: this.diagnosisMetadata.conditions[index] || `Condition_${index}`
      }))
      .filter(diagnosis => diagnosis.confidence >= threshold)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxResults);

    return diagnoses;
  }

  /**
   * Add medical condition to diagnosis metadata
   * @param {string} condition - Medical condition name
   * @param {Object} details - Condition details
   */
  addMedicalCondition(condition, details = {}) {
    if (!this.diagnosisMetadata.conditions.includes(condition)) {
      this.diagnosisMetadata.conditions.push(condition);
    }

    this.diagnosisMetadata.lastUpdated = new Date().toISOString();

    console.log('Medical condition added', {
      condition,
      totalConditions: this.diagnosisMetadata.conditions.length
    });
  }

  /**
   * Add medical specialty to diagnosis metadata
   * @param {string} specialty - Medical specialty
   */
  addMedicalSpecialty(specialty) {
    if (!this.diagnosisMetadata.specialties.includes(specialty)) {
      this.diagnosisMetadata.specialties.push(specialty);
    }

    this.diagnosisMetadata.lastUpdated = new Date().toISOString();

    console.log('Medical specialty added', {
      specialty,
      totalSpecialties: this.diagnosisMetadata.specialties.length
    });
  }

  /**
   * Get diagnosis network statistics
   * @returns {Object} Enhanced statistics
   */
  getStatistics() {
    const stats = super.getStatistics();

    return {
      ...stats,
      diagnosisSpecific: {
        confidenceThreshold: this.config.confidenceThreshold,
        specialties: this.diagnosisMetadata.specialties.length,
        conditions: this.diagnosisMetadata.conditions.length,
        lastUpdated: this.diagnosisMetadata.lastUpdated
      }
    };
  }

  /**
   * Get diagnosis metadata
   * @returns {Object} Diagnosis metadata
   */
  getDiagnosisMetadata() {
    return {
      ...this.diagnosisMetadata,
      config: this.config
    };
  }
}

module.exports = MedicalDiagnosisNN;