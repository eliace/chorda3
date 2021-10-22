const path = require('path')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        app: './src/index.ts'
    },
    output: {
        library: {
            type: "umd",
            name: "Chorda"
        },
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib-umd'),
        // library: 'Chorda',
        // libraryTarget: 'umd',
        // filename: 'index.js',
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
        extensions: ['.ts', '.js'] 
    }
}