/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0e1f16',
          primary: '#163324',
          'primary-hover': '#11271b',
          'primary-light': '#214734',
          accent: '#c29c5e',
          'accent-hover': '#af8949',
          'accent-light': '#f5ede0',
          'accent-dark': '#866a39',
          gold: '#9d8050',
          silver: '#8b9bb4',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f8fafc',
          muted: '#f1f5f9',
          border: '#e2e8f0',
          'border-subtle': '#edf2f7',
        },
        content: {
          title: '#0f172a',
          body: '#334155',
          muted: '#64748b',
          subtle: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'dropdown': '0 10px 30px -5px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
      borderRadius: {
        'card': '0.75rem',
      }
    },
  },
  plugins: [],
}

