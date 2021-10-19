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
            use: {
                loader: 'ts-loader'
            }
        }, {
            test: /\.(png|svg|jpg|gif)$/i,
            type: 'asset/resource'
            // use: [
            //     'file-loader'
            // ]
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
            type: 'asset/resource'
            // use: [{
            //     loader: 'file-loader',
            //     // options: {
            //     //     name: '[name].[ext]',
            //     //     outputPath: 'fonts/'
            //     // }
            //     // options: {
            //     //     name: './[name].[ext]',
            //     // }
            // }],
        }, {
            resourceQuery: /base64/,
            type: 'asset/inline'
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
            '@chorda/preact': path.resolve('../chorda-preact/src'),
//            '@chorda/engine': path.resolve('../chorda-engine/src'),
            '@chorda/core': path.resolve('../chorda-core/src'),
            '@chorda/inferno': path.resolve('../chorda-inferno/src'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
        /*new CompressionPlugin()*/
    ]
}