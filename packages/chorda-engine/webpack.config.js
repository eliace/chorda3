const path = require('path')
//const HtmlWebpackPlugin = require('html-webpack-plugin')
//const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        app: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'lib-umd'),
        library: {
            type: 'umd',
            name: 'ChordaEngine'
        },
        filename: 'index.js',
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'ts-loader'
            }
        }]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        // alias: {
        //     '@chorda/core': 'chorda-core' //path.resolve('../chorda-core/src'),
        // }
    },
    plugins: [
        /*new CompressionPlugin()*/
    ],
    externals: {
        '@chorda/core': 'common-js @chorda/core',
    }
}