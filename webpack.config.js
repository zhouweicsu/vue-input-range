var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var vueLoader = require('vue-loader');

module.exports = {
    entry: {
        inputrange: "./demo/inputrange.js"
    },
    output: {
        filename: `./dist/js/[name].js`
    },
    module: {
        loaders: [
            {
                test: /.vue$/,
                loader: 'vue'
            },
            {
                test: /.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            },
            {
                test: /\.js?$/,
                exclude: /node_modules\//,
                loader: 'babel'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(`./dist/css/[name].css`)
    ],
    devtool: 'sourcemap',
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    }

};
