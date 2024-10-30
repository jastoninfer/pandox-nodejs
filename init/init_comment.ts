// const fs = require('fs').promises;
import { promises as fs } from 'fs';
import { sequelize } from '../app/models';
import { STATIC_COMMENT_PATH } from '../app/config/resource.config';

// const { sequelize } = require('../app/models');
// const { STATIC_COMMENT_PATH } = require('../app/config/resource.config');

import type { UserDict, ThreadData } from './types';
import type { M_Page, M_Thread } from '../app/models/types';

const DB_Thread = sequelize.models.thread;
const DB_Comment = sequelize.models.comment;
const DB_Page = sequelize.models.page;

const mapComment2Page = async (users:UserDict, threads: ThreadData[], pageId: number): Promise<void> => {
    const user_list = Object.keys(users);
    for (const thread of threads) {
        const threadOwner = user_list[Math.floor(Math.random()*user_list.length)];
        const threadDbData = await DB_Thread.create<M_Thread>({
            author: threadOwner,
            text: thread.body,
            pageId,
        });
        for (const comment of thread.comments) {
            const commenter = user_list[Math.floor(Math.random()*user_list.length)];
            await DB_Comment.create({
                from: commenter,
                to: threadOwner,
                text: comment,
                threadId: threadDbData.dataValues.id,
            });
        }
    }
};

const initComments = async (users: UserDict): Promise<void> => {
    const readPath:string = STATIC_COMMENT_PATH;
    try {
        const data:string = await fs.readFile(readPath, 'utf-8');
        const threads: ThreadData[] = [];
        for (const thread of data.split('\n\n')) {
            const threadBody_t1:RegExpMatchArray|null = thread.match(/\$\$([\n\s\S]*?)>>/);
            const threadBody_t2:RegExpMatchArray|null = thread.match(/\$\$(.*)/);
            const threadBodyText:string = (threadBody_t1 && threadBody_t1[1] || (threadBody_t2 && threadBody_t2[1]) || '').trim();
            const subItems: string[] = [];
            const threadComments:RegExpMatchArray[] = Array.from(
                thread.matchAll(/([\n\s\S]*?)>>/g)
            );
            for (let threadComment of threadComments.slice(1)) {
                subItems.push(threadComment[1].trim());
            }
            const threadData: ThreadData = {
                body: threadBodyText,
                comments: subItems,
            };
            threads.push(threadData);
        }
        const pages: M_Page[] = await DB_Page.findAll<M_Page>({
            attributes: ['id'],
        });
        for (let {dataValues: page} of pages) {
            if(page.id) {
                await mapComment2Page(users, threads, +page.id);
            }
        }
    } catch (err) {
        console.error('Error init comments: ', err);
    }
};

export { initComments };
