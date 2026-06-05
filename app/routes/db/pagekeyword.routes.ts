// const { PageKeyword } = require('../../controllers/db');
// const {
//     verifyLoggedIn,
//     verifyAuthorization,
// } = require('../../middleware/access');
import { Router } from "express";
import { PageKeyword } from "../../controllers/db";

import { verifyLoggedIn, verifyAuthorization } from "../../middleware/access";
import { Rt_Func } from "../types";

const pagekeywordRoute:Rt_Func = (app) => {
    // var router = require('express').Router();
    const router:Router = Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    // Get keyword list of a page
    router.get('/:pageId', PageKeyword.getKeywordsByPageId);

    // Add a keyword of a page
    router.post(
        '/:pageId',
        [verifyLoggedIn.isTokenValid, verifyAuthorization.checkPageOwner],
        PageKeyword.createKeyword
    );

    // Delete a keyword of a page
    router.delete(
        '/:pageId/:keyword',
        [verifyLoggedIn.isTokenValid, verifyAuthorization.checkPageOwner],
        PageKeyword.deleteKeyword
    );

    app.use('/api/db/pagekeyword', router);
};

export default pagekeywordRoute;