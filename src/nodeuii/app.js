'use strict';
import Koa from 'koa';
import convert from 'koa-convert'; //koa1 转换器
import serve from 'koa-static';
import router from 'koa-simple-router';
import path from 'path';
import config from './config/config';
import co from 'co';
import controllers from './controllers/controllerInit';
import historyApiFallback from 'koa2-history-api-fallback';
import errorHandler from './middleware/errorHandler';
import render from 'koa-swig';
const url = require('url');
const app = new Koa();
app.context.render = co.wrap(render({
    root: config.viewDir,
    autoescape: true,
    cache: 'memory', // disable, set to false
    ext: 'html',
    writeBody: false
}));
if (config.env == "development") {
    const webpack = require('webpack');
    const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
    var devConfig = require('../config/webpack.dev');
    const compile = webpack(devConfig)
    app.use(devMiddleware(compile, {
        // display no info to console (only warnings and errors)
        noInfo: false,

        // display nothing to the console
        quiet: false,

        // switch into lazy mode
        // that means no watching, but recompilation on every request
        lazy: false,

        // watch options (only lazy: false)
        watchOptions: {
            aggregateTimeout: 300,
            poll: true
        },

        // public path to bind the middleware to
        // use the same as in webpack
        publicPath: "/assets/",

        // custom headers
        headers: { "Access-Control-Allow-Origin": "*" },

        // options for formating the statistics
        stats: {
            colors: true
        }
    }))
    app.use(hotMiddleware(compile, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    }))
}
errorHandler.error(app); //处理页面错误的处理句柄
controllers.getAllrouters(app, router); //初始化controllers
app.use(serve(config.staticDir)); // 静态资源文件
//监听端口
const server = app.listen(config.port, () => {
    console.log('vueSSR listening on port %s', config.port);
});
module.exports = app;