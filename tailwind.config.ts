import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { 100: '#D6E8FA', 300: '#6BA5E3', 500: '#4A90D9', 700: '#3A7BC8' },
        success:   { 100: '#D4F5DD', 300: '#6DD98A', 500: '#34C759', 700: '#2DB84D' },
        danger:    { 100: '#FFD6D4', 300: '#FF6B63', 500: '#FF3B30', 700: '#E0352B' },
        warning:   { 100: '#FFEACC', 300: '#FFB84D', 500: '#FF9500', 700: '#E08500' },
        player:    { '1': '#4A90D9', '2': '#FF9500', '3': '#34C759' },
        surface:   { page: '#F8F9FA', card: '#FFFFFF' },
      },
      textColor: {
        main: '#1A1A2E',
        muted: '#6B7280',
      },
    },
  },
  plugins: [],
}

export default config
