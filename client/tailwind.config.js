/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Apple-inspired Color Palette
        ivory: {
          50: '#fdfcf9',
          100: '#faf8f2',
          200: '#f4efe4',
          300: '#ede4d1',
          400: '#ded0b6',
          500: '#caa885',
          600: '#a38463',
          700: '#7d6347',
          800: '#584430',
          900: '#34271a',
        },
        'soft-blue': {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc4fa',
          400: '#38a5f6',
          500: '#0071e3', // Apple signature blue
          600: '#0077ed',
          700: '#005bb5',
          800: '#004c96',
          900: '#053f7c',
        },
        'natural-green': {
          50: '#f2faf5',
          100: '#e2f5ea',
          200: '#c7ebd7',
          300: '#9ddbbe',
          400: '#6bc39f',
          500: '#34c759', // Apple natural green
          600: '#28a745',
          700: '#1f8337',
          800: '#1c672e',
          900: '#185528',
        },
        'apple-gray': {
          50: '#fbfbfd',
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#d2d2d7',
          400: '#86868b',
          500: '#6e6e73',
          600: '#424245',
          700: '#333336',
          800: '#1d1d1f',
          900: '#161617',
          950: '#000000',
        },
        // Maintained brand and surface tokens for complete backward compatibility
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc4fa',
          400: '#38a5f6',
          500: '#0071e3',
          600: '#0077ed',
          700: '#005bb5',
          800: '#004c96',
          900: '#053f7c',
          950: '#032348',
        },
        accent: {
          50: '#f2faf5',
          100: '#e2f5ea',
          200: '#c7ebd7',
          300: '#9ddbbe',
          400: '#6bc39f',
          500: '#34c759',
          600: '#28a745',
          700: '#1f8337',
        },
        surface: {
          50: '#faf8f5',
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#d2d2d7',
          400: '#86868b',
          500: '#6e6e73',
          600: '#424245',
          700: '#333336',
          800: '#1d1d1f',
          900: '#121214',
          950: '#0c0c0e',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'SF Pro Text',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        'apple-sm': '0.625rem', // 10px
        'apple': '0.875rem',    // 14px
        'apple-md': '1.125rem', // 18px
        'apple-lg': '1.375rem', // 22px
        'apple-xl': '1.75rem',  // 28px
        'apple-2xl': '2.25rem', // 36px
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(0, 113, 227, 0.2)',
        'glow': '0 0 30px -5px rgba(0, 113, 227, 0.25)',
        'glow-lg': '0 0 50px -10px rgba(0, 113, 227, 0.35)',
        'apple-card': '0 4px 20px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'apple-card-hover': '0 16px 36px 0 rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.03)',
        'apple-modal': '0 24px 60px 0 rgba(0, 0, 0, 0.16), 0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'apple-toast': '0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'soft-blue-glow': '0 0 24px -2px rgba(0, 113, 227, 0.25)',
        'natural-green-glow': '0 0 24px -2px rgba(52, 199, 89, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.88' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
