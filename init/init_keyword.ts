// const fs = require('fs').promises;
// const path = require('path');
import { promises as fs, Stats } from 'fs';
import { sequelize } from '../app/models';
import path from 'path';

// const { sequelize } = require('../app/models');
// const { STATIC_PAGE_DIR } = require('../app/config/resource.config');
import { STATIC_PAGE_DIR } from '../app/config/resource.config';

import type { M_Page } from '../app/models/types';

import type { UserDict } from './types';
const DB_Page = sequelize.models.page;

const mapKeyword2Page = async (author:string, title:string, keywords:string[]): Promise<void> => {
    try {
        const page: M_Page|null = await DB_Page.findOne<M_Page>({
            where: {
                author,
                title,
            },
            attributes: ['id'],
        });
        if (page) {
            for (const keyword of keywords) {
                await sequelize.models.pagekeyword.create({
                    pageId: page.dataValues.id,
                    keyword,
                });
            }
        }
    } catch (err) {
        console.error('Error during mapping keywords to page: ', err);
    }
};

const initKeywords = async (users: UserDict): Promise<void> => {
    const keywordsRegex: RegExp = /KEYWORDS\[\[(.*?)\]\]KEYWORDS/s;
    try {
        for (const [username, user] of Object.entries(users)) {
            const readDir:string = STATIC_PAGE_DIR(username);
            const files:string[] = await fs.readdir(readDir);
            for (const file of files) {
                const filePath:string = path.join(readDir, file);
                const stats:Stats = await fs.stat(filePath);
                if (stats.isFile() && path.extname(file) === '.txt') {
                    const title:string = path.basename(filePath, '.txt');
                    const content:string = await fs.readFile(filePath, 'utf-8');
                    const keywordsMatch:RegExpMatchArray|null = content.match(keywordsRegex);
                    if (keywordsMatch && keywordsMatch[1]) {
                        const keywords:string[] = keywordsMatch[1]
                            .split('][')
                            .map((keyword) => keyword.trim());
                        await mapKeyword2Page(username, title, keywords);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error during init keywords: ', err);
    }
};

export { initKeywords };
