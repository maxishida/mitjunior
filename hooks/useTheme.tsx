'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme, ThemeContextType } from '@/types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme);
    } else {
      setTheme('system');
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const root = window.document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      setResolvedTheme(systemTheme);
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      setResolvedTheme(theme as 'light' | 'dark');
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme, isClient]);

  const toggleTheme = () => {
    setTheme(current => (current === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}