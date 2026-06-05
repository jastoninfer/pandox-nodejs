// const { sequelize } = require('../../models');
import { sequelize } from "../../models";

// import type {M}
import type { Md_Func } from "../types";
import type { CommentAttributes, ImageAttribtues, M_Comment, M_Image, M_Page, M_Thread, PageAttribtues, ThreadAttributes } from "../../models/types";

const DB_Page = sequelize.models.page;
const DB_Thread = sequelize.models.thread;
const DB_Comment = sequelize.models.comment;
const DB_Image = sequelize.models.image;

const checkPageOwner: Md_Func = async (req, res, next) => {
    const username: string|undefined = req.body.username;
    const pageId: string = req.params.pageId;
    try {
        const page: M_Page|null = await DB_Page.findByPk<M_Page>(pageId);
        const pageData: PageAttribtues|undefined = page?.dataValues;
        if (!username || pageData?.author !== username) {
            res.status(403).send({
                message: 'Unauthorized! Permission denied.',
            });
            return;
        }
        next();
    } catch (err:any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

const checkThreadOwner: Md_Func = async (req, res, next) => {
    const username: string|undefined = req.body.username;
    const threadId:string = req.params.threadId;
    try {
        const thread: M_Thread|null = await DB_Thread.findByPk<M_Thread>(threadId);
        const threadData: ThreadAttributes|undefined = thread?.dataValues;
        if (!username || threadData?.author !== username) {
            res.status(403).send({
                message: 'Unauthorized! Permission denied.',
            });
            return;
        }
        next();
    } catch (err:any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

const checkCommentOwner:Md_Func = async (req, res, next) => {
    const username:string|undefined = req.body.username;
    const commentId:string = req.params.commentId;
    try {
        const comment: M_Comment|null = await DB_Comment.findByPk<M_Comment>(commentId);
        const commentData: CommentAttributes|undefined = comment?.dataValues;
        if (!username || commentData?.from !== username) {
            res.status(403).send({
                message: 'Unauthorized! Permission denied.',
            });
            return;
        }
        next();
    } catch (err:any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

const checkImageOwner:Md_Func = async (req, res, next) => {
    const username:string|undefined = req.body.username;
    const imageId:string = req.params.imageId;
    try {
        const image: M_Image|null = await DB_Image.findByPk<M_Image>(imageId);
        const imageData: ImageAttribtues|undefined = image?.dataValues;
        if (!username || imageData?.author !== username) {
            res.status(403).send({
                message: 'Unauthorized! Permission denied.',
            });
            return;
        }
        next();
    } catch (err:any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

export {
    checkPageOwner,
    checkThreadOwner,
    checkCommentOwner,
    checkImageOwner,
};
