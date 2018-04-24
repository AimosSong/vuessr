/**
 *@Description 开发环境Webpack配置项
 */
console.log('webpack进程项', process.env.NODE_ENV);
const conf = require('./webpack.conf')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const vueConfig = require('./vue-loader.config')
const HtmlWebpackPlugin = require('html-webpack-plugin');
vueConfig.loaders = {
    extractCSS: true
}
const options = {
    output: {
        path: path.resolve(__dirname, '../build/assets/'),
        publicPath: '/',
        filename: 'scripts/[name].bundle.js'
    },
    // externals: {
    //     jquery: 'vue'
    // },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('styles/[name].css'),
        // Scope Hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            filename: 'scripts/[name].js',
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        // 生成 `vue-ssr-client-manifest.json`。
        // 1.在生成的文件名中有哈希时，可以取代 html-webpack-plugin 来注入正确的资源 URL。
        // 2.保证chunck的提前预加载
        new VueSSRClientPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/webapp/indexdev.html',
            inject: false
        })
    ]
}
const _options = Object.assign(options, conf.dev)
module.exports = _options