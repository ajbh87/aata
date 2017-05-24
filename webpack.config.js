var path = require('path');

module.exports = {
  entry: './js/script.js',
  output: {
    filename: 'script-bundle.js',
    path: path.resolve(__dirname)
  },
  module: {
    
  },
  watch: true
};
