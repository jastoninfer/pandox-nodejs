const { Follow } = require('../../controllers/db');
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
    router.post('/:followedUsername', [verifyLoggedIn.isTokenValid], Follow.addFollower);
    router.delete('/:followedUsername', [verifyLoggedIn.isTokenValid], Follow.removeFollower);
    // 将路由挂载到特定路径
    app.use('/api/db/follows', router);
};