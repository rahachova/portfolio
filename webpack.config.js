const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const prodConfig = require('./webpack.prod.config');
const devConfig = require('./webpack.dev.config');
const { merge } = require('webpack-merge');

const baseConfig = {
    entry: path.resolve(__dirname, './src/index.ts'),
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, './dist'),
    },
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? prodConfig : devConfig;

    return merge(baseConfig, envConfig);
};
