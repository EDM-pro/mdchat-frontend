import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  activeChannel: 'md-arkadaslik',
  messages: {},         // { channelName: [message] }
  privateMessages: {},  // { roomId: [message] }
  onlineUsers: {},      // { channelName: [user] }
  typingUsers: {},      // { channelName: [username] }
  privateTyping: {},    // { roomId: username | null }
  privateChat: null,    // { userId, username, avatar } — açık özel sohbet
  notifications: [],    // Bildirimler

  setActiveChannel: (channel) => {
    set({ activeChannel: channel });
  },

  // Kanal mesajlarını set et (geçmiş yükleme)
  setChannelMessages: (channel, messages) => {
    set((state) => ({
      messages: { ...state.messages, [channel]: messages },
    }));
  },

  // Kanal mesajı ekle
  addMessage: (channel, message) => {
    set((state) => {
      const current = state.messages[channel] || [];
      // Duplicate kontrolü
      if (current.some((m) => m._id === message._id)) return state;
      return { messages: { ...state.messages, [channel]: [...current, message] } };
    });
  },

  // Online kullanıcıları güncelle
  setOnlineUsers: (channel, users) => {
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [channel]: users },
    }));
  },

  // Yazıyor ekle/kaldır
  setTyping: (channel, username, isTyping) => {
    set((state) => {
      const current = state.typingUsers[channel] || [];
      let updated;
      if (isTyping) {
        updated = current.includes(username) ? current : [...current, username];
      } else {
        updated = current.filter((u) => u !== username);
      }
      return { typingUsers: { ...state.typingUsers, [channel]: updated } };
    });
  },

  // Özel sohbet aç
  openPrivateChat: (user) => {
    set({ privateChat: user });
  },

  // Özel sohbeti kapat
  closePrivateChat: () => {
    set({ privateChat: null });
  },

  // Özel mesaj geçmişini set et
  setPrivateMessages: (roomId, messages) => {
    set((state) => ({
      privateMessages: { ...state.privateMessages, [roomId]: messages },
    }));
  },

  // Özel mesaj ekle
  addPrivateMessage: (roomId, message) => {
    set((state) => {
      const current = state.privateMessages[roomId] || [];
      if (current.some((m) => m._id === message._id)) return state;
      return { privateMessages: { ...state.privateMessages, [roomId]: [...current, message] } };
    });
  },

  // Özel sohbet yazıyor
  setPrivateTyping: (roomId, username, isTyping) => {
    set((state) => ({
      privateTyping: { ...state.privateTyping, [roomId]: isTyping ? username : null },
    }));
  },

  // Bildirim ekle
  addNotification: (notification) => {
    set((state) => ({
      notifications: [{ ...notification, id: Date.now() }, ...state.notifications].slice(0, 10),
    }));
  },

  // Bildirimleri temizle
  clearNotifications: () => set({ notifications: [] }),
}));

export default useChatStore;
