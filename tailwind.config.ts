import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "indigo-dark": "var(--indigo-dark)",
        "indigo-mid": "var(--indigo-mid)",
        blue: "var(--blue)",
        amber: "var(--amber)",
        "amber-light": "var(--amber-light)",
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        success: "var(--success)",
        high: "var(--high)",
        "gray-text": "var(--gray-text)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        paper: "0 1px 3px rgba(1,30,65,0.08), 0 8px 24px rgba(1,30,65,0.06)",
        card: "0 1px 2px rgba(1,30,65,0.06), 0 2px 8px rgba(1,30,65,0.05)",
        lift: "0 4px 16px rgba(1,30,65,0.12)",
      },
      keyframes: {
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 1.2s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
