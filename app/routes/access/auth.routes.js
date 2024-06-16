const router = require('express').Router();
const { Auth } = require('../../controllers/access');
const { verifyNotRegistered, verifyLoggedIn } = require('../../middleware/access');

module.exports = app => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });
    router.post('/signup',
        [verifyNotRegistered.isUsernameUnused],
        Auth.signup);

    router.post('/signin', Auth.signin);

    // router.post('/logout',
    //     [verifyLoggedIn.isTokenValid],
    //     Auth.logout);
    
    router.post('/logout', Auth.logout);

    router.put('/account', [   
        verifyLoggedIn.isTokenValid,
        verifyNotRegistered.isUsernameUnused
    ], Auth.changeAccountName);

    router.delete('/account', [
        verifyLoggedIn.isTokenValid
    ], Auth.deleteAccount);
    // 将路由挂载到特定路径
    app.use('/api/access/auth', router);
};