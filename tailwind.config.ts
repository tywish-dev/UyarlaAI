import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        ink: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        subtle: "var(--border-subtle)",
        content: "var(--accent-content)",
        process: "var(--accent-process)",
        product: "var(--accent-product)",
        action: "var(--accent-action)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 26, 33, 0.04), 0 4px 12px rgba(23, 26, 33, 0.06)",
        "card-hover":
          "0 2px 4px rgba(23, 26, 33, 0.06), 0 12px 28px rgba(23, 26, 33, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
