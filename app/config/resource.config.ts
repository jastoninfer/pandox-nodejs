import path from 'path';
import { URL_PREFIX } from './env.config';

const IMAGE_PREFIX = (username: string): string =>
    URL_PREFIX + '/api/db/images/' + username + '/';

const ROOT_DIR: string = path.resolve(__dirname, '../../');
const IMG_ROOT_DIR: string = path.join(ROOT_DIR, 'img_data');
const IMG_DIR = (username: string): string => path.join(IMG_ROOT_DIR, username);
const STATIC_RES_DIR: string = path.join(ROOT_DIR, 'static/resource');
const STATIC_IMG_ROOT: string = path.join(STATIC_RES_DIR, 'images');
const STATIC_IMG_DIR = (username: string): string =>
    path.join(STATIC_IMG_ROOT, username);
const STATIC_PAGE_ROOT: string = path.join(STATIC_RES_DIR, 'pages');
const STATIC_PAGE_DIR = (username: string): string =>
    path.join(STATIC_PAGE_ROOT, username);
const STATIC_COMMENT_PATH: string = path.join(
    STATIC_RES_DIR,
    'comments/comments.txt'
);

export {
    IMAGE_PREFIX,
    ROOT_DIR,
    IMG_ROOT_DIR,
    IMG_DIR,
    STATIC_IMG_ROOT,
    STATIC_IMG_DIR,
    STATIC_PAGE_ROOT,
    STATIC_PAGE_DIR,
    STATIC_COMMENT_PATH,
};
