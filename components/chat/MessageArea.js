'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';

const CHANNEL_LABELS = {
  'md-arkadaslik': { label: 'MD Arkadaşlık', emoji: '👥', desc: 'Yeni arkadaşlar edin, tanışın!' },
  'md-sohbet': { label: 'MD Sohbet', emoji: '💬', desc: 'Genel sohbet alanı' },
  'md-serbest': { label: 'MD Serbest', emoji: '🎯', desc: 'Özgürce konuşun' },
};

export default function MessageArea() {
  const { activeChannel, messages, typingUsers } = useChatStore();
  const { user } = useAuthStore();
  const bottomRef = useRef(null);

  const channelMessages = messages[activeChannel] || [];
  const typing = typingUsers[activeChannel] || [];
  const channel = CHANNEL_LABELS[activeChannel];

  // Yeni mesajda otomatik kaydır
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages, typing]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
      {/* Kanal Başlığı */}
      {channelMessages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
          <div className="w-20 h-20 rounded-3xl gradient-orange-soft flex items-center justify-center mb-4 text-4xl">
            {channel?.emoji}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{channel?.label}</h3>
          <p className="text-gray-400 text-sm max-w-xs">{channel?.desc}</p>
          <p className="text-gray-300 text-xs mt-2">İlk mesajı siz gönderin!</p>
        </div>
      )}

      {/* Mesajlar */}
      <AnimatePresence initial={false}>
        {channelMessages.map((message, index) => {
          const prevMessage = channelMessages[index - 1];
          const showAvatar =
            !prevMessage || prevMessage.sender?._id !== message.sender?._id;
          const isOwn = message.sender?._id === user?._id || message.sender === user?._id;

          return (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={isOwn}
              showAvatar={showAvatar}
            />
          );
        })}
      </AnimatePresence>

      {/* Yazıyor göstergesi */}
      {typing.length > 0 && (
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex gap-1">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
          <span className="text-xs text-gray-400">
            {typing.length === 1
              ? `${typing[0]} yazıyor...`
              : `${typing.slice(0, -1).join(', ')} ve ${typing.slice(-1)} yazıyor...`}
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
