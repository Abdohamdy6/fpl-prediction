import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pl: {
          purple: {
            DEFAULT: "#38003C",
            dark: "#240027",
            deeper: "#19001C",
            deepest: "#0B000C",
            light: "#4F0055",
            accent: "#6B0072",
          },
          green: {
            DEFAULT: "#00FF85",
            hover: "#00E676",
            muted: "#00FF8520",
          },
          pink: {
            DEFAULT: "#E90052",
            hover: "#D00048",
            muted: "#E9005220",
          },
          cyan: {
            DEFAULT: "#04F5FF",
            hover: "#00D6E0",
          },
          gold: "#FFD700",
        },
      },
      fontFamily: {
        display: ["Bebas Neue", "Space Grotesk", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 8px #00FF85)" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 2px #00FF85)" },
        },
      },
      animation: {
        neon: "pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
