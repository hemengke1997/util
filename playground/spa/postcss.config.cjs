const { definePlugins } = require('@minko-fe/postcss-config')

module.exports = {
  plugins: definePlugins({ 'postcss-import': false }),
}
