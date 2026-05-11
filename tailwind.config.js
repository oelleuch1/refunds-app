/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,js}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#b186ff',
          DEFAULT: '#8f68ff',
          dark: '#6a4dff',
          purple: '#8656f6',
          pink: '#cf73dc',
        },
        surface: {
          DEFAULT: '#111625',
          panel: '#191f31',
          card: 'rgba(255, 255, 255, 0.03)',
        },
        text: {
          primary: '#eef2ff',
          secondary: '#92a0c5',
          muted: '#8d9bbf',
          dim: '#7c89a9',
        },
        success: {
          DEFAULT: '#3ad48c',
          bg: 'rgba(58, 212, 140, 0.1)',
        },
        error: {
          DEFAULT: '#ff6262',
          text: '#ffc8c8',
          bg: 'rgba(255, 98, 98, 0.08)',
        },
        info: {
          DEFAULT: '#58c8ff',
          bg: 'rgba(88, 200, 255, 0.1)',
        },
        warning: {
          DEFAULT: '#ffba54',
          bg: 'rgba(255, 186, 84, 0.1)',
        },
        border: {
          subtle: 'rgba(152, 168, 255, 0.08)',
          white: 'rgba(255, 255, 255, 0.05)',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #9e7bff 0%, #6a4dff 100%)',
        'auth-gradient': 'linear-gradient(90deg, #8656f6 0%, #cf73dc 100%)',
        'remember-gradient': 'linear-gradient(135deg, #8e5dff 0%, #c876db 100%)',
        'panel-gradient': 'linear-gradient(180deg, rgba(25, 31, 49, 0.96) 0%, rgba(17, 22, 37, 0.98) 100%)',
      },
      boxShadow: {
        'brand': '0 18px 40px rgba(104, 80, 255, 0.28)',
        'auth': '0 14px 34px rgba(152, 94, 248, 0.24)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
      }
    },
  },
  plugins: [],
}
