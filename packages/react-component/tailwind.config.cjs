const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    borderRadius: {
      default: '8px',
    },
    transitionDuration: {
      fast: '0.2s',
      default: '0.3s',
      slow: '0.4s',
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
