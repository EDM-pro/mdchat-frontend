import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { initSocket, disconnectSocket } from '@/lib/socket';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Giriş yap
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });

          // Socket bağlantısını başlat
          initSocket(accessToken);

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Giriş başarısız',
            code: error.response?.data?.code,
            email: error.response?.data?.email,
          };
        }
      },

      // Kayıt ol
      register: async (username, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { username, email, password });
          set({ isLoading: false });
          return { success: true, email: data.email };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Kayıt başarısız',
          };
        }
      },

      // OTP doğrula
      verifyOTP: async (email, otp) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/verify-otp', { email, otp });
          const { user, accessToken, refreshToken } = data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });

          initSocket(accessToken);

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Doğrulama başarısız',
            attemptsLeft: error.response?.data?.attemptsLeft,
          };
        }
      },

      // OTP yeniden gönder
      resendOTP: async (email) => {
        try {
          await api.post('/auth/resend-otp', { email });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || 'Kod gönderilemedi',
          };
        }
      },

      // Çıkış yap
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {}

        disconnectSocket();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      // Kullanıcı bilgilerini güncelle
      updateUser: (updatedUser) => {
        set((state) => ({ user: { ...state.user, ...updatedUser } }));
      },

      // Başlangıçta oturumu yenile
      initializeAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, accessToken: token, isAuthenticated: true });
          initSocket(token);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
