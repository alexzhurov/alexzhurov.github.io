const path = require('path');
const poststylus = require('poststylus');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    },
                },
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
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [poststylus(['autoprefixer'])]
                }
            }
        }),
        new webpack.SourceMapDevToolPlugin({exclude: ['/node_modules/']}),
    ],
    devServer: {
        contentBase: __dirname,
        publicPath: '/dist/',
        serveIndex: true,
        watchContentBase: true,
        quiet: true,
        hot: true,
        port: 9000,
        open: true,
        filename: 'bundle.js',
    }
};
