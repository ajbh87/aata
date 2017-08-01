/* global process __dirname */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const ENV = process.env.NODE_ENV,
  isDev = ENV === 'dev';

const devPlugins = [
  new ExtractTextPlugin(isDev ? 'style.css' : 'style.min.css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(ENV)
  })
];
const productionPlugins = devPlugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    mangle: {
      except: ['angular', 'ngResource', 'exports', 'require']
    },
    sourceMap: true
  }),
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.(js|html|css)$/,
    threshold: 10240,
    minRatio: 0.8
  })
]);

module.exports = {
  entry: {
    scripts: './init.js'
  },
  output: {
    filename: isDev ? './js-bundles/[name].js' : './js-bundles/[name].min.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['latest']
          }
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: true,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: 'inline',
                plugins: function() {
                  if (isDev) {
                    return;
                  } else {
                    return [require('autoprefixer'), require('cssnano')];
                  }
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },
  plugins: isDev ? devPlugins : productionPlugins,
  devtool: 'source-map',
  watch: isDev
};
