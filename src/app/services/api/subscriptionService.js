import httpClient from "@/app/services/httpClient";

/**
 * Subscription Service
 * Handles all subscription/pricing plan related API calls
 */

// ============================================
// END USER ENDPOINTS
// ============================================

/**
 * Get all available subscription plans (End User)
 * @returns {Promise<Array>} List of active subscription plans
 */
export const getPlans = async () => {
  try {
    const response = await httpClient.get("/end-user/subscriptions/plans");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
};

/**
 * Get details of a specific plan (End User)
 * @param {number|string} planId - The plan ID
 * @returns {Promise<Object>} Plan details
 */
export const getPlanDetails = async (planId) => {
  try {
    const response = await httpClient.get(`/end-user/subscriptions/plans/${planId}`);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching plan details for ID ${planId}:`, error);
    throw error;
  }
};

/**
 * Get all my subscriptions (End User)
 * @param {Object} filters - Optional filters (status, page, limit)
 * @returns {Promise<Object>} Response with subscriptions and pagination
 */
export const getMySubscriptions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    
    const endpoint = `/end-user/subscriptions${params.toString() ? `?${params.toString()}` : ""}`;
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error fetching my subscriptions:", error);
    throw error;
  }
};

/**
 * Get my subscription by ID (End User)
 * @param {number|string} subscriptionId - The subscription ID
 * @returns {Promise<Object>} Response with subscription details
 */
export const getMySubscriptionById = async (subscriptionId) => {
  try {
    return await httpClient.get(`/end-user/subscriptions/${subscriptionId}`);
  } catch (error) {
    console.error(`Error fetching subscription ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Get active subscription (End User)
 * @returns {Promise<Object>} Response with active subscription
 */
export const getActiveSubscription = async () => {
  try {
    return await httpClient.get("/end-user/subscriptions/active");
  } catch (error) {
    console.error("Error fetching active subscription:", error);
    throw error;
  }
};

/**
 * Get subscription history (End User)
 * @param {Object} pagination - Pagination options (page, limit)
 * @returns {Promise<Object>} Response with subscription history
 */
export const getSubscriptionHistory = async (pagination = {}) => {
  try {
    const params = new URLSearchParams();
    if (pagination.page) params.append("page", pagination.page);
    if (pagination.limit) params.append("limit", pagination.limit);
    
    const endpoint = `/end-user/subscriptions/history${params.toString() ? `?${params.toString()}` : ""}`;
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    throw error;
  }
};

/**
 * Cancel subscription (End User)
 * @param {number|string} subscriptionId - The subscription ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Response
 */
export const cancelSubscription = async (subscriptionId, reason) => {
  try {
    return await httpClient.post(`/end-user/subscriptions/${subscriptionId}/cancel`, { reason });
  } catch (error) {
    console.error(`Error cancelling subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Get all subscription plans (Admin)
 * @param {Object} filters - Optional filters (isActive, isPublic, planCode)
 * @returns {Promise<Object>} Response with plans data
 */
export const getAllPlans = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive);
    if (filters.isPublic !== undefined) params.append("isPublic", filters.isPublic);
    if (filters.planCode) params.append("planCode", filters.planCode);
    
    const endpoint = `/panel/subscription-plans${params.toString() ? `?${params.toString()}` : ""}`;
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error fetching all plans:", error);
    throw error;
  }
};

/**
 * Get plan by ID (Admin)
 * @param {number|string} planId - The plan ID
 * @returns {Promise<Object>} Response with plan details
 */
export const getPlanById = async (planId) => {
  try {
    return await httpClient.get(`/panel/subscription-plans/${planId}`);
  } catch (error) {
    console.error(`Error fetching plan by ID ${planId}:`, error);
    throw error;
  }
};

/**
 * Create subscription plan (Admin)
 * @param {Object} planData - Plan data
 * @returns {Promise<Object>} Response with created plan
 */
export const createPlan = async (planData) => {
  try {
    return await httpClient.post("/panel/subscription-plans", planData);
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

/**
 * Update subscription plan (Admin)
 * @param {number|string} planId - The plan ID
 * @param {Object} planData - Updated plan data
 * @returns {Promise<Object>} Response with updated plan
 */
export const updatePlan = async (planId, planData) => {
  try {
    return await httpClient.put(`/panel/subscription-plans/${planId}`, planData);
  } catch (error) {
    console.error(`Error updating plan ${planId}:`, error);
    throw error;
  }
};

/**
 * Delete subscription plan (Admin)
 * @param {number|string} planId - The plan ID
 * @returns {Promise<Object>} Response
 */
export const deletePlan = async (planId) => {
  try {
    return await httpClient.delete(`/panel/subscription-plans/${planId}`);
  } catch (error) {
    console.error(`Error deleting plan ${planId}:`, error);
    throw error;
  }
};

/**
 * Update plan status (Admin)
 * @param {number|string} planId - The plan ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<Object>} Response
 */
export const updatePlanStatus = async (planId, isActive) => {
  try {
    return await httpClient.patch(`/panel/subscription-plans/status/${planId}`, { isActive });
  } catch (error) {
    console.error(`Error updating plan status ${planId}:`, error);
    throw error;
  }
};

/**
 * Update plan visibility (Admin)
 * @param {number|string} planId - The plan ID
 * @param {boolean} isPublic - Public visibility
 * @returns {Promise<Object>} Response
 */
export const updatePlanVisibility = async (planId, isPublic) => {
  try {
    return await httpClient.patch(`/panel/subscription-plans/visibility/${planId}`, { isPublic });
  } catch (error) {
    console.error(`Error updating plan visibility ${planId}:`, error);
    throw error;
  }
};

/**
 * Get all user subscriptions (Admin)
 * @param {Object} filters - Optional filters (status, userId, planId, dateFrom, dateTo, page, limit)
 * @returns {Promise<Object>} Response with subscriptions and pagination
 */
export const getAllUserSubscriptions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.planId) params.append("planId", filters.planId);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    
    const endpoint = `/panel/subscriptions${params.toString() ? `?${params.toString()}` : ""}`;
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    throw error;
  }
};

/**
 * Get user subscription by ID (Admin)
 * @param {number|string} subscriptionId - The subscription ID
 * @returns {Promise<Object>} Response with subscription details
 */
export const getUserSubscriptionById = async (subscriptionId) => {
  try {
    return await httpClient.get(`/panel/subscriptions/${subscriptionId}`);
  } catch (error) {
    console.error(`Error fetching subscription ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Create subscription manually (Admin)
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<Object>} Response with created subscription
 */
export const createUserSubscription = async (subscriptionData) => {
  try {
    return await httpClient.post("/panel/subscriptions", subscriptionData);
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

/**
 * Update subscription (Admin)
 * @param {number|string} subscriptionId - The subscription ID
 * @param {Object} subscriptionData - Updated subscription data
 * @returns {Promise<Object>} Response with updated subscription
 */
export const updateUserSubscription = async (subscriptionId, subscriptionData) => {
  try {
    return await httpClient.put(`/panel/subscriptions/${subscriptionId}`, subscriptionData);
  } catch (error) {
    console.error(`Error updating subscription ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Delete subscription (Admin)
 * @param {number|string} subscriptionId - The subscription ID
 * @returns {Promise<Object>} Response
 */
export const deleteUserSubscription = async (subscriptionId) => {
  try {
    return await httpClient.delete(`/panel/subscriptions/${subscriptionId}`);
  } catch (error) {
    console.error(`Error deleting subscription ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Update subscription status (Admin)
 * @param {number|string} subscriptionId - The subscription ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Response
 */
export const updateUserSubscriptionStatus = async (subscriptionId, status) => {
  try {
    return await httpClient.patch(`/panel/subscriptions/status/${subscriptionId}`, { status });
  } catch (error) {
    console.error(`Error updating subscription status ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Extend subscription (Admin)
 * @param {number|string} subscriptionId - The subscription ID
 * @param {number} extensionDays - Number of days to extend
 * @returns {Promise<Object>} Response
 */
export const extendSubscription = async (subscriptionId, extensionDays) => {
  try {
    return await httpClient.post(`/panel/subscriptions/${subscriptionId}/extend`, { extensionDays });
  } catch (error) {
    console.error(`Error extending subscription ${subscriptionId}:`, error);
    throw error;
  }
};

const subscriptionService = {
  // End User - Plans
  getPlans,
  getPlanDetails,
  // End User - Subscriptions
  getMySubscriptions,
  getMySubscriptionById,
  getActiveSubscription,
  getSubscriptionHistory,
  cancelSubscription,
  // Admin - Plans
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  updatePlanStatus,
  updatePlanVisibility,
  // Admin - User Subscriptions
  getAllUserSubscriptions,
  getUserSubscriptionById,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
  updateUserSubscriptionStatus,
  extendSubscription,
};

export default subscriptionService;
