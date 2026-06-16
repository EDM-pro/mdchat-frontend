'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, MessageCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Tüm alanları doldurun');
      return;
    }

    const result = await login(form.email, form.password);

    if (result.success) {
      toast.success('Giriş başarılı! Hoş geldiniz 👋');
      router.push('/chat');
    } else if (result.code === 'EMAIL_NOT_VERIFIED') {
      toast.error('E-postanızı doğrulamanız gerekiyor');
      router.push(`/verify?email=${encodeURIComponent(result.email)}`);
    } else {
      toast.error(result.message || 'Giriş başarısız');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol Panel - Dekoratif */}
      <div className="hidden lg:flex lg:w-1/2 gradient-orange items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white px-8">
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <MessageCircle size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">MD Chat</h1>
          <p className="text-xl text-white/85 font-light max-w-sm mx-auto">
            Anlık mesajlaşmanın en modern ve güvenli adresi
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            {['MD Arkadaşlık', 'MD Sohbet', 'MD Serbest'].map((ch) => (
              <div key={ch} className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                {ch}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobil Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center orange-glow">
              <MessageCircle size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MD Chat</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tekrar hoş geldiniz!</h2>
          <p className="text-gray-500 mb-8">Hesabınıza giriş yapın</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* E-posta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="login-email"
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
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all outline-none bg-gray-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Giriş Butonu */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full gradient-orange text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 orange-glow hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
              Hemen Kayıt Olun
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
