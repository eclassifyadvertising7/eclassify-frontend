/**
 * Chat Window Component
 * Main chat interface with messages
 */

import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ImageModal from "./ImageModal";
import { getMessages, sendImageMessage, markMessagesAsRead } from "@/app/services/api/chatService";
import socketService from "@/app/services/socketService";
import { toast } from "sonner";

export default function ChatWindow({ 
  room, 
  currentUserId,
  onReport,
  onRequestContact,
  onBlock,
  onDelete,
  onClose
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isBuyer = room ? currentUserId === room.buyerId : false;
  const otherUser = room ? (isBuyer ? room.seller : room.buyer) : null;

  // Load messages and setup socket listeners
  useEffect(() => {
    if (room?.id) {
      loadMessages();
      markAsRead();
      
      // Join room via socket
      socketService.joinRoom(room.id, (data) => {
        console.log('Joined room:', data.roomId);
      });

      // Listen for new messages
      const handleNewMessage = (data) => {
        if (data.roomId === room.id) {
          setMessages(prev => [...prev, data.message]);
          scrollToBottom();
          
          // Mark as read if message is from other user
          if (data.message.senderId !== currentUserId) {
            socketService.markAsRead(room.id);
          }
        }
      };

      // Listen for message read events
      const handleMessageRead = (data) => {
        if (data.roomId === room.id) {
          setMessages(prev => prev.map(msg => ({
            ...msg,
            isRead: true,
            readAt: data.readAt
          })));
        }
      };

      // Listen for message deleted events
      const handleMessageDeleted = (data) => {
        if (data.roomId === room.id) {
          setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
        }
      };

      // Listen for typing indicators
      const handleUserTyping = (data) => {
        if (data.roomId === room.id && data.userId !== currentUserId) {
          setTypingUsers(prev => new Set(prev).add(data.userId));
        }
      };

      const handleUserStopTyping = (data) => {
        if (data.roomId === room.id) {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        }
      };

      socketService.onNewMessage(handleNewMessage);
      socketService.onMessageRead(handleMessageRead);
      socketService.onMessageDeleted(handleMessageDeleted);
      socketService.onUserTyping(handleUserTyping);
      socketService.onUserStopTyping(handleUserStopTyping);

      // Cleanup
      return () => {
        socketService.leaveRoom(room.id);
        socketService.offNewMessage(handleNewMessage);
        socketService.offMessageRead(handleMessageRead);
        socketService.offMessageDeleted(handleMessageDeleted);
        socketService.offUserTyping(handleUserTyping);
        socketService.offUserStopTyping(handleUserStopTyping);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, currentUserId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await getMessages(room.id);
      if (response.success) {
        setMessages(response.data || []);
        scrollToBottom();
      }
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await markMessagesAsRead(room.id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSendMessage = async (text) => {
    if (!socketService.isConnected()) {
      toast.error('Not connected to chat server');
      return;
    }

    try {
      setSending(true);
      // Send via socket for instant delivery
      socketService.sendMessage(room.id, text);
      // Message will be added via socket event listener
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!room?.id) return;

    // Emit typing event
    socketService.emitTyping(room.id);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to emit stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitStopTyping(room.id);
    }, 2000);
  };

  const handleSendImage = async (file) => {
    try {
      setSending(true);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Add temporary message with preview
      const tempMessage = {
        id: `temp-${Date.now()}`,
        senderId: currentUserId,
        messageType: 'image',
        previewUrl,
        uploading: true,
        createdAt: new Date().toISOString(),
        sender: { id: currentUserId }
      };
      
      setMessages(prev => [...prev, tempMessage]);
      scrollToBottom();
      
      // Upload image
      const response = await sendImageMessage(room.id, file);
      
      if (response.success) {
        // Remove temp message and reload to get actual message
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        await loadMessages();
        toast.success('Image sent');
      }
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => !msg.uploading));
      toast.error(error.message || 'Failed to send image');
    } finally {
      setSending(false);
    }
  };

  const handleSafetyTips = () => {
    toast.info('Safety Tips: Never share personal financial information. Meet in public places. Verify items before payment.');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Early return if no room selected - after all hooks
  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <ChatHeader
        room={room}
        otherUser={otherUser}
        onReport={onReport}
        onRequestContact={onRequestContact}
        onBlock={onBlock}
        onDelete={onDelete}
        onSafetyTips={handleSafetyTips}
        onClose={onClose}
      />

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm mt-2">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                sender={message.sender}
                onImageClick={setSelectedImage}
              />
            ))}
            {/* Typing Indicator */}
            {typingUsers.size > 0 && (
              <div className="flex gap-3 mb-4">
                <div className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        onTyping={handleTyping}
        disabled={sending || !room.isActive}
      />

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
