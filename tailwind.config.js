/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Storefront: Obsidian World
        "obsidian": "#090909",
        "obsidian-surface": "#121212",
        "obsidian-elevated": "#181818",

        // Luxury Storefront: Royal Emerald World
        "emerald-deep": "#041F17",
        "emerald-surface": "#062D22",
        "emerald-luxury": "#07513C",
        "emerald-jade": "#177E61",

        // Luxury Storefront: Ruby Crimson World
        "ruby-deep": "#1B050B",
        "ruby-surface": "#2E0913",
        "ruby-crimson": "#80152F",
        "ruby-glow": "#A82041",

        // Accents & Typography
        "warm-ivory": "#EAE3D5",
        "ivory-muted": "#B5ADA0",
        "antique-gold": "#B89552",
        "antique-gold-light": "#D8B775",
        "antique-gold-dim": "#8C6E33",
        "cigar-brown": "#302018",
        "hairline": "#26231F",
        "hairline-subtle": "#1B1917",

        // Admin Portal Directoire Palette
        "surface": "#131313",
        "surface-bright": "#3a3939",
        "surface-dim": "#131313",
        "surface-variant": "#353534",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#d1c5b4",
        "primary": "#e8c179",
        "primary-container": "#b89552",
        "on-primary": "#412d00",
        "on-primary-container": "#432e00",
        "secondary": "#e9c349",
        "secondary-container": "#af8d11",
        "tertiary": "#ffb2ba",
        "tertiary-container": "#f56f83",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "surface-tint": "#e8c179"
      },
      fontFamily: {
        cormorant: ["'Cormorant Garamond'", "Georgia", "serif"],
        jost: ["'Jost'", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "'Jost'", "sans-serif"],
        serif: ["'Cormorant Garamond'", "'Playfair Display'", "serif"]
      },
      letterSpacing: {
        'luxury-tight': '0.04em',
        'luxury-normal': '0.15em',
        'luxury-wide': '0.22em',
        'luxury-widest': '0.3em'
      }
    },
  },
  plugins: [],
};
