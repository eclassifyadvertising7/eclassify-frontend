import httpClient from "@/app/services/httpClient";

/**
 * Transaction Service
 * Handles all transaction related API calls for end users
 */

/**
 * Get all user transactions
 * @param {Object} filters - Optional filters (status, transactionType, startDate, endDate, page, limit)
 * @returns {Promise<Object>} Response with transactions and pagination
 */
export const getMyTransactions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.transactionType) params.append("transactionType", filters.transactionType);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    
    const endpoint = `/end-user/transactions${params.toString() ? `?${params.toString()}` : ""}`;
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

/**
 * Get transaction by ID
 * @param {number|string} transactionId - The transaction ID
 * @returns {Promise<Object>} Response with transaction details
 */
export const getTransactionById = async (transactionId) => {
  try {
    return await httpClient.get(`/end-user/transactions/${transactionId}`);
  } catch (error) {
    console.error(`Error fetching transaction ${transactionId}:`, error);
    throw error;
  }
};

const transactionService = {
  getMyTransactions,
  getTransactionById,
};

export default transactionService;
