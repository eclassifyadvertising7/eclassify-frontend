import httpClient from "../httpClient"

// ============ BRANDS ============

export const getAllBrands = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.search) params.append("search", filters.search)
  if (filters.isActive !== undefined) params.append("isActive", filters.isActive)
  if (filters.isPopular !== undefined) params.append("isPopular", filters.isPopular)
  const queryString = params.toString()
  return httpClient.get(`/panel/car-brands${queryString ? `?${queryString}` : ""}`)
}

export const getBrandById = async (id) => {
  return httpClient.get(`/panel/car-brands/${id}`)
}

export const createBrand = async (data) => {
  return httpClient.post("/panel/car-brands", data)
}

export const updateBrand = async (id, data) => {
  return httpClient.put(`/panel/car-brands/${id}`, data)
}

export const deleteBrand = async (id) => {
  return httpClient.delete(`/panel/car-brands/${id}`)
}

// ============ MODELS ============

export const getAllModels = async (brandId = "", search = "") => {
  const params = new URLSearchParams()
  if (brandId) params.append("brandId", brandId)
  if (search) params.append("search", search)
  const queryString = params.toString()
  return httpClient.get(`/panel/car-models${queryString ? `?${queryString}` : ""}`)
}

export const getModelById = async (id) => {
  return httpClient.get(`/panel/car-models/${id}`)
}

export const createModel = async (data) => {
  return httpClient.post("/panel/car-models", data)
}

export const updateModel = async (id, data) => {
  return httpClient.put(`/panel/car-models/${id}`, data)
}

export const deleteModel = async (id) => {
  return httpClient.delete(`/panel/car-models/${id}`)
}

// ============ VARIANTS ============

export const getAllVariants = async (modelId = "", search = "") => {
  const params = new URLSearchParams()
  if (modelId) params.append("modelId", modelId)
  if (search) params.append("search", search)
  const queryString = params.toString()
  return httpClient.get(`/panel/car-variants${queryString ? `?${queryString}` : ""}`)
}

export const getVariantById = async (id) => {
  return httpClient.get(`/panel/car-variants/${id}`)
}

export const createVariant = async (data) => {
  return httpClient.post("/panel/car-variants", data)
}

export const updateVariant = async (id, data) => {
  return httpClient.put(`/panel/car-variants/${id}`, data)
}

export const deleteVariant = async (id) => {
  return httpClient.delete(`/panel/car-variants/${id}`)
}
