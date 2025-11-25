# Public Listings API Integration

This document describes the integration of public listings API endpoints in the frontend.

## Service File

**Location:** `src/app/services/api/publicListingsService.js`

## Available Functions

### 1. `getHomepageListings(page, limit)`
Fetches listings for the homepage (newest first, no filters).

**Usage:**
```javascript
import { getHomepageListings } from "@/app/services/api/publicListingsService"

const result = await getHomepageListings(1, 20)
// result.data contains listings array
// result.pagination contains pagination info
```

**Used in:** `src/components/listing.jsx` (Homepage listings component)

---

### 2. `browseCategoryListings(categorySlugOrId, filters)`
Fetches category-specific listings with advanced filtering.

**Usage:**
```javascript
import { browseCategoryListings } from "@/app/services/api/publicListingsService"

const filters = {
  page: 1,
  limit: 20,
  search: "honda",
  sortBy: "price_asc",
  minPrice: 100000,
  maxPrice: 500000,
  brandId: 1,
  fuelType: "petrol",
  transmission: "automatic"
}

const result = await browseCategoryListings("cars", filters)
// or by ID: await browseCategoryListings(1, filters)
```

**Used in:** `src/components/CategoryListings.jsx`

**Available Filters:**
- Basic: `page`, `limit`, `search`, `sortBy`, `minPrice`, `maxPrice`, `stateId`, `cityId`, `isFeatured`
- Car-specific: `brandId`, `modelId`, `variantId`, `minYear`, `maxYear`, `condition`, `fuelType`, `transmission`, `bodyType`, `minMileage`, `maxMileage`, `ownersCount`
- Property-specific: `propertyType`, `listingType`, `bedrooms`, `bathrooms`, `minArea`, `maxArea`, `furnished`, `facing`, `parkingSpaces`

**Sort Options:**
- `date_desc` - Newest first (default)
- `date_asc` - Oldest first
- `price_asc` - Price low to high
- `price_desc` - Price high to low
- `views` - Most viewed first

---

### 3. `getFeaturedListings(limit, categoryId)`
Fetches only featured listings.

**Usage:**
```javascript
import { getFeaturedListings } from "@/app/services/api/publicListingsService"

const result = await getFeaturedListings(10)
// With category filter:
const carsFeatured = await getFeaturedListings(10, 1)
```

---

### 4. `getListingBySlug(slug)`
Fetches detailed information about a specific listing.

**Usage:**
```javascript
import { getListingBySlug } from "@/app/services/api/publicListingsService"

const result = await getListingBySlug("honda-city-vx-2020-a1b2c3")
// result.data contains full listing details with user, media, car/property data
```

**Used in:** `src/app/(root)/product-details/[slug]/page.jsx`

---

### 5. `incrementListingView(id)`
Increments the view count for a listing (call when user views details).

**Usage:**
```javascript
import { incrementListingView } from "@/app/services/api/publicListingsService"

await incrementListingView(123)
```

**Used in:** Product details page when listing is loaded

---

## Pages & Components

### Homepage Listings
**Component:** `src/components/listing.jsx`
- Displays latest listings using `getHomepageListings()`
- Shows 8 listings by default, expandable to 100
- Includes favorite functionality (client-side only)

### Category Page
**Page:** `src/app/(root)/category/[slug]/page.jsx`
**Component:** `src/components/CategoryListings.jsx`
- Dynamic route for category browsing
- Full filtering and search capabilities
- Pagination support
- Sort options
- Example URLs:
  - `/category/cars`
  - `/category/properties`
  - `/category/1` (by ID)

### Product Details Page
**Page:** `src/app/(root)/product-details/[slug]/page.jsx`
- Dynamic route for individual listings
- Fetches full listing details by slug
- Automatically increments view count
- Displays all listing information, media, and seller details
- Example URL: `/product-details/honda-city-vx-2020-a1b2c3`

---

## Response Format

All endpoints return a consistent format:

```javascript
{
  success: true,
  message: "Listings fetched successfully",
  data: [...], // Array of listings or single listing object
  pagination: {
    total: 150,
    page: 1,
    limit: 20,
    totalPages: 8
  }
}
```

### Listing Object Structure

```javascript
{
  id: 1,
  title: "Honda City VX 2020",
  slug: "honda-city-vx-2020-a1b2c3",
  description: "...",
  price: "650000.00",
  priceNegotiable: true,
  status: "active",
  isFeatured: true,
  viewCount: 245,
  createdAt: "2025-01-24T10:00:00.000Z",
  category: { id: 1, name: "Cars", slug: "cars" },
  state: { id: 5, name: "Karnataka", slug: "karnataka" },
  city: { id: 42, name: "Bangalore", slug: "bangalore" },
  media: [
    {
      id: 1,
      mediaUrl: "/uploads/listings/1/image1.jpg",
      thumbnailUrl: "/uploads/listings/1/thumb_image1.jpg",
      mediaType: "image",
      isPrimary: true
    }
  ],
  carListing: { // Only for car listings
    brand: { id: 1, name: "Honda" },
    model: { id: 5, name: "City" },
    year: 2020,
    mileageKm: 25000,
    fuelType: "petrol",
    transmission: "manual",
    // ... more car fields
  },
  user: { // Only in detail view
    id: 123,
    fullName: "John Doe",
    email: "john@example.com",
    mobile: "9876543210"
  }
}
```

---

## Helper Functions

The components include utility functions for formatting:

### `formatPrice(price)`
Formats price in Indian Rupees with proper formatting.

### `formatTimeAgo(dateString)`
Converts date to relative time (e.g., "2d", "3mo", "1y").

### `getImageUrl(listing)`
Extracts the primary or first image URL from listing media.

### `getLocation(listing)`
Builds location string from locality, city, and state.

---

## Error Handling

All service functions include try-catch blocks and log errors to console. Components display user-friendly error messages when API calls fail.

```javascript
try {
  const result = await getHomepageListings(1, 20)
  if (result.success) {
    // Handle success
  } else {
    // Handle API error
  }
} catch (error) {
  // Handle network/parsing error
}
```

---

## Next Steps

To extend functionality:

1. **Add more filters** - Update `CategoryListings.jsx` to include additional filter fields
2. **Implement favorites** - Connect favorite functionality to backend API
3. **Add infinite scroll** - Replace pagination with infinite scroll for better UX
4. **Search suggestions** - Add autocomplete for search input
5. **URL state management** - Sync filters with URL query params for shareable links

---

## API Documentation

For complete API documentation, see: `API-Docs/public-listings-api.md`
