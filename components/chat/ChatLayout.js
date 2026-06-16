'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';
import PrivateChat from './PrivateChat';
import LeftDrawer from '@/components/sidebar/LeftDrawer';
import useSocket from '@/hooks/useSocket';
import useChatStore from '@/store/chatStore';
import useUIStore from '@/store/uiStore';

export default function ChatLayout() {
  const { activeChannel, privateChat } = useChatStore();
  const { isLeftDrawerOpen, isMobileOnlineOpen, closeLeftDrawer, closeMobileOnline } = useUIStore();
  const { joinChannel } = useSocket();

  // Başlangıçta ilk kanala katıl
  useEffect(() => {
    joinChannel(activeChannel);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Üst Header + Kanallar */}
      <Header />

      {/* Ana İçerik */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Orta - Mesaj Alanı */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          <MessageArea />
          <MessageInput />
        </main>

        {/* Sağ - Online Kullanıcılar (Desktop) */}
        <aside className="hidden lg:flex w-64 xl:w-72 flex-col bg-white border-l border-gray-100">
          <OnlineUsers />
        </aside>

        {/* Mobil - Online Kullanıcılar Drawer */}
        <AnimatePresence>
          {isMobileOnlineOpen && (
            <>
              <motion.div
                key="mobile-online-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileOnline}
                className="lg:hidden fixed inset-0 z-30 drawer-overlay"
              />
              <motion.aside
                key="mobile-online-drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="lg:hidden fixed right-0 top-0 bottom-0 z-40 w-72 bg-white shadow-2xl flex flex-col"
              >
                <OnlineUsers onClose={closeMobileOnline} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Sol Drawer */}
      <AnimatePresence>
        {isLeftDrawerOpen && (
          <>
            <motion.div
              key="left-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLeftDrawer}
              className="fixed inset-0 z-40 drawer-overlay"
            />
            <motion.div
              key="left-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl"
            >
              <LeftDrawer />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Özel Sohbet Overlay */}
      <AnimatePresence>
        {privateChat && <PrivateChat />}
      </AnimatePresence>
    </div>
  );
}
