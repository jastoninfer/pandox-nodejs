const { mysqlDb } = require('../../models');
const User = mysqlDb.users;
const {imagePrefix} = require('../../config/resource.config');
const viewProfile = async (req, res) => {
    // 这不应该是一个受限函数
    try {
        const user = await User.findByPk(req.params.username);
        // const user = req.params.pageId;
        if (user) {
            // console.log('user is...');
            // console.log(user);
            const {password, avatar, ...retData} = user.dataValues;
            retData.avatar = imagePrefix(req.params.username) + avatar;
            res.send(retData);
        } else {
            res.status(400).send({
                message: `User not found.`,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

// 更新的内容显然包括avatar, selfIntro, 实际上暂时不考虑允许
// 用户更新其username

const updateProfile = async (req, res) => {
    try {
        const { username, newUsername, ...newProfile } = req.body;
        // username可能会被中间件直接挂载到req.body上
        // 检查newProfile的keys判断有哪些fields需要更新, 是否包括avatar
        // 用户在前端调用该方法之前, 应该已经调用了上传图片的方法, 并保证新的
        // avatar (如果有)已经被存储在服务器上, 这里只需提供新的avatar对应的name
        console.log('new Profile is', newProfile);
        const [num] = await User.update(newProfile, {
            where: {
                username: req.body.username,
            }
        });
        console.log('num is ', num);
        if (num !== 1) {
            res.status(500).send({
                message: 'User profile failed to update',
            });
            return;
        }
        console.log('proceedd...>>>>');
        // 成功时, 应该返回新的profile内容
        const user = await User.findByPk(req.body.username);
        // console.log('user is ', user);
        const {password, avatar, createdAt, updatedAt, ...retData} = user.dataValues;
        retData.avatar = imagePrefix(req.body.username) + avatar;
        console.log('ok.....');
        res.send(retData);
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

module.exports = {
    viewProfile,
    updateProfile,
};