import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      ...colors,
      retro: {
        'white': '#faefde',
        'red': '#e96133',
        'green': '#4b8443',
        'blue': '#1c90bc',
        'yellow': '#e7b52f',
        'dark': 'var(--color-retro-dark)',
        'background': 'var(--color-retro-background)',
      }
    },
    extend: {
      boxShadow: {
        'window': '4px 4px 0 0 var(--color-retro-dark)',
        'window-maximized': '0 0 0 1rem var(--color-retro-dark)',
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
    },
  },
  plugins: [],
};
export default config;
