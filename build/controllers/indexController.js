'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _indexModel = require('../models/indexModel');

var _indexModel2 = _interopRequireDefault(_indexModel);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _vueServerRenderer = require('vue-server-renderer');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//创建数据流
function createRenderer(bundle, template, clientManifest) {
    return (0, _vueServerRenderer.createBundleRenderer)(bundle, {
        cache: require('lru-cache')({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        runInNewContext: false,
        template,
        clientManifest
    });
}
// import config from '../config/config';
/*vue ssr start*/

const rootPath = _path2.default.join(__dirname, '..');
const template = _fs2.default.readFileSync(rootPath + '/assets/index.html', 'utf-8');
const $ = _cheerio2.default.load(template);
$('title').html('我的vuessr');
$('head').append('<meta name="keywords" content=我的vuessr>');
console.log('模板数据', $.html());
const serverBundle = require('../assets/vue-ssr-server-bundle.json');
const clientManifest = require('../assets/vue-ssr-client-manifest.json');
/*vue ssr end */
const indexController = {
    getData() {
        return async (ctx, next) => {
            const indecxModelIns = new _indexModel2.default();
            const _data = await indecxModelIns.getData();
            ctx.body = _data;
        };
    },
    index() {
        return async (ctx, next) => {
            const ssrrender = createRenderer(serverBundle, $.html(), clientManifest);
            const context = { url: ctx.url };

            function createSsrStreamPromise() {
                return new Promise((resolve, reject) => {
                    if (!ssrrender) {
                        ctx.body = 'compilation.. refresh in a moment.';
                    }
                    const ssrStream = ssrrender.renderToStream(context);
                    ctx.status = 200;
                    ctx.type = 'html';
                    ssrStream.on('error', err => {
                        reject(err);
                    }).pipe(ctx.res);
                });
            }
            await createSsrStreamPromise(context);
        };
    }
};
exports.default = indexController;