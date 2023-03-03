const { isObject, difference } = require('@minko-fe/lodash-pro')
const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

function extendsColors() {
  let keys = Object.keys(colors)
  const c = {}
  const warnings = ['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray']
  keys = difference(keys, warnings)
  keys.forEach((k) => {
    if (isObject(colors[k])) {
      c[k] = {
        light: colors[k][500],
        default: colors[k][600],
        dark: colors[k][700],
      }
    }
  })
  return c
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...extendsColors(),
      },
      borderRadius: {
        sm: '4px',
        default: '8px',
      },
      transitionDuration: {
        fast: defaultTheme.transitionDuration[150],
        default: defaultTheme.transitionDuration[200],
        slow: defaultTheme.transitionDuration[300],
      },
    },
  },

  corePlugins: {
    preflight: false,
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.center': {
          transform: 'translate3d(-50%,-50%,0)',
          left: '50%',
          top: '50%',
        },
      })
    }),
  ],
}
