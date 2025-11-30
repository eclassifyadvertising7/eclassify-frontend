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

const subscriptionService = {
  // End User
  getPlans,
  getPlanDetails,
  // Admin
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  updatePlanStatus,
  updatePlanVisibility,
};

export default subscriptionService;
