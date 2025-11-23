import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Get all car brands
export const getCarBrands = async (search = "") => {
  try {
    const params = search ? { search } : {}
    const response = await axios.get(`${API_BASE_URL}/api/public/car-brands`, { params })
    return response.data
  } catch (error) {
    console.error("Error fetching car brands:", error)
    throw error
  }
}

// Get car models by brand ID
export const getCarModels = async (brandId, search = "") => {
  try {
    if (!brandId) {
      throw new Error("Brand ID is required")
    }
    const params = { brandId, ...(search && { search }) }
    const response = await axios.get(`${API_BASE_URL}/api/public/car-models`, { params })
    return response.data
  } catch (error) {
    console.error("Error fetching car models:", error)
    throw error
  }
}

// Get car variants by model ID
export const getCarVariants = async (modelId, search = "") => {
  try {
    if (!modelId) {
      throw new Error("Model ID is required")
    }
    const params = { modelId, ...(search && { search }) }
    const response = await axios.get(`${API_BASE_URL}/api/public/car-variants`, { params })
    return response.data
  } catch (error) {
    console.error("Error fetching car variants:", error)
    throw error
  }
}

// Get car specifications by variant ID
export const getCarSpecifications = async (variantId) => {
  try {
    if (!variantId) {
      throw new Error("Variant ID is required")
    }
    const response = await axios.get(`${API_BASE_URL}/api/public/car-specifications/${variantId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching car specifications:", error)
    throw error
  }
}
