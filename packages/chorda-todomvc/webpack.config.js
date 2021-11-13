const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        static: './',
        hot: true,
        port: 1234
    },    
    entry: {
        app: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'app.js'
      },
        module: {
        rules: [{
            test: /\.ts$/,
            exclude: /(node_modules)/,
            use: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@chorda/react': path.resolve('../chorda-react/src'),
            '@chorda/engine': path.resolve('../chorda-engine/src'),
            '@chorda/core': path.resolve('../chorda-core/src'),
            'director': path.resolve('./node_modules/director/build/director')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
        /*new CompressionPlugin()*/
    ]
}