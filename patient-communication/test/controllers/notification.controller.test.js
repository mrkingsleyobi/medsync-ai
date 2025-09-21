/**
 * Notification Controller Tests
 * Tests for the notification controller
 */

const NotificationController = require('../../src/controllers/notification.controller.js');

// Mock the NotificationService
jest.mock('../../src/services/notification.service.js');

describe('Notification Controller', () => {
  let notificationController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    notificationController = new NotificationController();

    // Manually set up the mock service properties that the controller expects
    notificationController.notificationService.types = {
      APPOINTMENT_REMINDER: 'appointment_reminder',
      MEDICATION_REMINDER: 'medication_reminder',
      HEALTH_ALERT: 'health_alert',
      EDUCATION_RECOMMENDATION: 'education_recommendation',
      DOCUMENT_AVAILABLE: 'document_available',
      MESSAGE_RECEIVED: 'message_received',
      SYSTEM_UPDATE: 'system_update',
      SECURITY_ALERT: 'security_alert'
    };

    notificationController.notificationService.priorities = {
      LOW: 'low',
      NORMAL: 'normal',
      HIGH: 'high',
      URGENT: 'urgent'
    };

    notificationController.notificationService.channels = {
      EMAIL: 'email',
      SMS: 'sms',
      PUSH: 'push',
      IN_APP: 'in_app'
    };

    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { userId: 'user_123' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('sendNotification', () => {
    test('should send notification immediately', async () => {
      const userId = 'user_123';
      const type = 'appointment_reminder';
      const title = 'Appointment Reminder';
      const message = 'You have an appointment tomorrow';
      const result = {
        notificationId: 'notif_123',
        results: [{ channel: 'email', success: true }]
      };

      mockReq.body = { userId, type, title, message };

      // Mock the service method
      notificationController.notificationService.sendNotification.mockResolvedValue(result);

      await notificationController.sendNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Notification sent successfully',
        notificationId: result.notificationId,
        results: result.results
      });
    });

    test('should schedule notification if scheduledFor is provided', async () => {
      const userId = 'user_123';
      const type = 'appointment_reminder';
      const title = 'Appointment Reminder';
      const message = 'You have an appointment tomorrow';
      const scheduledFor = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const result = {
        message: 'Notification scheduled successfully',
        scheduledNotification: { id: 'sched_123' }
      };

      mockReq.body = { userId, type, title, message, scheduledFor };

      // Mock the service method
      notificationController.notificationService.scheduleNotification.mockResolvedValue(result);

      await notificationController.sendNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        scheduledNotification: result.scheduledNotification
      });
    });

    test('should return 400 if required fields are missing', async () => {
      mockReq.body = { userId: 'user_123', type: 'appointment_reminder' };

      await notificationController.sendNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User ID, type, title, and message are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const type = 'appointment_reminder';
      const title = 'Appointment Reminder';
      const message = 'You have an appointment tomorrow';
      const errorMessage = 'Service error';

      mockReq.body = { userId, type, title, message };

      // Mock the service method to throw an error
      notificationController.notificationService.sendNotification.mockRejectedValue(new Error(errorMessage));

      await notificationController.sendNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to send notification',
        message: errorMessage
      });
    });
  });

  describe('getUserNotifications', () => {
    test('should get user notifications', async () => {
      const userId = 'user_123';
      const notifications = [
        { id: 'notif_1', title: 'Appointment Reminder', read: false },
        { id: 'notif_2', title: 'Medication Reminder', read: true }
      ];

      mockReq.user = { userId };

      // Mock the service method
      notificationController.notificationService.getUserNotifications.mockResolvedValue(notifications);

      await notificationController.getUserNotifications(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: notifications.length,
        notifications: notifications
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const errorMessage = 'Service error';

      mockReq.user = { userId };

      // Mock the service method to throw an error
      notificationController.notificationService.getUserNotifications.mockRejectedValue(new Error(errorMessage));

      await notificationController.getUserNotifications(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve notifications',
        message: errorMessage
      });
    });
  });

  describe('markAsRead', () => {
    test('should mark notification as read', async () => {
      const userId = 'user_123';
      const notificationId = 'notif_123';
      const result = { message: 'Notification marked as read' };

      mockReq.user = { userId };
      mockReq.params = { notificationId };

      // Mock the service method
      notificationController.notificationService.markAsRead.mockResolvedValue(result);

      await notificationController.markAsRead(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message
      });
    });

    test('should return 400 if notificationId is missing', async () => {
      mockReq.params = {};

      await notificationController.markAsRead(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Notification ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const notificationId = 'notif_123';
      const errorMessage = 'Service error';

      mockReq.user = { userId };
      mockReq.params = { notificationId };

      // Mock the service method to throw an error
      notificationController.notificationService.markAsRead.mockRejectedValue(new Error(errorMessage));

      await notificationController.markAsRead(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to mark notification as read',
        message: errorMessage
      });
    });
  });

  describe('deleteNotification', () => {
    test('should delete notification', async () => {
      const userId = 'user_123';
      const notificationId = 'notif_123';
      const result = { message: 'Notification deleted successfully' };

      mockReq.user = { userId };
      mockReq.params = { notificationId };

      // Mock the service method
      notificationController.notificationService.deleteNotification.mockResolvedValue(result);

      await notificationController.deleteNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message
      });
    });

    test('should return 400 if notificationId is missing', async () => {
      mockReq.params = {};

      await notificationController.deleteNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Notification ID is required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const notificationId = 'notif_123';
      const errorMessage = 'Service error';

      mockReq.user = { userId };
      mockReq.params = { notificationId };

      // Mock the service method to throw an error
      notificationController.notificationService.deleteNotification.mockRejectedValue(new Error(errorMessage));

      await notificationController.deleteNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to delete notification',
        message: errorMessage
      });
    });
  });

  describe('getUserPreferences', () => {
    test('should get user notification preferences', async () => {
      const userId = 'user_123';
      const preferences = {
        channels: { email: true, sms: false },
        types: { appointment_reminder: true }
      };

      mockReq.user = { userId };

      // Mock the service method
      notificationController.notificationService.getUserPreferences.mockResolvedValue(preferences);

      await notificationController.getUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        preferences: preferences
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const errorMessage = 'Service error';

      mockReq.user = { userId };

      // Mock the service method to throw an error
      notificationController.notificationService.getUserPreferences.mockRejectedValue(new Error(errorMessage));

      await notificationController.getUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve notification preferences',
        message: errorMessage
      });
    });
  });

  describe('updateUserPreferences', () => {
    test('should update user notification preferences', async () => {
      const userId = 'user_123';
      const preferences = {
        channels: { email: true, sms: false },
        types: { appointment_reminder: true }
      };
      const result = {
        message: 'Notification preferences updated successfully',
        preferences: preferences
      };

      mockReq.user = { userId };
      mockReq.body = { preferences };

      // Mock the service method
      notificationController.notificationService.updateUserPreferences.mockResolvedValue(result);

      await notificationController.updateUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        preferences: result.preferences
      });
    });

    test('should return 400 if preferences are missing', async () => {
      mockReq.body = {};

      await notificationController.updateUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Preferences are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const preferences = { channels: { email: true } };
      const errorMessage = 'Service error';

      mockReq.user = { userId };
      mockReq.body = { preferences };

      // Mock the service method to throw an error
      notificationController.notificationService.updateUserPreferences.mockRejectedValue(new Error(errorMessage));

      await notificationController.updateUserPreferences(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to update notification preferences',
        message: errorMessage
      });
    });
  });

  describe('sendAppointmentReminder', () => {
    test('should send appointment reminder immediately', async () => {
      const userId = 'user_123';
      const appointmentDetails = {
        id: 'apt_123',
        doctor: 'Dr. Smith',
        date: '2025-10-20',
        time: '10:30 AM'
      };
      const result = {
        notificationId: 'notif_123',
        results: [{ channel: 'email', success: true }]
      };

      mockReq.body = { userId, appointmentDetails };

      // Mock the service method
      notificationController.notificationService.sendNotification.mockResolvedValue(result);

      await notificationController.sendAppointmentReminder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Appointment reminder sent successfully',
        notificationId: result.notificationId,
        results: result.results
      });
    });

    test('should schedule appointment reminder if reminderTime is provided', async () => {
      const userId = 'user_123';
      const appointmentDetails = {
        id: 'apt_123',
        doctor: 'Dr. Smith',
        date: '2025-10-20',
        time: '10:30 AM'
      };
      const reminderTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const result = {
        message: 'Notification scheduled successfully',
        scheduledNotification: { id: 'sched_123' }
      };

      mockReq.body = { userId, appointmentDetails, reminderTime };

      // Mock the service method
      notificationController.notificationService.scheduleNotification.mockResolvedValue(result);

      await notificationController.sendAppointmentReminder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        scheduledNotification: result.scheduledNotification
      });
    });

    test('should return 400 if required fields are missing', async () => {
      mockReq.body = { userId: 'user_123' };

      await notificationController.sendAppointmentReminder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User ID and appointment details are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const appointmentDetails = {
        id: 'apt_123',
        doctor: 'Dr. Smith',
        date: '2025-10-20',
        time: '10:30 AM'
      };
      const errorMessage = 'Service error';

      mockReq.body = { userId, appointmentDetails };

      // Mock the service method to throw an error
      notificationController.notificationService.sendNotification.mockRejectedValue(new Error(errorMessage));

      await notificationController.sendAppointmentReminder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to send appointment reminder',
        message: errorMessage
      });
    });
  });

  describe('sendMedicationReminder', () => {
    test('should send medication reminder immediately', async () => {
      const userId = 'user_123';
      const medicationDetails = {
        id: 'med_123',
        name: 'Aspirin',
        dosage: '100mg'
      };
      const result = {
        notificationId: 'notif_123',
        results: [{ channel: 'email', success: true }]
      };

      mockReq.body = { userId, medicationDetails };

      // Mock the service method
      notificationController.notificationService.sendNotification.mockResolvedValue(result);

      await notificationController.sendMedicationReminder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Medication reminder sent successfully',
        notificationId: result.notificationId,
        results: result.results
      });
    });

    test('should schedule medication reminder if reminderTime is provided', async () => {
      const userId = 'user_123';
      const medicationDetails = {
        id: 'med_123',
        name: 'Aspirin',
        dosage: '100mg'
      };
      const reminderTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const result = {
        message: 'Notification scheduled successfully',
        scheduledNotification: { id: 'sched_123' }
      };

      mockReq.body = { userId, medicationDetails, reminderTime };

      // Mock the service method
      notificationController.notificationService.scheduleNotification.mockResolvedValue(result);

      await notificationController.sendMedicationReminder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: result.message,
        scheduledNotification: result.scheduledNotification
      });
    });

    test('should return 400 if required fields are missing', async () => {
      mockReq.body = { userId: 'user_123' };

      await notificationController.sendMedicationReminder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User ID and medication details are required'
      });
    });

    test('should return 500 if service throws an error', async () => {
      const userId = 'user_123';
      const medicationDetails = {
        id: 'med_123',
        name: 'Aspirin',
        dosage: '100mg'
      };
      const errorMessage = 'Service error';

      mockReq.body = { userId, medicationDetails };

      // Mock the service method to throw an error
      notificationController.notificationService.sendNotification.mockRejectedValue(new Error(errorMessage));

      await notificationController.sendMedicationReminder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to send medication reminder',
        message: errorMessage
      });
    });
  });
});