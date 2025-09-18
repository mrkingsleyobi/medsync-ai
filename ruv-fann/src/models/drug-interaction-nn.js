// MediSync Healthcare AI Platform - Drug Interaction Neural Network
// Specialized neural network for drug interaction prediction

const HealthcareNeuralNetwork = require('../healthcare-nn');

class DrugInteractionNN extends HealthcareNeuralNetwork {
  /**
   * Create a drug interaction neural network
   * @param {Object} config - Configuration for the drug interaction network
   */
  constructor(config = {}) {
    const drugConfig = {
      type: 'drug_interaction',
      healthcareSpecialization: 'pharmacovigilance',
      numInput: config.numInput || 50, // Drug properties, patient factors
      numHidden: config.numHidden || 100, // Complex interaction analysis
      numOutput: config.numOutput || 20, // Interaction types/severity
      learningRate: config.learningRate || 0.4,
      activationFunction: config.activationFunction || 'tanh',
      interactionThreshold: config.interactionThreshold || 0.7,
      ...config
    };

    super(drugConfig);

    this.drugDatabase = new Map();
    this.interactionMetadata = {
      drugPairs: 0,
      interactionTypes: [],
      lastUpdated: null
    };

    console.log('Drug interaction neural network initialized', {
      inputFeatures: this.config.numInput,
      interactionTypes: this.config.numOutput,
      interactionThreshold: this.config.interactionThreshold
    });
  }

  /**
   * Train the drug interaction network
   * @param {Array} trainingData - Drug interaction training data
   * @param {Object} options - Training options
   * @returns {Object} Training results
   */
  train(trainingData, options = {}) {
    // Preprocess drug interaction data
    const processedData = this._preprocessDrugData(trainingData);

    console.log('Training drug interaction network', {
      originalDataSize: trainingData.length,
      processedDataSize: processedData.length,
      interactionTypes: processedData[0]?.output?.length || 0
    });

    const trainingOptions = {
      epochs: options.epochs || 1500,
      targetError: options.targetError || 0.002,
      logInterval: options.logInterval || 150,
      ...options
    };

    return super.train(processedData, trainingOptions);
  }

  /**
   * Preprocess drug interaction data
   * @param {Array} data - Raw drug data
   * @returns {Array} Processed data
   * @private
   */
  _preprocessDrugData(data) {
    return data.map(item => ({
      input: this._encodeDrugPair(item.drugs || item.input),
      output: this._encodeInteractions(item.interactions || item.output)
    }));
  }

  /**
   * Encode drug pair for network input
   * @param {Array} drugs - Drug pair
   * @returns {Array} Encoded input array
   * @private
   */
  _encodeDrugPair(drugs) {
    // Ensure input array has correct length
    const encoded = new Array(this.config.numInput).fill(0);

    if (Array.isArray(drugs) && drugs.length >= 2) {
      // Get or create drug IDs
      const drug1Id = this._getDrugId(drugs[0]);
      const drug2Id = this._getDrugId(drugs[1]);

      // Simple encoding - in a real implementation, this would use drug properties
      encoded[0] = drug1Id % 1000 / 1000; // Normalize to 0-1 range
      encoded[1] = drug2Id % 1000 / 1000; // Normalize to 0-1 range

      // Add some basic drug properties (simplified)
      if (typeof drugs[0] === 'object') {
        encoded[2] = drugs[0].dosage || 0;
        encoded[3] = drugs[0].frequency || 0;
      }
      if (typeof drugs[1] === 'object') {
        encoded[4] = drugs[1].dosage || 0;
        encoded[5] = drugs[1].frequency || 0;
      }
    }

    return encoded;
  }

  /**
   * Get or create drug ID
   * @param {string|Object} drug - Drug information
   * @returns {number} Drug ID
   * @private
   */
  _getDrugId(drug) {
    const drugName = typeof drug === 'string' ? drug : drug.name;
    if (!this.drugDatabase.has(drugName)) {
      const id = this.drugDatabase.size + 1;
      this.drugDatabase.set(drugName, id);
    }
    return this.drugDatabase.get(drugName);
  }

  /**
   * Encode interactions for network output
   * @param {Array} interactions - Interaction data
   * @returns {Array} Encoded output array
   * @private
   */
  _encodeInteractions(interactions) {
    // Ensure output array has correct length
    const encoded = new Array(this.config.numOutput).fill(0);

    if (Array.isArray(interactions)) {
      interactions.forEach((interaction, index) => {
        if (index < encoded.length) {
          // Convert interaction severity to 0-1 range
          if (typeof interaction === 'object') {
            encoded[index] = interaction.severity || 0;
          } else if (typeof interaction === 'number') {
            encoded[index] = interaction;
          } else {
            encoded[index] = 1; // Default to high severity
          }
        }
      });
    }

    return encoded;
  }

  /**
   * Predict drug interactions
   * @param {Array} drugs - Drug pair to check
   * @param {Object} options - Prediction options
   * @returns {Object} Interaction predictions
   */
  predictInteractions(drugs, options = {}) {
    const encodedInput = this._encodeDrugPair(drugs);
    const rawOutputs = this.predict(encodedInput);

    // Post-process outputs to get meaningful interactions
    const interactions = this._postProcessInteractions(rawOutputs, options);

    return {
      drugs,
      input: encodedInput,
      rawOutputs,
      interactions,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Post-process network outputs to get interactions
   * @param {Array} outputs - Raw network outputs
   * @param {Object} options - Processing options
   * @returns {Array} Processed interactions with confidence
   * @private
   */
  _postProcessInteractions(outputs, options = {}) {
    const threshold = options.threshold || this.config.interactionThreshold;
    const maxResults = options.maxResults || 10;

    const interactions = outputs
      .map((confidence, index) => ({
        id: index,
        confidence,
        type: this.interactionMetadata.interactionTypes[index] || `Interaction_${index}`,
        severity: confidence // Using confidence as severity proxy
      }))
      .filter(interaction => interaction.confidence >= threshold)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxResults);

    return interactions;
  }

  /**
   * Add drug to database
   * @param {string} drugName - Drug name
   * @param {Object} properties - Drug properties
   */
  addDrug(drugName, properties = {}) {
    if (!this.drugDatabase.has(drugName)) {
      const id = this.drugDatabase.size + 1;
      this.drugDatabase.set(drugName, id);
    }

    this.interactionMetadata.lastUpdated = new Date().toISOString();

    console.log('Drug added to database', {
      drugName,
      drugId: this.drugDatabase.get(drugName),
      totalDrugs: this.drugDatabase.size
    });
  }

  /**
   * Add interaction type to metadata
   * @param {string} interactionType - Interaction type
   */
  addInteractionType(interactionType) {
    if (!this.interactionMetadata.interactionTypes.includes(interactionType)) {
      this.interactionMetadata.interactionTypes.push(interactionType);
      this.interactionMetadata.drugPairs++;
    }

    this.interactionMetadata.lastUpdated = new Date().toISOString();

    console.log('Interaction type added', {
      interactionType,
      totalTypes: this.interactionMetadata.interactionTypes.length
    });
  }

  /**
   * Get drug interaction statistics
   * @returns {Object} Enhanced statistics
   */
  getStatistics() {
    const stats = super.getStatistics();

    return {
      ...stats,
      drugInteractionSpecific: {
        interactionThreshold: this.config.interactionThreshold,
        drugDatabaseSize: this.drugDatabase.size,
        interactionTypes: this.interactionMetadata.interactionTypes.length,
        drugPairs: this.interactionMetadata.drugPairs,
        lastUpdated: this.interactionMetadata.lastUpdated
      }
    };
  }

  /**
   * Get interaction metadata
   * @returns {Object} Interaction metadata
   */
  getInteractionMetadata() {
    return {
      ...this.interactionMetadata,
      drugDatabase: Array.from(this.drugDatabase.entries()),
      config: this.config
    };
  }
}

module.exports = DrugInteractionNN;