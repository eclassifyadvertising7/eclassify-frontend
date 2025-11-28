/**
 * Data Request Service
 * Handles user data requests and admin management
 */

import httpClient from '../httpClient';

export const dataRequestService = {
  // ===== End User Endpoints =====
  
  // Create a new data request
  createRequest: async (requestData) => {
    return httpClient.post('/end-user/data-requests', requestData);
  },

  // Get user's own requests
  getMyRequests: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.requestType) params.append('requestType', filters.requestType);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const endpoint = `/end-user/data-requests${params.toString() ? `?${params.toString()}` : ''}`;
    return httpClient.get(endpoint);
  },

  // Get specific request by ID
  getRequestById: async (id) => {
    return httpClient.get(`/end-user/data-requests/${id}`);
  },

  // ===== Admin Panel Endpoints =====
  
  // Get all requests (admin)
  getAllRequests: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.requestType) params.append('requestType', filters.requestType);
    if (filters.search) params.append('search', filters.search);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const endpoint = `/panel/data-requests${params.toString() ? `?${params.toString()}` : ''}`;
    return httpClient.get(endpoint);
  },

  // Get request by ID (admin)
  getRequestByIdAdmin: async (id) => {
    return httpClient.get(`/panel/data-requests/${id}`);
  },

  // Approve request
  approveRequest: async (id, createData) => {
    return httpClient.patch(`/panel/data-requests/approve/${id}`, { createData });
  },

  // Reject request
  rejectRequest: async (id, rejectionReason) => {
    return httpClient.patch(`/panel/data-requests/reject/${id}`, { rejectionReason });
  },

  // Get statistics
  getStatistics: async () => {
    return httpClient.get('/panel/data-requests/statistics');
  },
};

export default dataRequestService;
