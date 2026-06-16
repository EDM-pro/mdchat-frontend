'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const { verifyOTP, resendOTP, isLoading } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== '') && value) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    if (pasted.length === 6) handleVerify(pasted);
  };

  const handleVerify = async (code) => {
    const result = await verifyOTP(email, code);
    if (result.success) {
      setVerified(true);
      toast.success('E-posta doğrulandı! 🎉');
      setTimeout(() => router.push('/chat'), 1500);
    } else {
      toast.error(result.message || 'Hatalı kod');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    const result = await resendOTP(email);
    if (result.success) {
      toast.success('Yeni kod gönderildi!');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      toast.error(result.message);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doğrulandı!</h2>
          <p className="text-gray-500">Chat'e yönlendiriliyorsunuz...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl card-shadow p-8 w-full max-w-md text-center"
      >
        <div className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6 orange-glow">
          <MessageCircle size={32} className="text-white" />
        </div>

        <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-orange-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">E-postanızı Doğrulayın</h2>
        <p className="text-gray-500 text-sm mb-1">6 haneli doğrulama kodu gönderildi:</p>
        <p className="font-semibold text-gray-800 mb-8 text-sm">{email}</p>

        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all ${
                digit
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-orange-400 focus:bg-white'
              }`}
            />
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-orange-600 text-sm mb-4">
            <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
            Doğrulanıyor...
          </div>
        )}

        <div className="text-sm text-gray-500">
          Kodu almadınız mı?{' '}
          {canResend ? (
            <button id="resend-otp" onClick={handleResend}
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors inline-flex items-center gap-1">
              <RefreshCw size={14} /> Yeniden Gönder
            </button>
          ) : (
            <span className="text-gray-400">
              <span className="font-semibold text-orange-500">{countdown}s</span> sonra tekrar gönder
            </span>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            E-postayı kontrol etmeyi unutmayın. Spam klasörüne düşmüş olabilir.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
