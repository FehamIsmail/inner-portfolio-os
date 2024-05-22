import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      ...colors,
      retro: {
        'white': '#fdf4e8',
        'red': '#e8693f',
        'green': '#5a9651',
        'blue': '#2693bd',
        'yellow': '#e5b53b',
        'medium': '#efe1d0',
        'medium-dark': '#ccba99',
        'dark': 'var(--color-retro-dark)',
        'background': 'var(--color-retro-background)',
      }
    },
    extend: {
      boxShadow: {
        'window': '4px 4px 0  var(--color-retro-dark)',
        'window-maximized': '0 0 0 7px var(--color-retro-dark)',
        'taskbar': '0 8px 0 0 var(--color-retro-dark)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      divideWidth: {
        '3': '3px',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        'nunito': ['var(--font-nunito)'],
        'noto': ['var(--font-noto-serif)'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwind-scrollbar')({ preferredStrategy: 'pseudoelements' }),
  ]
};
export default config;
