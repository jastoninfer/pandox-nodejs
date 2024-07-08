// const { verifyLoggedIn } = require('../../middleware/access');
// const { User } = require('../../controllers/db');
import { Router } from "express";
import { verifyLoggedIn } from "../../middleware/access";
import { User } from "../../controllers/db";

import { Rt_Func } from "../types";

const userRoute:Rt_Func = (app) => {
    // var router = require('express').Router();
    const router: Router = Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    router.put('/', [verifyLoggedIn.isTokenValid], User.updateProfile);

    router.get('/:username', User.viewProfile);

    app.use('/api/db/users', router);
};

export default userRoute;