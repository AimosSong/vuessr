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

const url = require('url')
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
    const compile = webpack(devConfig);
    app.use(devMiddleware(compile, {
        noInfo: false,
        quiet: false,
        laze: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true
        },
        publicPath: '/',
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
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

errorHandler.error(app);
controllers.getAllrouters(app, router);
app.use(serve(config.staticDir));


const server = app.listen(config.port, () => {
    // server.keepAliveTimeout = 0;
    console.log('VueSSR listening on port %s', config.port);
});

module.exports = app;