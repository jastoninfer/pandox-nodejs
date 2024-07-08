import { Request, Response } from 'express';
import { Model, WhereOptions } from 'sequelize';

import { IMAGE_PREFIX } from '../../config/resource.config';
import { sequelize } from '../../models';
// import { CommentAttributes } from '../../models/comment.model';
import type { M_Comment, CommentAttributes, UserAttributes } from '../../models/types';

const DB_Comment = sequelize.models.comment;
const DB_User = sequelize.models.user;

// type M_Comment = Model<CommentAttributes>;


type M_User = Model<UserAttributes>;

// type C_Func = (req: Request, res: Response) => void|Promise<void>;
import type { C_Func } from '../types';

/**
 * try to create comment    /pages/comments?threadId=:threadId
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createComment: C_Func = (req, res) => {
    /*  The username of the responder (not the initiator) should be
        attached to req.body.
    */

    if (!req.body.text) {
        res.status(400).send({
            message: 'Comment cannot be empty',
        });
        return;
    }

    const comment: CommentAttributes = {
        threadId: +req.params.threadId,
        from: req.body.username,
        to: req.body.to,
        text: req.body.text,
    };
    /*  Write to the database
        Since foreign keys are defined, the database automatically checks if
        pageId exists in the pages table during insertion.
    */
        DB_Comment.create<M_Comment>(comment)
        .then((data: M_Comment) => {
            res.send(data.dataValues);
            return;
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while creating the comment.',
            });
            return;
        });
};

/**
 * retrieve all comments in a thread
 * @param {*} req
 * @param {*} res
 */

const getCommentsByThreadId: C_Func = async (req: Request, res: Response) => {
    const threadId: string = req.params.threadId;
    let commentIdx:number = 1;
    if(req.query.commentIdx) {
        commentIdx = parseInt(req.query.commentIdx as string);
    }

    const commentPageSize: number = 5;
    // Number of comments displayed per page in each thread

    try {
        const cntComments: number = await DB_Comment.count<M_Comment>({
            where: {
                threadId: threadId,
            },
        });
        const cntCommentPages: number = Math.ceil(cntComments / commentPageSize);

        if (commentIdx === -1) {
            commentIdx = Math.max(1, cntCommentPages);
        } else {
            commentIdx = Math.max(1, Math.min(cntCommentPages, commentIdx));
        }

        const offset: number = (commentIdx - 1) * commentPageSize;
        const comments: M_Comment[] = await DB_Comment.findAll<M_Comment>({
            where: {
                threadId: threadId,
            },
            order: [['createdAt', 'ASC'], ['id', 'ASC']],
            offset: offset,
            limit: commentPageSize,
        });

        const ret_comments = [];

        for (const { dataValues: commentData } of comments) {
            const user: M_User|null = await DB_User.findByPk<M_User>(commentData.from);
            // const ret_comment = {...comment, dataValues: {...comment.dataValues, avatar: IMAGE_PRFIX(user?.username) + user?.avatar}};
            const ret_comment: CommentAttributes & {'avatar': string} = {
                ...commentData,
                avatar: IMAGE_PREFIX(user?.dataValues.username||'') + (user?.dataValues.avatar||''),
            };
            ret_comments.push(ret_comment);
        }
        res.json({
            comments: ret_comments,
            total: cntCommentPages,
            current: commentIdx,
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
 * try to delete a comment by an ID
 * @param {*} req
 * @param {*} res
 */

const deleteCommentById: C_Func = (req, res) => {
    const commentId: string = req.params.commentId;
    DB_Comment.destroy<M_Comment>({
        where: { id: commentId } as WhereOptions<M_Comment>,
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: 'Comment deleted successfully',
                });
                return;
            } else {
                res.send({
                    message: 'Cannot delete comment. Maybe not found.',
                });
                return;
            }
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Internal error when trying to delete comment.',
            });
            return;
        });
};

export {
    createComment,
    getCommentsByThreadId,
    deleteCommentById,
};
