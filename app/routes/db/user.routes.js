const { verifyLoggedIn } = require('../../middleware/access');
const { User } = require('../../controllers/db');
module.exports = app => {

    var router = require('express').Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });
    // const pages = require('../controllers/page/page.controller.js');

    // router.get('/:userId/pages', pages.getPagesByUserId);
    router.put('/', 
        [verifyLoggedIn.isTokenValid],
        User.updateProfile
    );
    router.get('/:username', 
        // [verifyLoggedIn.isTokenValid],
        User.viewProfile
    );
    app.use('/api/db/users', router);
};