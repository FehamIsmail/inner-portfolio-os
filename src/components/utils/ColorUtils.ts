const adjustColorBrightness = (hex: string, shift: number) => {
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
};

export const setDynamicColors = () => {
  if (!window || !document) return;
  const root = document.documentElement;
  const retroBackground = getComputedStyle(root)
    .getPropertyValue("--color-retro-background")
    .trim();
  const semiDark = adjustColorBrightness(retroBackground, -12);
  const dark = adjustColorBrightness(retroBackground, -50);

  root.style.setProperty("--color-retro-semi-dark", semiDark);
  root.style.setProperty("--color-retro-dark", dark);
};

export const initializeThemeChangeListener = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Add listener for theme change events
  document.addEventListener('themeChanged', () => {
    setDynamicColors();
  });
};
