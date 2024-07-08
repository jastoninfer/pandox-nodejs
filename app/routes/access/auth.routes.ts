// const router = require('express').Router();
import { Router } from 'express';

// const { Auth } = require('../../controllers/access');
// const {
//     verifyNotRegistered,
//     verifyLoggedIn,
// } = require('../../middleware/access');
import { Auth } from '../../controllers/access';
import { verifyLoggedIn, verifyNotRegistered } from '../../middleware/access';

import { Rt_Func } from '../types';

const authRoute:Rt_Func = (app) => {

    const router:Router = Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    router.post('/signup', [verifyNotRegistered.isUsernameUnused], Auth.signup);

    router.post('/signin', Auth.signin);

    router.post('/logout', Auth.logout);

    router.put(
        '/account',
        [verifyLoggedIn.isTokenValid, verifyNotRegistered.isUsernameUnused],
        Auth.changeAccountName
    );

    router.delete(
        '/account',
        [verifyLoggedIn.isTokenValid],
        Auth.deleteAccount
    );

    app.use('/api/access/auth', router);
};

export default authRoute;