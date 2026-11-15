/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary, #EA580C)",
          hover: "var(--brand-primary-hover, #C2410C)",
          light: "var(--brand-primary-light, #FFF7ED)",
          accent: "var(--brand-accent, #F97316)",
        },
        surface: {
          bg: "var(--surface-bg, #FFFCFA)",
          card: "var(--surface-card, #FFFFFF)",
        },
        sidebar: {
          bg: "var(--sidebar-bg, #1C1410)",
          text: "var(--sidebar-text, #FFF7ED)",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
    },
  },
  plugins: [],
};
