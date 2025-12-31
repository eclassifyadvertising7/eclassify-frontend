/**
 * Socket.io Service
 * Manages real-time WebSocket connection for notifications and chat
 */

import { io } from 'socket.io-client';

// Get base URL without /api suffix for socket connection
const getSocketURL = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
  // Remove /api suffix and ensure we have a valid URL
  const baseUrl = apiUrl.replace('/api', '');
  
  // Validate the URL format
  try {
    const url = new URL(baseUrl);
    console.log('Socket connecting to:', url.origin);
    return url.origin;
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_BACKEND_URL:', apiUrl);
    // Fallback to localhost
    return 'http://localhost:5000';
  }
};

class SocketService {
  constructor() {
    this.socket = null;
    this.connectionStatus = false;
    this.listeners = new Map();
  }

  /**
   * Connect to socket server with JWT token
   * @param {string} token - JWT access token
   */
  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    if (!token) {
      // This is expected for guest users - don't log as error
      console.log('Socket connection skipped: No authentication token');
      return null;
    }

    const socketURL = getSocketURL();
    
    console.log('Initializing socket connection to:', socketURL);
    
    this.socket = io(socketURL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.setupEventHandlers();
    
    return this.socket;
  }

  /**
   * Setup core socket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connectionStatus = true;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connectionStatus = false;
      this.emit('connection_status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.emit('connection_error', { error: error.message });
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('socket_error', error);
    });

    // Real-time count update events
    this.socket.on('unread_counts', (data) => {
      console.log('Received initial unread counts:', data);
      this.emit('unread_counts', data);
    });

    this.socket.on('chat_count_update', (data) => {
      console.log('Chat count updated:', data);
      this.emit('chat_count_update', data);
    });

    this.socket.on('notification_count_update', (data) => {
      console.log('Notification count updated:', data);
      this.emit('notification_count_update', data);
    });

    // Debug: Log all incoming events
    this.socket.onAny((eventName, ...args) => {
      console.log(`[Socket Event Received] ${eventName}:`, args);
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus = false;
      this.listeners.clear();
    }
  }

  /**
   * Request current unread counts manually
   */
  requestUnreadCounts() {
    if (this.socket?.connected) {
      console.log('Requesting unread counts...');
      this.socket.emit('request_unread_counts');
    } else {
      console.warn('Cannot request counts: Socket not connected');
    }
  }

  /**
   * Subscribe to socket events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Emit event to all listeners
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.getConnectionStatus();
  }

  /**
   * Get connection status
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.socket?.connected || false;
  }

  /**
   * Get socket instance
   * @returns {Socket|null}
   */
  getSocket() {
    return this.socket;
  }

  // ============================================
  // CHAT-SPECIFIC METHODS
  // ============================================

  /**
   * Join a chat room
   * @param {string|number} roomId - Chat room ID
   * @param {Function} callback - Optional callback
   */
  joinRoom(roomId, callback) {
    if (this.socket?.connected) {
      console.log('Joining chat room:', roomId);
      this.socket.emit('join_room', { roomId }, callback);
    } else {
      console.warn('Cannot join room: Socket not connected');
    }
  }

  /**
   * Leave a chat room
   * @param {string|number} roomId - Chat room ID
   */
  leaveRoom(roomId) {
    if (this.socket?.connected) {
      console.log('Leaving chat room:', roomId);
      this.socket.emit('leave_room', { roomId });
    }
  }

  /**
   * Send a chat message
   * @param {string|number} roomId - Chat room ID
   * @param {string} messageText - Message text
   * @param {string|number} replyToMessageId - Optional reply to message ID
   */
  sendMessage(roomId, messageText, replyToMessageId = null) {
    if (this.socket?.connected) {
      this.socket.emit('send_message', { 
        roomId, 
        messageText,
        replyToMessageId 
      });
    } else {
      throw new Error('Socket not connected');
    }
  }

  /**
   * Mark messages as read
   * @param {string|number} roomId - Chat room ID
   */
  markAsRead(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('mark_read', { roomId });
    }
  }

  /**
   * Emit typing indicator
   * @param {string|number} roomId - Chat room ID
   */
  emitTyping(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('typing', { roomId });
    }
  }

  /**
   * Emit stop typing indicator
   * @param {string|number} roomId - Chat room ID
   */
  emitStopTyping(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('stop_typing', { roomId });
    }
  }

  /**
   * Listen for new messages
   * @param {Function} callback - Callback function
   */
  onNewMessage(callback) {
    if (this.socket) {
      console.log('Registering new_message listener');
      this.socket.on('new_message', callback);
    } else {
      console.warn('Cannot register new_message listener: Socket not initialized');
    }
  }

  /**
   * Remove new message listener
   * @param {Function} callback - Callback function
   */
  offNewMessage(callback) {
    if (this.socket) {
      console.log('Removing new_message listener');
      this.socket.off('new_message', callback);
    }
  }

  /**
   * Listen for message read events
   * @param {Function} callback - Callback function
   */
  onMessageRead(callback) {
    if (this.socket) {
      console.log('Registering message_read listener');
      this.socket.on('message_read', callback);
    } else {
      console.warn('Cannot register message_read listener: Socket not initialized');
    }
  }

  /**
   * Remove message read listener
   * @param {Function} callback - Callback function
   */
  offMessageRead(callback) {
    if (this.socket) {
      this.socket.off('message_read', callback);
    }
  }

  /**
   * Listen for message deleted events
   * @param {Function} callback - Callback function
   */
  onMessageDeleted(callback) {
    if (this.socket) {
      console.log('Registering message_deleted listener');
      this.socket.on('message_deleted', callback);
    } else {
      console.warn('Cannot register message_deleted listener: Socket not initialized');
    }
  }

  /**
   * Remove message deleted listener
   * @param {Function} callback - Callback function
   */
  offMessageDeleted(callback) {
    if (this.socket) {
      this.socket.off('message_deleted', callback);
    }
  }

  /**
   * Listen for typing indicators
   * @param {Function} callback - Callback function
   */
  onUserTyping(callback) {
    if (this.socket) {
      console.log('Registering user_typing listener');
      this.socket.on('user_typing', callback);
    } else {
      console.warn('Cannot register user_typing listener: Socket not initialized');
    }
  }

  /**
   * Remove typing listener
   * @param {Function} callback - Callback function
   */
  offUserTyping(callback) {
    if (this.socket) {
      this.socket.off('user_typing', callback);
    }
  }

  /**
   * Listen for stop typing indicators
   * @param {Function} callback - Callback function
   */
  onUserStopTyping(callback) {
    if (this.socket) {
      console.log('Registering user_stop_typing listener');
      this.socket.on('user_stop_typing', callback);
    } else {
      console.warn('Cannot register user_stop_typing listener: Socket not initialized');
    }
  }

  /**
   * Remove stop typing listener
   * @param {Function} callback - Callback function
   */
  offUserStopTyping(callback) {
    if (this.socket) {
      this.socket.off('user_stop_typing', callback);
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
