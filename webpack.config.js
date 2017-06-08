const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './init.js',
    output: {
        filename: './js-bundles/scripts.js',
        path: path.resolve(__dirname)
    },
    module: {
        rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['es2015']
            }
        }
    }
    ]},
    watch: true
};
