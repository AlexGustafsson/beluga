const defaultTheme = require('tailwindcss/defaultTheme') // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  mode: 'jit',
  content: ['./frontend/**/*.{html,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
