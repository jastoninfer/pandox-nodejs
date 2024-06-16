const { mysqlDb } = require('../../models');
const Thread = mysqlDb.threads;
const User = mysqlDb.users;
const {imagePrefix} = require('../../config/resource.config');

// 尝试创建一个thread
exports.createThread = (req, res) => {
    // console.log('creating a thread...');
    if(!req.body.text) {
        // 400 Bad Request
        res.status(400).send({
            message: 'Comment cannot be empty'
        });
        return;
    }
    // console.log('page id is ', pageId);
    // console.log('body content is ', req.body.content);
    // 需要注意的是, req.body上不需要挂载pageId, author
    // 只需要挂载[text]
    const thread = {
        pageId: req.params.pageId,
        author: req.body.username,
        text: req.body.text,
    }
    // 写入数据库
    // 由于已经定义了外键, 数据库进行插入时会自动检查pageId是否在pages表中存在
    Thread.create(thread)
        .then((data) => {
            // console.log('|||----------->>>');
            // console.log(text);
            res.send(data);
        })
        .catch((err) => {
            // 500 服务器内部错误
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the thread.'
            });
        })
};

exports.getThreadsByPageId = async (req, res) => {
    // console.log('get all threads under one page...');
    // console.log('threadPageId is ', req.query.threadPage);
    const pageId = parseInt(req.params.pageId);
    let threadIdx = parseInt(req.query.threadIdx) || 1;
    // const threadPageId = parseInt(req.query.threadPage) || 1;
    const threadPageSize = 3; // 每页的评论threads数量
    try {
        const cntThreads = await Thread.count({
            where: {
                pageId: pageId,
            }
        });
        const cntThreadPages = Math.ceil(cntThreads/threadPageSize);
        if (threadIdx === -1) {
            threadIdx = Math.max(1, cntThreadPages);
        }else {
            threadIdx = Math.max(1, Math.min(cntThreadPages, threadIdx));
        }
        const offset = (threadIdx - 1) * threadPageSize;
        const threads = await Thread.findAll({
            where: {
                pageId: pageId,
            },
            order: [['createdAt', 'ASC']],
            offset: offset,
            limit: threadPageSize,
        });
        for (const thread of threads) {
            const user = await User.findByPk(thread.author);
            thread.dataValues.avatar = imagePrefix(thread.author)+user?.avatar;
        }

        res.json({
            threads,
            total: cntThreadPages,
            current: threadIdx,
        });
        // console.log('tot threads: ', cntThreads);
    }  catch(err) {
        res.status(500).send({
            message : err.message || 'Error while retrieving the comments.'
        });
    }
};

// 尝试根据id删除某个thread
exports.deleteThreadById = (req, res) => {
    const threadId = req.params.threadId;
    Thread.destroy({
        where: {id: threadId}
    }).then(num => {
        if(num == 1){
            res.send({
                message: 'Thread deleted successfully',
            })
        }else{
            res.send({
                message: 'Cannot delete thread. Maybe not found.'
            })
        }
    }).catch(err => {
        res.status(500).send({
            message: 'Internal error when trying to delete thread.'
        })
    })
};