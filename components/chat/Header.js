'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Users, Bell, MessageCircle, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import useChatStore from '@/store/chatStore';
import useUIStore from '@/store/uiStore';
import useSocket from '@/hooks/useSocket';
import { getAvatarUrl } from '@/lib/avatarHelper';
import toast from 'react-hot-toast';

const CHANNELS = [
  { id: 'md-arkadaslik', label: 'MD Arkadaşlık', emoji: '👥' },
  { id: 'md-sohbet', label: 'MD Sohbet', emoji: '💬' },
  { id: 'md-serbest', label: 'MD Serbest', emoji: '🎯' },
];

export default function Header() {
  const { user } = useAuthStore();
  const { activeChannel, setActiveChannel, notifications } = useChatStore();
  const { openLeftDrawer, toggleMobileOnline } = useUIStore();
  const { joinChannel } = useSocket();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    // iOS Safari kontrolü
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) setIsInstallable(true);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) {
      toast('📱 Safari\'de "Paylaş" → "Ana Ekrana Ekle" seçin!', { duration: 5000, icon: '📲' });
      return;
    }
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      toast.success('Uygulama yüklendi! 🎉');
      setIsInstallable(false);
    }
  };

  const handleChannelClick = (channelId) => {
    if (channelId === activeChannel) return;
    setActiveChannel(channelId);
    joinChannel(channelId);
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0 z-20">
      <div className="flex items-center gap-3 px-4 h-16">
        {/* Hamburger Menü */}
        <motion.button
          id="menu-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openLeftDrawer('profile')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors flex-shrink-0"
        >
          <Menu size={22} />
        </motion.button>

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 hidden sm:block text-sm">MD Chat</span>
        </div>

        {/* Kanal Sekmeleri */}
        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto scrollbar-none">
          {CHANNELS.map((channel) => (
            <motion.button
              key={channel.id}
              id={`channel-${channel.id}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChannelClick(channel.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeChannel === channel.id
                  ? 'gradient-orange text-white orange-glow shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{channel.emoji}</span>
              <span className="hidden sm:inline">{channel.label}</span>
              <span className="sm:hidden">{channel.label.split(' ')[1]}</span>
            </motion.button>
          ))}
        </div>

        {/* Sağ Aksiyonlar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Bildirim */}
          {notifications.length > 0 && (
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-orange-500 absolute -top-0.5 -right-0.5 animate-pulse" />
              <Bell size={20} className="text-gray-500" />
            </div>
          )}

          {/* Uygulamayı Yükle */}
          <AnimatePresence>
            {isInstallable && (
              <motion.button
                id="install-app-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl gradient-orange text-white text-xs font-semibold orange-glow hover:opacity-90 transition-opacity flex-shrink-0"
                title="Uygulamayı telefona yükle"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Yükle</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobil - Online Kullanıcılar */}
          <motion.button
            id="online-users-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileOnline}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <Users size={20} />
          </motion.button>

          {/* Avatar */}
          <motion.button
            id="avatar-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLeftDrawer('profile')}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-orange-200 hover:ring-orange-400 transition-all flex-shrink-0"
          >
            {user?.avatar ? (
              <img src={getAvatarUrl(user.avatar)} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-orange flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
