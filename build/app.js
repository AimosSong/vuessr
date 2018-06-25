'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaSimpleRouter = require('koa-simple-router');

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _controllerInit = require('./controllers/controllerInit');

var _controllerInit2 = _interopRequireDefault(_controllerInit);

var _koa2HistoryApiFallback = require('koa2-history-api-fallback');

var _koa2HistoryApiFallback2 = _interopRequireDefault(_koa2HistoryApiFallback);

var _errorHandler = require('./middleware/errorHandler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _koaSwig = require('koa-swig');

var _koaSwig2 = _interopRequireDefault(_koaSwig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const url = require('url'); //koa1 转换器

const app = new _koa2.default();
app.context.render = _co2.default.wrap((0, _koaSwig2.default)({
    root: _config2.default.viewDir,
    autoescape: true,
    cache: 'memory', // disable, set to false
    ext: 'html',
    writeBody: false
}));
if (_config2.default.env == "development") {
    const webpack = require('webpack');
    const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
    var devConfig = require('../config/webpack.dev');
    const compile = webpack(devConfig);
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
    }));
    app.use(hotMiddleware(compile, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    }));
}
_errorHandler2.default.error(app); //处理页面错误的处理句柄
_controllerInit2.default.getAllrouters(app, _koaSimpleRouter2.default); //初始化controllers
app.use((0, _koaStatic2.default)(_config2.default.staticDir)); // 静态资源文件
//监听端口
const server = app.listen(_config2.default.port, () => {
    console.log('vueSSR listening on port %s', _config2.default.port);
});
module.exports = app;