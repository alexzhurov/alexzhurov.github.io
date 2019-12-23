const path = require('path');
const poststylus = require('poststylus');
const webpack = require('webpack');
const distFile = 'bundle.js';

module.exports = {
    mode: "development",
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: distFile
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'stylus-loader'
                ],
            }
        ],
    },
    plugins: [

        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         stylus: {
        //             use: [poststylus(['autoprefixer'])]
        //         }
        //     }
        // }),
        new webpack.SourceMapDevToolPlugin({exclude: ['/node_modules/']}),
    ],
    devServer: {
        contentBase: __dirname,
        publicPath: '/dist/',
        serveIndex: true,
        watchContentBase: true,
        quiet: true,
        progress: true,
        hot: true,
        port: 9000,
        open: true,
        filename: distFile
    }
};
