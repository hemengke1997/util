import plugin from 'tailwindcss/plugin'

export const center = plugin(({ addUtilities }) => {
  addUtilities({
    '.center': {
      transform: 'translate3d(-50%,-50%,0)',
      left: '50%',
      top: '50%',
    },
  })
})
