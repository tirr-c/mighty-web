const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const cssnext = require('postcss-cssnext');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = {
    entry: ['babel-polyfill', './src/app.ts'],
    output: {
        filename: 'static-[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new ExtractTextPlugin('static-[hash].css'),
        new HtmlWebpackPlugin({ template: 'src/index.html' })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [['env', { targets: { uglify: true } }]]
                }
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['env', { targets: { uglify: true } }]]
                        }
                    },
                    'ts-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        { loader: 'postcss-loader', options: { plugins: [cssnext] } }
                    ]
                })
            }
        ]
    }
};

const dev = {
    devtool: 'source-map',
    devServer: { compress: true }
};

const production = {
    plugins: [
        new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
    ]
};

module.exports = env => merge(common, env === 'production' ? production : dev);