"use client";

import { useEffect } from 'react';
import { initializeThemeChangeListener, loadSavedTheme, setDynamicColors } from '@/components/utils/ColorUtils';

// Constant for default color - keep in sync with the one in ColorUtils.ts
const DEFAULT_THEME_COLOR = '#ba8752';

const ThemeInitializer = () => {
  useEffect(() => {
    
    // Ensure we have a background color set in the CSS variables
    const root = document.documentElement;
    const currentBackground = getComputedStyle(root).getPropertyValue('--color-retro-background').trim();
    
    // If no background color is set, set it to the default color
    if (!currentBackground) {
      root.style.setProperty('--color-retro-background', DEFAULT_THEME_COLOR);
    }
    
    // Load saved theme from localStorage
    const themeLoaded = loadSavedTheme();
    
    // Initialize theme change listeners
    initializeThemeChangeListener();
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default ThemeInitializer; 