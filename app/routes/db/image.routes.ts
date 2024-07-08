// const { Image } = require('../../controllers/db');
import { Image } from "../../controllers/db";
// const { imageHelper } = require('../../middleware/utility');
import { imageHelper } from "../../middleware/utility";
// const {
//     verifyLoggedIn,
//     verifyAuthorization,
// } = require('../../middleware/access');

import { verifyLoggedIn, verifyAuthorization } from "../../middleware/access";
import type { Rt_Func } from "../types";
import { Router } from "express";
import { Md_Func } from "../../middleware/types";

const imageRoute: Rt_Func = (app) => {
    // var router = require('express').Router();
    const router: Router = Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    // Upload a image
    router.post(
        '/images',
        [
            verifyLoggedIn.isTokenValid,
            (req, res, next) => {
                imageHelper.uploadImage(req.body.username).single('image')(
                    req,
                    res,
                    (err) => {
                        if (err) {
                            console.error('Error during file upload: ', err);
                            return res.status(500).json({ error: err.message });
                        }
                        next();
                    }
                );
            },
        ] as Md_Func[],
        Image.addImage
    );
    router.get(
        '/imagelist/:username',
        [verifyLoggedIn.isTokenValid],
        Image.getAllImages
    );

    /**
     * As long as the id is available, the corresponding image can be retrieved
     * with a GET request. Viewing the image does not require any permission checks
     * In fact, the image id is simply a modified version of the image name
     */
    router.get('/images/:username/:imageId', Image.getImageById);
    router.delete(
        '/images/:username/:imageId',
        [verifyLoggedIn.isTokenValid, verifyAuthorization.checkImageOwner],
        Image.deleteImageById
    );

    app.use('/api/db', router);
};

export default imageRoute;