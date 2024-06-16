module.exports = app => {
    var router = require('express').Router();
    const { Comment } = require('../../controllers/db');
    const { verifyLoggedIn, verifyAuthorization } = require('../../middleware/access');

    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });
    
    // 在某个thread下创建comment /pages/comments?threadId=:threadId
    router.post('/:threadId', [verifyLoggedIn.isTokenValid], Comment.createComment);

    // 查询某个thread下全部comments /pages/comments?threadId=:threadId
    router.get('/:threadId', Comment.getCommentsByThreadId);

    // 删除某个comment
    router.delete('/:commentId', [
        verifyLoggedIn.isTokenValid,
        verifyAuthorization.checkCommentOwner,
    ], Comment.deleteCommentById);

    app.use('/api/db/comments', router);
};