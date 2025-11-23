# Listings Service Implementation

## Phase 1: End-User Operations ✅ COMPLETED

**Status:** Fully implemented and integrated with UI (November 23, 2024)

The listing service has been implemented for end-user operations, allowing users to manage their own listings through both API service and UI forms.

### Files Implemented

**Service Layer:**
1. **`listingService.js`** - Main service file with all API methods
2. **`examples/listingServiceExample.js`** - Usage examples and patterns
3. **`LISTING-QUICK-START.md`** - Quick reference guide

**UI Components:**
1. **`src/components/car-form/page.jsx`** - Car listing form with full integration
2. **`src/components/property-form/page.jsx`** - Property listing form with full integration

### Available Methods

#### Listing Management
- `createListing(listingData)` - Create new listing (draft status)
- `getMyListings(filters)` - Get user's listings with filters
- `getMyListingById(listingId)` - Get specific listing details
- `updateListing(listingId, listingData)` - Update listing (draft/rejected only)
- `deleteListing(listingId)` - Soft delete listing

#### Listing Actions
- `submitForApproval(listingId)` - Submit listing for admin approval
- `markAsSold(listingId)` - Mark listing as sold

#### Media Management
- `uploadMedia(listingId, formData)` - Upload images/videos
- `deleteMedia(listingId, mediaId)` - Delete specific media

#### Statistics
- `getMyStats()` - Get user's listing statistics

### Usage Example

```javascript
import listingService from '@/app/services/api/listingService';

// Create a car listing
const carData = {
  categoryId: 1,
  categoryType: 'car',
  title: 'Toyota Camry 2020',
  price: 1500000,
  // ... other fields
};

const listing = await listingService.createListing(carData);

// Upload media
const formData = new FormData();
formData.append('media', imageFile1);
formData.append('media', imageFile2);
await listingService.uploadMedia(listing.data.id, formData);

// Submit for approval
await listingService.submitForApproval(listing.data.id);
```

### Listing Types Supported

#### Car Listings
Required fields:
- `categoryType: 'car'`
- `brandId`, `modelId`, `variantId`
- `year`, `condition`, `fuelType`, `transmission`
- `mileageKm`, `ownersCount`

#### Property Listings
Required fields:
- `categoryType: 'property'`
- `propertyType`, `listingType`
- `bedrooms`, `bathrooms`, `areaSqft`
- `furnished`, `facing`

### Status Flow

```
draft → pending → active → expired/sold
              ↓
          rejected
```

### Media Limits

- **Images**: Max 15 per listing, 5MB each (JPEG, PNG, WebP)
- **Videos**: Max 3 per listing, 50MB each (MP4, MOV, AVI)

### Error Handling

All methods return promises and should be wrapped in try-catch:

```javascript
try {
  const response = await listingService.createListing(data);
  console.log('Success:', response.data);
} catch (error) {
  console.error('Error:', error.message);
  // Handle error (show toast, etc.)
}
```

### Next Steps

See `examples/listingServiceExample.js` for complete usage examples including:
- Creating car and property listings
- Complete listing flow (create → upload → submit)
- Filtering and searching
- React component integration

## Phase 2: Admin Panel Operations (Pending)

Will include:
- Approve/reject listings
- Manage all listings
- Featured listings management
- Admin statistics

## Phase 3: Public Browsing (Pending)

Will include:
- Browse active listings
- Search and filters
- View listing details
- Track views
