import { Express, Request, Response, NextFunction, Router } from "express";
import type { Rt_Func } from "../types";

import { Comment } from "../../controllers/db";

import { verifyLoggedIn, verifyAuthorization } from "../../middleware/access";

const commentRoute:Rt_Func = (app) => {

    const router: Router = Router();

    // const { Comment } = require('../../controllers/db');
    // const {
    //     verifyLoggedIn,
    //     verifyAuthorization,
    // } = require('../../middleware/access');

    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    // Create a comment in a specific thread    /pages/comments?threadId=:threadId
    router.post(
        '/:threadId',
        [verifyLoggedIn.isTokenValid],
        Comment.createComment
    );

    // Query all comments in a specific thread  /pages/comments?threadId=:threadId
    router.get('/:threadId', Comment.getCommentsByThreadId);

    // Delete a comment
    router.delete(
        '/:commentId',
        [verifyLoggedIn.isTokenValid, verifyAuthorization.checkCommentOwner],
        Comment.deleteCommentById
    );

    app.use('/api/db/comments', router);
};

export default commentRoute;
