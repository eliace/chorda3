const path = require('path')
//const HtmlWebpackPlugin = require('html-webpack-plugin')
//const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        app: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'umd'),
        library: {
            name: 'ChordaReact',
            type: 'umd',
            umdNamedDefine: true
        },
        // library: 'ChordaReact',
        // libraryTarget: 'umd',
        filename: 'chorda-react.production.js',
        // umdNamedDefine: true
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
        //     '@chorda/core': path.resolve('../chorda-core/src'),
        // }
    },
    plugins: [
        /*new CompressionPlugin()*/
    ],
    externals: {
        '@chorda/core': 'Chorda',
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
}