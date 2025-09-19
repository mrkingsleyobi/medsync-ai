/**
 * IoT & Wearable Integration Controller Tests
 * Unit tests for the IoT and wearable integration controller
 */

const IoTWearableController = require('../../src/controllers/iot-wearable.controller.js');

// Mock the service
jest.mock('../../src/services/iot-wearable.service.js');

describe('IoTWearableController', () => {
  let iotWearableController;
  let mockIoTWearableService;

  beforeEach(() => {
    iotWearableController = new IoTWearableController();
    mockIoTWearableService = iotWearableController.iotWearableService;
  });

  describe('integrateWithWearables', () => {
    test('should integrate with wearable devices successfully', async () => {
      const req = {
        body: {
          options: { deviceTypes: ['fitbit', 'appleWatch'] }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'wearable-job-123',
        devicesConnected: [
          { id: 'DEVICE-001', type: 'fitbit', connected: true },
          { id: 'DEVICE-002', type: 'appleWatch', connected: true }
        ],
        dataPoints: 1247,
        processingTime: 1500
      };

      mockIoTWearableService.integrateWithWearables.mockResolvedValue(mockResult);

      await iotWearableController.integrateWithWearables(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Wearable device integration completed successfully',
        jobId: mockResult.jobId,
        devicesConnected: mockResult.devicesConnected,
        dataPoints: mockResult.dataPoints,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when wearable device integration is not enabled', async () => {
      const req = {
        body: {
          options: { deviceTypes: ['fitbit'] }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.integrateWithWearables.mockRejectedValue(new Error('Wearable device integration is not enabled'));

      await iotWearableController.integrateWithWearables(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Wearable device integration is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          options: { deviceTypes: ['fitbit'] }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.integrateWithWearables.mockRejectedValue(new Error('Service error'));

      await iotWearableController.integrateWithWearables(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to integrate with wearable devices',
        message: 'Service error'
      });
    });
  });

  describe('processSensorData', () => {
    test('should process IoT sensor data successfully', async () => {
      const req = {
        body: {
          sensorData: [
            { type: 'heartRate', value: 72 },
            { type: 'bloodPressure', value: { systolic: 118, diastolic: 76 } }
          ]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'sensor-job-123',
        processedDataPoints: 2,
        anomaliesDetected: 0,
        processingTime: 2000
      };

      mockIoTWearableService.processSensorData.mockResolvedValue(mockResult);

      await iotWearableController.processSensorData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'IoT sensor data processed successfully',
        jobId: mockResult.jobId,
        processedDataPoints: mockResult.processedDataPoints,
        anomaliesDetected: mockResult.anomaliesDetected,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when sensor data array is not provided', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await iotWearableController.processSensorData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Sensor data array is required'
      });
    });

    test('should return 400 when sensor data is not an array', async () => {
      const req = {
        body: {
          sensorData: 'not-an-array'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await iotWearableController.processSensorData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Sensor data array is required'
      });
    });

    test('should return 400 when IoT sensor integration is not enabled', async () => {
      const req = {
        body: {
          sensorData: [{ type: 'heartRate', value: 72 }]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.processSensorData.mockRejectedValue(new Error('IoT sensor integration is not enabled'));

      await iotWearableController.processSensorData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'IoT sensor integration is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          sensorData: [{ type: 'heartRate', value: 72 }]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.processSensorData.mockRejectedValue(new Error('Service error'));

      await iotWearableController.processSensorData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to process IoT sensor data',
        message: 'Service error'
      });
    });
  });

  describe('monitorRealTimeHealth', () => {
    test('should monitor real-time health data successfully', async () => {
      const req = {
        body: {
          options: { frequency: 10000 }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'monitoring-job-123',
        vitals: { heartRate: 72, bloodPressure: { systolic: 118, diastolic: 76 } },
        alerts: [],
        processingTime: 1000
      };

      mockIoTWearableService.monitorRealTimeHealth.mockResolvedValue(mockResult);

      await iotWearableController.monitorRealTimeHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Real-time health monitoring completed successfully',
        jobId: mockResult.jobId,
        vitals: mockResult.vitals,
        alerts: mockResult.alerts,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when real-time health monitoring is not enabled', async () => {
      const req = {
        body: {
          options: { frequency: 10000 }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.monitorRealTimeHealth.mockRejectedValue(new Error('Real-time health monitoring is not enabled'));

      await iotWearableController.monitorRealTimeHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Real-time health monitoring is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          options: { frequency: 10000 }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.monitorRealTimeHealth.mockRejectedValue(new Error('Service error'));

      await iotWearableController.monitorRealTimeHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to monitor real-time health data',
        message: 'Service error'
      });
    });
  });

  describe('generateEarlyWarning', () => {
    test('should generate early warning successfully', async () => {
      const req = {
        body: {
          patientData: {
            patientId: 'PAT-12345',
            vitals: { heartRate: 72 }
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'warning-job-123',
        patientId: 'PAT-12345',
        warnings: [{ type: 'risk_of_fall', severity: 'medium' }],
        confidence: 0.85,
        processingTime: 1500
      };

      mockIoTWearableService.generateEarlyWarning.mockResolvedValue(mockResult);

      await iotWearableController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Early warning generated successfully',
        jobId: mockResult.jobId,
        patientId: mockResult.patientId,
        warnings: mockResult.warnings,
        confidence: mockResult.confidence,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when patient data is not provided', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await iotWearableController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient data is required'
      });
    });

    test('should return 400 when early warning system is not enabled', async () => {
      const req = {
        body: {
          patientData: { patientId: 'PAT-12345' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.generateEarlyWarning.mockRejectedValue(new Error('Early warning system is not enabled'));

      await iotWearableController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Early warning system is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          patientData: { patientId: 'PAT-12345' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.generateEarlyWarning.mockRejectedValue(new Error('Service error'));

      await iotWearableController.generateEarlyWarning(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to generate early warning',
        message: 'Service error'
      });
    });
  });

  describe('generatePopulationAnalytics', () => {
    test('should generate population health analytics successfully', async () => {
      const req = {
        body: {
          options: { aggregationPeriod: 'daily' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'analytics-job-123',
        populationMetrics: { totalPatients: 2456, averageHeartRate: 74 },
        benchmarks: { heartRate: { min: 60, max: 100 } },
        outliers: 42,
        processingTime: 2500
      };

      mockIoTWearableService.generatePopulationAnalytics.mockResolvedValue(mockResult);

      await iotWearableController.generatePopulationAnalytics(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Population health analytics generated successfully',
        jobId: mockResult.jobId,
        populationMetrics: mockResult.populationMetrics,
        benchmarks: mockResult.benchmarks,
        outliers: mockResult.outliers,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when population health analytics is not enabled', async () => {
      const req = {
        body: {
          options: { aggregationPeriod: 'daily' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.generatePopulationAnalytics.mockRejectedValue(new Error('Population health analytics is not enabled'));

      await iotWearableController.generatePopulationAnalytics(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Population health analytics is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          options: { aggregationPeriod: 'daily' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.generatePopulationAnalytics.mockRejectedValue(new Error('Service error'));

      await iotWearableController.generatePopulationAnalytics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to generate population health analytics',
        message: 'Service error'
      });
    });
  });

  describe('generateHealthPredictions', () => {
    test('should generate personalized health predictions successfully', async () => {
      const req = {
        body: {
          patientData: {
            patientId: 'PAT-12345',
            vitals: { heartRate: 72 }
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        jobId: 'prediction-job-123',
        patientId: 'PAT-12345',
        predictions: [{ type: 'risk_of_readmission', probability: 0.75 }],
        confidence: 0.88,
        processingTime: 2000
      };

      mockIoTWearableService.generateHealthPredictions.mockResolvedValue(mockResult);

      await iotWearableController.generateHealthPredictions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Personalized health predictions generated successfully',
        jobId: mockResult.jobId,
        patientId: mockResult.patientId,
        predictions: mockResult.predictions,
        confidence: mockResult.confidence,
        processingTime: mockResult.processingTime
      });
    });

    test('should return 400 when patient data is not provided', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await iotWearableController.generateHealthPredictions(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Patient data is required'
      });
    });

    test('should return 400 when personalized health prediction is not enabled', async () => {
      const req = {
        body: {
          patientData: { patientId: 'PAT-12345' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.generateHealthPredictions.mockRejectedValue(new Error('Personalized health prediction is not enabled'));

      await iotWearableController.generateHealthPredictions(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Personalized health prediction is not enabled'
      });
    });

    test('should return 500 when service throws an error', async () => {
      const req = {
        body: {
          patientData: { patientId: 'PAT-12345' }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.generateHealthPredictions.mockRejectedValue(new Error('Service error'));

      await iotWearableController.generateHealthPredictions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to generate personalized health predictions',
        message: 'Service error'
      });
    });
  });

  describe('getServiceStatus', () => {
    test('should return service status successfully', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        wearables: { enabled: true, devicesConnected: 5 },
        sensors: { enabled: true, sensorsConnected: 3 }
      };

      mockIoTWearableService.getServiceStatus.mockReturnValue(mockStatus);

      iotWearableController.getServiceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getServiceStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.getServiceStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve service status',
        message: 'Service error'
      });
    });
  });

  describe('getWearableIntegrationStatus', () => {
    test('should return wearable integration job status successfully', () => {
      const req = {
        params: {
          jobId: 'wearable-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'wearable-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:01Z',
        devicesConnected: 2
      };

      mockIoTWearableService.getWearableIntegrationStatus.mockReturnValue(mockStatus);

      iotWearableController.getWearableIntegrationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 400 when job ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      iotWearableController.getWearableIntegrationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when job is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getWearableIntegrationStatus.mockReturnValue(null);

      iotWearableController.getWearableIntegrationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Wearable integration job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'wearable-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getWearableIntegrationStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.getWearableIntegrationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve wearable integration job status',
        message: 'Service error'
      });
    });
  });

  describe('getSensorDataProcessingStatus', () => {
    test('should return sensor data processing job status successfully', () => {
      const req = {
        params: {
          jobId: 'sensor-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'sensor-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:02Z',
        processedDataPoints: 2,
        anomaliesDetected: 0
      };

      mockIoTWearableService.getSensorDataProcessingStatus.mockReturnValue(mockStatus);

      iotWearableController.getSensorDataProcessingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 400 when job ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      iotWearableController.getSensorDataProcessingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when job is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getSensorDataProcessingStatus.mockReturnValue(null);

      iotWearableController.getSensorDataProcessingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Sensor data processing job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'sensor-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getSensorDataProcessingStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.getSensorDataProcessingStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve sensor data processing job status',
        message: 'Service error'
      });
    });
  });

  describe('getMonitoringStatus', () => {
    test('should return monitoring job status successfully', () => {
      const req = {
        params: {
          jobId: 'monitoring-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'monitoring-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        startedAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:01Z'
      };

      mockIoTWearableService.getMonitoringStatus.mockReturnValue(mockStatus);

      iotWearableController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 400 when job ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      iotWearableController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when job is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getMonitoringStatus.mockReturnValue(null);

      iotWearableController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Monitoring job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'monitoring-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getMonitoringStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.getMonitoringStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve monitoring job status',
        message: 'Service error'
      });
    });
  });

  describe('getAlertStatus', () => {
    test('should return alert status successfully', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        id: 'alert-123',
        type: 'high_heart_rate',
        severity: 'high',
        createdAt: '2025-09-19T14:30:00Z',
        acknowledged: false,
        resolved: false
      };

      mockIoTWearableService.getAlertStatus.mockReturnValue(mockStatus);

      iotWearableController.getAlertStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 400 when alert ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      iotWearableController.getAlertStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
      });
    });

    test('should return 404 when alert is not found', () => {
      const req = {
        params: {
          alertId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getAlertStatus.mockReturnValue(null);

      iotWearableController.getAlertStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getAlertStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.getAlertStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve alert status',
        message: 'Service error'
      });
    });
  });

  describe('getPredictionStatus', () => {
    test('should return prediction job status successfully', () => {
      const req = {
        params: {
          jobId: 'prediction-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'prediction-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        startedAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:02Z'
      };

      mockIoTWearableService.getPredictionStatus.mockReturnValue(mockStatus);

      iotWearableController.getPredictionStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 400 when job ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      iotWearableController.getPredictionStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when job is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getPredictionStatus.mockReturnValue(null);

      iotWearableController.getPredictionStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Prediction job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'prediction-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getPredictionStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.getPredictionStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve prediction job status',
        message: 'Service error'
      });
    });
  });

  describe('getAnalyticsStatus', () => {
    test('should return analytics job status successfully', () => {
      const req = {
        params: {
          jobId: 'analytics-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockStatus = {
        jobId: 'analytics-job-123',
        status: 'completed',
        createdAt: '2025-09-19T14:30:00Z',
        completedAt: '2025-09-19T14:30:02Z',
        populationSize: 2456
      };

      mockIoTWearableService.getAnalyticsStatus.mockReturnValue(mockStatus);

      iotWearableController.getAnalyticsStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: mockStatus
      });
    });

    test('should return 400 when job ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      iotWearableController.getAnalyticsStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Job ID is required'
      });
    });

    test('should return 404 when job is not found', () => {
      const req = {
        params: {
          jobId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getAnalyticsStatus.mockReturnValue(null);

      iotWearableController.getAnalyticsStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Analytics job not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          jobId: 'analytics-job-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.getAnalyticsStatus.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.getAnalyticsStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve analytics job status',
        message: 'Service error'
      });
    });
  });

  describe('acknowledgeAlert', () => {
    test('should acknowledge an alert successfully', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        id: 'alert-123',
        acknowledged: true,
        acknowledgedAt: '2025-09-19T14:30:01Z'
      };

      mockIoTWearableService.acknowledgeAlert.mockReturnValue(mockResult);

      iotWearableController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert acknowledged successfully',
        alert: mockResult
      });
    });

    test('should return 400 when alert ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      iotWearableController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
      });
    });

    test('should return 404 when alert is not found', () => {
      const req = {
        params: {
          alertId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.acknowledgeAlert.mockReturnValue(null);

      iotWearableController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.acknowledgeAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.acknowledgeAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to acknowledge alert',
        message: 'Service error'
      });
    });
  });

  describe('resolveAlert', () => {
    test('should resolve an alert successfully', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        id: 'alert-123',
        resolved: true,
        resolvedAt: '2025-09-19T14:30:01Z'
      };

      mockIoTWearableService.resolveAlert.mockReturnValue(mockResult);

      iotWearableController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Alert resolved successfully',
        alert: mockResult
      });
    });

    test('should return 400 when alert ID is not provided', () => {
      const req = {
        params: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      iotWearableController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert ID is required'
      });
    });

    test('should return 404 when alert is not found', () => {
      const req = {
        params: {
          alertId: 'non-existent-id'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.resolveAlert.mockReturnValue(null);

      iotWearableController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Alert not found'
      });
    });

    test('should return 500 when service throws an error', () => {
      const req = {
        params: {
          alertId: 'alert-123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockIoTWearableService.resolveAlert.mockImplementation(() => {
        throw new Error('Service error');
      });

      iotWearableController.resolveAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to resolve alert',
        message: 'Service error'
      });
    });
  });
});