# postcss-config

## Usage

### postcss.config.js


#### vite
```js
import { definePlugins } from '@minko-fe/postcss-config/vite'

export default {
  plugins: definePlugins({
    'postcss-import': true, // default. if vite, set false
    'tailwindcss/nesting': true, // default
    'tailwindcss': true, // default
    'postcss-pxtorem': {}, // set if you need
    'postcss-pxtoviewport': {}, // set if you need
    'postcss-preset-env': {}, // default
  })
}
```

#### next.js
```js
import { definePlugins } from '@minko-fe/postcss-config/nextjs'

export default {
  plugins: definePlugins({
    'postcss-import': true, // default. if next.js, set false
    'tailwindcss/nesting': true, // default
    'tailwindcss': true, // default
    'postcss-pxtorem': {}, // set if you need
    'postcss-pxtoviewport': {}, // set if you need
    'postcss-preset-env': {}, // default
  })
}
```
