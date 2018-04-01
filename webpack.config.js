const {camelCase} = require('lodash')
const {name} = require('./package.json')
const library = camelCase(name)

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname,
    filename: library + '.js',
    library
  }
}
