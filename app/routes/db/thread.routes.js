const { Thread } = require('../../controllers/db');
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
    // 在特定页面下创建新的评论thread
    router.post('/:pageId', [verifyLoggedIn.isTokenValid], Thread.createThread);
    // 获取特定页面下的评论thread列表, 有query参数
    router.get('/:pageId', Thread.getThreadsByPageId);
    // 删除某个页面下的某个thread
    router.delete('/:threadId', [
        verifyLoggedIn.isTokenValid,
        verifyAuthorization.checkThreadOwner,
    ], Thread.deleteThreadById);

    app.use('/api/db/threads', router);
};