import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#06070b",
        surface: "#10131b",
        border: "rgba(255, 255, 255, 0.08)",
        text: {
          DEFAULT: "#f4f7fb",
          muted: "#9ca6ba",
        },
        accent: {
          purple: "#8b5cf6",
          blue: "#38bdf8",
          lilac: "#c4b5fd",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        sans: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(56, 189, 248, 0.12), 0 32px 100px rgba(139, 92, 246, 0.15)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(139,92,246,0.28), transparent 30%), radial-gradient(circle at 70% 10%, rgba(56,189,248,0.22), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
