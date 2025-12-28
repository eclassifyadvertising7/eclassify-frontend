import httpClient from '../httpClient';

class NotificationsService {
  async getNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      const {
        page = 1,
        limit = 20,
        status,
        category,
        notificationType,
        isRead,
        startDate,
        endDate,
        includeExpired = false
      } = params;

      queryParams.append('page', page.toString());
      queryParams.append('limit', Math.min(limit, 100).toString());
      
      if (status) queryParams.append('status', status);
      if (category) queryParams.append('category', category);
      if (notificationType) queryParams.append('notificationType', notificationType);
      if (isRead !== undefined) queryParams.append('isRead', isRead.toString());
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (includeExpired) queryParams.append('includeExpired', includeExpired.toString());

      const response = await httpClient.get(`/end-user/notifications?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getNotification(id) {
    try {
      const response = await httpClient.get(`/end-user/notifications/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const response = await httpClient.get('/end-user/notifications/unread-count');
      return response;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  async markAsRead(id) {
    try {
      const response = await httpClient.patch(`/end-user/notifications/${id}/read`);
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markMultipleAsRead(notificationIds) {
    try {
      const response = await httpClient.patch('/end-user/notifications/mark-multiple-read', {
        notificationIds
      });
      return response;
    } catch (error) {
      console.error('Error marking multiple notifications as read:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await httpClient.patch('/end-user/notifications/mark-all-read');
      return response;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(id) {
    try {
      const response = await httpClient.delete(`/end-user/notifications/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async getStats(days = 30) {
    try {
      const response = await httpClient.get(`/end-user/notifications/stats?days=${days}`);
      return response;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  async getPreferences() {
    try {
      const response = await httpClient.get('/end-user/notifications/preferences');
      return response;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  async updatePreferences(preferences) {
    try {
      const response = await httpClient.put('/end-user/notifications/preferences', preferences);
      return response;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;
