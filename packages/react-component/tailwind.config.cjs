const { isObject, difference } = require('@minko-fe/lodash-pro')
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
const { center } = require('@minko-fe/postcss-config/tailwindcss/plugin')

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
      transitionTimingFunction: {
        motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
        motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
        motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
        motionEaseInBack: 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
        motionEaseInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        motionEaseOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      boxShadow: {
        default: '0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [center],
}
