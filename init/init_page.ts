// const fs = require('fs').promises;
// const path = require('path');

// const { sequelize } = require('../app/models');
// const { STATIC_PAGE_DIR } = require('../app/config/resource.config');

import { promises as fs, Stats } from 'fs';
import { sequelize } from '../app/models';
import path from 'path';

import { STATIC_PAGE_DIR } from '../app/config/resource.config';

// const { URL_PREFIX } = require('../app/config/env.config');
import { URL_PREFIX } from '../app/config/env.config';

import type { UserDict, UserImageRename } from './types';
import { PageAttribtues } from '../app/models/types';
import { PageStatus } from '../app/enums/page.enum';

const initPages = async (users: UserDict, userImageRename: UserImageRename): Promise<void> => {
    const keywordsRegex:RegExp = /KEYWORDS\[\[.*?\]\]KEYWORDS/s;
    const domainRenameRegex: RegExp = /!\[(.*?)\]\((.*?)\s*(".*?")?\)/g;

    for (const [username, user] of Object.entries(users)) {
        const imgRenameRegex: RegExp = new RegExp(
            Object.keys(userImageRename[username])
                .map(
                    (key) =>
                        `\\b${key
                            .replace(/\s/g, '%20')
                            .replace(/\(/g, '\\(')
                            .replace(/\)/g, '\\)')}\\b`
                )
                .join('|'),
            'g'
        );
        const readDir:string = STATIC_PAGE_DIR(username);
        try {
            const files:string[] = await fs.readdir(readDir);
            for (const file of files) {
                const filePath:string = path.join(readDir, file);
                const stats:Stats = await fs.stat(filePath);
                if (stats.isFile() && path.extname(file) === '.txt') {
                    const title:string = path.basename(filePath, '.txt');
                    let content:string = await fs.readFile(filePath, 'utf-8');
                    content = content.replace(keywordsRegex, '').trim();
                    /**
                     * resolve image urls
                     */
                    content = content.replace(
                        domainRenameRegex,
                        (match:any, p1:any, p2:any, p3:any) => {
                            const new_p2 = p2.includes('pandox') ? p2.replace(
                                /https:\/\/[^\/]+/g,
                                URL_PREFIX
                            ) : p2;
                            // console.log('match 1 is ', match);
                            return `![${p1}](${new_p2}${
                                (p3 && ` ${p3}`) || ''
                            })`;
                        }
                    );
                    content = content.replace(imgRenameRegex, (match:any) => {
                        // console.log('match 2', match);
                        return userImageRename[username][
                            match.replace(/%20/g, ' ')
                        ];
                    });
                    const jsonData:PageAttribtues = {
                        title,
                        content,
                        author: username,
                    };
                    await sequelize.models.page.create({
                        ...jsonData,
                        status: PageStatus.PUBLISHED,
                    });
                    // console.log('--------');
                }
            }
        } catch (err) {
            console.error('Error during init pages: ', err);
        }
    }
};

export { initPages };