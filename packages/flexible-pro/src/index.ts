import modernFlexible from 'modern-flexible'

function flexible(options?: Parameters<typeof modernFlexible>[0]) {
  modernFlexible({
    ...options,
    distinctDevice: options?.distinctDevice || [
      { isDevice: (w: number) => w < 750, UIWidth: 375, widthRange: [300, 375] },
      { isDevice: (w: number) => w >= 750, UIWidth: 1920, widthRange: [1080, 1920] },
    ],
  })
}

export default flexible
export { flexible }
