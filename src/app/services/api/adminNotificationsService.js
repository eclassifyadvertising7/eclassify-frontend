import httpClient from '../httpClient';

/**
 * Admin Notifications Service
 * Handles admin notification management operations
 */

/**
 * Send broadcast notification to multiple users
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Broadcast result
 */
export const sendBroadcastNotification = async (notificationData) => {
  const response = await httpClient.post('/panel/notifications/broadcast', notificationData);
  return response.data;
};

/**
 * Send notification to a single user
 * @param {number} userId - User ID
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Notification result
 */
export const sendUserNotification = async (userId, notificationData) => {
  const response = await httpClient.post(`/panel/notifications/users/${userId}`, notificationData);
  return response.data;
};

/**
 * Get notification statistics
 * @param {number} days - Number of days (default: 30)
 * @returns {Promise<Object>} Notification statistics
 */
export const getNotificationStats = async (days = 30) => {
  const response = await httpClient.get(`/panel/notifications/stats?days=${days}`);
  return response.data;
};

/**
 * Get notifications for a specific user (admin view)
 * @param {number} userId - User ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} User notifications
 */
export const getUserNotifications = async (userId, params = {}) => {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 20,
    ...(params.status && { status: params.status }),
    ...(params.category && { category: params.category }),
    ...(params.isRead !== undefined && { isRead: params.isRead }),
    ...(params.includeExpired !== undefined && { includeExpired: params.includeExpired })
  });

  const response = await httpClient.get(`/panel/notifications/users/${userId}?${queryParams}`);
  return response.data;
};

/**
 * Process scheduled notifications manually
 * @returns {Promise<Object>} Processing result
 */
export const processScheduledNotifications = async () => {
  const response = await httpClient.post('/panel/notifications/process-scheduled');
  return response.data;
};

/**
 * Cleanup expired notifications
 * @param {number} olderThanDays - Delete notifications older than this many days
 * @returns {Promise<Object>} Cleanup result
 */
export const cleanupExpiredNotifications = async (olderThanDays = 180) => {
  const response = await httpClient.post('/panel/notifications/cleanup-expired', {
    olderThanDays
  });
  return response.data;
};
