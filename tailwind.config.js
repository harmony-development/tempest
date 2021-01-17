import { colors } from 'tailwindcss/defaultTheme'

export const theme = {
  extend: {
    colors: {
      primary: colors.blue,
    },
    darkMode: 'class',
  },
  plugins: [require('tailwindcss-dark-mode')()],
}
