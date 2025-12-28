import httpClient from "@/app/services/httpClient";

export const getHomepageListings = async (page = 1, limit = 20, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    // Add filter parameters
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== "" && key !== 'page' && key !== 'limit') {
        params.append(key, value.toString());
      }
    });
    
    return await httpClient.get(
      `/public/listings/homepage?${params.toString()}`
    );
  } catch (error) {
    console.error("Error fetching homepage listings:", error);
    throw error;
  }
};

export const browseCategoryListings = async (
  categorySlugOrId,
  filters = {}
) => {
  try {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/public/listings/category/${categorySlugOrId}${
      queryString ? `?${queryString}` : ""
    }`;

    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error browsing category listings:", error);
    throw error;
  }
};

export const getFeaturedListings = async (limit = 10, categoryId = null) => {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (categoryId) {
      params.append("categoryId", categoryId.toString());
    }

    return await httpClient.get(
      `/public/listings/featured?${params.toString()}`
    );
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    throw error;
  }
};

export const getListingBySlug = async (slug) => {
  try {
    return await httpClient.get(`/public/listings/${slug}`);
  } catch (error) {
    console.error("Error fetching listing by slug:", error);
    throw error;
  }
};

export const incrementListingView = async (id) => {
  try {
    return await httpClient.post(`/public/listings/view/${id}`, {});
  } catch (error) {
    console.error("Error incrementing view count:", error);
    throw error;
  }
};

export const getRelatedListings = async (id, limit = 6) => {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    return await httpClient.get(
      `/public/listings/related/${id}?${params.toString()}`
    );
  } catch (error) {
    console.error("Error fetching related listings:", error);
    throw error;
  }
};

const publicListingsService = {
  getHomepageListings,
  browseCategoryListings,
  getFeaturedListings,
  getListingBySlug,
  incrementListingView,
  getRelatedListings,
};

export default publicListingsService;
