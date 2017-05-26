const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './init.js',
  output: {
    filename: './js-bundles/lib.js',
    path: path.resolve(__dirname)
  },
  // module: {
  //   noParse: /moment/
  // },
  plugins: [ 
	  new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(es)$/)
  ]
};
