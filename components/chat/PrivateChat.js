'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Lock } from 'lucide-react';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import useSocket from '@/hooks/useSocket';
import { getAvatarUrl, getInitial } from '@/lib/avatarHelper';


const formatTime = (date) => new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

export default function PrivateChat() {
  const [message, setMessage] = useState('');
  const { privateChat, closePrivateChat, privateMessages, addPrivateMessage, privateTyping } = useChatStore();
  const { user } = useAuthStore();
  const { sendPrivateMessage, sendPrivateTyping, joinPrivateRoom, leavePrivateRoom, loadPrivateMessages } = useSocket();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const typingRef = useRef(false);
  const typingTimeoutRef = useRef(null);

  const roomId = privateChat
    ? [user._id?.toString(), privateChat.userId?.toString()].sort().join('_')
    : null;

  const messages = (roomId && privateMessages[roomId]) || [];
  const isOtherTyping = roomId && privateTyping[roomId];

  useEffect(() => {
    if (!privateChat) return;

    joinPrivateRoom(privateChat.userId);
    loadPrivateMessages(privateChat.userId, roomId);
    inputRef.current?.focus();

    return () => {
      leavePrivateRoom(privateChat.userId);
    };
  }, [privateChat?.userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  const handleTyping = useCallback(() => {
    if (!typingRef.current) {
      typingRef.current = true;
      sendPrivateTyping(privateChat.userId, roomId, true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      typingRef.current = false;
      sendPrivateTyping(privateChat.userId, roomId, false);
    }, 2000);
  }, [privateChat?.userId, roomId, sendPrivateTyping]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendPrivateMessage(privateChat.userId, message.trim());
    setMessage('');
    clearTimeout(typingTimeoutRef.current);
    typingRef.current = false;
    inputRef.current?.focus();
  };

  if (!privateChat) return null;

  return (
    <motion.div
      key="private-chat"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closePrivateChat}
        className="absolute inset-0 drawer-overlay"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg h-[75vh] max-h-[600px] flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0 gradient-orange">
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/40">
              {privateChat.avatar ? (
                <img src={getAvatarUrl(privateChat.avatar)} alt={privateChat.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold">{privateChat.username[0]?.toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white text-sm">{privateChat.username}</h3>
            <div className="flex items-center gap-1">
              <Lock size={10} className="text-white/70" />
              <span className="text-white/70 text-xs">Şifreli özel sohbet</span>
            </div>
          </div>

          <button
            id="close-private-chat"
            onClick={closePrivateChat}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Mesajlar */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-3">🔒</div>
              <p className="text-sm font-medium text-gray-600">{privateChat.username} ile özel sohbet</p>
              <p className="text-xs text-gray-400 mt-1">İlk mesajı siz gönderin!</p>
            </div>
          )}

          {messages.map((msg) => {
            const isOwn = msg.sender?._id === user?._id || msg.sender === user?._id;
            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn
                      ? 'gradient-orange text-white rounded-br-md'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                  }`}
                >
                  <p className="leading-relaxed break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Yazıyor */}
          {isOtherTyping && (
            <div className="flex items-center gap-2 ml-2">
              <div className="flex gap-1 bg-white rounded-full px-3 py-2 shadow-sm">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              <span className="text-xs text-gray-400">{privateChat.username} yazıyor</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center gap-3 flex-shrink-0">
          <input
            ref={inputRef}
            id="private-message-input"
            type="text"
            value={message}
            onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`${privateChat.username}'e mesaj gönder...`}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
          />
          <motion.button
            id="private-send-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              message.trim() ? 'gradient-orange text-white orange-glow' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
