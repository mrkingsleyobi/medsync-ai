/**
 * Notification Controller
 * Controller for handling notification requests
 */

const NotificationService = require('../services/notification.service.js');

class NotificationController {
  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Send notification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendNotification(req, res) {
    try {
      const { userId, type, title, message, priority, channels, data, scheduledFor } = req.body;

      // Validate required fields
      if (!userId || !type || !title || !message) {
        return res.status(400).json({
          error: 'User ID, type, title, and message are required'
        });
      }

      // Create notification object
      const notification = {
        userId,
        type,
        title,
        message,
        priority,
        channels,
        data,
        scheduledFor
      };

      // If scheduledFor is provided, schedule the notification
      if (scheduledFor) {
        const result = await this.notificationService.scheduleNotification(notification, scheduledFor);
        return res.status(200).json({
          success: true,
          message: result.message,
          scheduledNotification: result.scheduledNotification
        });
      }

      // Send notification immediately
      const result = await this.notificationService.sendNotification(notification);

      // Return notification result
      res.status(200).json({
        success: true,
        message: 'Notification sent successfully',
        notificationId: result.notificationId,
        results: result.results
      });
    } catch (error) {
      if (this.notificationService && this.notificationService.logger) {
        this.notificationService.logger.error('Send notification controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to send notification',
        message: error.message
      });
    }
  }

  /**
   * Get user notifications
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated
      const { type, read, priority, startDate, endDate } = req.query;

      // Create filters object
      const filters = {};
      if (type) filters.type = type;
      if (read !== undefined) filters.read = read === 'true';
      if (priority) filters.priority = priority;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      // Get user notifications
      const notifications = await this.notificationService.getUserNotifications(userId, filters);

      // Return notifications
      res.status(200).json({
        success: true,
        count: notifications.length,
        notifications: notifications
      });
    } catch (error) {
      if (this.notificationService && this.notificationService.logger) {
        this.notificationService.logger.error('Get user notifications controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve notifications',
        message: error.message
      });
    }
  }

  /**
   * Mark notification as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async markAsRead(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated
      const { notificationId } = req.params;

      // Validate required fields
      if (!notificationId) {
        return res.status(400).json({
          error: 'Notification ID is required'
        });
      }

      // Mark notification as read
      const result = await this.notificationService.markAsRead(userId, notificationId);

      // Return result
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      if (this.notificationService && this.notificationService.logger) {
        this.notificationService.logger.error('Mark as read controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to mark notification as read',
        message: error.message
      });
    }
  }

  /**
   * Delete notification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteNotification(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated
      const { notificationId } = req.params;

      // Validate required fields
      if (!notificationId) {
        return res.status(400).json({
          error: 'Notification ID is required'
        });
      }

      // Delete notification
      const result = await this.notificationService.deleteNotification(userId, notificationId);

      // Return result
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      if (this.notificationService && this.notificationService.logger) {
        this.notificationService.logger.error('Delete notification controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to delete notification',
        message: error.message
      });
    }
  }

  /**
   * Get user notification preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserPreferences(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated

      // Get user preferences
      const preferences = await this.notificationService.getUserPreferences(userId);

      // Return preferences
      res.status(200).json({
        success: true,
        preferences: preferences
      });
    } catch (error) {
      if (this.notificationService && this.notificationService.logger) {
        this.notificationService.logger.error('Get user preferences controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve notification preferences',
        message: error.message
      });
    }
  }

  /**
   * Update user notification preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserPreferences(req, res) {
    try {
      const userId = req.user.userId; // Assuming user is authenticated
      const { preferences } = req.body;

      // Validate required fields
      if (!preferences) {
        return res.status(400).json({
          error: 'Preferences are required'
        });
      }

      // Update user preferences
      const result = await this.notificationService.updateUserPreferences(userId, preferences);

      // Return result
      res.status(200).json({
        success: true,
        message: result.message,
        preferences: result.preferences
      });
    } catch (error) {
      if (this.notificationService && this.notificationService.logger) {
        this.notificationService.logger.error('Update user preferences controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to update notification preferences',
        message: error.message
      });
    }
  }

  /**
   * Send appointment reminder
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendAppointmentReminder(req, res) {
    try {
      const { userId, appointmentDetails, reminderTime } = req.body;

      // Validate required fields
      if (!userId || !appointmentDetails) {
        return res.status(400).json({
          error: 'User ID and appointment details are required'
        });
      }

      // Create appointment reminder notification
      const notification = {
        userId: userId,
        type: this.notificationService.types.APPOINTMENT_REMINDER,
        title: 'Appointment Reminder',
        message: `You have an appointment with ${appointmentDetails.doctor} on ${appointmentDetails.date} at ${appointmentDetails.time}`,
        priority: this.notificationService.priorities.NORMAL,
        data: {
          appointmentId: appointmentDetails.id,
          doctor: appointmentDetails.doctor,
          date: appointmentDetails.date,
          time: appointmentDetails.time,
          location: appointmentDetails.location
        }
      };

      // If reminderTime is provided, schedule the notification
      if (reminderTime) {
        const result = await this.notificationService.scheduleNotification(notification, reminderTime);
        return res.status(200).json({
          success: true,
          message: result.message,
          scheduledNotification: result.scheduledNotification
        });
      }

      // Send notification immediately
      const result = await this.notificationService.sendNotification(notification);

      // Return notification result
      res.status(200).json({
        success: true,
        message: 'Appointment reminder sent successfully',
        notificationId: result.notificationId,
        results: result.results
      });
    } catch (error) {
      if (this.notificationService && this.notificationService.logger) {
        this.notificationService.logger.error('Send appointment reminder controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to send appointment reminder',
        message: error.message
      });
    }
  }

  /**
   * Send medication reminder
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendMedicationReminder(req, res) {
    try {
      const { userId, medicationDetails, reminderTime } = req.body;

      // Validate required fields
      if (!userId || !medicationDetails) {
        return res.status(400).json({
          error: 'User ID and medication details are required'
        });
      }

      // Create medication reminder notification
      const notification = {
        userId: userId,
        type: this.notificationService.types.MEDICATION_REMINDER,
        title: 'Medication Reminder',
        message: `It's time to take your ${medicationDetails.name} (${medicationDetails.dosage})`,
        priority: this.notificationService.priorities.HIGH,
        data: {
          medicationId: medicationDetails.id,
          name: medicationDetails.name,
          dosage: medicationDetails.dosage,
          instructions: medicationDetails.instructions
        }
      };

      // If reminderTime is provided, schedule the notification
      if (reminderTime) {
        const result = await this.notificationService.scheduleNotification(notification, reminderTime);
        return res.status(200).json({
          success: true,
          message: result.message,
          scheduledNotification: result.scheduledNotification
        });
      }

      // Send notification immediately
      const result = await this.notificationService.sendNotification(notification);

      // Return notification result
      res.status(200).json({
        success: true,
        message: 'Medication reminder sent successfully',
        notificationId: result.notificationId,
        results: result.results
      });
    } catch (error) {
      if (this.notificationService && this.notificationService.logger) {
        this.notificationService.logger.error('Send medication reminder controller error', {
          error: error.message,
          stack: error.stack
        });
      }

      res.status(500).json({
        error: 'Failed to send medication reminder',
        message: error.message
      });
    }
  }
}

module.exports = NotificationController;