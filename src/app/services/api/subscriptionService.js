import httpClient from "@/app/services/httpClient";

export const getPlans = async () => {
  try {
    const response = await httpClient.get("/public/subscription-plans");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
};

export const getPlansByCategory = async (categoryId) => {
  try {
    const response = await httpClient.get(`/public/subscription-plans/category/${categoryId}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching subscription plans for category ${categoryId}:`, error);
    throw error;
  }
};

export const getPlanDetails = async (planId) => {
  try {
    const response = await httpClient.get(`/public/subscription-plans/${planId}`);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching plan details for ID ${planId}:`, error);
    throw error;
  }
};

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

export const getMySubscriptionById = async (subscriptionId) => {
  try {
    return await httpClient.get(`/end-user/subscriptions/${subscriptionId}`);
  } catch (error) {
    console.error(`Error fetching subscription ${subscriptionId}:`, error);
    throw error;
  }
};

export const getActiveSubscription = async () => {
  try {
    return await httpClient.get("/end-user/subscriptions/active");
  } catch (error) {
    console.error("Error fetching active subscription:", error);
    throw error;
  }
};

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

export const cancelSubscription = async (subscriptionId, reason) => {
  try {
    return await httpClient.post(`/end-user/subscriptions/${subscriptionId}/cancel`, { reason });
  } catch (error) {
    console.error(`Error cancelling subscription ${subscriptionId}:`, error);
    throw error;
  }
};

export const getAllPlans = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive);
    if (filters.isPublic !== undefined) params.append("isPublic", filters.isPublic);
    if (filters.planCode) params.append("planCode", filters.planCode);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    
    const endpoint = `/panel/subscription-plans${params.toString() ? `?${params.toString()}` : ""}`;
    
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error fetching all plans:", error);
    throw error;
  }
};

export const getPlanById = async (planId) => {
  try {
    return await httpClient.get(`/panel/subscription-plans/${planId}`);
  } catch (error) {
    console.error(`Error fetching plan by ID ${planId}:`, error);
    throw error;
  }
};

export const createPlan = async (planData) => {
  try {
    return await httpClient.post("/panel/subscription-plans", planData);
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

export const updatePlan = async (planId, planData) => {
  try {
    return await httpClient.put(`/panel/subscription-plans/${planId}`, planData);
  } catch (error) {
    console.error(`Error updating plan ${planId}:`, error);
    throw error;
  }
};

export const deletePlan = async (planId) => {
  try {
    return await httpClient.delete(`/panel/subscription-plans/${planId}`);
  } catch (error) {
    console.error(`Error deleting plan ${planId}:`, error);
    throw error;
  }
};

export const updatePlanStatus = async (planId, isActive) => {
  try {
    return await httpClient.patch(`/panel/subscription-plans/status/${planId}`, { isActive });
  } catch (error) {
    console.error(`Error updating plan status ${planId}:`, error);
    throw error;
  }
};

export const updatePlanVisibility = async (planId, isPublic) => {
  try {
    return await httpClient.patch(`/panel/subscription-plans/visibility/${planId}`, { isPublic });
  } catch (error) {
    console.error(`Error updating plan visibility ${planId}:`, error);
    throw error;
  }
};

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

export const getUserSubscriptionById = async (subscriptionId) => {
  try {
    return await httpClient.get(`/panel/subscriptions/${subscriptionId}`);
  } catch (error) {
    console.error(`Error fetching subscription ${subscriptionId}:`, error);
    throw error;
  }
};

export const createUserSubscription = async (subscriptionData) => {
  try {
    return await httpClient.post("/panel/subscriptions", subscriptionData);
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

export const updateUserSubscription = async (subscriptionId, subscriptionData) => {
  try {
    return await httpClient.put(`/panel/subscriptions/${subscriptionId}`, subscriptionData);
  } catch (error) {
    console.error(`Error updating subscription ${subscriptionId}:`, error);
    throw error;
  }
};

export const deleteUserSubscription = async (subscriptionId) => {
  try {
    return await httpClient.delete(`/panel/subscriptions/${subscriptionId}`);
  } catch (error) {
    console.error(`Error deleting subscription ${subscriptionId}:`, error);
    throw error;
  }
};

export const updateUserSubscriptionStatus = async (subscriptionId, status) => {
  try {
    return await httpClient.patch(`/panel/subscriptions/status/${subscriptionId}`, { status });
  } catch (error) {
    console.error(`Error updating subscription status ${subscriptionId}:`, error);
    throw error;
  }
};

export const extendSubscription = async (subscriptionId, extensionDays) => {
  try {
    return await httpClient.post(`/panel/subscriptions/${subscriptionId}/extend`, { extensionDays });
  } catch (error) {
    console.error(`Error extending subscription ${subscriptionId}:`, error);
    throw error;
  }
};

const subscriptionService = {
  getPlans,
  getPlansByCategory,
  getPlanDetails,
  getMySubscriptions,
  getMySubscriptionById,
  getActiveSubscription,
  getSubscriptionHistory,
  cancelSubscription,
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  updatePlanStatus,
  updatePlanVisibility,
  getAllUserSubscriptions,
  getUserSubscriptionById,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
  updateUserSubscriptionStatus,
  extendSubscription,
};

export default subscriptionService;
