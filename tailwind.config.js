import colors from 'tailwindcss/colors'

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        harmonydark: colors.coolGray,
      },
      darkMode: 'class',
    },
  },
  plugins: [require('tailwindcss-dark-mode')()],
}
