const { PageKeyword } = require('../../controllers/db');
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
    // 获取某个page下的keywords列表
    router.get('/:pageId', PageKeyword.getKeywordsByPageId);
    // 增加某个page下的keyword
    router.put('/:pageId', [
        verifyLoggedIn.isTokenValid,
        verifyAuthorization.checkPageOwner,
    ], PageKeyword.createKeyword);
    // 删除某个page下的keyword
    router.put('/:pageId', [
        verifyLoggedIn.isTokenValid,
        verifyAuthorization.checkPageOwner,
    ], PageKeyword.deleteKeyword);
    // 使用路由中间件
    app.use('/api/db/pagekeyword', router);
};