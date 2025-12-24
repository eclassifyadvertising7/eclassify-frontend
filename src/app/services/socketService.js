/**
 * Socket.io Service
 * Manages real-time chat connections
 */

import { io } from 'socket.io-client';
import { API_BASE_URL } from './httpClient';

// Get base URL from environment, remove /api suffix for socket connection
const getSocketUrl = () => {
  return API_BASE_URL.replace('/api', '');
};

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  /**
   * Connect to socket server
   */
  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found for socket connection');
      return null;
    }

    const socketUrl = getSocketUrl();

    this.socket = io(socketUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Join a chat room
   */
  joinRoom(roomId, callback) {
    if (!this.socket) return;

    this.socket.emit('join_room', { roomId });

    if (callback) {
      this.socket.once('joined_room', callback);
    }
  }

  /**
   * Leave a chat room
   */
  leaveRoom(roomId) {
    if (!this.socket) return;

    this.socket.emit('leave_room', { roomId });
  }

  /**
   * Send a text message via socket
   */
  sendMessage(roomId, messageText, replyToMessageId = null) {
    if (!this.socket) return;

    this.socket.emit('send_message', {
      roomId,
      messageText,
      replyToMessageId
    });
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback) {
    if (!this.socket) return;

    this.socket.on('new_message', callback);
  }

  /**
   * Remove new message listener
   */
  offNewMessage(callback) {
    if (!this.socket) return;

    this.socket.off('new_message', callback);
  }

  /**
   * Listen for message read events
   */
  onMessageRead(callback) {
    if (!this.socket) return;

    this.socket.on('message_read', callback);
  }

  /**
   * Remove message read listener
   */
  offMessageRead(callback) {
    if (!this.socket) return;

    this.socket.off('message_read', callback);
  }

  /**
   * Listen for message deleted events
   */
  onMessageDeleted(callback) {
    if (!this.socket) return;

    this.socket.on('message_deleted', callback);
  }

  /**
   * Remove message deleted listener
   */
  offMessageDeleted(callback) {
    if (!this.socket) return;

    this.socket.off('message_deleted', callback);
  }

  /**
   * Emit typing indicator
   */
  emitTyping(roomId) {
    if (!this.socket) return;

    this.socket.emit('typing', { roomId });
  }

  /**
   * Emit stop typing indicator
   */
  emitStopTyping(roomId) {
    if (!this.socket) return;

    this.socket.emit('stop_typing', { roomId });
  }

  /**
   * Listen for user typing
   */
  onUserTyping(callback) {
    if (!this.socket) return;

    this.socket.on('user_typing', callback);
  }

  /**
   * Remove user typing listener
   */
  offUserTyping(callback) {
    if (!this.socket) return;

    this.socket.off('user_typing', callback);
  }

  /**
   * Listen for user stop typing
   */
  onUserStopTyping(callback) {
    if (!this.socket) return;

    this.socket.on('user_stop_typing', callback);
  }

  /**
   * Remove user stop typing listener
   */
  offUserStopTyping(callback) {
    if (!this.socket) return;

    this.socket.off('user_stop_typing', callback);
  }

  /**
   * Mark messages as read via socket
   */
  markAsRead(roomId) {
    if (!this.socket) return;

    this.socket.emit('mark_read', { roomId });
  }

  /**
   * Listen for room inactive events
   */
  onRoomInactive(callback) {
    if (!this.socket) return;

    this.socket.on('room_inactive', callback);
  }

  /**
   * Remove room inactive listener
   */
  offRoomInactive(callback) {
    if (!this.socket) return;

    this.socket.off('room_inactive', callback);
  }

  /**
   * Listen for offer received events
   */
  onOfferReceived(callback) {
    if (!this.socket) return;

    this.socket.on('offer_received', callback);
  }

  /**
   * Remove offer received listener
   */
  offOfferReceived(callback) {
    if (!this.socket) return;

    this.socket.off('offer_received', callback);
  }

  /**
   * Check if socket is connected
   */
  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
