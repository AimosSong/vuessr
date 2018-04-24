'use strict';
import indexModel from '../models/indexModel'
import cheerio from 'cheerio';
import { createBundleRenderer } from 'vue-server-renderer';
import fs from 'fs';
import path from 'path';

//创建数据流
function createRenderer(bundle, template, clientManifest) {
    return createBundleRenderer(bundl, {
        cache: require('lru-cache')({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        runInNewContext: false, //推荐
        template,
        clientManifest
    })
}

const rootPath = path.join(__dirname, '..');
const template = fs.readFileSync(rootPath + '/assets/index.html', 'utf-8');
const $ = cheerio.load(template);
$('title').html('我的vuessr');
$('head').append('<meta name="keywords" content=我的vuessr');
// const serverBundle = require('../assets/vue-ssr-server-bundle.json');
const clientManifest = require('../assets/vue-ssr-client-manifest.json');
/*vue ssr end */

const indexController = {
    getData() {
        return async(ctx, next) => {
            const indexModelIns = new indexModel();
            const _data = await indexModelIns.getData();
            ctx.body = _data;
        }
    },
    index() {
        return async(ctx, next) => {
            const s = Date.now();
            const ssrrender = createRenderer(serverBundle, $.html(), clientManifest);
            const context = { url: ctx.url };

            function createSsrStreamPromise() {
                return new Promise((resolve, reject) => {
                    if (!ssrrender) {
                        return ctx.body = 'waiting for compilation.. refresh in a moment.'
                    }
                    const ssrStream = ssrrender.renderToStream(context);
                    ctx.status = 200;
                    ctx.type = 'html';
                    ssrStream.on('error', err => { reject(err) }).pipe(ctx.res)
                })
            }
            await createSsrStreamPromise(context);
        }
    }
}

export default indexController;