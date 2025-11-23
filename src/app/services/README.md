# API Services

This directory contains the HTTP client and all API service modules for the application.

## Structure

```
services/
├── httpClient.js          # Base HTTP client with fetch wrapper
├── api/                   # API service modules
│   ├── authService.js     # Authentication & session
│   ├── userService.js     # User profile management
│   ├── carService.js      # Car listings
│   ├── propertyService.js # Property listings
│   ├── adminService.js    # Admin operations
│   ├── packageService.js  # Pricing packages
│   ├── contactService.js  # Contact & messaging
│   ├── uploadService.js   # File uploads
│   └── index.js           # Service exports
└── index.js               # Main export
```

## Usage

### Import services

```javascript
// Import specific service
import { carService } from '@/app/services';

// Or import multiple
import { carService, authService, userService } from '@/app/services';
```

### Using in components

```javascript
'use client';

import { useState, useEffect } from 'react';
import { carService } from '@/app/services';

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.getCars({ limit: 10 });
        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {cars.map(car => (
        <div key={car.id}>{car.title}</div>
      ))}
    </div>
  );
}
```

### Using in Server Components

```javascript
import { carService } from '@/app/services';

export default async function CarsPage() {
  const cars = await carService.getCars();
  
  return (
    <div>
      {cars.map(car => (
        <div key={car.id}>{car.title}</div>
      ))}
    </div>
  );
}
```

### Error Handling

All services throw errors with this structure:

```javascript
{
  status: 404,
  message: 'Not found',
  data: { ... }
}
```

Handle errors with try-catch:

```javascript
try {
  const car = await carService.getCarById(123);
} catch (error) {
  if (error.status === 404) {
    console.log('Car not found');
  } else if (error.status === 401) {
    console.log('Unauthorized');
  } else {
    console.log('Error:', error.message);
  }
}
```

## Configuration

Set your API base URL in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Authentication

The HTTP client automatically includes the auth token from localStorage in all requests. Use `authService` to manage authentication:

```javascript
// Login
const response = await authService.login({ email, password });
// Token is automatically stored

// Check auth status
const isLoggedIn = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();

// Logout
authService.logout();
```
