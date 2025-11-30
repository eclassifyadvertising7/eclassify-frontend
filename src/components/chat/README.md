# Chat Module

End-user chat interface for the marketplace platform.

## Features

- **Real-time messaging** between buyers and sellers
- **Room-based conversations** linked to listings
- **Message types**: Text, images, location, system messages
- **Filters**: All/Buying/Selling, Unread/Important
- **Actions**: Report, request contact, block, delete
- **Unread indicators** and important flags
- **Responsive layout** with sidebar and chat window

## Components

### ChatRoomItem
Displays individual chat room in the sidebar with:
- Listing thumbnail
- Other user's avatar and name
- Listing title and price
- Unread count badge
- Important flag (star)
- Last message timestamp

### ChatWindow
Main chat interface containing:
- ChatHeader with listing info and actions
- Messages area with scrolling
- ChatInput for sending messages

### ChatHeader
Top section with:
- Listing cover photo
- User name and avatar
- Action buttons: Report (flag), Request Contact (phone), More options (menu), Close (X)
- Dropdown menu: Block, Delete, Safety Tips

### ChatMessage
Individual message display supporting:
- Text messages
- Image messages (clickable to open)
- Location messages (with map link)
- System messages (centered)
- Read receipts (✓✓)
- Edit indicator

### ChatInput
Message input area with:
- Image upload button
- Text input (supports Enter to send, Shift+Enter for new line)
- Send button

## Usage

Navigate to `/messages` to access the chat interface.

## API Integration

Uses `chatService.js` which follows the project's API guidelines:
- Uses centralized `httpClient`
- Proper error handling
- All endpoints use `/end-user/chats/*` prefix

## State Management

- Rooms list loaded on mount and filter change
- Messages loaded when room is selected
- Auto-marks messages as read when viewing
- Refreshes after sending messages

## Future Enhancements

- Socket.io integration for real-time updates
- Typing indicators
- Message editing/deletion UI
- Offer management UI
- Contact sharing UI
- Pagination for messages and rooms
