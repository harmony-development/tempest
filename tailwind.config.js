const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.amber,
        harmonydark: colors.coolGray,
      },
      darkMode: 'class',
    },
  },
  plugins: [require('tailwindcss-dark-mode')()],
}
