import httpClient from "../httpClient"

// Get all car brands
export const getCarBrands = async (search = "") => {
  try {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    const queryString = params.toString()
    const endpoint = `/public/car-brands${queryString ? `?${queryString}` : ""}`
    return await httpClient.get(endpoint)
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
    const params = new URLSearchParams({ brandId: brandId.toString() })
    if (search) params.append("search", search)
    const endpoint = `/public/car-models?${params.toString()}`
    return await httpClient.get(endpoint)
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
    const params = new URLSearchParams({ modelId: modelId.toString() })
    if (search) params.append("search", search)
    const endpoint = `/public/car-variants?${params.toString()}`
    return await httpClient.get(endpoint)
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
    return await httpClient.get(`/public/car-specifications/${variantId}`)
  } catch (error) {
    console.error("Error fetching car specifications:", error)
    throw error
  }
}
