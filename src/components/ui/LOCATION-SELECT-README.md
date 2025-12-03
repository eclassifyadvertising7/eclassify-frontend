# Location Select Components

Reusable state and city selection components with search functionality and smart caching.

## Components

### StateSelect
Dropdown for selecting a state. Fetches all states on mount.

### CitySelect
Dropdown for selecting a city. Fetches cities when state changes, with client-side search filtering.

## Features

✅ **Client-side search** - Instant filtering for cities (no server requests while typing)
✅ **Smart caching** - Cities cached per state to avoid re-fetching
✅ **Loading states** - Shows spinners during API calls
✅ **Error handling** - Displays error messages
✅ **Validation support** - Required field indicators and error messages
✅ **Accessibility** - Proper ARIA attributes and keyboard navigation
✅ **Responsive** - Works on mobile and desktop

## Basic Usage

```jsx
import { StateSelect } from "@/components/ui/state-select"
import { CitySelect } from "@/components/ui/city-select"
import { useState } from "react"

function MyForm() {
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const handleStateChange = (stateId, stateName) => {
    setSelectedState(stateId)
    setSelectedCity("") // Clear city when state changes
  }

  const handleCityChange = (cityId, cityName) => {
    setSelectedCity(cityId)
  }

  return (
    <>
      <StateSelect
        value={selectedState}
        onChange={handleStateChange}
        required
      />

      <CitySelect
        stateId={selectedState}
        value={selectedCity}
        onChange={handleCityChange}
        required
      />
    </>
  )
}
```

## Props

### StateSelect Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string/number | - | Selected state ID |
| `onChange` | function | - | Callback: `(stateId, stateName) => void` |
| `placeholder` | string | "Select state" | Placeholder text |
| `disabled` | boolean | false | Disable the select |
| `error` | string | "" | Error message to display |
| `required` | boolean | false | Show required indicator |
| `showLabel` | boolean | true | Show label above select |
| `label` | string | "State" | Custom label text |
| `className` | string | "" | Additional CSS classes |

### CitySelect Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stateId` | string/number | - | **Required** - Selected state ID |
| `value` | string/number | - | Selected city ID |
| `onChange` | function | - | Callback: `(cityId, cityName) => void` |
| `placeholder` | string | "Select city" | Placeholder text |
| `disabled` | boolean | false | Disable the select |
| `error` | string | "" | Error message to display |
| `required` | boolean | false | Show required indicator |
| `showLabel` | boolean | true | Show label above select |
| `label` | string | "City" | Custom label text |
| `className` | string | "" | Additional CSS classes |

## Advanced Usage

### With Validation

```jsx
const [stateError, setStateError] = useState("")
const [cityError, setCityError] = useState("")

const handleSubmit = () => {
  if (!selectedState) {
    setStateError("Please select a state")
  }
  if (!selectedCity) {
    setCityError("Please select a city")
  }
}

<StateSelect
  value={selectedState}
  onChange={handleStateChange}
  error={stateError}
  required
/>

<CitySelect
  stateId={selectedState}
  value={selectedCity}
  onChange={handleCityChange}
  error={cityError}
  required
/>
```

### Without Labels

```jsx
<StateSelect
  value={selectedState}
  onChange={handleStateChange}
  showLabel={false}
  placeholder="Choose your state"
/>
```

### Custom Labels

```jsx
<StateSelect
  value={selectedState}
  onChange={handleStateChange}
  label="Select Your State"
/>

<CitySelect
  stateId={selectedState}
  value={selectedCity}
  onChange={handleCityChange}
  label="Select Your City"
/>
```

### Pre-populated Values (Edit Mode)

```jsx
// When editing existing data
const [selectedState, setSelectedState] = useState(existingListing.stateId)
const [selectedCity, setSelectedCity] = useState(existingListing.cityId)

// Components will automatically load and display the selected values
```

## Integration Examples

### Car Listing Form

```jsx
// In src/components/car-form/CarForm.jsx
const [formData, setFormData] = useState({
  // ... other fields
  stateId: "",
  cityId: "",
})

<StateSelect
  value={formData.stateId}
  onChange={(stateId) => {
    setFormData(prev => ({ ...prev, stateId, cityId: "" }))
  }}
  required
/>

<CitySelect
  stateId={formData.stateId}
  value={formData.cityId}
  onChange={(cityId) => {
    setFormData(prev => ({ ...prev, cityId }))
  }}
  required
/>
```

### Property Listing Form

```jsx
// In src/components/property-form/PropertyForm.jsx
// Same pattern as car form
```

### User Profile

```jsx
// In src/app/(root)/edit-profile/page.jsx
const [profile, setProfile] = useState({
  // ... other fields
  stateId: user.stateId || "",
  cityId: user.cityId || "",
})

<StateSelect
  value={profile.stateId}
  onChange={(stateId) => {
    setProfile(prev => ({ ...prev, stateId, cityId: "" }))
  }}
/>

<CitySelect
  stateId={profile.stateId}
  value={profile.cityId}
  onChange={(cityId) => {
    setProfile(prev => ({ ...prev, cityId }))
  }}
/>
```

## How It Works

### State Selection Flow
1. Component mounts → Fetches all states from API
2. User selects state → Calls `onChange(stateId, stateName)`
3. Parent updates state value

### City Selection Flow
1. User selects state → `stateId` prop changes
2. Component detects change → Fetches cities for that state
3. Cities cached in `useRef` → Won't re-fetch if user switches back
4. User types in search → Filters cities client-side (instant)
5. User selects city → Calls `onChange(cityId, cityName)`
6. Parent updates city value

### Caching Strategy
- Cities are cached per state ID in component memory
- If user selects "California", then "Texas", then back to "California"
- California cities are loaded from cache (no API call)
- Cache persists for component lifetime only

## Performance

- **States**: One API call on mount (~50 states, <5KB)
- **Cities**: One API call per state selection (~500 cities, ~50KB)
- **Search**: Client-side filtering (instant, no API calls)
- **Cache**: Prevents duplicate API calls for same state

## API Requirements

Requires these endpoints (already implemented in `commonService.js`):

```javascript
// GET /api/common/states
// Returns: [{ id: 1, name: "California" }, ...]

// GET /api/common/cities/:stateId
// Returns: [{ id: 1, name: "Los Angeles" }, ...]
```

## Troubleshooting

**Cities not loading?**
- Check that `stateId` prop is passed to CitySelect
- Verify API endpoint returns data
- Check browser console for errors

**Search not working?**
- Search only works after cities are loaded
- Requires at least 1 character
- Case-insensitive matching

**Values not persisting?**
- Make sure parent component manages state correctly
- Clear city when state changes
- Use controlled component pattern

## See Also

- Example implementation: `src/components/ui/location-select-example.jsx`
- API service: `src/app/services/api/commonService.js`
- Base components: `src/components/ui/select.jsx`
