'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Tüm alanları doldurun');
      return false;
    }
    if (form.username.length < 3) {
      toast.error('Kullanıcı adı en az 3 karakter olmalıdır');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) {
      toast.error('Kullanıcı adı sadece harf, rakam, _ ve - içerebilir');
      return false;
    }
    if (form.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await register(form.username, form.email, form.password);

    if (result.success) {
      toast.success('Kayıt başarılı! E-postanızı kontrol edin.');
      router.push(`/verify?email=${encodeURIComponent(result.email)}`);
    } else {
      toast.error(result.message || 'Kayıt başarısız');
    }
  };

  const requirements = [
    { label: 'En az 3 karakter', met: form.username.length >= 3 },
    { label: 'Harf, rakam, _ veya - içerir', met: /^[a-zA-Z0-9_-]+$/.test(form.username) && form.username.length > 0 },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sol Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-orange items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-white"
              style={{ width: `${(i+1)*120}px`, height: `${(i+1)*120}px`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white px-8">
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <MessageCircle size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">MD Chat</h1>
          <p className="text-xl text-white/85 font-light max-w-sm mx-auto">
            Topluluğumuza katılın, yeni insanlarla tanışın
          </p>
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {['Gerçek zamanlı mesajlaşma', 'Güvenli özel sohbetler', 'Nick koruması', 'E-posta doğrulaması'].map((f) => (
              <div key={f} className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-2.5">
                <CheckCircle size={16} className="text-white flex-shrink-0" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center orange-glow">
              <MessageCircle size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MD Chat</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hesap Oluşturun</h2>
          <p className="text-gray-500 mb-8">Birkaç saniyede ücretsiz kaydolun</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kullanıcı Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı (Nick)</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="register-username"
                  type="text"
                  placeholder="kullaniciadiniz"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all outline-none bg-gray-50 focus:bg-white"
                />
              </div>
              {form.username && (
                <div className="mt-2 space-y-1">
                  {requirements.map((r) => (
                    <div key={r.label} className="flex items-center gap-2 text-xs">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${r.met ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {r.met && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8"><path d="M3 6L0 3l1-1 2 2 4-4 1 1z"/></svg>}
                      </div>
                      <span className={r.met ? 'text-green-600' : 'text-gray-400'}>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* E-posta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="ornek@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all outline-none bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="En az 6 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all outline-none bg-gray-50 focus:bg-white"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Şifre Tekrar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifrenizi tekrar girin"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:ring-2 transition-all outline-none bg-gray-50 focus:bg-white ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                  }`}
                />
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Şifreler eşleşmiyor</p>
              )}
            </div>

            <motion.button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full gradient-orange text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 orange-glow hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Kaydediliyor...</>
              ) : (
                <>Hesap Oluştur <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
              Giriş Yapın
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
