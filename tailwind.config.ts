import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        surface: {
          50: '#1A2234',
          100: '#141B2D',
          200: '#0F1523',
          DEFAULT: '#0D1321',
        },
        card: {
          DEFAULT: '#111927',
          hover: '#172235',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        aid: {
          primary: '#10B981',   // Emerald (Trust & Humanity)
          secondary: '#06B6D4', // Cyan (Transparency & Speed)
          accent: '#8B5CF6',    // Violet (Decentralization)
          warning: '#F59E0B',   // Amber
          danger: '#EF4444',    // Rose
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
