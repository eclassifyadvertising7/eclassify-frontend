import httpClient from "@/app/services/httpClient";

export const getMyInvoices = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    
    const endpoint = `/end-user/invoices${params.toString() ? `?${params.toString()}` : ""}`;
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (invoiceId) => {
  try {
    return await httpClient.get(`/end-user/invoices/${invoiceId}`);
  } catch (error) {
    console.error(`Error fetching invoice ${invoiceId}:`, error);
    throw error;
  }
};

export const downloadInvoice = async (invoiceId) => {
  try {
    return await httpClient.get(`/end-user/invoices/${invoiceId}/download`);
  } catch (error) {
    console.error(`Error downloading invoice ${invoiceId}:`, error);
    throw error;
  }
};

const invoiceService = {
  getMyInvoices,
  getInvoiceById,
  downloadInvoice,
};

export default invoiceService;
