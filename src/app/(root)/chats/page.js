/**
 * Chats Page
 * Main chat interface with rooms list and chat window
 */

'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatRoomItem from "@/components/chat/ChatRoomItem";
import ChatWindow from "@/components/chat/ChatWindow";
import { getChatRooms, deleteChatRoom, blockUser, reportUser, requestContact } from "@/app/services/api/chatService";
import socketService from "@/app/services/socketService";
import { toast } from "sonner";

function ChatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filters, setFilters] = useState({
    main: 'all',
    sub: 'all'
  });

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await getChatRooms(filters);
      if (response.success) {
        setRooms(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      router.push('/sign-in');
      return;
    }
    setCurrentUserId(user.id);

    // Connect to socket
    socketService.connect();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [router]);

  useEffect(() => {
    if (currentUserId) {
      loadRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentUserId]);

  // Auto-select room from query parameter or first room
  useEffect(() => {
    if (rooms.length === 0) return;

    const roomId = searchParams.get('room');
    if (roomId) {
      const room = rooms.find(r => r.id === parseInt(roomId));
      if (room) {
        setSelectedRoom(room);
        return;
      }
    }

    // If no room selected and no query param, select first room
    if (!selectedRoom) {
      setSelectedRoom(rooms[0]);
    }
  }, [searchParams, rooms, selectedRoom]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleReport = async () => {
    if (!selectedRoom) return;

    const reportType = prompt('Report reason (spam/inappropriate/scam/other):');
    if (!reportType) return;

    const reason = prompt('Please provide details:');
    if (!reason) return;

    try {
      await reportUser(selectedRoom.id, reportType, reason);
      toast.success('Report submitted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to submit report');
    }
  };

  const handleRequestContact = async () => {
    if (!selectedRoom) return;

    try {
      await requestContact(selectedRoom.id);
      toast.success('Contact request sent');
    } catch (error) {
      toast.error(error.message || 'Failed to request contact');
    }
  };

  const handleBlock = async () => {
    if (!selectedRoom) return;

    const confirmed = confirm('Are you sure you want to block this user?');
    if (!confirmed) return;

    try {
      await blockUser(selectedRoom.id, true, 'Blocked by user');
      toast.success('User blocked successfully');
      setSelectedRoom(null);
      loadRooms();
    } catch (error) {
      toast.error(error.message || 'Failed to block user');
    }
  };

  const handleDelete = async () => {
    if (!selectedRoom) return;

    const confirmed = confirm('Are you sure you want to delete this chat? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteChatRoom(selectedRoom.id);
      toast.success('Chat deleted successfully');
      setSelectedRoom(null);
      loadRooms();
    } catch (error) {
      toast.error(error.message || 'Failed to delete chat');
    }
  };

  const handleClose = async () => {
    // Check if room has no messages and delete it
    if (selectedRoom) {
      const hasMessages = selectedRoom.lastMessageAt !== null;
      if (!hasMessages) {
        try {
          await deleteChatRoom(selectedRoom.id);
          loadRooms();
        } catch (error) {
          console.error('Failed to delete empty room:', error);
        }
      }
    }
    setSelectedRoom(null);
  };

  return (
    <>
      <Header />
      <div className="bg-white" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="h-full flex">
          <div className="bg-white shadow-sm overflow-hidden h-full flex" style={{ width: '100%', maxWidth: '100vw' }}>
            <div className="flex h-full w-full">
              {/* Left Sidebar - Rooms List */}
              <div className="w-80 border-r flex flex-col">
                {/* Filters */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setFilters({ ...filters, main: 'all' })}
                      className={`px-3 py-1 text-sm rounded ${
                        filters.main === 'all' ? 'bg-blue-500 text-white' : 'bg-white border'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, main: 'buying' })}
                      className={`px-3 py-1 text-sm rounded ${
                        filters.main === 'buying' ? 'bg-blue-500 text-white' : 'bg-white border'
                      }`}
                    >
                      Buying
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, main: 'selling' })}
                      className={`px-3 py-1 text-sm rounded ${
                        filters.main === 'selling' ? 'bg-blue-500 text-white' : 'bg-white border'
                      }`}
                    >
                      Selling
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilters({ ...filters, sub: 'all' })}
                      className={`px-2 py-1 text-xs rounded ${
                        filters.sub === 'all' ? 'bg-gray-700 text-white' : 'bg-white border'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, sub: 'unread' })}
                      className={`px-2 py-1 text-xs rounded ${
                        filters.sub === 'unread' ? 'bg-gray-700 text-white' : 'bg-white border'
                      }`}
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, sub: 'important' })}
                      className={`px-2 py-1 text-xs rounded ${
                        filters.sub === 'important' ? 'bg-gray-700 text-white' : 'bg-white border'
                      }`}
                    >
                      Important
                    </button>
                  </div>
                </div>

                {/* Rooms List */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">Loading chats...</div>
                    </div>
                  ) : rooms.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500 p-4">
                        <p>No chats yet</p>
                        <p className="text-sm mt-2">Start browsing listings to chat with sellers</p>
                      </div>
                    </div>
                  ) : (
                    rooms.map((room) => (
                      <ChatRoomItem
                        key={room.id}
                        room={room}
                        isActive={selectedRoom?.id === room.id}
                        onClick={() => handleRoomSelect(room)}
                        currentUserId={currentUserId}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Right Side - Chat Window */}
              <ChatWindow
                room={selectedRoom}
                currentUserId={currentUserId}
                onReport={handleReport}
                onRequestContact={handleRequestContact}
                onBlock={handleBlock}
                onDelete={handleDelete}
                onClose={handleClose}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function ChatsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ChatsContent />
    </Suspense>
  );
}
