'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const errorHandler = {
    error(app) {
        app.use(async (ctx, next) => {
            try {
                await next();
            } catch (err) {
                console.log('errcode', err);
                ctx.status = err.status || 500;
                ctx.body = await ctx.render('500', { data: err.stack });
            }
        });
        app.use(async (ctx, next) => {
            await next();
            if (404 != ctx.status) return;
            ctx.status = 404;
            ctx.body = '<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8" homePageUrl="http://yoursite.com/yourPage.html" homePageName="回到我的主页"></script>';
        });
    }
};
exports.default = errorHandler;