import { defineConfig } from 'vite-plugin-windicss'
import colors from 'windicss/colors'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  darkMode: 'class',
  plugins: [
    typography(),
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.amber,
        harmonydark: {
          50: '#f5f5f6',
          100: '#ebebec',
          200: '#cccdd1',
          300: '#aeaeb5',
          400: '#71727d',
          500: '#343545',
          600: '#2f303e',
          700: '#272834',
          800: '#1f2029',
          900: '#191a22',
        },
      },
    },
  },
})
