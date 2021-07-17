const path = require('path')
//const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        app: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'lib-umd'),
        library: 'Chorda',
        libraryTarget: 'umd',
        filename: 'index.js',
        umdNamedDefine: true
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
        extensions: ['.ts', '.js'] 
    },
    plugins: [
        /*new CompressionPlugin()*/
    ]
}