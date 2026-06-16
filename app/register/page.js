'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, MessageCircle, ArrowRight, CheckCircle, Shield, Zap, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

const features = [
  { icon: Zap, text: 'Gerçek zamanlı mesajlaşma' },
  { icon: Shield, text: 'Güvenli özel sohbetler' },
  { icon: Users, text: 'Canlı topluluk kanalları' },
  { icon: CheckCircle, text: 'E-posta doğrulaması' },
];

function PasswordStrength({ password }) {
  const checks = [
    { label: '6+ karakter', met: password.length >= 6 },
    { label: 'Büyük harf', met: /[A-Z]/.test(password) },
    { label: 'Rakam', met: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.met).length;
  const colors = ['bg-red-400', 'bg-yellow-400', 'bg-green-400'];
  const labels = ['Zayıf', 'Orta', 'Güçlü'];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <span key={c.label} className={`text-xs flex items-center gap-1 transition-colors ${c.met ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${c.met ? 'bg-green-500' : 'bg-gray-300'}`} />
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span className={`text-xs font-medium ${score === 3 ? 'text-green-600' : score === 2 ? 'text-yellow-600' : 'text-red-500'}`}>{labels[score - 1]}</span>}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');

  const validateForm = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Tüm alanları doldurun'); return false;
    }
    if (form.username.length < 3) {
      toast.error('Kullanıcı adı en az 3 karakter olmalıdır'); return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) {
      toast.error('Kullanıcı adı sadece harf, rakam, _ ve - içerebilir'); return false;
    }
    if (form.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır'); return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Şifreler eşleşmiyor'); return false;
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

  const inputClass = (field, extraClass = '') =>
    `w-full pl-11 pr-4 py-3.5 border-2 rounded-2xl text-sm font-medium transition-all duration-200 outline-none bg-gray-50/80 ${extraClass} ${
      focused === field
        ? 'border-orange-400 bg-white shadow-md shadow-orange-100 scale-[1.01]'
        : 'border-gray-200 hover:border-gray-300'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sol Panel */}
      <div className="hidden lg:flex lg:w-[45%] gradient-orange items-center justify-center relative overflow-hidden">
        {/* Dekoratif halkalar */}
        <div className="absolute inset-0">
          {[300, 500, 700, 900].map((size, i) => (
            <motion.div
              key={i}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
              className="absolute border border-white/10 rounded-full"
              style={{ width: size, height: size, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          ))}
        </div>

        {/* Parlayan daireler */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-yellow-300/15 rounded-full blur-3xl" />

        <div className="relative z-10 text-center text-white px-10 max-w-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-28 h-28 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl"
          >
            <MessageCircle size={52} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-black mb-3 tracking-tight"
          >
            MD Chat
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-lg font-light mb-10 leading-relaxed"
          >
            Topluluğumuza katılın,<br />yeni insanlarla tanışın
          </motion.p>

          <div className="space-y-3 text-left">
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/12 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <f.icon size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">{f.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex items-center justify-center gap-2 text-white/60 text-xs"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Binlerce kullanıcı çevrimiçi
          </motion.div>
        </div>
      </div>

      {/* Sağ Panel */}
      <div className="w-full lg:w-[55%] flex items-center justify-center px-6 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobil Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-orange flex items-center justify-center shadow-lg shadow-orange-200">
              <MessageCircle size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900">MD Chat</span>
          </div>

          {/* Başlık */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Hesap Oluşturun</h2>
            <p className="text-gray-500 text-base">Ücretsiz kaydolun, saniyeler içinde başlayın</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Kullanıcı Adı */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kullanıcı Adı <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused === 'username' ? 'text-orange-500' : 'text-gray-400'}`}>
                  <User size={18} />
                </div>
                <input
                  id="register-username"
                  type="text"
                  placeholder="kullaniciadiniz"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  className={inputClass('username')}
                />
                <AnimatePresence>
                  {form.username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(form.username) && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    >
                      <CheckCircle size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 ml-1">Harf, rakam, _ ve - kullanabilirsiniz</p>
            </div>

            {/* E-posta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-posta <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-orange-500' : 'text-gray-400'}`}>
                  <Mail size={18} />
                </div>
                <input
                  id="register-email"
                  type="email"
                  placeholder="ornek@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  className={inputClass('email')}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 ml-1">Doğrulama kodu bu adrese gönderilecek</p>
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Şifre <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-orange-500' : 'text-gray-400'}`}>
                  <Lock size={18} />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="En az 6 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  className={inputClass('password', 'pr-12')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Şifre Tekrar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Şifre Tekrar <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  form.confirmPassword && form.password !== form.confirmPassword ? 'text-red-400' :
                  form.confirmPassword && form.password === form.confirmPassword ? 'text-green-500' :
                  focused === 'confirm' ? 'text-orange-500' : 'text-gray-400'
                }`}>
                  <Lock size={18} />
                </div>
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifrenizi tekrar girin"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused('')}
                  className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-2xl text-sm font-medium transition-all duration-200 outline-none ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-300 bg-red-50 shadow-sm shadow-red-100'
                      : form.confirmPassword && form.password === form.confirmPassword
                      ? 'border-green-300 bg-green-50 shadow-sm shadow-green-100'
                      : focused === 'confirm'
                      ? 'border-orange-400 bg-white shadow-md shadow-orange-100 scale-[1.01]'
                      : 'border-gray-200 bg-gray-50/80 hover:border-gray-300'
                  }`}
                />
                <AnimatePresence>
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500">
                      <CheckCircle size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-500 mt-1.5 ml-1">
                    ⚠️ Şifreler eşleşmiyor
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01, boxShadow: '0 8px 30px rgba(249,115,22,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full gradient-orange text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg shadow-orange-200"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Hesap oluşturuluyor...
                </>
              ) : (
                <>
                  Hesap Oluştur
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Giriş linki */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-orange-600 font-bold hover:text-orange-700 transition-colors underline underline-offset-2">
                Giriş Yapın →
              </Link>
            </p>
          </div>

          {/* Güvenlik notu */}
          <div className="mt-6 flex items-center gap-2 justify-center text-xs text-gray-400">
            <Shield size={14} className="text-gray-300" />
            SSL şifreli bağlantı · Verileriniz güvende
          </div>
        </motion.div>
      </div>
    </div>
  );
}
