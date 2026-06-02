/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Abhar Santé (vert/turquoise médical + gris foncé)
        brand: {
          DEFAULT: '#10b981', // Vert principal (logo)
          dark: '#059669',    // Vert foncé
          light: '#34d399',   // Vert clair
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        gray: {
          DEFAULT: '#4b5563',  // Gris principal
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',       // Gris foncé
          700: '#374151',       // Gris très foncé
          800: '#1f2937',
          900: '#111827',
        },
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#f59e0b',
        info: '#3b82f6',
        muted: '#6b7280',
      },
      borderRadius: {
        xl: '14px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
};
