const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const devPlugins = [
    new ExtractTextPlugin('style.css')
];
const productionPlugins = devPlugins.concat([
    new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: [
            'angular',
            'ngResource',
            '$document',
            'exports',
            'require',
            '$compile',
            '$sce',
            '$q',
            '$resource',
            '$templateCache',
            '$timeout',
            '$document']
         },
        sourceMap: true
    }),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|html|css)$/,
        threshold: 10240,
        minRatio: 0.8
    })
]);
const isDev = process.env.NODE_ENV === 'dev',
    isProd = process.env.NODE_ENV === 'production';


module.exports = {
    entry: {
        main: './init.js'
    },
    output: {
        filename: './js-bundles/scripts.js',
        path: path.resolve(__dirname)
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['latest']
                }
            }
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader', 
                use: [{
                        loader: 'css-loader',
                        options: {
                            importLoaders: true,
                            sourceMap: true
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: { 
                             sourceMap: 'inline', 
                             plugins: function() { 
                                  return [ require('autoprefixer') ] 
                             } 
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }]
            })
        }]
    },
    plugins: isDev ? devPlugins : productionPlugins,
    devtool: 'source-map',
    watch: isDev
};
