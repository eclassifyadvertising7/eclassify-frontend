# Admin Listings Integration - Quick Start Guide

## 🚀 Phase 2 Complete!

Admin panel integration for listings management is now fully implemented and ready to use.

## What's New

### ✅ Admin Service
- **File**: `src/app/services/api/listingAdminService.js`
- All Phase 2 API endpoints integrated
- Complete CRUD operations for admin

### ✅ Admin UI
- **Component**: `src/components/admin/ads-management.jsx`
- **Route**: `/admin/ads`
- Full-featured listings management interface

### ✅ Features Implemented
1. View all listings (all users)
2. Approve pending listings
3. Reject listings with reason
4. Manage featured listings
5. Delete listings
6. Filter and search
7. Pagination
8. Real-time statistics

## Quick Access

### Navigate to Admin Ads
1. Login as admin
2. Go to `/admin`
3. Click "Ads" in sidebar
4. You're at `/admin/ads`

## Common Tasks

### 1. Approve a Listing
```javascript
// In component
import { listingAdminService } from '@/app/services/api/listingAdminService'

const handleApprove = async (listingId) => {
  try {
    await listingAdminService.approveListing(listingId)
    toast.success('Listing approved')
  } catch (error) {
    toast.error(error.message)
  }
}
```

### 2. Reject a Listing
```javascript
const handleReject = async (listingId, reason) => {
  try {
    await listingAdminService.rejectListing(listingId, reason)
    toast.success('Listing rejected')
  } catch (error) {
    toast.error(error.message)
  }
}
```

### 3. Make Featured
```javascript
const handleFeatured = async (listingId, days = 7) => {
  try {
    await listingAdminService.updateFeaturedStatus(listingId, true, days)
    toast.success('Listing featured')
  } catch (error) {
    toast.error(error.message)
  }
}
```

### 4. Get All Listings
```javascript
const fetchListings = async () => {
  try {
    const response = await listingAdminService.getAllListings({
      status: 'pending',
      page: 1,
      limit: 20
    })
    setListings(response.data)
    setPagination(response.pagination)
  } catch (error) {
    console.error(error)
  }
}
```

### 5. Get Statistics
```javascript
const fetchStats = async () => {
  try {
    const response = await listingAdminService.getStats()
    setStats(response.data)
    // { total, draft, pending, active, expired, sold, rejected }
  } catch (error) {
    console.error(error)
  }
}
```

## UI Features

### Filters
- **Status**: Filter by draft, pending, active, expired, sold, rejected
- **Search**: Search in title and description
- **Pagination**: Navigate through pages

### Actions
- **Approve** (✓): Green checkmark - Approve pending listings
- **Reject** (✗): Red X - Reject with reason
- **Featured** (★): Star icon - Make/remove featured
- **Delete** (🗑️): Trash icon - Soft delete listing

### Status Badges
- **Draft**: Gray badge
- **Pending**: Yellow badge (needs approval)
- **Active**: Green badge (live)
- **Expired**: Orange badge
- **Sold**: Blue badge
- **Rejected**: Red badge

## Testing Workflow

### Test Approval Flow
1. **As User**: Create and submit a listing
2. **As Admin**: 
   - Go to `/admin/ads`
   - Filter by "Pending"
   - Click approve (✓)
   - Listing becomes active

### Test Rejection Flow
1. **As User**: Submit a listing
2. **As Admin**:
   - Go to `/admin/ads`
   - Filter by "Pending"
   - Click reject (✗)
   - Enter reason: "Images not clear"
   - Submit
3. **As User**: Check listing - see rejection reason

### Test Featured Flow
1. **As Admin**:
   - Go to `/admin/ads`
   - Filter by "Active"
   - Click star icon (★)
   - Set duration: 7 days
   - Submit
   - Listing shows yellow star

## API Endpoints

All Phase 2 endpoints are integrated:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/panel/listings` | Get all listings |
| GET | `/api/panel/listings/stats` | Get statistics |
| GET | `/api/panel/listings/:id` | Get listing details |
| PATCH | `/api/panel/listings/approve/:id` | Approve listing |
| PATCH | `/api/panel/listings/reject/:id` | Reject listing |
| PATCH | `/api/panel/listings/featured/:id` | Update featured |
| DELETE | `/api/panel/listings/:id` | Delete listing |

## File Structure

```
src/
├── app/
│   ├── (root)/
│   │   └── admin/
│   │       └── ads/
│   │           └── page.jsx          # Admin ads page
│   └── services/
│       └── api/
│           ├── listingAdminService.js    # Admin service
│           ├── examples/
│           │   └── listingAdminServiceExample.js
│           ├── ADMIN-QUICK-START.md      # This file
│           └── README-LISTINGS-ADMIN.md  # Full docs
└── components/
    └── admin/
        └── ads-management.jsx        # Admin UI component
```

## Next Steps

### Phase 3: Public Browsing (Coming Next)
- Browse active listings (public)
- Search and filters
- View listing details by slug
- Track view counts
- Featured listings carousel

## Support

For detailed documentation, see:
- **Full Docs**: `src/app/services/api/README-LISTINGS-ADMIN.md`
- **Examples**: `src/app/services/api/examples/listingAdminServiceExample.js`
- **API Docs**: `API-Docs/listings.md`

## Notes

- ✅ Admin role required
- ✅ All actions logged on backend
- ✅ Soft delete preserves data
- ✅ Toast notifications for all actions
- ✅ Loading states implemented
- ✅ Error handling included
- ✅ Responsive design
