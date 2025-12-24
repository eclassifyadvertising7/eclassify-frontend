import httpClient from "@/app/services/httpClient";

export const getChatRooms = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.main) params.append('main', filters.main);
    if (filters.sub) params.append('sub', filters.sub);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const endpoint = `/end-user/chats/rooms${params.toString() ? `?${params.toString()}` : ''}`;
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    throw error;
  }
};

export const createOrGetChatRoom = async (listingId) => {
  try {
    return await httpClient.post('/end-user/chats/rooms/create', { listingId });
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw error;
  }
};

export const getRoomDetails = async (roomId) => {
  try {
    return await httpClient.get(`/end-user/chats/rooms/view/${roomId}`);
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }
};

export const deleteChatRoom = async (roomId) => {
  try {
    return await httpClient.delete(`/end-user/chats/rooms/delete/${roomId}`);
  } catch (error) {
    console.error('Error deleting chat room:', error);
    throw error;
  }
};

export const toggleImportant = async (roomId, isImportant) => {
  try {
    return await httpClient.patch(`/end-user/chats/rooms/important/${roomId}`, { isImportant });
  } catch (error) {
    console.error('Error toggling important flag:', error);
    throw error;
  }
};

export const blockUser = async (roomId, blocked, reason = '') => {
  try {
    return await httpClient.patch(`/end-user/chats/rooms/block/${roomId}`, { blocked, reason });
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

export const reportUser = async (roomId, reportType, reason) => {
  try {
    return await httpClient.post(`/end-user/chats/rooms/report/${roomId}`, { reportType, reason });
  } catch (error) {
    console.error('Error reporting user:', error);
    throw error;
  }
};

export const getMessages = async (roomId, page = 1, limit = 50) => {
  try {
    const params = new URLSearchParams({ page, limit });
    return await httpClient.get(`/end-user/chats/messages/list/${roomId}?${params.toString()}`);
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendTextMessage = async (roomId, messageText, replyToMessageId = null) => {
  try {
    return await httpClient.post(`/end-user/chats/messages/send/${roomId}`, {
      messageType: 'text',
      messageText,
      replyToMessageId
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const sendImageMessage = async (roomId, imageFile, caption = '') => {
  try {
    const formData = new FormData();
    formData.append('messageType', 'image');
    formData.append('messageText', caption);
    formData.append('image', imageFile);

    return await httpClient.upload(`/end-user/chats/messages/send/${roomId}`, formData);
  } catch (error) {
    console.error('Error sending image:', error);
    throw error;
  }
};

export const sendLocationMessage = async (roomId, locationData, messageText = '') => {
  try {
    return await httpClient.post(`/end-user/chats/messages/send/${roomId}`, {
      messageType: 'location',
      messageText,
      locationData
    });
  } catch (error) {
    console.error('Error sending location:', error);
    throw error;
  }
};

export const editMessage = async (messageId, messageText) => {
  try {
    return await httpClient.patch(`/end-user/chats/messages/edit/${messageId}`, { messageText });
  } catch (error) {
    console.error('Error editing message:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    return await httpClient.delete(`/end-user/chats/messages/delete/${messageId}`);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (roomId) => {
  try {
    return await httpClient.patch(`/end-user/chats/messages/mark-read/${roomId}`);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

export const requestContact = async (roomId) => {
  try {
    return await httpClient.post(`/end-user/chats/contact/request/${roomId}`);
  } catch (error) {
    console.error('Error requesting contact:', error);
    throw error;
  }
};

export const shareContact = async (roomId, phone, email) => {
  try {
    return await httpClient.post(`/end-user/chats/contact/share/${roomId}`, { phone, email });
  } catch (error) {
    console.error('Error sharing contact:', error);
    throw error;
  }
};
