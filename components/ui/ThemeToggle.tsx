'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './button';

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Alternar para modo ${resolvedTheme === 'light' ? 'escuro' : 'claro'}`}
      title={`Alternar para modo ${resolvedTheme === 'light' ? 'escuro' : 'claro'}`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}