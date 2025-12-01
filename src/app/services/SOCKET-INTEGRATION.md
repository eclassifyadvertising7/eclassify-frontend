# Socket.io Integration Guide

Complete real-time chat implementation using Socket.io.

## Overview

The chat system uses Socket.io for real-time bidirectional communication between the client and server. This enables instant message delivery, typing indicators, read receipts, and other real-time features.

## Architecture

### Socket Service (`socketService.js`)

Singleton service that manages the Socket.io connection and provides methods for:
- Connection management
- Room operations (join/leave)
- Message sending
- Event listeners (new messages, typing, read receipts)

### Components Integration

**ChatWindow.jsx**
- Connects to socket when room is opened
- Joins room via `socket.emit('join_room')`
- Listens for real-time events
- Sends messages via socket
- Handles typing indicators
- Cleans up listeners on unmount

**ChatInput.jsx**
- Emits typing events on user input
- Throttles typing indicators (2 second timeout)

**ChatsPage.js**
- Initializes socket connection on mount
- Disconnects on unmount

## Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ roomId }` | Join a chat room |
| `leave_room` | `{ roomId }` | Leave a chat room |
| `send_message` | `{ roomId, messageText, replyToMessageId }` | Send text message |
| `typing` | `{ roomId }` | User is typing |
| `stop_typing` | `{ roomId }` | User stopped typing |
| `mark_read` | `{ roomId }` | Mark messages as read |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `joined_room` | `{ roomId }` | Successfully joined room |
| `new_message` | `{ roomId, message }` | New message received |
| `message_read` | `{ roomId, userId, readAt }` | Messages marked as read |
| `message_deleted` | `{ roomId, messageId }` | Message was deleted |
| `user_typing` | `{ roomId, userId }` | User is typing |
| `user_stop_typing` | `{ roomId, userId }` | User stopped typing |
| `room_inactive` | `{ roomId, reason }` | Room became inactive |
| `offer_received` | `{ roomId, offerId, amount }` | New offer received |
| `error` | `{ message }` | Error occurred |

## Connection Flow

```javascript
// 1. Connect to socket (on page mount)
socketService.connect()

// 2. Join room (when opening chat)
socketService.joinRoom(roomId, (data) => {
  console.log('Joined room:', data.roomId)
})

// 3. Listen for events
socketService.onNewMessage((data) => {
  // Add message to UI
  setMessages(prev => [...prev, data.message])
})

// 4. Send messages
socketService.sendMessage(roomId, messageText)

// 5. Leave room (when closing chat)
socketService.leaveRoom(roomId)

// 6. Disconnect (on page unmount)
socketService.disconnect()
```

## Features Implemented

### ✅ Real-time Messaging
- Messages sent via socket appear instantly
- No page refresh needed
- Automatic scroll to bottom on new messages

### ✅ Typing Indicators
- Shows when other user is typing
- Animated dots indicator
- Auto-hides after 2 seconds of inactivity

### ✅ Read Receipts
- Messages marked as read automatically
- Double checkmark (✓✓) for read messages
- Updates in real-time

### ✅ Message Deletion
- Deleted messages removed from UI instantly
- Synced across all connected clients

### ✅ Connection Management
- Auto-reconnect on disconnect
- Connection status monitoring
- Graceful error handling

## Environment Configuration

Socket connects to the backend server using:
```javascript
const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
```

**Example:**
- If `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- Socket connects to `http://localhost:5000`

## Authentication

Socket connection uses JWT token from localStorage:
```javascript
const token = localStorage.getItem('access_token')

io(socketUrl, {
  auth: { token }
})
```

## Error Handling

The service handles:
- Connection failures
- Authentication errors
- Network disconnections
- Invalid room access

Errors are logged to console and shown via toast notifications.

## Best Practices

1. **Always cleanup listeners**: Use `off` methods in useEffect cleanup
2. **Check connection status**: Use `socketService.isConnected()` before emitting
3. **Throttle typing events**: Prevent excessive socket emissions
4. **Handle reconnection**: Socket.io handles this automatically
5. **Use HTTP for media**: Images/files still use HTTP API endpoints

## Fallback Strategy

If socket connection fails:
- Messages can still be sent via HTTP API
- Polling can be implemented as fallback
- User is notified of connection issues

## Testing

To test socket functionality:

1. Open chat in two different browsers
2. Send message from one - should appear instantly in other
3. Type in one - typing indicator should show in other
4. Mark as read - checkmarks should update
5. Delete message - should disappear from both

## Troubleshooting

**Socket not connecting:**
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend socket server is running
- Check browser console for errors
- Verify JWT token is valid

**Messages not appearing:**
- Check if room was joined successfully
- Verify event listeners are attached
- Check network tab for socket frames
- Ensure room IDs match

**Typing indicator not working:**
- Check throttling timeout (2 seconds)
- Verify socket connection is active
- Check if other user is in same room

## Performance Considerations

- Socket connection is shared across all rooms
- Only one connection per user session
- Listeners are cleaned up when rooms change
- Typing events are throttled to reduce load

## Future Enhancements

- [ ] Message delivery status (sent/delivered/read)
- [ ] Online/offline user status
- [ ] Voice messages
- [ ] File sharing progress
- [ ] Message reactions
- [ ] Push notifications integration
