# Listing Service - Quick Start Guide

## Import

```javascript
import listingService from '@/app/services/api/listingService';
```

## Common Operations

### 1. Create Listing

```javascript
// Car listing
const carListing = await listingService.createListing({
  categoryId: 1,
  categoryType: 'car',
  title: 'Toyota Camry 2020',
  description: 'Well maintained car...',
  price: 1500000,
  priceNegotiable: true,
  stateId: 1,
  cityId: 5,
  locality: 'Andheri West',
  brandId: 10,
  modelId: 45,
  variantId: 120,
  year: 2020,
  condition: 'used',
  mileageKm: 25000,
  fuelType: 'petrol',
  transmission: 'automatic'
});

// Property listing
const propertyListing = await listingService.createListing({
  categoryId: 2,
  categoryType: 'property',
  title: '3BHK Apartment',
  description: 'Spacious apartment...',
  price: 8500000,
  priceNegotiable: true,
  stateId: 1,
  cityId: 5,
  locality: 'Bandra West',
  propertyType: 'apartment',
  listingType: 'sale',
  bedrooms: 3,
  bathrooms: 2,
  areaSqft: 1200,
  furnished: 'semi-furnished'
});
```

### 2. Upload Media

```javascript
const formData = new FormData();
formData.append('media', imageFile1);
formData.append('media', imageFile2);
formData.append('media', videoFile);

await listingService.uploadMedia(listingId, formData);
```

### 3. Submit for Approval

```javascript
await listingService.submitForApproval(listingId);
```

### 4. Get My Listings

```javascript
// All listings
const all = await listingService.getMyListings();

// With filters
const active = await listingService.getMyListings({
  status: 'active',
  page: 1,
  limit: 10
});

// Search
const results = await listingService.getMyListings({
  search: 'Toyota',
  categoryId: 1
});
```

### 5. Update Listing

```javascript
await listingService.updateListing(listingId, {
  title: 'Updated Title',
  price: 1450000,
  description: 'Updated description...'
});
```

### 6. Mark as Sold

```javascript
await listingService.markAsSold(listingId);
```

### 7. Delete Listing

```javascript
await listingService.deleteListing(listingId);
```

### 8. Get Statistics

```javascript
const stats = await listingService.getMyStats();
// Returns: { total, draft, pending, active, expired, sold, rejected }
```

## React Hook Example

```javascript
import { useState, useEffect } from 'react';
import listingService from '@/app/services/api/listingService';

function useMyListings(filters = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadListings();
  }, [JSON.stringify(filters)]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await listingService.getMyListings(filters);
      setListings(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => loadListings();

  return { listings, loading, error, refresh };
}

// Usage in component
function MyListingsPage() {
  const { listings, loading, error, refresh } = useMyListings({
    status: 'active'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {listings.map(listing => (
        <div key={listing.id}>{listing.title}</div>
      ))}
    </div>
  );
}
```

## Complete Flow Example

```javascript
async function createAndPublishListing(data, files) {
  try {
    // 1. Create listing
    const listing = await listingService.createListing(data);
    const listingId = listing.data.id;

    // 2. Upload media
    const formData = new FormData();
    files.forEach(file => formData.append('media', file));
    await listingService.uploadMedia(listingId, formData);

    // 3. Submit for approval
    await listingService.submitForApproval(listingId);

    return { success: true, listingId };
  } catch (error) {
    console.error('Error:', error.message);
    return { success: false, error: error.message };
  }
}
```

## Filter Options

### Status Values
- `draft` - Not submitted
- `pending` - Awaiting approval
- `active` - Approved and live
- `expired` - Auto-expired
- `sold` - Marked as sold
- `rejected` - Rejected by admin

### Car ENUMs
- **condition**: `new`, `used`
- **fuelType**: `petrol`, `diesel`, `cng`, `lpg`, `electric`, `hybrid`
- **transmission**: `manual`, `automatic`, `cvt`, `semi-automatic`
- **bodyType**: `sedan`, `hatchback`, `suv`, `coupe`, `convertible`, `wagon`, `pickup`, `van`, `truck`

### Property ENUMs
- **propertyType**: `apartment`, `house`, `villa`, `plot`, `commercial`, `office`, `shop`, `warehouse`
- **listingType**: `sale`, `rent`, `pg`, `hostel`
- **furnished**: `unfurnished`, `semi-furnished`, `fully-furnished`
- **facing**: `north`, `south`, `east`, `west`, `north-east`, `north-west`, `south-east`, `south-west`

## Error Handling

```javascript
try {
  await listingService.createListing(data);
} catch (error) {
  if (error.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.status === 400) {
    // Validation error - show message
    console.error(error.message);
  } else {
    // Other errors
    console.error('Unexpected error:', error.message);
  }
}
```
