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
          50: '#f4f4f5',
          100: '#e9e9eb',
          200: '#c7c7cc',
          300: '#a5a5ad',
          400: '#626270',
          500: '#1f1e33',
          600: '#1c1b2e',
          700: '#171726',
          800: '#13121f',
          900: '#0f0f19',
        },
      },
    },
  },
})
