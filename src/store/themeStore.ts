import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types';

interface ThemeStore {
  isDark: boolean;
  selectedThemeId: string;
  
  // Actions
  toggleDarkMode: () => void;
  setTheme: (themeId: string) => void;
}

export const THEMES: Theme[] = [
  {
    id: 'ocean',
    name: '🌊 Ocean',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgColor: 'bg-blue-50',
    accentColor: '#667eea',
  },
  {
    id: 'sunset',
    name: '🌅 Sunset',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    bgColor: 'bg-red-50',
    accentColor: '#f5576c',
  },
  {
    id: 'forest',
    name: '🌲 Forest',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    bgColor: 'bg-green-50',
    accentColor: '#4facfe',
  },
  {
    id: 'fire',
    name: '🔥 Fire',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    bgColor: 'bg-yellow-50',
    accentColor: '#fa709a',
  },
  {
    id: 'midnight',
    name: '🌙 Midnight',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    bgColor: 'bg-gray-50',
    accentColor: '#0f2027',
  },
  {
    id: 'cosmic',
    name: '✨ Cosmic',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    bgColor: 'bg-purple-50',
    accentColor: '#667eea',
  },
];

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      selectedThemeId: 'ocean',

      toggleDarkMode: () =>
        set((state) => ({
          isDark: !state.isDark,
        })),

      setTheme: (themeId: string) =>
        set({
          selectedThemeId: themeId,
        }),
    }),
    {
      name: 'theme-store',
    }
  )
);
