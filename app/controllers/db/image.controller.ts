// const fs = require('fs');
// const path = require('path');
// const mime = require('mime');

// const { sequelize } = require('../../models');
// const { ROOT_DIR } = require('../../config/resource.config');

// const Image = sequelize.models.image;

import fs from 'fs';
import path from 'path';
import mime from 'mime';

import { WhereOptions } from 'sequelize';

import { sequelize } from '../../models';
import { ROOT_DIR } from '../../config/resource.config';
// import { ImageAttribtues } from '../../models/image.model';
import type { M_Image } from '../../models/types';

// type M_Image = Model<ImageAttribtues>;
// import { M_Image, ImageAttribtues } from '../../models/types';

const DB_Image = sequelize.models.image;

// import {C_F}
// import { C_Func } from './types.d.ts';
import type { C_Func } from '../types';

// type C_Func = (req: Request, res: Response) => void|Promise<void>;

const addImage:C_Func = (req, res) => {
    if (req.file) {
        res.json({ filename: req.file.filename });
        return;
    } else {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
    }
};

const getImageById:C_Func = async (req, res) => {
    const imageId:string = req.params.imageId;
    const username:string = req.params.username;

    try {
        const imagePath:string = path.join(ROOT_DIR, 'img_data', username, imageId);

        fs.accessSync(imagePath, fs.constants.R_OK);
        const imageStream: fs.ReadStream = fs.createReadStream(imagePath);
        const mimeType: string = mime.lookup(imagePath);
        res.set('Content-Type', mimeType);
        imageStream.pipe(res);
        return;
    } catch (err: any) {
        console.log(`Error fetching image!: ${err.message || err}`);
        res.status(500).send('Internal Server Error.');
        return;
    }
};

/**
 * retrieve all images of a user
 * @param {*} req
 * @param {*} res
 */

const getAllImages: C_Func = (req, res) => {
    const username: string|undefined = req.body.username;
    const imageIdx: number = parseInt(req.query.imageIdx as string|undefined || '1');

    DB_Image.findAll<M_Image>({
        where: {
            author: username,
        } as WhereOptions<M_Image>,
    })
        .then((data: M_Image[]) => {
            res.send(data.map((key) => (key.dataValues)));
            return;
        })
        .catch((err: any) => {
            res.status(500).send({
                message: err.message || 'Error while retrieving the images.',
            });
            return;
        });
};

/**
 * try to delete an image by ID
 * @param {*} req
 * @param {*} res
 */

const deleteImageById: C_Func = (req, res) => {
    /*
        Consider using a background process similar to garbage collection (GC) to
        automatically delete images instead of providing an explicit API to the
        frontend for deleting specific images.
    */

    const imageId: string = req.params.imageId;
    DB_Image.destroy<M_Image>({
        where: { name: imageId } as WhereOptions<M_Image>,
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: 'Image deleted successfully',
                });
                return;
            } else {
                res.send({
                    message: 'Cannot delete image. Maybe not found.',
                });
                return;
            }
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Internal error when trying to delete image.',
            });
            return;
        });
};

export {
    addImage,
    getImageById,
    getAllImages,
    deleteImageById,
}