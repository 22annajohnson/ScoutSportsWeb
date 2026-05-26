import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        border: "rgb(var(--color-border) / 0.08)",
        text: {
          DEFAULT: "rgb(var(--color-text) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        accent: {
          purple: "rgb(var(--color-accent-purple) / <alpha-value>)",
          blue: "rgb(var(--color-accent-blue) / <alpha-value>)",
          lilac: "rgb(var(--color-accent-lilac) / <alpha-value>)",
          pink: "rgb(var(--color-accent-pink) / <alpha-value>)",
          teal: "rgb(var(--color-accent-teal) / <alpha-value>)",
          emerald: "rgb(var(--color-accent-emerald) / <alpha-value>)",
          sky: "rgb(var(--color-accent-sky) / <alpha-value>)",
          danger: "rgb(var(--color-danger) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        sans: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgb(var(--color-accent-purple) / 0.28), transparent 30%), radial-gradient(circle at 70% 10%, rgb(var(--color-accent-blue) / 0.22), transparent 26%), linear-gradient(180deg, rgb(var(--color-border) / 0.03), transparent)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
