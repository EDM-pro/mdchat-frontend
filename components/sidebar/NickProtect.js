'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Unlock, Eye, EyeOff, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

export default function NickProtect() {
  const { user, updateUser } = useAuthStore();
  const [action, setAction] = useState(null); // 'enable' | 'disable' | 'change'
  const [form, setForm] = useState({ nickPassword: '', currentPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const isProtected = user?.nickProtected;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (action === 'enable' && form.nickPassword !== form.confirmPassword) {
      toast.error('Şifreler eşleşmiyor'); return;
    }
    if (action === 'enable' && form.nickPassword.length < 4) {
      toast.error('Şifre en az 4 karakter olmalıdır'); return;
    }

    setLoading(true);
    try {
      const payload = { action };
      if (action === 'enable') {
        payload.nickPassword = form.nickPassword;
      } else if (action === 'disable') {
        payload.currentPassword = form.currentPassword;
      } else if (action === 'change') {
        payload.currentPassword = form.currentPassword;
        payload.nickPassword = form.nickPassword;
      }

      const { data } = await api.post('/user/nick-protect', payload);
      updateUser({
        nickProtected: action === 'enable' || action === 'change' ? true : false,
      });
      toast.success(data.message);
      setAction(null);
      setForm({ nickPassword: '', currentPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-5">
      {/* Durum Kartı */}
      <div className={`rounded-2xl p-4 ${isProtected ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isProtected ? 'bg-green-100' : 'gradient-orange'}`}>
            <Shield size={22} className={isProtected ? 'text-green-600' : 'text-white'} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{user?.username}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isProtected ? (
                <>
                  <CheckCircle size={13} className="text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Nick korumalı</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={13} className="text-orange-500" />
                  <span className="text-xs text-orange-600 font-medium">Nick korumasız</span>
                </>
              )}
            </div>
          </div>
        </div>
        {isProtected && (
          <p className="text-xs text-green-600 mt-3 bg-green-100 rounded-lg px-3 py-2">
            🔒 Nick'iniz başkaları tarafından alınamaz. Şifrenizi bilmeden değiştirilemez.
          </p>
        )}
        {!isProtected && (
          <p className="text-xs text-orange-600 mt-3 bg-orange-100 rounded-lg px-3 py-2">
            ⚠️ Nick'iniz korumasız. Başkaları bu nick'i alabilir.
          </p>
        )}
      </div>

      {/* Eylem Butonları */}
      {!action && (
        <div className="space-y-2">
          {!isProtected && (
            <motion.button
              id="nick-enable-btn"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setAction('enable')}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              <Lock size={18} />
              <div className="text-left">
                <p className="font-semibold text-sm">Nick Korumasını Aktif Et</p>
                <p className="text-xs text-gray-400">Şifre ile nick'inizi kilitleyin</p>
              </div>
            </motion.button>
          )}

          {isProtected && (
            <>
              <motion.button
                id="nick-change-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setAction('change')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl gradient-orange text-white orange-glow hover:opacity-90 transition-opacity"
              >
                <Shield size={18} />
                <div className="text-left">
                  <p className="font-semibold text-sm">Şifreyi Değiştir</p>
                  <p className="text-xs text-white/70">Nick şifrenizi güncelleyin</p>
                </div>
              </motion.button>

              <motion.button
                id="nick-disable-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setAction('disable')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
              >
                <Unlock size={18} />
                <div className="text-left">
                  <p className="font-semibold text-sm">Korumayı Kaldır</p>
                  <p className="text-xs text-red-400">Nick kilidini açın</p>
                </div>
              </motion.button>
            </>
          )}
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {action && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">
                {action === 'enable' && '🔒 Nick Korumasını Aktif Et'}
                {action === 'disable' && '🔓 Korumayı Kaldır'}
                {action === 'change' && '🔄 Şifre Değiştir'}
              </h3>
              <button type="button" onClick={() => { setAction(null); setForm({ nickPassword: '', currentPassword: '', confirmPassword: '' }); }}
                className="text-xs text-gray-400 hover:text-gray-600">İptal</button>
            </div>

            {/* Mevcut şifre (disable/change için) */}
            {(action === 'disable' || action === 'change') && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Mevcut Nick Şifresi</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                    placeholder="Mevcut şifre"
                    required
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Yeni şifre (enable/change için) */}
            {(action === 'enable' || action === 'change') && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    {action === 'change' ? 'Yeni Nick Şifresi' : 'Nick Şifresi'}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.nickPassword}
                      onChange={(e) => setForm({ ...form, nickPassword: e.target.value })}
                      placeholder="En az 4 karakter"
                      required
                      className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none bg-gray-50"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Şifre Tekrar</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Şifreyi tekrar girin"
                      required
                      className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none bg-gray-50 ${
                        form.confirmPassword && form.nickPassword !== form.confirmPassword
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            <motion.button
              id="nick-submit-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                action === 'disable'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'gradient-orange text-white orange-glow hover:opacity-90'
              } disabled:opacity-60`}
            >
              {loading ? (
                <><Loader size={16} className="animate-spin" /> İşleniyor...</>
              ) : (
                action === 'enable' ? '🔒 Koru' : action === 'disable' ? '🔓 Korumayı Kaldır' : '🔄 Güncelle'
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bilgi */}
      <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1.5">
        <p className="font-semibold text-gray-600">Nick Şifreleme Nedir?</p>
        <p>• Nick'inizi şifreyle kilitleyerek başkalarının almasını engellersiniz</p>
        <p>• Şifrenizi bilen kişi bile nick'inizi alamaz (sadece siz kullanabilirsiniz)</p>
        <p>• Şifrenizi unutursanız nick'inizi geri alamayabilirsiniz</p>
      </div>
    </div>
  );
}
