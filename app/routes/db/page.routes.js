const { Page } = require('../../controllers/db');
const { verifyLoggedIn, verifyAuthorization } = require('../../middleware/access');

module.exports = app => {
    var router = require('express').Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    // 尝试create一个新的page
    router.post('/pages', [verifyLoggedIn.isTokenValid], Page.createPage);

    // 获取某个user的推荐pages
    router.get('/pagerecommend', [
        verifyLoggedIn.ifTokenValid,
    ], Page.getRecommendPages);

    // 尝试根据id检索某个page
    router.get('/pages/:pageId', [
        verifyLoggedIn.ifTokenValid,
    ], Page.getPageById); // 这里的model方法需要重写

    // 访问某个用户的所有pages
    // /pagelist?pageOwner=:pageOwner&pageIdx=:pageIdx
    router.get('/pagelist', [
        verifyLoggedIn.ifTokenValid,
    ], Page.getPagesByOwner);

    // 尝试根据id更新某个page
    router.put('/pages/:pageId', [
        verifyLoggedIn.isTokenValid,
        verifyAuthorization.checkPageOwner
    ], Page.updatePageById);

    // 尝试根据id删除某个page
    router.delete('/pages/:pageId', [
        verifyLoggedIn.isTokenValid,
        verifyAuthorization.checkPageOwner
    ], Page.deletePageById);

    // 使用路由中间件
    app.use('/api/db', router);
};