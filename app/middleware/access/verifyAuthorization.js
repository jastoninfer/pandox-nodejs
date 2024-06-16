const {mysqlDb} = require('../../models');

const checkPageOwner = async (req, res, next) => {
    // 这里加上async修饰是可以的吗?不确定.
    const username = req.body.username;
    const pageId = req.params.pageId;
    try {
        const page = await mysqlDb.pages.findByPk(pageId);
        if (page.author !== username) {
            // 403: 有令牌, 但是无权限
            return res.status(403).send({
                message: 'Unauthorized! Permission denied.',
            });
        }
        next();
    } catch (err) {
        return res.status(500).send({
            message: err.message,
        });
    }
};

const checkThreadOwner = async (req, res, next) => {
    // 这里加上async修饰是可以的吗?不确定.
    const username = req.body.username;
    const threadId = req.params.threadId;
    try {
        const thread = await mysqlDb.threads.findByPk(threadId);
        if (thread.author !== username) {
            // 403: 有令牌, 但是无权限
            return res.status(403).send({
                message: 'Unauthorized! Permission denied.',
            });
        }
        next();
    } catch (err) {
        return res.status(500).send({
            message: err.message,
        });
    }
};

const checkCommentOwner = async (req, res, next) => {
    // 这里加上async修饰是可以的吗?不确定.
    const username = req.body.username;
    const commentId = req.params.commentId;
    try {
        const comment = await mysqlDb.comments.findByPk(commentId);
        if (comment.from !== username) {
            // 403: 有令牌, 但是无权限
            return res.status(403).send({
                message: 'Unauthorized! Permission denied.',
            });
        }
        next();
    } catch (err) {
        return res.status(500).send({
            message: err.message,
        });
    }
};

const checkImageOwner = async (req, res, next) => {
    // 这里加上async修饰是可以的吗?不确定.
    const username = req.body.username;
    const imageId = req.params.imageId;
    try {
        const image = await mysqlDb.images.findByPk(imageId);
        if (image.author !== username) {
            // 403: 有令牌, 但是无权限
            return res.status(403).send({
                message: 'Unauthorized! Permission denied.',
            });
        }
        next();
    } catch (err) {
        return res.status(500).send({
            message: err.message,
        });
    }
};

module.exports = {
    checkPageOwner,
    checkThreadOwner,
    checkCommentOwner,
    checkImageOwner,
};