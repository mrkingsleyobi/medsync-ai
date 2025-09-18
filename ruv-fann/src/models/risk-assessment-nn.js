// MediSync Healthcare AI Platform - Patient Risk Assessment Neural Network
// Specialized neural network for patient risk assessment

const HealthcareNeuralNetwork = require('../healthcare-nn');

class RiskAssessmentNN extends HealthcareNeuralNetwork {
  /**
   * Create a patient risk assessment neural network
   * @param {Object} config - Configuration for the risk assessment network
   */
  constructor(config = {}) {
    const riskConfig = {
      type: 'risk_assessment',
      healthcareSpecialization: 'predictive_analytics',
      numInput: config.numInput || 40, // Patient demographics, vitals, history
      numHidden: config.numHidden || 80, // Risk pattern analysis
      numOutput: config.numOutput || 10, // Risk categories/outcomes
      learningRate: config.learningRate || 0.35,
      activationFunction: config.activationFunction || 'sigmoid',
      riskThresholds: config.riskThresholds || {
        low: 0.3,
        medium: 0.6,
        high: 0.8
      },
      ...config
    };

    super(riskConfig);

    this.riskCategories = [];
    this.riskMetadata = {
      assessments: 0,
      categories: [],
      lastUpdated: null
    };

    console.log('Patient risk assessment neural network initialized', {
      inputFeatures: this.config.numInput,
      riskCategories: this.config.numOutput,
      riskThresholds: this.config.riskThresholds
    });
  }

  /**
   * Train the risk assessment network
   * @param {Array} trainingData - Patient risk training data
   * @param {Object} options - Training options
   * @returns {Object} Training results
   */
  train(trainingData, options = {}) {
    // Preprocess patient risk data
    const processedData = this._preprocessRiskData(trainingData);

    console.log('Training patient risk assessment network', {
      originalDataSize: trainingData.length,
      processedDataSize: processedData.length,
      riskCategories: processedData[0]?.output?.length || 0
    });

    const trainingOptions = {
      epochs: options.epochs || 1800,
      targetError: options.targetError || 0.0015,
      logInterval: options.logInterval || 180,
      ...options
    };

    return super.train(processedData, trainingOptions);
  }

  /**
   * Preprocess patient risk data
   * @param {Array} data - Raw patient data
   * @returns {Array} Processed data
   * @private
   */
  _preprocessRiskData(data) {
    return data.map(item => ({
      input: this._encodePatientData(item.patient || item.input),
      output: this._encodeRiskOutcomes(item.outcomes || item.output)
    }));
  }

  /**
   * Encode patient data for network input
   * @param {Object} patient - Patient data
   * @returns {Array} Encoded input array
   * @private
   */
  _encodePatientData(patient) {
    // Ensure input array has correct length
    const encoded = new Array(this.config.numInput).fill(0);

    if (patient && typeof patient === 'object') {
      // Demographics
      encoded[0] = patient.age || 0;
      encoded[1] = patient.gender === 'male' ? 1 : patient.gender === 'female' ? 0 : 0.5;

      // Vitals (normalized to 0-1 range)
      encoded[2] = (patient.bloodPressure?.systolic || 120) / 200;
      encoded[3] = (patient.bloodPressure?.diastolic || 80) / 150;
      encoded[4] = (patient.heartRate || 70) / 200;
      encoded[5] = (patient.temperature || 98.6) / 110;
      encoded[6] = (patient.bmi || 25) / 50;

      // Medical history (binary flags)
      encoded[7] = patient.history?.diabetes ? 1 : 0;
      encoded[8] = patient.history?.hypertension ? 1 : 0;
      encoded[9] = patient.history?.heartDisease ? 1 : 0;
      encoded[10] = patient.history?.cancer ? 1 : 0;

      // Lifestyle factors
      encoded[11] = patient.lifestyle?.smoking ? 1 : 0;
      encoded[12] = patient.lifestyle?.alcohol ? 1 : 0;
      encoded[13] = patient.lifestyle?.exercise || 0; // 0-1 scale

      // Lab results (normalized)
      encoded[14] = (patient.labResults?.cholesterol?.total || 200) / 400;
      encoded[15] = (patient.labResults?.cholesterol?.ldl || 100) / 200;
      encoded[16] = (patient.labResults?.glucose || 100) / 300;
      encoded[17] = (patient.labResults?.creatine || 1.0) / 5.0;

      // Medications (simplified)
      encoded[18] = patient.medications?.count || 0;
      encoded[19] = patient.medications?.highRisk ? 1 : 0;
    }

    return encoded;
  }

  /**
   * Encode risk outcomes for network output
   * @param {Array} outcomes - Risk outcomes
   * @returns {Array} Encoded output array
   * @private
   */
  _encodeRiskOutcomes(outcomes) {
    // Ensure output array has correct length
    const encoded = new Array(this.config.numOutput).fill(0);

    if (Array.isArray(outcomes)) {
      outcomes.forEach((outcome, index) => {
        if (index < encoded.length) {
          encoded[index] = typeof outcome === 'number' ? outcome :
                          outcome.riskScore || outcome.probability || 0;
        }
      });
    } else if (outcomes && typeof outcomes === 'object') {
      // Handle object-based outcomes
      Object.keys(outcomes).forEach((key, index) => {
        if (index < encoded.length) {
          encoded[index] = outcomes[key];
        }
      });
    }

    return encoded;
  }

  /**
   * Assess patient risk
   * @param {Object} patient - Patient data
   * @param {Object} options - Assessment options
   * @returns {Object} Risk assessment
   */
  assessRisk(patient, options = {}) {
    const encodedInput = this._encodePatientData(patient);
    const rawOutputs = this.predict(encodedInput);

    // Post-process outputs to get risk assessment
    const riskAssessment = this._postProcessRiskAssessment(rawOutputs, options);

    // Update metadata
    this.riskMetadata.assessments++;
    this.riskMetadata.lastUpdated = new Date().toISOString();

    return {
      patient: patient.id || 'unknown',
      input: encodedInput,
      rawOutputs,
      riskAssessment,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Post-process network outputs to get risk assessment
   * @param {Array} outputs - Raw network outputs
   * @param {Object} options - Processing options
   * @returns {Object} Processed risk assessment
   * @private
   */
  _postProcessRiskAssessment(outputs, options = {}) {
    const overallRisk = Math.max(...outputs);
    const riskLevel = this._determineRiskLevel(overallRisk);
    const riskCategories = this._categorizeRisks(outputs);

    return {
      overallRisk,
      riskLevel,
      categories: riskCategories,
      recommendations: this._generateRecommendations(riskLevel, riskCategories)
    };
  }

  /**
   * Determine risk level based on score
   * @param {number} score - Risk score
   * @returns {string} Risk level
   * @private
   */
  _determineRiskLevel(score) {
    if (score >= this.config.riskThresholds.high) {
      return 'high';
    } else if (score >= this.config.riskThresholds.medium) {
      return 'medium';
    } else if (score >= this.config.riskThresholds.low) {
      return 'low';
    } else {
      return 'minimal';
    }
  }

  /**
   * Categorize individual risks
   * @param {Array} outputs - Risk outputs
   * @returns {Array} Risk categories
   * @private
   */
  _categorizeRisks(outputs) {
    return outputs
      .map((riskScore, index) => ({
        id: index,
        category: this.riskCategories[index] || `Risk_Category_${index}`,
        score: riskScore,
        level: this._determineRiskLevel(riskScore)
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Generate recommendations based on risk assessment
   * @param {string} riskLevel - Overall risk level
   * @param {Array} riskCategories - Individual risk categories
   * @returns {Array} Recommendations
   * @private
   */
  _generateRecommendations(riskLevel, riskCategories) {
    const recommendations = [];

    switch (riskLevel) {
      case 'high':
        recommendations.push('Immediate medical consultation recommended');
        recommendations.push('Consider specialist referral');
        break;
      case 'medium':
        recommendations.push('Regular monitoring advised');
        recommendations.push('Lifestyle modifications recommended');
        break;
      case 'low':
        recommendations.push('Routine care appropriate');
        recommendations.push('Annual checkup sufficient');
        break;
      default:
        recommendations.push('No immediate concerns');
        recommendations.push('Maintain current care plan');
    }

    // Add specific recommendations based on top risk categories
    const topRisks = riskCategories.slice(0, 3);
    topRisks.forEach(risk => {
      if (risk.level === 'high') {
        recommendations.push(`Monitor ${risk.category} closely`);
      }
    });

    return recommendations;
  }

  /**
   * Add risk category
   * @param {string} category - Risk category
   */
  addRiskCategory(category) {
    if (!this.riskCategories.includes(category)) {
      this.riskCategories.push(category);
    }

    if (!this.riskMetadata.categories.includes(category)) {
      this.riskMetadata.categories.push(category);
    }

    this.riskMetadata.lastUpdated = new Date().toISOString();

    console.log('Risk category added', {
      category,
      totalCategories: this.riskCategories.length
    });
  }

  /**
   * Get risk assessment statistics
   * @returns {Object} Enhanced statistics
   */
  getStatistics() {
    const stats = super.getStatistics();

    return {
      ...stats,
      riskAssessmentSpecific: {
        riskThresholds: this.config.riskThresholds,
        riskCategories: this.riskCategories.length,
        totalAssessments: this.riskMetadata.assessments,
        lastUpdated: this.riskMetadata.lastUpdated
      }
    };
  }

  /**
   * Get risk metadata
   * @returns {Object} Risk metadata
   */
  getRiskMetadata() {
    return {
      ...this.riskMetadata,
      categories: this.riskCategories,
      config: this.config
    };
  }
}

module.exports = RiskAssessmentNN;