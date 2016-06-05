'use strict'

const webpack = require('webpack');
const NODE_ENV = 'development';

module.exports = {
    entry: './TodoList.js',
    output: {
        path: __dirname + '/public',
        publicPath: '/',
        filename: 'bundle.js',
    },
    devServer: {
        hot: true,//вкл режим горячей замены
        host: 'localhost',//default
        port: 8080,//default
    },
    module: {
        loaders: [{
            test: [/\.(js|es6)$/],
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'stage-0', 'react'],
                plugins: ['transform-runtime']
            },
            exclude: /node_modules/
        },
            {
                test: [/\.jsx$/],
                include: __dirname + '/components',
                loader: 'babel',
                /* babel-preset-es2015 babel-preset-react babel-plugin-transform-runtime*/
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-runtime']
                },
            },
            {
                test:   /\.jade$/,
                exclude: /node_modules/,
                loader: "jade"
            }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],

    devtool: NODE_ENV == "development" ? "chip-inline-module-source-map" : null,

}
