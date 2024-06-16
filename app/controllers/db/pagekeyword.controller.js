const {mysqlDb} = require('../../models');
const PageKeyword = mysqlDb.pagekeywords;

exports.getKeywordsByPageId = (req, res) => {
    const pageId = req.params.pageId;
    PageKeyword.findAll({
        where: {
            pageId: pageId,
        },
        order: [['createdAt', 'ASC']],
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving the keywords.'
        });
    });
};

exports.createKeyword = async (req, res) => {
    // 向某个page增加keyword, 但是一个page下keyword上限是5
    // 前端也应该进行数量检查
    const pageId = req.params.pageId;
    const NumKeywordLimit = 5;
    if (!req.body.keyword){
        // 400 请求错误
        // 检查keyword是否为空, 前端也应该进行此种限制
        // 并且在字符串两端移除多余的空白字符
        res.status(400).send({
            message: 'Keyword can not be empty!'
        });
        return;
    }
    try {
        // 检查keyword数量是否超出限制
        const cntKeywords = await PageKeyword.count({
            where: {
                pageId: pageId,
            }
        });
        if (cntKeywords >= NumKeywordLimit) {
            res.status(400).send({
                message: 'Keyword num reaches capacity!'
            });
            return;
        }
        PageKeyword.create({
            pageId,
            keyword: req.body.keyword,
        }).then((data) => {
            res.send(data);
        });
    } catch(err) {
        // 500 服务器内部错误
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the keyword.'
        });
    }
};

exports.deleteKeyword = (req, res) => {
    const pageId = req.params.pageId;
    const keyword = req.body.keyword;
    try {
        PageKeyword.destroy({
            where: {
                pageId, keyword
            }
        }).then((num) => {
            if(num === 1) {
                res.send({
                    message: 'Keyword successfully deleted.'
                })
            }else {
                res.send({
                    message: 'Keyword cannot be deleted, maybe not found.'
                })
            }
        });
    } catch(err) {
        // 500 服务器内部错误
        res.status(500).send({
            message: err.message || 'Some error occurred while deleting the keyword.'
        });
    }
};