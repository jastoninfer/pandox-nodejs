// const { sequelize } = require('../../models');

// const { IMAGE_PRFIX } = require('../../config/resource.config');
import { sequelize } from "../../models";
import { IMAGE_PREFIX } from "../../config/resource.config";
import type { M_Thread, M_User, ThreadAttributes, UserAttributes } from "../../models/types";
import type { C_Func } from '../types';
import { WhereOptions } from "sequelize";

const DB_Thread = sequelize.models.thread;
const DB_User = sequelize.models.user;

/**
 * try to create a thread
 * @param {*} req
 * @param {*} res
 * @returns
 */

const createThread:C_Func = (req, res) => {
    if (!req.body.text) {
        res.status(400).send({
            message: 'Comment cannot be empty',
        });
        return;
    }

    const thread:ThreadAttributes = {
        pageId: +req.params.pageId,
        author: req.body.username,
        text: req.body.text,
    };

    /**
     *  Write to the database
     *  Since a foreign key is defined, the database will automatically check
     *  if pageId exists in the pages table during insertion
     */

    DB_Thread.create<M_Thread>(thread)
        .then((data: M_Thread) => {
            res.send(data.dataValues);
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while creating the thread.',
            });
        });
};

const getThreadsByPageId:C_Func = async (req, res) => {
    const pageId:number = parseInt(req.params.pageId);
    const threadPageSize:number = 3; // Number of comment threads per page
    try {
        let threadIdx:number = parseInt(req.query.threadIdx as string|undefined || '1');
        const cntThreads:number = await DB_Thread.count<M_Thread>({
            where: {
                pageId: pageId,
            },
        });
        const cntThreadPages:number = Math.ceil(cntThreads / threadPageSize);
        if (threadIdx === -1) {
            threadIdx = Math.max(1, cntThreadPages);
        } else {
            threadIdx = Math.max(1, Math.min(cntThreadPages, threadIdx));
        }
        const offset:number = (threadIdx - 1) * threadPageSize;

        const threads: M_Thread[] = await DB_Thread.findAll<M_Thread>({
            where: {
                pageId: pageId,
            },
            order: [['createdAt', 'ASC'], ['id', 'ASC']],
            offset: offset,
            limit: threadPageSize,
        });

        const ret_threads: any[] = [];

        for (const {dataValues: threadData} of threads) {
            const user:M_User|null = await DB_User.findByPk<M_User>(threadData.author);
            const userData:UserAttributes|undefined = user?.dataValues;
            const ret_thread = {...threadData, avatar: IMAGE_PREFIX(threadData.author||'') + (userData?.avatar||'')};
            // thread.dataValues.avatar =
            //     IMAGE_PRFIX(threadData.author) + userData?.avatar;
            ret_threads.push(ret_thread);
        }

        res.json({
            threads: ret_threads,
            total: cntThreadPages,
            current: threadIdx,
        });
        return;
    } catch (err: any) {
        res.status(500).send({
            message: err.message || 'Error while retrieving the comments.',
        });
        return;
    }
};

/**
 * Try to delete a thread by ID
 * @param {*} req
 * @param {*} res
 */

const deleteThreadById:C_Func = (req, res) => {
    const threadId:string = req.params.threadId;
    DB_Thread.destroy<M_Thread>({
        where: { id: threadId } as WhereOptions<M_Thread>,
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: 'Thread deleted successfully',
                });
            } else {
                res.send({
                    message: 'Cannot delete thread. Maybe not found.',
                });
            }
            return;
        })
        .catch((err: any) => {
            res.status(500).send({
                message: 'Internal error when trying to delete thread.',
            });
            return;
        });
};

export {
    createThread,
    getThreadsByPageId,
    deleteThreadById,
}