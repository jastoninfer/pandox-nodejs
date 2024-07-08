// const { Follow } = require('../../controllers/db');
// const { verifyLoggedIn } = require('../../middleware/access');
import { Follow } from '../../controllers/db';
import { verifyLoggedIn } from '../../middleware/access';
import { Router } from 'express';
import type { Rt_Func } from '../types';

const followRoute:Rt_Func = (app) => {
    // var router = require('express').Router();
    const router: Router = Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });
    router.post(
        '/:followedUsername',
        [verifyLoggedIn.isTokenValid],
        Follow.addFollower
    );
    router.delete(
        '/:followedUsername',
        [verifyLoggedIn.isTokenValid],
        Follow.removeFollower
    );

    app.use('/api/db/follows', router);
};

export default followRoute;
