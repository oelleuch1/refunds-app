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

        // --- Lovable semantic tokens (adopted, dark) ---
        background: 'oklch(17% 0.025 270)',
        foreground: 'oklch(97% 0.01 250)',
        card: {
          DEFAULT: 'oklch(21% 0.028 270)',
          foreground: 'oklch(97% 0.01 250)',
        },
        primary: {
          DEFAULT: 'oklch(66% 0.21 290)',
          foreground: 'oklch(99% 0 0)',
        },
        muted: {
          DEFAULT: 'oklch(25% 0.025 270)',
          foreground: 'oklch(70% 0.02 260)',
        },
        accent: {
          DEFAULT: 'oklch(32% 0.07 290)',
          foreground: 'oklch(97% 0.01 250)',
        },
        destructive: {
          DEFAULT: 'oklch(62% 0.22 25)',
          foreground: 'oklch(98% 0 0)',
        },
        border: {
          DEFAULT: 'oklch(30% 0.03 270)',
          subtle: 'rgba(152, 168, 255, 0.08)',
          white: 'rgba(255, 255, 255, 0.05)',
        },
        input: 'oklch(27% 0.03 270)',
        ring: 'oklch(66% 0.21 290)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #9e7bff 0%, #6a4dff 100%)',
        'auth-gradient': 'linear-gradient(90deg, #8656f6 0%, #cf73dc 100%)',
        'remember-gradient': 'linear-gradient(135deg, #8e5dff 0%, #c876db 100%)',
        'panel-gradient': 'linear-gradient(180deg, rgba(25, 31, 49, 0.96) 0%, rgba(17, 22, 37, 0.98) 100%)',
        'gradient-violet': 'linear-gradient(135deg, oklch(55% 0.22 290), oklch(70% 0.18 320))',
      },
      boxShadow: {
        'brand': '0 18px 40px rgba(104, 80, 255, 0.28)',
        'auth': '0 14px 34px rgba(152, 94, 248, 0.24)',
        'glow': '0 0 0 1px oklch(66% 0.21 290 / 0.25), 0 12px 40px -12px oklch(55% 0.22 290 / 0.55)',
        'card': '0 1px 0 0 oklch(100% 0 0 / 0.04) inset, 0 8px 24px -12px oklch(0% 0 0 / 0.5)',
      },
      borderRadius: {
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      }
    },
  },
  plugins: [],
}
