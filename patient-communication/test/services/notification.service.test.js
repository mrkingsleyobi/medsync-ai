/**
 * Notification Service Tests
 * Tests for the notification service
 */

const NotificationService = require('../../src/services/notification.service.js');

describe('Notification Service', () => {
  let notificationService;

  beforeEach(() => {
    notificationService = new NotificationService();
  });

  describe('sendNotification', () => {
    test('should send notification successfully', async () => {
      const notification = {
        userId: 'user_123',
        type: notificationService.types.APPOINTMENT_REMINDER,
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow',
        channels: [notificationService.channels.IN_APP]
      };

      const result = await notificationService.sendNotification(notification);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.notificationId).toBeDefined();
      expect(result.results).toBeDefined();
      expect(Array.isArray(result.results)).toBe(true);
    });

    test('should throw an error for missing user ID', async () => {
      const notification = {
        type: notificationService.types.APPOINTMENT_REMINDER,
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow'
      };

      await expect(notificationService.sendNotification(notification))
        .rejects
        .toThrow('User ID and notification type are required');
    });

    test('should throw an error for missing notification type', async () => {
      const notification = {
        userId: 'user_123',
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow'
      };

      await expect(notificationService.sendNotification(notification))
        .rejects
        .toThrow('User ID and notification type are required');
    });
  });

  describe('scheduleNotification', () => {
    test('should schedule notification successfully', async () => {
      const notification = {
        userId: 'user_123',
        type: notificationService.types.APPOINTMENT_REMINDER,
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow'
      };
      const scheduledTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

      const result = await notificationService.scheduleNotification(notification, scheduledTime);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Notification scheduled successfully');
      expect(result.scheduledNotification).toBeDefined();
    });

    test('should throw an error for missing notification data', async () => {
      const scheduledTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

      await expect(notificationService.scheduleNotification(null, scheduledTime))
        .rejects
        .toThrow('Notification data and scheduled time are required');
    });

    test('should throw an error for missing scheduled time', async () => {
      const notification = {
        userId: 'user_123',
        type: notificationService.types.APPOINTMENT_REMINDER,
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow'
      };

      await expect(notificationService.scheduleNotification(notification, null))
        .rejects
        .toThrow('Notification data and scheduled time are required');
    });

    test('should throw an error for past scheduled time', async () => {
      const notification = {
        userId: 'user_123',
        type: notificationService.types.APPOINTMENT_REMINDER,
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow'
      };
      const pastTime = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago

      await expect(notificationService.scheduleNotification(notification, pastTime))
        .rejects
        .toThrow('Scheduled time must be in the future');
    });
  });

  describe('getUserNotifications', () => {
    test('should get user notifications', async () => {
      const userId = 'user_123';

      const result = await notificationService.getUserNotifications(userId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should get user notifications with filters', async () => {
      const userId = 'user_123';
      const filters = { type: notificationService.types.APPOINTMENT_REMINDER };

      const result = await notificationService.getUserNotifications(userId, filters);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    test('should throw an error for missing user ID', async () => {
      await expect(notificationService.getUserNotifications(null))
        .rejects
        .toThrow('User ID is required');
    });
  });

  describe('markAsRead', () => {
    test('should mark notification as read', async () => {
      const userId = 'user_123';
      const notificationId = 'notif_123';

      const result = await notificationService.markAsRead(userId, notificationId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Notification marked as read');
    });

    test('should throw an error for missing user ID', async () => {
      const notificationId = 'notif_123';

      await expect(notificationService.markAsRead(null, notificationId))
        .rejects
        .toThrow('User ID and notification ID are required');
    });

    test('should throw an error for missing notification ID', async () => {
      const userId = 'user_123';

      await expect(notificationService.markAsRead(userId, null))
        .rejects
        .toThrow('User ID and notification ID are required');
    });
  });

  describe('deleteNotification', () => {
    test('should delete notification', async () => {
      const userId = 'user_123';
      const notificationId = 'notif_123';

      const result = await notificationService.deleteNotification(userId, notificationId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Notification deleted successfully');
    });

    test('should throw an error for missing user ID', async () => {
      const notificationId = 'notif_123';

      await expect(notificationService.deleteNotification(null, notificationId))
        .rejects
        .toThrow('User ID and notification ID are required');
    });

    test('should throw an error for missing notification ID', async () => {
      const userId = 'user_123';

      await expect(notificationService.deleteNotification(userId, null))
        .rejects
        .toThrow('User ID and notification ID are required');
    });
  });

  describe('getUserPreferences', () => {
    test('should get user notification preferences', async () => {
      const userId = 'user_123';

      const result = await notificationService.getUserPreferences(userId);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.channels).toBeDefined();
      expect(result.types).toBeDefined();
      expect(result.doNotDisturb).toBeDefined();
    });

    test('should throw an error for missing user ID', async () => {
      await expect(notificationService.getUserPreferences(null))
        .rejects
        .toThrow('User ID is required');
    });
  });

  describe('updateUserPreferences', () => {
    test('should update user notification preferences', async () => {
      const userId = 'user_123';
      const preferences = {
        channels: {
          [notificationService.channels.EMAIL]: true,
          [notificationService.channels.SMS]: false
        }
      };

      const result = await notificationService.updateUserPreferences(userId, preferences);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Notification preferences updated successfully');
      expect(result.preferences).toEqual(preferences);
    });

    test('should throw an error for missing user ID', async () => {
      const preferences = {
        channels: {
          [notificationService.channels.EMAIL]: true
        }
      };

      await expect(notificationService.updateUserPreferences(null, preferences))
        .rejects
        .toThrow('User ID and preferences are required');
    });

    test('should throw an error for missing preferences', async () => {
      const userId = 'user_123';

      await expect(notificationService.updateUserPreferences(userId, null))
        .rejects
        .toThrow('User ID and preferences are required');
    });
  });

  describe('sendEmailNotification', () => {
    test('should send email notification', async () => {
      const notification = {
        userId: 'user_123',
        title: 'Test Email',
        message: 'This is a test email'
      };

      const result = await notificationService.sendEmailNotification(notification);

      expect(result).toBeDefined();
      expect(result.messageId).toBeDefined();
      expect(result.to).toBeDefined();
      expect(result.status).toBe('sent');
    });
  });

  describe('sendSmsNotification', () => {
    test('should send SMS notification', async () => {
      const notification = {
        userId: 'user_123',
        title: 'Test SMS',
        message: 'This is a test SMS'
      };

      const result = await notificationService.sendSmsNotification(notification);

      expect(result).toBeDefined();
      expect(result.messageId).toBeDefined();
      expect(result.to).toBeDefined();
      expect(result.status).toBe('sent');
    });
  });

  describe('sendPushNotification', () => {
    test('should send push notification', async () => {
      const notification = {
        userId: 'user_123',
        title: 'Test Push',
        message: 'This is a test push notification'
      };

      const result = await notificationService.sendPushNotification(notification);

      expect(result).toBeDefined();
      expect(result.messageId).toBeDefined();
      expect(result.to).toBeDefined();
      expect(result.status).toBe('sent');
    });
  });

  describe('sendInAppNotification', () => {
    test('should send in-app notification', async () => {
      const notification = {
        userId: 'user_123',
        title: 'Test In-App',
        message: 'This is a test in-app notification'
      };

      const result = await notificationService.sendInAppNotification(notification);

      expect(result).toBeDefined();
      expect(result.notificationId).toBeDefined();
      expect(result.userId).toBe(notification.userId);
      expect(result.status).toBe('delivered');
    });
  });
});