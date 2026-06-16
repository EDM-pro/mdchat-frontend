'use client';

import { useEffect, useCallback, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

const useSocket = () => {
  const socket = getSocket();
  const { user } = useAuthStore();
  const {
    activeChannel,
    addMessage,
    setOnlineUsers,
    setTyping,
    addPrivateMessage,
    setPrivateTyping,
    addNotification,
    privateChat,
    setChannelMessages,
    setPrivateMessages,
  } = useChatStore();

  const typingTimeoutRef = useRef({});

  // Kanala katıl ve mesajları yükle
  const joinChannel = useCallback(
    async (channel) => {
      if (!socket) return;
      socket.emit('join_channel', { channel });

      // Geçmiş mesajları yükle
      try {
        const { data } = await api.get(`/message/channel/${channel}`);
        setChannelMessages(channel, data.messages);
      } catch (err) {
        console.error('Mesaj geçmişi yüklenemedi:', err);
      }
    },
    [socket, setChannelMessages]
  );

  // Özel sohbet mesajlarını yükle
  const loadPrivateMessages = useCallback(
    async (targetUserId, roomId) => {
      try {
        const { data } = await api.get(`/message/private/${targetUserId}`);
        setPrivateMessages(roomId, data.messages);
      } catch (err) {
        console.error('Özel mesajlar yüklenemedi:', err);
      }
    },
    [setPrivateMessages]
  );

  // Mesaj gönder
  const sendMessage = useCallback(
    (content) => {
      if (!socket || !activeChannel || !content?.trim()) return;
      socket.emit('send_message', { channel: activeChannel, content });
    },
    [socket, activeChannel]
  );

  // Özel mesaj gönder
  const sendPrivateMessage = useCallback(
    (targetUserId, content) => {
      if (!socket || !content?.trim()) return;
      socket.emit('send_private_message', { targetUserId, content });
    },
    [socket]
  );

  // Yazıyor göstergesi
  const sendTyping = useCallback(
    (channel, isTyping) => {
      if (!socket) return;
      socket.emit('typing', { channel, isTyping });
    },
    [socket]
  );

  // Özel sohbet yazıyor
  const sendPrivateTyping = useCallback(
    (targetUserId, roomId, isTyping) => {
      if (!socket) return;
      socket.emit('private_typing', { targetUserId, isTyping });
    },
    [socket]
  );

  // Özel sohbet odasına katıl
  const joinPrivateRoom = useCallback(
    (targetUserId) => {
      if (!socket) return;
      socket.emit('join_private', { targetUserId });
    },
    [socket]
  );

  // Özel sohbet odasından ayrıl
  const leavePrivateRoom = useCallback(
    (targetUserId) => {
      if (!socket) return;
      socket.emit('leave_private', { targetUserId });
    },
    [socket]
  );

  // Socket event listener'larını kur
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = ({ message, channel }) => {
      addMessage(channel, message);
    };

    const handleOnlineUsers = ({ channel, users }) => {
      setOnlineUsers(channel, users);
    };

    const handleTypingDisplay = ({ username, isTyping, channel }) => {
      if (username === user?.username) return;

      setTyping(channel, username, isTyping);

      // Auto-clear
      if (isTyping) {
        clearTimeout(typingTimeoutRef.current[`${channel}_${username}`]);
        typingTimeoutRef.current[`${channel}_${username}`] = setTimeout(() => {
          setTyping(channel, username, false);
        }, 3000);
      }
    };

    const handlePrivateMessage = ({ message, roomId }) => {
      addPrivateMessage(roomId, message);
    };

    const handlePrivateTypingDisplay = ({ username, isTyping }) => {
      if (!privateChat) return;
      const roomId = [user._id, privateChat.userId].sort().join('_');
      setPrivateTyping(roomId, username, isTyping);
    };

    const handlePrivateNotification = ({ from, content, roomId }) => {
      addNotification({ from, content, roomId });
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('online_users', handleOnlineUsers);
    socket.on('typing_display', handleTypingDisplay);
    socket.on('receive_private_message', handlePrivateMessage);
    socket.on('private_typing_display', handlePrivateTypingDisplay);
    socket.on('private_notification', handlePrivateNotification);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('online_users', handleOnlineUsers);
      socket.off('typing_display', handleTypingDisplay);
      socket.off('receive_private_message', handlePrivateMessage);
      socket.off('private_typing_display', handlePrivateTypingDisplay);
      socket.off('private_notification', handlePrivateNotification);
    };
  }, [socket, user, activeChannel, privateChat, addMessage, setOnlineUsers, setTyping, addPrivateMessage, setPrivateTyping, addNotification]);

  return {
    joinChannel,
    sendMessage,
    sendPrivateMessage,
    sendTyping,
    sendPrivateTyping,
    joinPrivateRoom,
    leavePrivateRoom,
    loadPrivateMessages,
  };
};

export default useSocket;
