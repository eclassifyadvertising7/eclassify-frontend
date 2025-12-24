import httpClient from '../httpClient';

export const dataRequestService = {
  createRequest: async (requestData) => {
    return httpClient.post('/end-user/data-requests', requestData);
  },

  getMyRequests: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.requestType) params.append('requestType', filters.requestType);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const endpoint = `/end-user/data-requests${params.toString() ? `?${params.toString()}` : ''}`;
    return httpClient.get(endpoint);
  },

  getRequestById: async (id) => {
    return httpClient.get(`/end-user/data-requests/${id}`);
  },

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

  getRequestByIdAdmin: async (id) => {
    return httpClient.get(`/panel/data-requests/${id}`);
  },

  approveRequest: async (id, createData) => {
    return httpClient.patch(`/panel/data-requests/approve/${id}`, { createData });
  },

  rejectRequest: async (id, rejectionReason) => {
    return httpClient.patch(`/panel/data-requests/reject/${id}`, { rejectionReason });
  },

  getStatistics: async () => {
    return httpClient.get('/panel/data-requests/statistics');
  },
};

export default dataRequestService;
