// const { Thread } = require('../../controllers/db');
// const { verifyLoggedIn, verifyAuthorization } = require('../../middleware/access');
import { Thread } from "../../controllers/db";
import { Router } from "express";

import { verifyLoggedIn, verifyAuthorization } from "../../middleware/access";
import { Rt_Func } from "../types";

const threadRoute:Rt_Func = (app) => {
    // var router = require('express').Router();
    const router:Router = Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    // Create a new comment thread under a specific page
    router.post('/:pageId', [verifyLoggedIn.isTokenValid], Thread.createThread);

    // Get the list of comment threads under a specific page, with query parameters
    router.get('/:pageId', Thread.getThreadsByPageId);

    // Delete a specific thread under a certain page
    router.delete('/:threadId', [
        verifyLoggedIn.isTokenValid,
        verifyAuthorization.checkThreadOwner,
    ], Thread.deleteThreadById);

    app.use('/api/db/threads', router);
};

export default threadRoute;