'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, User, MessageSquare, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import { getAvatarUrl } from '@/lib/avatarHelper';

export default function ProfilePanel() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    username: user?.username || '',
    statusMessage: user?.statusMessage || '',
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/user/profile', form);
      updateUser(data.user);
      toast.success('Profil güncellendi!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Güncelleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Önizleme
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Yükle
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      toast.success('Avatar güncellendi!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Avatar yüklenemedi');
      setAvatarPreview(null);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const { data } = await api.delete('/user/avatar');
      updateUser(data.user);
      setAvatarPreview(null);
      toast.success('Avatar silindi');
    } catch (err) {
      toast.error('Avatar silinemedi');
    }
  };

  const currentAvatar = avatarPreview || getAvatarUrl(user?.avatar);

  return (
    <div className="p-5 space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-orange-100">
            {currentAvatar ? (
              <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-orange flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{user?.username?.[0]?.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Kamera butonu */}
          <motion.button
            id="avatar-upload-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarLoading}
            className="absolute -bottom-2 -right-2 w-9 h-9 gradient-orange rounded-xl flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
          >
            {avatarLoading ? (
              <Loader size={16} className="text-white animate-spin" />
            ) : (
              <Camera size={16} className="text-white" />
            )}
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {user?.avatar && !avatarPreview && (
          <button
            onClick={handleRemoveAvatar}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Avatarı Kaldır
          </button>
        )}
        <p className="text-xs text-gray-400 text-center">JPG, PNG, GIF veya WebP (max 5MB)</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Kullanıcı Adı */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Kullanıcı Adı
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="profile-username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={user?.nickProtected}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {user?.nickProtected && (
            <p className="text-xs text-orange-500 mt-1">🔒 Nick korumalı. Nick Şifreleme sekmesinden değiştirin.</p>
          )}
        </div>

        {/* Durum Mesajı */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Durum Mesajı
          </label>
          <div className="relative">
            <MessageSquare size={16} className="absolute left-3 top-3 text-gray-400" />
            <textarea
              id="profile-status"
              value={form.statusMessage}
              onChange={(e) => setForm({ ...form, statusMessage: e.target.value.slice(0, 100) })}
              placeholder="Kendinizi tanıtın..."
              rows={3}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
            />
          </div>
          <p className="text-xs text-gray-400 text-right mt-1">{form.statusMessage.length}/100</p>
        </div>

        {/* Kaydet */}
        <motion.button
          id="save-profile-btn"
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full gradient-orange text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 orange-glow hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <><Loader size={16} className="animate-spin" /> Kaydediliyor...</>
          ) : (
            <><Save size={16} /> Değişiklikleri Kaydet</>
          )}
        </motion.button>
      </form>

      {/* Hesap Bilgileri */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hesap Bilgileri</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">E-posta</span>
            <span className="font-medium text-gray-700 text-right text-xs">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Hesap Durumu</span>
            <span className="text-green-600 font-medium text-xs">✓ Doğrulandı</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Üyelik</span>
            <span className="font-medium text-gray-700 text-xs">
              {new Date(user?.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
