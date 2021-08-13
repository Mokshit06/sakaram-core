import create from 'zustand';

export const Apps = {
  SPOTIFY: 'SPOTIFY',
} as const;

export type App = keyof typeof Apps;

type WindowState = {
  isOpen: boolean;
  app: App;
  openApp: (app: App) => void;
  closeApp: () => void;
};

const useWindow = create<WindowState>(set => ({
  isOpen: false,
  app: Apps.SPOTIFY,
  openApp: app => set({ app, isOpen: true }),
  closeApp: () => set({ isOpen: false }),
}));

export default useWindow;
