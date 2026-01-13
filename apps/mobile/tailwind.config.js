/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand Colors - matching web app
        primary: {
          DEFAULT: '#1c1e26',
          light: '#2a2d38',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f5b700',
          light: '#f7c52d',
          foreground: '#1c1e26',
        },
        accent: {
          DEFAULT: '#2eb67d',
          light: '#4ecdc4',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#e63946',
          foreground: '#ffffff',
        },
        // Theme colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};

