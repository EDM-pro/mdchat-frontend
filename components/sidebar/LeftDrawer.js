'use client';

import { motion } from 'framer-motion';
import { User, Shield, LogOut, X, MessageCircle, ChevronRight } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useUIStore from '@/store/uiStore';
import ProfilePanel from './ProfilePanel';
import NickProtect from './NickProtect';
import { getAvatarUrl, getInitial } from '@/lib/avatarHelper';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'profile', label: 'Profil', icon: User, desc: 'Bilgilerini düzenle' },
  { id: 'nickprotect', label: 'Nick Şifreleme', icon: Shield, desc: 'Nick\'ini koru' },
];

export default function LeftDrawer() {
  const { user, logout } = useAuthStore();
  const { leftDrawerTab, setLeftDrawerTab, closeLeftDrawer } = useUIStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Çıkış yapıldı. Güle güle! 👋');
    closeLeftDrawer();
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="gradient-orange px-5 py-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-white" />
            <span className="font-bold text-white">MD Chat</span>
          </div>
          <button
            id="close-drawer"
            onClick={closeLeftDrawer}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Kullanıcı Bilgisi */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/40">
            {user?.avatar ? (
              <img
                src={getAvatarUrl(user.avatar)}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{getInitial(user?.username)}</span>
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-white text-base">{user?.username}</p>
            <p className="text-white/75 text-xs">{user?.email}</p>
            {user?.statusMessage && (
              <p className="text-white/60 text-xs truncate max-w-[180px] mt-0.5">{user.statusMessage}</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/70">Online</span>
              {user?.nickProtected && (
                <>
                  <div className="w-1 h-1 rounded-full bg-white/40 mx-1" />
                  <Shield size={10} className="text-yellow-300" />
                  <span className="text-xs text-yellow-300">Korumalı</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigasyon */}
      <div className="px-3 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`drawer-tab-${tab.id}`}
              onClick={() => setLeftDrawerTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                leftDrawerTab === tab.id
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab İçeriği */}
      <div className="flex-1 overflow-y-auto">
        {leftDrawerTab === 'profile' && <ProfilePanel />}
        {leftDrawerTab === 'nickprotect' && <NickProtect />}
      </div>

      {/* Çıkış */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <motion.button
          id="logout-btn"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="font-medium text-sm">Çıkış Yap</span>
          </div>
          <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>
    </div>
  );
}
