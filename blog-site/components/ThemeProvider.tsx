'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Initialize dark mode on client side
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDarkMode = 
      savedDarkMode === 'true' || 
      (savedDarkMode === null && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Apply theme class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
} 