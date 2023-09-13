import { flexible } from '@minko-fe/flexible-pro'

flexible({
  distinctDevice: [
    { isDevice: (w: number) => w < 750, UIWidth: 375, deviceWidthRange: [300, 375] },
    { isDevice: (w: number) => w >= 750, UIWidth: 1920, deviceWidthRange: [1080, 1920] },
  ],
})

