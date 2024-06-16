const { mysqlDb } = require('../../models');
const Comment = mysqlDb.comments;
const User = mysqlDb.users;
const { imagePrefix } = require('../../config/resource.config');

// 尝试创建一个comment    /pages/comments?threadId=:threadId

exports.createComment = (req, res) => {
    // console.log('creating a thread...');
    // req.body上应该挂载回复的(而不是发起的人)的username
    if(!req.body.text) {
        // 400 Bad Request
        res.status(400).send({
            message: 'Comment cannot be empty'
        });
        return;
    }
    // console.log('page id is ', pageId);
    // console.log('body content is ', req.body.content);
    const comment = {
        threadId: req.params.threadId,
        from: req.body.username,
        to: req.body.toUsername,
        text: req.body.text,
    }
    // 写入数据库
    // 由于已经定义了外键, 数据库进行插入时会自动检查pageId是否在pages表中存在
    Comment.create(comment)
        .then((data) => {
            // console.log('|||----------->>>');
            // console.log(text);
            res.send(data);
        })
        .catch((err) => {
            // 500 服务器内部错误
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the comment.'
            });
        })
};

// 查询某个thread下所有的comment 
exports.getCommentsByThreadId = async (req, res) => {
    // console.log('------------>>>');
    const threadId = req.params.threadId;
    // console.log('text is ', req.query.commentIdx);
    let commentIdx = parseInt(req.query.commentIdx) || 1;
    // commentIdx一般是1, 2, 3这种整数，也有可能是0(表示最后一页)
    // 有分页, 但未实现, 现在来实现分页
    const commentPageSize = 5; // 每个thread下每页comment的显示数量
    try {
        const cntComments = await Comment.count({
            where: {
                threadId: threadId,
            }
        });
        // console.log('idx is ...', commentIdx);
        const cntCommentPages = Math.ceil(cntComments/commentPageSize);
        // console.log('idx is ...', commentIdx);
        if (commentIdx === -1) {
            commentIdx = Math.max(1, cntCommentPages);
        }else {
            commentIdx = Math.max(1, Math.min(cntCommentPages, commentIdx));
        }
        const offset = (commentIdx - 1) * commentPageSize;
        const comments = await Comment.findAll({
            where: {
                threadId: threadId,
            },
            order: [['createdAt', 'ASC']],
            offset: offset,
            limit: commentPageSize,
        });
        for (const comment of comments) {
            const user = await User.findByPk(comment.from);
            comment.dataValues.avatar = imagePrefix(user?.username) + user?.avatar;
        }
        res.json({
            comments,
            total: cntCommentPages,
            current: commentIdx,
        });
    } catch (err) {
        res.status(500).send({
            message : err.message || 'Error while retrieving the comments.'
        });
    }
};

// 尝试根据id删除某个comment
exports.deleteCommentById = (req, res) => {
    const commentId = req.params.commentId;
    Comment.destroy({
        where: {id: commentId}
    }).then(num => {
        if(num == 1){
            res.send({
                message: 'Comment deleted successfully',
            });
        }else{
            res.send({
                message: 'Cannot delete comment. Maybe not found.'
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: 'Internal error when trying to delete comment.'
        });
    });
};