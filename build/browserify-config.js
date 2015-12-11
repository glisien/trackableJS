var paths = require('./paths');

module.exports = {
  options: {
    entries: paths.output_commonjs + 'index.js',
    debug: true
  }
}
