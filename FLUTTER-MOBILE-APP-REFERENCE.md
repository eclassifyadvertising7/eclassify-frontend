# Flutter Mobile App Reference Document
# E-Classify - Classified Ads Marketplace

## Table of Contents
1. [Project Overview](#project-overview)
2. [Application Architecture](#application-architecture)
3. [User Flow & Navigation](#user-flow--navigation)
4. [Complete Screen List](#complete-screen-list)
5. [Screen Details & Relationships](#screen-details--relationships)
6. [API Integration Guide](#api-integration-guide)
7. [State Management](#state-management)
8. [Authentication Flow](#authentication-flow)
9. [Key Features Implementation](#key-features-implementation)
10. [Technical Stack Recommendations](#technical-stack-recommendations)

---

## 1. Project Overview

### What is E-Classify?
E-Classify is a comprehensive classified ads marketplace platform that allows users to buy and sell items across multiple categories, primarily focusing on:
- **Cars** - New and used vehicles with detailed specifications
- **Properties** - Apartments, houses, commercial spaces for sale/rent

### Core Functionality
- User registration and authentication (Mobile OTP-based)
- Create, manage, and browse listings
- Advanced search and filtering
- Favorites/Wishlist management
- Subscription plans for premium features
- Admin panel for content moderation
- Real-time chat between buyers and sellers
- Location-based search
- Payment integration for subscriptions

### Target Users
1. **End Users** - Buyers and sellers of classified items
2. **Admins** - Platform administrators for content moderation
3. **Super Admins** - Full system management access


---

## 2. Application Architecture

### Architecture Pattern
**Recommended:** Clean Architecture with BLoC/Cubit for state management

```
lib/
├── core/
│   ├── constants/
│   ├── theme/
│   ├── utils/
│   └── network/
├── data/
│   ├── models/
│   ├── repositories/
│   └── data_sources/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── use_cases/
├── presentation/
│   ├── screens/
│   ├── widgets/
│   └── bloc/
└── main.dart
```

### Backend Integration
- **Base URL:** `http://localhost:5000/api` (Development)
- **Authentication:** JWT Bearer Token
- **Response Format:** JSON with standard structure:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { /* response data */ }
}
```


---

## 3. User Flow & Navigation

### Primary User Journeys

#### Journey 1: New User Registration & First Listing
```
Splash Screen → Onboarding → Sign Up (OTP) → Complete Profile → 
Home → Create Listing → Select Category → Fill Details → 
Upload Photos → Submit for Approval → My Listings
```

#### Journey 2: Browse & Purchase Flow
```
Home → Browse Categories → Search/Filter → Listing Details → 
Add to Favorites → Contact Seller (Chat) → Complete Transaction
```

#### Journey 3: Subscription Purchase
```
Home → Profile → Pricing Plans → Select Plan → Payment → 
Active Subscription → Enhanced Features Unlocked
```

#### Journey 4: Admin Moderation
```
Admin Login → Dashboard → Pending Listings → Review Listing → 
Approve/Reject → Notifications Sent
```

### Navigation Structure
```
Bottom Navigation (Main App):
├── Home (Feed)
├── Search
├── Create Listing (+)
├── Favorites
└── Profile

Drawer/Side Menu:
├── My Listings
├── Subscriptions
├── Transactions
├── Chats
├── Settings
└── Logout
```


---

## 4. Complete Screen List

### Authentication Screens (6)
1. **Splash Screen** - App initialization and branding
2. **Onboarding Screen** - Feature introduction (3-4 slides)
3. **Sign In Screen** - Mobile number + OTP login
4. **Sign Up Screen** - Mobile number + OTP registration
5. **OTP Verification Screen** - 6-digit OTP input
6. **Complete Profile Screen** - Additional user details

### Main App Screens (25)

#### Home & Discovery (5)
7. **Home Screen** - Featured listings, categories, recent ads
8. **Category Listings Screen** - All listings in a category
9. **Search Screen** - Search with filters
10. **Search Results Screen** - Filtered listing results
11. **Listing Details Screen** - Full listing information

#### Listing Management (6)
12. **Create Listing Screen** - Category selection
13. **Car Listing Form** - Car-specific fields
14. **Property Listing Form** - Property-specific fields
15. **Upload Media Screen** - Image/video upload
16. **My Listings Screen** - User's all listings
17. **Edit Listing Screen** - Update existing listing

#### User Profile (5)
18. **Profile Screen** - User information and stats
19. **Edit Profile Screen** - Update personal details
20. **Business/KYC Screen** - Business information
21. **Favorites Screen** - Saved listings
22. **Search History Screen** - Recent searches

#### Subscriptions & Billing (4)
23. **Pricing Plans Screen** - Available subscription plans
24. **Subscription Details Screen** - Plan features
25. **Active Subscription Screen** - Current subscription info
26. **Transaction History Screen** - Payment history

#### Communication (2)
27. **Chats List Screen** - All conversations
28. **Chat Screen** - Individual conversation

#### Settings & Support (3)
29. **Settings Screen** - App preferences
30. **About Screen** - App information
31. **Contact Support Screen** - Help and support


### Admin Screens (12)
32. **Admin Login Screen** - Admin authentication
33. **Admin Dashboard** - Statistics and overview
34. **Manage Users Screen** - User list and management
35. **User Details Screen** - Individual user info
36. **Manage Listings Screen** - All listings with filters
37. **Listing Approval Screen** - Approve/reject listings
38. **Manage Categories Screen** - Category CRUD
39. **Manage Subscriptions Screen** - Plan management
40. **User Subscriptions Screen** - Assign/manage user plans
41. **Transactions Screen** - Payment records
42. **Reports Screen** - Analytics and reports
43. **Settings Screen** - Admin settings

**Total Screens: 43**


---

## 5. Screen Details & Relationships

### 5.1 Authentication Flow Screens

#### Screen 1: Splash Screen
**Purpose:** App initialization, check authentication status
**Components:**
- App logo and branding
- Loading indicator
- Version number

**Logic:**
- Check if user is logged in (JWT token exists)
- If logged in → Navigate to Home
- If not logged in → Navigate to Onboarding/Sign In

**API Calls:** None

---

#### Screen 2: Onboarding Screen
**Purpose:** Introduce app features to new users
**Components:**
- 3-4 slides with illustrations
- Skip button
- Next/Get Started button
- Page indicators

**Features:**
- Swipeable slides
- Auto-advance option
- Skip to Sign In

**Navigation:**
- Skip/Get Started → Sign In Screen

---

#### Screen 3: Sign In Screen
**Purpose:** User login with mobile number
**Components:**
- Country code selector (+91)
- Mobile number input (10 digits)
- Continue button
- "Don't have account? Sign Up" link

**Validation:**
- Mobile number: 10 digits, numeric only
- Country code: Required

**API Endpoint:** `POST /api/auth/login`
**Request:**
```json
{
  "mobile": "9876543210",
  "password": "temp_password"
}
```

**Navigation:**
- Success → OTP Verification Screen
- New user → Sign Up Screen

---

#### Screen 4: Sign Up Screen
**Purpose:** New user registration
**Components:**
- Full name input
- Country code selector
- Mobile number input
- Continue button
- "Already have account? Sign In" link

**Validation:**
- Full name: Min 2 characters
- Mobile: 10 digits, unique
- Country code: Required

**API Endpoint:** `POST /api/auth/signup`
**Request:**
```json
{
  "fullName": "John Doe",
  "mobile": "9876543210",
  "password": "auto_generated",
  "countryCode": "+91"
}
```

**Navigation:**
- Success → OTP Verification Screen

---

#### Screen 5: OTP Verification Screen
**Purpose:** Verify mobile number with OTP
**Components:**
- 6-digit OTP input boxes
- Resend OTP button (with timer)
- Verify button
- Edit mobile number link

**Features:**
- Auto-focus next box
- Auto-submit on 6 digits
- Resend timer (60 seconds)
- Auto-read OTP (SMS)

**API Endpoint:** `POST /api/auth/verify-otp`
**Request:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "tokens": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    }
  }
}
```

**Navigation:**
- Success → Complete Profile Screen (new user) or Home (existing)

---

#### Screen 6: Complete Profile Screen
**Purpose:** Collect additional user information
**Components:**
- Profile photo upload
- Email input (optional)
- Date of birth picker
- Gender selector
- Address fields
- State/City dropdowns
- Save button

**API Endpoint:** `PUT /api/profile/me`
**Request:** Multipart form data with profile photo

**Navigation:**
- Success → Home Screen


---

### 5.2 Home & Discovery Screens

#### Screen 7: Home Screen
**Purpose:** Main landing page with featured content
**Components:**
- App bar with location and notifications
- Search bar (tap to navigate to Search Screen)
- Category grid (Cars, Properties)
- Featured listings carousel
- Recent listings list
- Bottom navigation bar

**Features:**
- Pull to refresh
- Infinite scroll for listings
- Quick filters (Price, Location)

**API Endpoints:**
- `GET /api/public/categories` - Get categories
- `GET /api/public/listings/featured` - Featured listings
- `GET /api/public/listings?page=1&limit=20` - Recent listings

**State Management:**
- Categories list
- Featured listings
- Recent listings
- User location
- Loading states

**Navigation:**
- Category card → Category Listings Screen
- Listing card → Listing Details Screen
- Search bar → Search Screen
- Bottom nav → Other main screens

---

#### Screen 8: Category Listings Screen
**Purpose:** Show all listings in a specific category
**Components:**
- App bar with category name
- Filter button (opens filter bottom sheet)
- Sort dropdown
- Listings grid/list view toggle
- Listing cards

**Features:**
- Grid/List view switch
- Sort options (Newest, Price Low-High, Price High-Low)
- Filter by price, location, features
- Infinite scroll pagination

**API Endpoint:** `GET /api/public/listings?categoryId=1&page=1&limit=20`

**Navigation:**
- Listing card → Listing Details Screen
- Filter button → Filter Bottom Sheet

---

#### Screen 9: Search Screen
**Purpose:** Advanced search with filters
**Components:**
- Search input with suggestions
- Recent searches list
- Popular searches chips
- Category filter
- Advanced filters section
- Search button

**Features:**
- Search suggestions as user types
- Save search history
- Quick filter chips
- Voice search (optional)

**API Endpoints:**
- `GET /api/end-user/searches/recommendations` - Search suggestions
- `GET /api/public/searches/popular` - Popular searches
- `POST /api/end-user/searches/log` - Log search activity

**Navigation:**
- Search → Search Results Screen

---

#### Screen 10: Search Results Screen
**Purpose:** Display filtered search results
**Components:**
- Search query display
- Active filters chips
- Results count
- Sort dropdown
- Listings grid/list
- No results state

**Features:**
- Remove individual filters
- Clear all filters
- Save search
- Share results

**API Endpoint:** `GET /api/public/listings?search=query&filters=...`

**Navigation:**
- Listing card → Listing Details Screen

---

#### Screen 11: Listing Details Screen
**Purpose:** Complete listing information
**Components:**
- Image gallery (swipeable)
- Price and title
- Favorite button
- Share button
- Seller information card
- Description
- Specifications (for cars/properties)
- Location map
- Similar listings
- Contact seller buttons (Call, WhatsApp, Chat)

**Features:**
- Image zoom and gallery
- Add/remove from favorites
- Share listing
- Report listing
- View count display
- Contact seller (if subscribed)

**API Endpoints:**
- `GET /api/public/listings/:slug` - Get listing details
- `POST /api/public/listings/view/:id` - Increment view count
- `POST /api/end-user/favorites` - Add to favorites
- `DELETE /api/end-user/favorites/:listingId` - Remove favorite

**Navigation:**
- Chat button → Chat Screen
- Seller profile → Public Profile Screen
- Similar listing → Listing Details Screen


---

### 5.3 Listing Management Screens

#### Screen 12: Create Listing Screen
**Purpose:** Select category for new listing
**Components:**
- Category selection cards
- Category icons and names
- Continue button

**Navigation:**
- Cars → Car Listing Form
- Properties → Property Listing Form

---

#### Screen 13: Car Listing Form
**Purpose:** Create/edit car listing
**Components:**
- **Basic Information:**
  - Title input
  - Description textarea
  - Price input
  - Price negotiable checkbox
  
- **Car Details:**
  - Brand dropdown (cascading)
  - Model dropdown (based on brand)
  - Variant dropdown (based on model)
  - Year picker
  - Registration year
  - Condition (New/Used)
  - Mileage input
  - Owners count
  - Fuel type dropdown
  - Transmission dropdown
  - Body type dropdown
  - Color input
  - Registration number
  - Registration state

- **Location:**
  - State dropdown
  - City dropdown
  - Locality input
  - Address textarea
  - Get current location button

- **Features:**
  - Multi-select checkboxes (ABS, Airbags, Sunroof, etc.)

- **Action Buttons:**
  - Save as Draft
  - Continue to Upload Photos

**Validation:**
- All required fields
- Price > 0
- Valid registration number format
- Year validation

**API Endpoints:**
- `GET /api/public/car-brands` - Get brands
- `GET /api/public/car-models?brandId=X` - Get models
- `GET /api/public/car-variants?modelId=X` - Get variants
- `POST /api/end-user/listings` - Create listing

**Request:**
```json
{
  "categoryId": 1,
  "categoryType": "car",
  "title": "Toyota Camry 2020",
  "description": "Well maintained...",
  "price": 1500000,
  "priceNegotiable": true,
  "stateId": 1,
  "cityId": 5,
  "locality": "Andheri West",
  "brandId": 10,
  "modelId": 45,
  "variantId": 120,
  "year": 2020,
  "condition": "used",
  "mileageKm": 25000,
  "fuelType": "petrol",
  "transmission": "automatic",
  "features": ["ABS", "Airbags"]
}
```

**Navigation:**
- Save Draft → My Listings Screen
- Continue → Upload Media Screen

---

#### Screen 14: Property Listing Form
**Purpose:** Create/edit property listing
**Components:**
- **Basic Information:**
  - Title input
  - Description textarea
  - Price input
  - Price negotiable checkbox

- **Property Details:**
  - Property type (Apartment, House, Villa, etc.)
  - Listing type (Sale, Rent, PG)
  - Bedrooms input
  - Bathrooms input
  - Balconies input
  - Area (sqft) input
  - Carpet area input
  - Floor number
  - Total floors
  - Age (years)
  - Facing direction
  - Furnished status
  - Parking spaces
  - Ownership type
  - RERA approved checkbox
  - RERA ID input

- **Location:**
  - State dropdown
  - City dropdown
  - Locality input
  - Address textarea

- **Amenities:**
  - Multi-select (Gym, Pool, Security, Lift, etc.)

- **Action Buttons:**
  - Save as Draft
  - Continue to Upload Photos

**API Endpoint:** `POST /api/end-user/listings`

**Navigation:**
- Save Draft → My Listings Screen
- Continue → Upload Media Screen

---

#### Screen 15: Upload Media Screen
**Purpose:** Upload images and videos for listing
**Components:**
- Image grid (max 15 images)
- Video section (max 3 videos)
- Camera button
- Gallery button
- Drag to reorder
- Delete button on each media
- Set as primary button
- Submit button

**Features:**
- Image compression
- Multiple selection
- Drag to reorder
- Set primary image
- Preview before upload
- Progress indicator

**Validation:**
- At least 1 image required
- Max 15 images (5MB each)
- Max 3 videos (50MB each)
- Supported formats: JPEG, PNG, WebP, MP4

**API Endpoint:** `POST /api/end-user/listings/media/:id`
**Request:** Multipart form data

**Navigation:**
- Submit → Listing submitted, navigate to My Listings

---

#### Screen 16: My Listings Screen
**Purpose:** Manage user's listings
**Components:**
- Tab bar (All, Draft, Pending, Active, Sold, Rejected)
- Listing cards with status badges
- Edit/Delete actions
- Statistics card (total views, contacts)

**Features:**
- Filter by status
- Pull to refresh
- Swipe actions (Edit, Delete, Mark as Sold)

**API Endpoint:** `GET /api/end-user/listings?status=active`

**Navigation:**
- Edit → Edit Listing Screen
- Listing card → Listing Details Screen

---

#### Screen 17: Edit Listing Screen
**Purpose:** Update existing listing
**Components:**
- Same as Create Listing Form
- Pre-filled with existing data
- Update button

**Restrictions:**
- Can only edit Draft or Rejected listings
- Cannot edit Active listings

**API Endpoint:** `PUT /api/end-user/listings/:id`

**Navigation:**
- Update → My Listings Screen


---

### 5.4 User Profile Screens

#### Screen 18: Profile Screen
**Purpose:** User profile and account management
**Components:**
- Profile header (photo, name, email, mobile)
- Statistics cards (Listings, Favorites, Views)
- Menu items:
  - Edit Profile
  - My Listings
  - Favorites
  - Subscriptions
  - Transactions
  - Business/KYC Info
  - Settings
  - Help & Support
  - Logout

**API Endpoint:** `GET /api/auth/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "fullName": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "profilePhoto": "url",
    "subscriptionType": "premium",
    "subscriptionExpiresAt": "2025-02-14"
  }
}
```

**Navigation:**
- Menu items → Respective screens

---

#### Screen 19: Edit Profile Screen
**Purpose:** Update user information
**Components:**
- Profile photo with edit button
- Full name input
- Email input
- Date of birth picker
- Gender selector
- About textarea
- Address fields
- State/City dropdowns
- Pincode input
- Save button

**Features:**
- Image picker for profile photo
- Form validation
- Loading state during upload

**API Endpoint:** `PUT /api/profile/me`
**Request:** Multipart form data

**Navigation:**
- Save → Profile Screen

---

#### Screen 20: Business/KYC Screen
**Purpose:** Business information and KYC details
**Components:**
- Name on ID input
- Business name input
- GSTIN input (15 chars)
- Aadhar number input (12 digits)
- PAN number input (10 chars)
- KYC status badge
- Save button

**Validation:**
- GSTIN: 15 alphanumeric
- PAN: 10 alphanumeric
- Aadhar: 12 digits

**API Endpoints:**
- `GET /api/profile/me/business` - Get business info
- `PUT /api/profile/me/business` - Update business info

**Navigation:**
- Save → Profile Screen

---

#### Screen 21: Favorites Screen
**Purpose:** User's saved listings
**Components:**
- Tab bar (All, Cars, Properties)
- Listing cards
- Remove from favorites button
- Empty state

**Features:**
- Filter by category
- Pull to refresh
- Swipe to remove
- Sort options

**API Endpoint:** `GET /api/end-user/favorites?page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": 67890,
        "listing": {
          "id": 12345,
          "title": "Honda City 2020",
          "price": 850000,
          "media": [...]
        }
      }
    ],
    "pagination": {...}
  }
}
```

**Navigation:**
- Listing card → Listing Details Screen

---

#### Screen 22: Search History Screen
**Purpose:** User's recent searches
**Components:**
- Search history list
- Clear all button
- Search again button
- Delete individual search

**API Endpoint:** `GET /api/end-user/searches/history`

**Navigation:**
- Search item → Search Results Screen with saved filters


---

### 5.5 Subscriptions & Billing Screens

#### Screen 23: Pricing Plans Screen
**Purpose:** Display available subscription plans
**Components:**
- Plan cards with:
  - Plan name and tagline
  - Original price (strikethrough if discounted)
  - Final price
  - Offer badge
  - Duration
  - Features list
  - Subscribe button
- Compare plans button
- Current plan indicator

**Features:**
- Horizontal scroll for plans
- Feature comparison table
- Highlight recommended plan

**API Endpoint:** `GET /api/end-user/subscriptions/plans`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Basic Plan",
      "finalPrice": "299.00",
      "basePrice": "299.00",
      "durationDays": 30,
      "tagline": "Best for Beginners",
      "showOfferBadge": false,
      "maxActiveListings": 3,
      "features": {
        "showPhoneNumber": true,
        "allowChat": true
      }
    }
  ]
}
```

**Navigation:**
- Subscribe button → Subscription Details Screen

---

#### Screen 24: Subscription Details Screen
**Purpose:** Detailed plan information before purchase
**Components:**
- Plan name and price
- Duration
- Complete features list with icons
- Benefits breakdown
- Terms and conditions
- Payment method selector
- Subscribe button

**Features:**
- Expandable feature sections
- Payment gateway integration
- Terms acceptance checkbox

**API Endpoint:** `GET /api/end-user/subscriptions/plans/:id`

**Navigation:**
- Subscribe → Payment Gateway → Active Subscription Screen

---

#### Screen 25: Active Subscription Screen
**Purpose:** Current subscription details
**Components:**
- Plan name and status badge
- Expiry date with countdown
- Features included
- Usage statistics:
  - Active listings (X/10)
  - Featured listings (X/5)
- Upgrade button
- Cancel subscription button
- Auto-renewal toggle

**API Endpoint:** `GET /api/end-user/subscriptions/active`

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": 15,
      "planName": "Premium Plan",
      "status": "active",
      "startsAt": "2025-01-15",
      "endsAt": "2025-02-14",
      "maxActiveListings": 10,
      "features": {...}
    },
    "upgradeAvailable": {
      "id": 5,
      "name": "Premium Plus",
      "finalPrice": "999.00"
    }
  }
}
```

**Navigation:**
- Upgrade → Pricing Plans Screen
- Cancel → Confirmation dialog

---

#### Screen 26: Transaction History Screen
**Purpose:** Payment and transaction records
**Components:**
- Transaction list with:
  - Date
  - Description
  - Amount
  - Status badge
  - Invoice download button
- Filter by date range
- Search transactions

**API Endpoint:** `GET /api/end-user/subscriptions/history`

**Navigation:**
- Invoice → PDF viewer/download

