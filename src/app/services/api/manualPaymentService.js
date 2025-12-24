import httpClient from "@/app/services/httpClient";

export const createManualPayment = async (formData) => {
  try {
    return await httpClient.upload("/manual-payments/create", formData);
  } catch (error) {
    console.error("Error creating manual payment:", error);
    throw error;
  }
};

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

export const getManualPaymentById = async (subscriptionId) => {
  try {
    return await httpClient.get(`/panel/manual-payments/view/${subscriptionId}`);
  } catch (error) {
    console.error(`Error fetching manual payment ${subscriptionId}:`, error);
    throw error;
  }
};

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

export const uploadQRCode = async (formData) => {
  try {
    return await httpClient.upload("/panel/manual-payments/qr-code", formData);
  } catch (error) {
    console.error("Error uploading QR code:", error);
    throw error;
  }
};

export const getQRCode = async () => {
  try {
    return await httpClient.get("/public/manual-payments/qr-code");
  } catch (error) {
    console.error("Error fetching QR code:", error);
    throw error;
  }
};

const manualPaymentService = {
  createManualPayment,
  getQRCode,
  getManualPayments,
  getManualPaymentById,
  verifyManualPayment,
  uploadQRCode,
};

export default manualPaymentService;
