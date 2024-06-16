const {mysqlDb} = require('../../models');

const isUsernameUnused = (req, res, next) => {
    // .findOne找到条目返回该条目, 否则返回null
    mysqlDb.users.findOne({
        where: {
            username: req.body.newUsername || req.body.username,
        }
    }).then((user) => {
        if (user) {
            res.status(400).send({
                message: 'Failed! Username is already in use!',
            });
            return;
        }
        next(); // 转交给下一个中间件函数
    });
};

module.exports = {
    isUsernameUnused,
};