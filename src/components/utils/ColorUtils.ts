const adjustColorBrightness = (hex: string, percent: number) => {
  const num = parseInt(hex.slice(1), 16),
    amt = Math.round(2.55 * percent),
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
  const semiDark = adjustColorBrightness(retroBackground, -12); // Adjust the percentage as needed
  const dark = adjustColorBrightness(retroBackground, -50); // Adjust the percentage as needed

  root.style.setProperty("--color-retro-semi-dark", semiDark);
  root.style.setProperty("--color-retro-dark", dark);
};
