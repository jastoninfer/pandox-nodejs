// const multer = require('multer');
// const fs = require('fs').promises;
import { Express } from 'express';
import { promises as fs } from 'fs';
// const path = require('path');
import multer, { Multer, StorageEngine, FileFilterCallback, DiskStorageOptions } from 'multer';
import path from 'path';
import { Request } from 'express';

// const { ROOT_DIR } = require('../../config/resource.config');
import { ROOT_DIR } from '../../config/resource.config';

const imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Please upload only images.'));
    }
};

const createStorage = (username: string): StorageEngine => {
    return multer.diskStorage({
        destination: async (req, file, cb) => {
            const dir:string = path.join(ROOT_DIR, 'img_data', username);
            try {
                await fs.access(dir);
            } catch (err) {
                cb(new Error('Direcotory not accessible.'), dir);
                return;
            }
            try {
                await fs.access(path.join(dir, file.originalname));
                cb(new Error('Internal error: filename exists'), dir);
                return;
            } catch (err) {}
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    } as DiskStorageOptions);
};

const uploadImage = (username: string): Multer => {
    return multer({
        storage: createStorage(username),
        fileFilter: imageFilter,
    });
};

export { uploadImage };
