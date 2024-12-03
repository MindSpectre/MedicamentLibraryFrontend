const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            '@pages': path.resolve(__dirname, 'pages'),
            '@css': path.resolve(__dirname, 'css'),
            '@js': path.resolve(__dirname, 'js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
        ],
    },
    devServer: {
        static: [
            { directory: path.join(__dirname, 'pages') },
            { directory: path.join(__dirname, 'css') },
        ],
        port: 8000,
    }
};
