'use client';

import { motion } from 'framer-motion';
import { Users, X } from 'lucide-react';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import { getAvatarUrl, getInitial } from '@/lib/avatarHelper';

function UserCard({ user, onClick }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: '#FFF7ED', x: 2 }}
      onClick={() => onClick(user)}
      id={`user-${user.userId}`}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl mx-2 transition-colors group"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-full overflow-hidden">
          {user.avatar ? (
            <img src={getAvatarUrl(user.avatar)} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-orange flex items-center justify-center">
              <span className="text-white text-sm font-bold">{getInitial(user.username)}</span>
            </div>
          )}
        </div>
        {/* Online nokta */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white online-pulse" />
      </div>

      {/* Bilgi */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
          {user.username}
        </p>
        {user.statusMessage && (
          <p className="text-xs text-gray-400 truncate">{user.statusMessage}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function OnlineUsers({ onClose }) {
  const { activeChannel, onlineUsers, openPrivateChat } = useChatStore();
  const { user } = useAuthStore();

  const users = (onlineUsers[activeChannel] || []).filter(
    (u) => u.userId !== user?._id?.toString()
  );

  const handleUserClick = (targetUser) => {
    openPrivateChat(targetUser);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Başlık */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-orange-500" />
          <span className="text-sm font-semibold text-gray-700">Online Üyeler</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {users.length}
          </div>
          {onClose && (
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="flex-1 overflow-y-auto py-2">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <div className="text-3xl mb-2">👤</div>
            <p className="text-xs text-gray-400">Bu kanalda başka online üye yok</p>
          </div>
        ) : (
          users.map((u) => (
            <UserCard key={u.userId} user={u} onClick={handleUserClick} />
          ))
        )}
      </div>

      {/* Alt not */}
      <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <p className="text-[10px] text-gray-300 text-center">
          Özel sohbet için üzerine tıklayın
        </p>
      </div>
    </div>
  );
}
