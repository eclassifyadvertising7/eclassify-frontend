/**
 * Subscription Service
 * Handles subscription plan management (Admin) and user subscriptions
 */

import httpClient from '../httpClient';

export const subscriptionService = {
  // ============ ADMIN - Plan Management ============
  
  // Get all subscription plans (admin)
  getAllPlans: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic);
    if (filters.planCode) params.append('planCode', filters.planCode);
    
    const query = params.toString();
    return httpClient.get(`/panel/subscription-plans${query ? `?${query}` : ''}`);
  },

  // Get plan by ID (admin)
  getPlanById: async (planId) => {
    return httpClient.get(`/panel/subscription-plans/${planId}`);
  },

  // Create subscription plan (admin)
  createPlan: async (planData) => {
    return httpClient.post('/panel/subscription-plans', planData);
  },

  // Update subscription plan (admin)
  updatePlan: async (planId, planData) => {
    return httpClient.put(`/panel/subscription-plans/${planId}`, planData);
  },

  // Delete subscription plan (admin)
  deletePlan: async (planId) => {
    return httpClient.delete(`/panel/subscription-plans/${planId}`);
  },

  // Update plan status (admin)
  updatePlanStatus: async (planId, isActive) => {
    return httpClient.patch(`/panel/subscription-plans/status/${planId}`, { isActive });
  },

  // Update plan visibility (admin)
  updatePlanVisibility: async (planId, isPublic) => {
    return httpClient.patch(`/panel/subscription-plans/visibility/${planId}`, { isPublic });
  },

  // ============ END USER - Subscriptions ============
  
  // Get available plans (end user)
  getAvailablePlans: async () => {
    return httpClient.get('/end-user/subscriptions/plans');
  },

  // Get plan details (end user)
  getPlanDetails: async (planId) => {
    return httpClient.get(`/end-user/subscriptions/plans/${planId}`);
  },

  // Subscribe to plan (end user)
  subscribeToPlan: async (subscriptionData) => {
    return httpClient.post('/end-user/subscriptions', subscriptionData);
  },

  // Get active subscription (end user)
  getActiveSubscription: async () => {
    return httpClient.get('/end-user/subscriptions/active');
  },

  // Get subscription history (end user)
  getSubscriptionHistory: async (page = 1, limit = 10) => {
    return httpClient.get(`/end-user/subscriptions/history?page=${page}&limit=${limit}`);
  },

  // Cancel subscription (end user)
  cancelSubscription: async (subscriptionId, reason) => {
    return httpClient.post(`/end-user/subscriptions/${subscriptionId}/cancel`, { reason });
  },
};

export default subscriptionService;
