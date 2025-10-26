// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
        backgroundMove: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(50px, 50px)" },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%) translateY(-100%) rotate(45deg)",
          },
          "100%": {
            transform: "translateX(300%) translateY(300%) rotate(45deg)",
          },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": {
            transform: "scale(1)",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          },
          "50%": {
            transform: "scale(1.2)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        },
      },
      animation: {
        scroll: "scroll 25s linear infinite",
        "scroll-paused": "scroll 25s linear paused",
        backgroundMove: "backgroundMove 15s linear infinite",
        shimmer: "shimmer 3s infinite",
        fadeInUp: "fadeInUp 0.6s ease forwards",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
