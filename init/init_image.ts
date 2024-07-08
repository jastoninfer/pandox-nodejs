// const fs = require('fs').promises;
import { promises as fs, Stats } from 'fs';
import path from 'path';
// const path = require('path');
// const mime = require('mime');
import mime from 'mime';
// const { v4: uuidv4 } = require('uuid');
import { v4 as uuidv4 } from 'uuid';
import type { UserDict, UserImageRename, ImageRename } from './types';

// const {
//     IMG_ROOT_DIR,
//     IMG_DIR,
//     STATIC_IMG_DIR,
// } = require('../app/config/resource.config');

import { IMG_ROOT_DIR, IMG_DIR, STATIC_IMG_DIR } from '../app/config/resource.config';

const IMAGE_MIME_TYPES: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp',
];

const clear = async (dir: string): Promise<void> => {
    try {
        const files: string[] = await fs.readdir(dir);
        for (const file of files) {
            const filePath:string = path.join(dir, file);
            const stats:Stats = await fs.stat(filePath);
            if (stats.isFile()) {
                await fs.unlink(filePath);
            } else if (stats.isDirectory()) {
                await clear(filePath);
            }
        }
    } catch (err) {
        console.error(`Error while clearing ${dir}: `, err);
    }
};

const createDir = async (dir:string): Promise<void> => {
    try {
        await fs.access(dir);
    } catch (err: any) {
        if (err.code && err.code === 'ENOENT') {
            await fs.mkdir(dir, { recursive: true });
        } else {
            throw err;
        }
    }
};

const writeDir = async (srcDir: string, destDir: string, imageRename: ImageRename): Promise<void> => {
    try {
        const files: string[] = await fs.readdir(srcDir);
        for (const file of files) {
            const filePath:string = path.join(srcDir, file);
            const stats:Stats = await fs.stat(filePath);
            if (stats.isFile()) {
                const mimeType:string = mime.lookup(filePath);
                if (IMAGE_MIME_TYPES.includes(mimeType)) {
                    const content:Buffer = await fs.readFile(filePath);
                    const extension:string = mime.extension(mimeType)||'';
                    const newFilename:string = `${uuidv4()}.${extension}`;
                    imageRename[file] = newFilename;
                    const writePath:string = path.join(destDir, newFilename);
                    await fs.writeFile(writePath, content);
                }
            }
        }
    } catch (err) {
        console.error(`Error while reading ${srcDir}: `, err);
    }
};

const initImages = async (users: UserDict): Promise<UserImageRename> => {
    await clear(IMG_ROOT_DIR);

    const userImageRename: UserImageRename = {};
    for (const [username, user] of Object.entries(users)) {
        createDir(IMG_DIR(username));
        const imageRename: ImageRename = {};
        await writeDir(STATIC_IMG_DIR(username), IMG_DIR(username), imageRename);
        userImageRename[username] = imageRename;
    }

    return userImageRename;
};

export {
    initImages,
};
