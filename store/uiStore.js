import { create } from 'zustand';

const useUIStore = create((set) => ({
  isLeftDrawerOpen: false,
  leftDrawerTab: 'profile', // 'profile' | 'nickprotect'
  isMobileOnlineOpen: false,

  openLeftDrawer: (tab = 'profile') => set({ isLeftDrawerOpen: true, leftDrawerTab: tab }),
  closeLeftDrawer: () => set({ isLeftDrawerOpen: false }),
  setLeftDrawerTab: (tab) => set({ leftDrawerTab: tab }),
  toggleMobileOnline: () => set((state) => ({ isMobileOnlineOpen: !state.isMobileOnlineOpen })),
  closeMobileOnline: () => set({ isMobileOnlineOpen: false }),
}));

export default useUIStore;
