// const { Like } = require('../../controllers/db');
// const { verifyLoggedIn } = require('../../middleware/access');
import { Router } from "express";
import { Like } from "../../controllers/db";
import { verifyLoggedIn } from "../../middleware/access";
// import { Md_Func } from "../../middleware/types";
import { Rt_Func } from "../types";

const likeRoute:Rt_Func = (app) => {
    const router:Router = Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });
    router.post('/:pageId', [verifyLoggedIn.isTokenValid], Like.savePage);
    router.delete(
        '/:pageId',
        [verifyLoggedIn.isTokenValid],
        Like.removeSavedPage
    );

    app.use('/api/db/likes', router);
};

export default likeRoute;