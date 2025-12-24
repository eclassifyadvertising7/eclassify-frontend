import httpClient from "@/app/services/httpClient"

export const userAdminService = {
  getExternalUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams()
      if (filters.page) params.append('page', filters.page)
      if (filters.limit) params.append('limit', filters.limit)
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const endpoint = `/panel/users/list/external${params.toString() ? `?${params.toString()}` : ''}`
      return await httpClient.get(endpoint)
    } catch (error) {
      console.error('Error fetching external users:', error)
      throw error;
    }
  },

  getInternalUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams()
      if (filters.page) params.append('page', filters.page)
      if (filters.limit) params.append('limit', filters.limit)
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const endpoint = `/panel/users/list/internal${params.toString() ? `?${params.toString()}` : ''}`
      return await httpClient.get(endpoint)
    } catch (error) {
      console.error('Error fetching internal users:', error)
      throw error
    }
  },

  getUserDetails: async (userId) => {
    try {
      return await httpClient.get(`/panel/users/view/${userId}`)
    } catch (error) {
      console.error('Error fetching user details:', error)
      throw error
    }
  },

  toggleUserStatus: async (userId, isActive) => {
    try {
      return await httpClient.patch(`/panel/users/status/${userId}`, { isActive })
    } catch (error) {
      console.error('Error toggling user status:', error)
      throw error
    }
  },

  toggleAutoApprove: async (userId, isEnabled) => {
    try {
      return await httpClient.patch(`/panel/users/auto-approve/${userId}`, { isEnabled })
    } catch (error) {
      console.error('Error toggling auto-approve:', error)
      throw error
    }
  },

  updateKycStatus: async (userId, kycStatus) => {
    try {
      return await httpClient.patch(`/panel/users/kyc-status/${userId}`, { kycStatus })
    } catch (error) {
      console.error('Error updating KYC status:', error)
      throw error
    }
  },

  verifyUser: async (userId) => {
    try {
      return await httpClient.patch(`/panel/users/verify/${userId}`)
    } catch (error) {
      console.error('Error verifying user:', error)
      throw error
    }
  },

  deleteUser: async (userId) => {
    try {
      return await httpClient.delete(`/panel/users/delete/${userId}`)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  getUserStats: async () => {
    try {
      return await httpClient.get('/panel/users/statistics')
    } catch (error) {
      console.error('Error fetching user statistics:', error)
      throw error
    }
  },

  createInternalUser: async (userData) => {
    try {
      return await httpClient.post('/panel/users/create', userData)
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  updateUserSubscription: async (subscriptionId, subscriptionData) => {
    try {
      return await httpClient.patch(`/panel/subscriptions/${subscriptionId}`, subscriptionData)
    } catch (error) {
      console.error('Error updating user subscription:', error)
      throw error
    }
  }
}
