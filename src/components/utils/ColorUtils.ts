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

interface WallpaperPalette {
  paper: string;
  /** ROYGBIV: red → orange → yellow → green → blue → indigo → violet */
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  line5: string;
  line6: string;
  line7: string;
  muted: string;
}

const WALLPAPER_PALETTES: Record<string, WallpaperPalette> = {
  '#BA8752': {
    paper: '#FBF3E6',
    line1: '#E85A3C',
    line2: '#E8923A',
    line3: '#E8C84A',
    line4: '#4DAA6E',
    line5: '#3B7FD4',
    line6: '#5B4EC9',
    line7: '#8B4AB8',
    muted: '#B8A58E',
  },
  '#247B9E': {
    paper: '#F4F7EE',
    line1: '#E45B4A',
    line2: '#E89A3C',
    line3: '#D4C04A',
    line4: '#3BA88A',
    line5: '#2B7CB8',
    line6: '#4A5EC0',
    line7: '#7A4FB0',
    muted: '#9FB7B4',
  },
  '#2C3E50': {
    paper: '#F4F1E9',
    line1: '#D94B4B',
    line2: '#D98A3A',
    line3: '#C9B040',
    line4: '#3A9A7A',
    line5: '#3A6FCF',
    line6: '#5A48B5',
    line7: '#8A45A8',
    muted: '#A6A2AD',
  },
  '#282A36': {
    paper: '#F8F1F1',
    line1: '#E85A6A',
    line2: '#E89050',
    line3: '#D4B84A',
    line4: '#45A88A',
    line5: '#5A7AD4',
    line6: '#7A5AC8',
    line7: '#A050C0',
    muted: '#B1A3B1',
  },
};

const deriveWallpaperPalette = (hex: string): WallpaperPalette => {
  const normalized = hex.replace('#', '');
  const parsed = Number.parseInt(normalized, 16);
  if (normalized.length !== 6 || Number.isNaN(parsed)) {
    return WALLPAPER_PALETTES['#BA8752'];
  }

  const red = ((parsed >> 16) & 255) / 255;
  const green = ((parsed >> 8) & 255) / 255;
  const blue = (parsed & 255) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  const sat = Math.max(48, Math.round(saturation * 100));
  /** Fixed spectral hues, lightly pulled toward theme hue for cohesion */
  const spectral = (baseHue: number, light: number, satShift = 0) => {
    const pull = ((hue - baseHue + 540) % 360) - 180;
    const mixed = (baseHue + pull * 0.12 + 360) % 360;
    return `hsl(${Math.round(mixed)} ${Math.min(82, sat + satShift)}% ${light}%)`;
  };

  return {
    paper: `hsl(${Math.round(hue)} 32% 95%)`,
    line1: spectral(8, 48, 4),
    line2: spectral(32, 52, 6),
    line3: spectral(52, 54, 4),
    line4: spectral(140, 42, -2),
    line5: spectral(215, 48, 2),
    line6: spectral(255, 44, 2),
    line7: spectral(285, 46, 1),
    muted: `hsl(${Math.round(hue)} 18% 68%)`,
  };
};

const setWallpaperColors = (root: HTMLElement, backgroundColor: string) => {
  const key = backgroundColor.toUpperCase();
  const palette =
    WALLPAPER_PALETTES[key] ?? deriveWallpaperPalette(backgroundColor);

  root.style.setProperty('--wallpaper-paper', palette.paper);
  root.style.setProperty('--wallpaper-line-1', palette.line1);
  root.style.setProperty('--wallpaper-line-2', palette.line2);
  root.style.setProperty('--wallpaper-line-3', palette.line3);
  root.style.setProperty('--wallpaper-line-4', palette.line4);
  root.style.setProperty('--wallpaper-line-5', palette.line5);
  root.style.setProperty('--wallpaper-line-6', palette.line6);
  root.style.setProperty('--wallpaper-line-7', palette.line7);
  root.style.setProperty('--wallpaper-muted', palette.muted);
};

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
    setWallpaperColors(root, retroBackground);
    
  } catch (error) {
    
    // In case of error, set fallback colors
    root.style.setProperty("--color-retro-semi-dark", "#5f3b1e");
    root.style.setProperty("--color-retro-dark", "#42220e");
    setWallpaperColors(root, DEFAULT_THEME_COLOR);
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
