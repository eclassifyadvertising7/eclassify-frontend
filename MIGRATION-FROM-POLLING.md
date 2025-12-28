# Migration Guide: From Polling to Socket.io

## Overview

This guide helps you migrate components from polling-based count updates to real-time socket updates.

## Before & After Example

### ❌ Before (Polling)

```javascript
"use client"

import { useState, useEffect } from 'react'
import notificationsService from '@/app/services/api/notificationsService'

function MyComponent() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount()
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsService.getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data.total)
      }
    } catch (error) {
      console.error("Error fetching count:", error)
    }
  }

  return (
    <div>
      {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
    </div>
  )
}
```

### ✅ After (Socket.io)

```javascript
"use client"

import { useSocket } from '@/app/context/SocketContext'

function MyComponent() {
  const { notificationUnreadCount } = useSocket()

  return (
    <div>
      {notificationUnreadCount > 0 && <Badge>{notificationUnreadCount}</Badge>}
    </div>
  )
}
```

## Step-by-Step Migration

### Step 1: Remove Polling Logic

**Remove:**
- `useState` for count
- `useEffect` with interval
- `fetchUnreadCount` function
- API service imports (if only used for polling)

```javascript
// ❌ Remove these
const [unreadCount, setUnreadCount] = useState(0)

useEffect(() => {
  fetchUnreadCount()
  const interval = setInterval(fetchUnreadCount, 30000)
  return () => clearInterval(interval)
}, [])

const fetchUnreadCount = async () => {
  // ...
}
```

### Step 2: Import Socket Hook

```javascript
// ✅ Add this
import { useSocket } from '@/app/context/SocketContext'
```

### Step 3: Use Socket Counts

```javascript
// ✅ Add this
const { 
  chatUnreadCount,           // For chat messages
  notificationUnreadCount,   // For notifications
  isConnected                // Optional: connection status
} = useSocket()
```

### Step 4: Update JSX

Replace your local state variable with socket count:

```javascript
// ❌ Before
{unreadCount > 0 && <Badge>{unreadCount}</Badge>}

// ✅ After
{notificationUnreadCount > 0 && <Badge>{notificationUnreadCount}</Badge>}
```

### Step 5: Remove Refresh Calls (Optional)

If you were refreshing counts after actions:

```javascript
// ❌ Before
const handleMarkAsRead = async (id) => {
  await markAsRead(id)
  fetchUnreadCount() // Manual refresh
}

// ✅ After
const handleMarkAsRead = async (id) => {
  await markAsRead(id)
  // Count updates automatically via socket!
}
```

## Common Patterns

### Pattern 1: Header/Navigation Badge

```javascript
// Before
const [count, setCount] = useState(0)
useEffect(() => {
  const interval = setInterval(fetchCount, 30000)
  return () => clearInterval(interval)
}, [])

// After
const { notificationUnreadCount } = useSocket()
```

### Pattern 2: Drawer/Modal with Counts

```javascript
// Before
const [count, setCount] = useState(0)
useEffect(() => {
  if (isOpen) fetchCount()
}, [isOpen])

// After
const { notificationUnreadCount } = useSocket()
// Count is always up-to-date, no need to fetch on open
```

### Pattern 3: Multiple Count Displays

```javascript
// Before
const [chatCount, setChatCount] = useState(0)
const [notifCount, setNotifCount] = useState(0)

useEffect(() => {
  fetchChatCount()
  fetchNotifCount()
  const interval = setInterval(() => {
    fetchChatCount()
    fetchNotifCount()
  }, 30000)
  return () => clearInterval(interval)
}, [])

// After
const { chatUnreadCount, notificationUnreadCount } = useSocket()
// Both counts always synchronized!
```

### Pattern 4: Pull-to-Refresh

```javascript
// Before
const handleRefresh = async () => {
  await fetchUnreadCount()
}

// After
const { refreshUnreadCounts } = useSocket()
const handleRefresh = () => {
  refreshUnreadCounts() // Requests fresh counts from server
}
```

## Checklist for Each Component

- [ ] Remove `useState` for count
- [ ] Remove `useEffect` with polling interval
- [ ] Remove fetch function
- [ ] Import `useSocket` hook
- [ ] Destructure needed counts
- [ ] Update JSX to use socket counts
- [ ] Remove manual refresh calls (optional)
- [ ] Test component functionality

## Components Already Migrated ✅

- `src/components/user-header/page.jsx`
- `src/components/NotificationDrawer.jsx`

## Components That May Need Migration

Search your codebase for these patterns:

```bash
# Find components with polling intervals
grep -r "setInterval.*fetch" src/

# Find components fetching unread counts
grep -r "getUnreadCount\|unreadCount" src/

# Find components with count state
grep -r "useState.*count" src/
```

## Benefits After Migration

| Aspect | Before (Polling) | After (Socket.io) |
|--------|------------------|-------------------|
| Update Speed | 0-30 seconds | < 100ms |
| API Calls | Every 30s per user | Only on changes |
| Server Load | High | Minimal |
| Battery Usage | Higher | Lower |
| Synchronization | Per component | Global |
| Code Complexity | High | Low |

## Troubleshooting

### Counts Not Updating After Migration

1. Check socket connection:
   ```javascript
   const { isConnected } = useSocket()
   console.log('Socket connected:', isConnected)
   ```

2. Check browser console for socket events

3. Verify backend is emitting events

### Need to Keep Polling as Fallback?

Not recommended, but if needed:

```javascript
const { notificationUnreadCount, isConnected } = useSocket()
const [fallbackCount, setFallbackCount] = useState(0)

// Only poll if socket disconnected
useEffect(() => {
  if (!isConnected) {
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }
}, [isConnected])

// Use socket count if connected, fallback otherwise
const displayCount = isConnected ? notificationUnreadCount : fallbackCount
```

## Questions?

- Review `SOCKET-INTEGRATION-COMPLETE.md` for full details
- Check `SOCKET-QUICK-REFERENCE.md` for usage examples
- Test in browser console with socket logs enabled
