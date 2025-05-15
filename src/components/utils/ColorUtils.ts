const adjustColorBrightness = (hex: string, shift: number) => {
  try {
    // Handle case where hex might be invalid
    if (!hex || !hex.startsWith('#') || hex.length < 7) {
      console.error('Invalid hex color:', hex);
      return shift > 0 ? '#FFFFFF' : '#000000';
    }
    
    const num = parseInt(hex.slice(1), 16),
      amt = Math.round(2.55 * shift),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
  } catch (error) {
    console.error('Error adjusting color brightness:', error);
    return shift > 0 ? '#FFFFFF' : '#000000';
  }
};

const THEME_COLOR_KEY = 'retro-theme-background-color';
export const DEFAULT_THEME_COLOR = '#ba8752';

export const setDynamicColors = (backgroundColor?: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // If a backgroundColor is provided, use it and save to localStorage
  if (backgroundColor) {
    root.style.setProperty("--color-retro-background", backgroundColor);
    try {
      localStorage.setItem(THEME_COLOR_KEY, backgroundColor);
    } catch (err) {
      console.error('Failed to save theme to localStorage:', err);
    }
  }
  
  // Get the current background color (either the one we just set or the existing one)
  let retroBackground = getComputedStyle(root)
    .getPropertyValue("--color-retro-background")
    .trim();
  
  // If no color is set in CSS, use the default
  if (!retroBackground) {
    retroBackground = DEFAULT_THEME_COLOR;
    root.style.setProperty("--color-retro-background", DEFAULT_THEME_COLOR);
  }
  
  try {
    const semiDark = adjustColorBrightness(retroBackground, -12);
    const dark = adjustColorBrightness(retroBackground, -50);

    root.style.setProperty("--color-retro-semi-dark", semiDark);
    root.style.setProperty("--color-retro-dark", dark);
    
  } catch (error) {
    
    // In case of error, set fallback colors
    root.style.setProperty("--color-retro-semi-dark", "#5f3b1e");
    root.style.setProperty("--color-retro-dark", "#42220e");
  }
};

export const loadSavedTheme = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  
  try {
    const savedColor = localStorage.getItem(THEME_COLOR_KEY);
    
    if (savedColor) {
      setDynamicColors(savedColor);
      return true;
    } else {
      // Use the default color when no saved theme is found
      setDynamicColors(DEFAULT_THEME_COLOR);
      return false;
    }
  } catch (err) {
    // Use default color in case of error
    setDynamicColors(DEFAULT_THEME_COLOR);
    return false;
  }
};

export const initializeThemeChangeListener = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Load saved theme or use default
  const themeLoaded = loadSavedTheme();
  
  // If theme loading failed or returned false, make sure we at least have the default colors applied
  if (!themeLoaded) {
    setDynamicColors(DEFAULT_THEME_COLOR);
  }
  
  // Remove any existing listeners to prevent duplicates
  document.removeEventListener('themeChanged', handleThemeChanged);
  
  // Add listener for theme change events
  document.addEventListener('themeChanged', handleThemeChanged);
};

export const handleThemeChanged = (event: Event) => {
  console.log('Theme change event detected');
  
  // If the event has a color property, use it
  if ((event as CustomEvent).detail?.color) {
    setDynamicColors((event as CustomEvent).detail.color);
  } else {
    // Otherwise just recalculate based on current background
    setDynamicColors();
  }
};
