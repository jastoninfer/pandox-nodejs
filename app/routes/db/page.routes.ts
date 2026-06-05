// const { Page } = require('../../controllers/db');
// const {
//     verifyLoggedIn,
//     verifyAuthorization,
// } = require('../../middleware/access');
import { Router } from "express";
import { Page } from "../../controllers/db";

import { verifyLoggedIn, verifyAuthorization } from "../../middleware/access";

import { Rt_Func } from "../types";

const pageRoute:Rt_Func = (app) => {
    const router:Router = Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    // Attempt to create a new page
    router.post('/pages', [verifyLoggedIn.isTokenValid], Page.createPage);

    // get recommended pages for a user
    router.get(
        '/pagerecommend',
        [verifyLoggedIn.ifTokenValid],
        Page.getRecommendPages
    );

    // Query a page by ID
    router.get(
        '/pages/:pageId',
        [verifyLoggedIn.ifTokenValid],
        Page.getPageById
    );

    // Query all pages of a user    pagelist?pageOwner=:pageOwner&pageIdx=:pageIdx
    router.get(
        '/pagelist',
        [verifyLoggedIn.ifTokenValid],
        Page.getPagesByOwner
    );

    // Update a page by ID
    router.put(
        '/pages/:pageId',
        [verifyLoggedIn.isTokenValid, verifyAuthorization.checkPageOwner],
        Page.updatePageById
    );

    // Delete a page by ID
    router.delete(
        '/pages/:pageId',
        [verifyLoggedIn.isTokenValid, verifyAuthorization.checkPageOwner],
        Page.deletePageById
    );

    app.use('/api/db', router);
};

export default pageRoute;
