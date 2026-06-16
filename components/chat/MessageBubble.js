'use client';

import { motion } from 'framer-motion';
import { getAvatarUrl, getInitial } from '@/lib/avatarHelper';

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

export default function MessageBubble({ message, isOwn, showAvatar }) {
  const senderName = message.sender?.username || 'Kullanıcı';
  const avatarUrl = getAvatarUrl(message.sender?.avatar);
  const initial = getInitial(senderName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${!showAvatar ? (isOwn ? 'pr-10' : 'pl-10') : ''}`}
    >
      {/* Avatar */}
      {showAvatar ? (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1">
          {avatarUrl ? (
            <img src={avatarUrl} alt={senderName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-orange flex items-center justify-center">
              <span className="text-white text-xs font-bold">{initial}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Balon */}
      <div className={`max-w-[70%] sm:max-w-[60%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Gönderen adı (sadece başkalarının mesajlarında) */}
        {!isOwn && showAvatar && (
          <span className="text-xs font-semibold text-orange-600 mb-1 ml-1">{senderName}</span>
        )}

        <div className="group relative">
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
              isOwn
                ? 'gradient-orange text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}
          >
            {message.content}
          </div>

          {/* Saat */}
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[10px] text-gray-400">
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
