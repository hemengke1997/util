import svgrPlugin from 'vite-plugin-svgr'

export function svgr() {
  return svgrPlugin({
    svgrOptions: {
      icon: true,
    },
  })
}
