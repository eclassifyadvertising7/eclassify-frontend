# Preferred Location API

## Overview
The Preferred Location API allows authenticated users to save and retrieve their preferred browsing location. This location is used for filtering search results and listings based on the user's area of interest.

## Endpoints

### 1. Get Preferred Location

Retrieve the user's saved preferred location.

**Endpoint:** `GET /api/profile/me/preferred-location`

**Authentication:** Required (JWT)

**Request:**
```http
GET /api/profile/me/preferred-location
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "preferredStateId": 1,
    "preferredStateName": "Maharashtra",
    "preferredCityId": 5,
    "preferredCityName": "Pune",
    "preferredLatitude": "18.5204",
    "preferredLongitude": "73.8567"
  }
}
```

### 2. Update Preferred Location

Update the user's preferred location.

**Endpoint:** `PUT /api/profile/me/preferred-location`

**Authentication:** Required (JWT)

**Request:**
```http
PUT /api/profile/me/preferred-location
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "preferredCityId": 5,
  "preferredCityName": "Pune",
  "preferredLatitude": 18.5204,
  "preferredLongitude": 73.8567
}
```

**Response:**
```json
{
  "success": true,
  "message": "Preferred location updated successfully",
  "data": {
    "preferredStateId": 1,
    "preferredStateName": "Maharashtra",
    "preferredCityId": 5,
    "preferredCityName": "Pune",
    "preferredLatitude": "18.5204",
    "preferredLongitude": "73.8567"
  }
}
```

## Frontend Implementation

### Location Flow

1. **On App Load (Authenticated Users):**
   - Load from localStorage (instant display)
   - Fetch from API in background
   - Update localStorage with API data if different

2. **On Location Change:**
   - Update localStorage immediately (instant feedback)
   - Sync with API in background (for authenticated users)

3. **Guest Users:**
   - Only use localStorage
   - No API calls

### Popular Cities Caching

Popular cities are cached in localStorage with a 24-hour expiration:

1. **First Load:**
   - Check localStorage for cached popular cities
   - If cache exists and is less than 24 hours old → Use cache (no API call)
   - If cache is missing or expired → Fetch from API and update cache

2. **Subsequent Loads:**
   - Use cached data (no API calls for 24 hours)

This reduces API calls significantly while keeping data reasonably fresh.

### Service Methods

```javascript
import profileService from '@/app/services/api/profileService'

// Get preferred location
const result = await profileService.getPreferredLocation()

// Update preferred location
const result = await profileService.updatePreferredLocation({
  preferredCityId: 5,
  preferredCityName: "Pune",
  preferredLatitude: 18.5204,
  preferredLongitude: 73.8567
})
```

### Context Usage

```javascript
import { useLocation } from '@/app/context/LocationContext'

function MyComponent() {
  const { 
    selectedLocation,
    updateLocation,
    clearLocation,
    getLocationDisplayName 
  } = useLocation()

  // Update location (automatically syncs with API if authenticated)
  const handleLocationSelect = (location) => {
    updateLocation({
      id: location.id,
      name: location.name,
      type: 'preferred',
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    })
  }

  return (
    <div>
      <p>Current Location: {getLocationDisplayName()}</p>
    </div>
  )
}
```

## Notes

- **State fields are optional:** The frontend only uses `cityId` and `cityName`
- **All fields are optional in PUT request:** Can update individual fields or all at once
- **Send null to clear a field**
- **Used for browsing preference:** Not the user's actual address
- **localStorage as cache:** Reduces API calls and provides instant UI updates
- **Automatic sync:** Changes are automatically synced to backend for authenticated users
