const { Like } = require('../../controllers/db');
const { verifyLoggedIn } = require('../../middleware/access');

module.exports = app => {
    var router = require('express').Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });
    router.post('/:pageId', [verifyLoggedIn.isTokenValid], Like.savePage);
    router.delete('/:pageId', [verifyLoggedIn.isTokenValid], Like.removeSavedPage);
    // 将路由挂载到特定路径
    app.use('/api/db/likes', router);
};