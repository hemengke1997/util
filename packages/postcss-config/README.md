# postcss-config

## Usage

### postcss.config.cjs


#### vite
```js
const { definePlugins } = require('@minko-fe/postcss-config')

module.exports = {
  plugins: definePlugins({
    'postcss-import': true, // default. if vite, set false
    'tailwindcss/nesting': true, // default
    'tailwindcss': true, // default
    'postcss-pxtorem': {}, // set if you need
    'postcss-pxtoviewport': {}, // set if you need
    'postcss-preset-env': {}, // default
  }).normal
}
```

#### next.js
```js
const { definePlugins } = require('@minko-fe/postcss-config')

module.exports = {
  plugins: definePlugins({
    'postcss-import': true, // default. if next.js, set false
    'tailwindcss/nesting': true, // default
    'tailwindcss': true, // default
    'postcss-pxtorem': {}, // set if you need
    'postcss-pxtoviewport': {}, // set if you need
    'postcss-preset-env': {}, // default
  }).nextjs
}
```
