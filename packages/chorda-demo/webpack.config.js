const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: './',
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
            use: {
                loader: 'ts-loader'
            }
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
        }, {
            test: /\.s[ac]ss$/i,
            use: [
              'style-loader',
              'css-loader',
              'sass-loader'
            ]
        }, {
            test: /\.css$/i,
            use: [
              'style-loader',
              'css-loader',
            ]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }/*, {
            test: /\.txt$/,
            use: [
                'raw-loader'
            ]
        }*/]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'chorda-bulma': path.resolve('../chorda-bulma/src'),
            '@chorda/react': path.resolve('../chorda-react/src'),
            '@chorda/engine': path.resolve('../chorda-engine/src'),
            '@chorda/core': path.resolve('../chorda-core/src'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
        /*new CompressionPlugin()*/
    ]
}