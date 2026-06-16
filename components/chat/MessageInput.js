'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile } from 'lucide-react';
import useSocket from '@/hooks/useSocket';
import useChatStore from '@/store/chatStore';

export default function MessageInput() {
  const [content, setContent] = useState('');
  const { activeChannel } = useChatStore();
  const { sendMessage, sendTyping } = useSocket();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const inputRef = useRef(null);

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTyping(activeChannel, true);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTyping(activeChannel, false);
    }, 2000);
  }, [activeChannel, sendTyping]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!content.trim()) return;

    sendMessage(content);
    setContent('');

    // Yazıyor durumunu kapat
    clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    sendTyping(activeChannel, false);

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = content.trim().length > 0;

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            id="message-input"
            ref={inputRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın... (Enter ile gönder)"
            rows={1}
            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white outline-none transition-all max-h-32 overflow-y-auto"
            style={{ lineHeight: '1.5' }}
          />
        </div>

        {/* Gönder Butonu */}
        <motion.button
          id="send-btn"
          type="submit"
          disabled={!canSend}
          whileHover={canSend ? { scale: 1.05 } : {}}
          whileTap={canSend ? { scale: 0.95 } : {}}
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            canSend
              ? 'gradient-orange text-white orange-glow hover:opacity-90'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </motion.button>
      </form>
    </div>
  );
}
