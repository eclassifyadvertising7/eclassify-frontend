import httpClient from "@/app/services/httpClient";

/**
 * Manual Payment Service
 * Handles manual payment verification for subscriptions
 * ⚠️ TEMPORARY - Remove when payment gateway is implemented
 */

// ============================================
// END USER ENDPOINTS
// ============================================

/**
 * Create manual payment subscription (End User)
 * @param {FormData} formData - Form data with planId, upiId, transactionId, paymentProof (optional)
 * @returns {Promise<Object>} Response with created subscription
 */
export const createManualPayment = async (formData) => {
  try {
    return await httpClient.upload("/manual-payments/create", formData);
  } catch (error) {
    console.error("Error creating manual payment:", error);
    throw error;
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Get all manual payment subscriptions (Admin)
 * @param {Object} filters - Optional filters (status, dateFrom, dateTo, search, userId, planId, page, limit)
 * @returns {Promise<Object>} Response with subscriptions and pagination
 */
export const getManualPayments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.search) params.append("search", filters.search);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.planId) params.append("planId", filters.planId);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    
    const endpoint = `/panel/manual-payments/list${params.toString() ? `?${params.toString()}` : ""}`;
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error fetching manual payments:", error);
    throw error;
  }
};

/**
 * Get single manual payment subscription (Admin)
 * @param {number|string} subscriptionId - The subscription ID
 * @returns {Promise<Object>} Response with subscription details
 */
export const getManualPaymentById = async (subscriptionId) => {
  try {
    return await httpClient.get(`/panel/manual-payments/view/${subscriptionId}`);
  } catch (error) {
    console.error(`Error fetching manual payment ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Verify or reject manual payment (Admin)
 * @param {number|string} subscriptionId - The subscription ID
 * @param {boolean} approved - true to approve, false to reject
 * @param {string} notes - Verification notes (optional)
 * @returns {Promise<Object>} Response
 */
export const verifyManualPayment = async (subscriptionId, approved, notes = "") => {
  try {
    return await httpClient.post(`/panel/manual-payments/verify/${subscriptionId}`, {
      approved,
      notes
    });
  } catch (error) {
    console.error(`Error verifying manual payment ${subscriptionId}:`, error);
    throw error;
  }
};

/**
 * Upload QR code (Admin)
 * @param {FormData} formData - Form data with qrCode file and caption (UPI ID)
 * @returns {Promise<Object>} Response
 */
export const uploadQRCode = async (formData) => {
  try {
    return await httpClient.upload("/panel/manual-payments/qr-code", formData);
  } catch (error) {
    console.error("Error uploading QR code:", error);
    throw error;
  }
};

/**
 * Get QR code (Public)
 * @returns {Promise<Object>} Response with QR code data
 */
export const getQRCode = async () => {
  try {
    return await httpClient.get("/public/manual-payments/qr-code");
  } catch (error) {
    console.error("Error fetching QR code:", error);
    throw error;
  }
};

const manualPaymentService = {
  // End User
  createManualPayment,
  getQRCode,
  // Admin
  getManualPayments,
  getManualPaymentById,
  verifyManualPayment,
  uploadQRCode,
};

export default manualPaymentService;
