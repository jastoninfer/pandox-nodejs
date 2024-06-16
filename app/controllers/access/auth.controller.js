// sign up: 在数据库中创建新的user
// sign in: 1. 在数据库中查询username, 如果存在
//          2. 使用bcrypt进行输入和数据库的password比对
//          3. 使用jsonwebtoken生成一个token
//          4. 返回用户信息及access token

const {mysqlDb,redisDb} = require('../../models');
const config = require('../../config/auth.config');
const User = mysqlDb.users;

// const Op = mysqlDb.Sequelize.Op;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    try {
        // 将用户存储到数据库
        await User.create({
            username: req.body.username,
            email: req.body.email,
            // 使用bcrypt对客户端发送的密码数据进行哈希加密, salt rounds设置为8(推荐值10-12)
            password: bcrypt.hashSync(req.body.password, 8),
        });
        // 如果用户被block, 从redis中移除
        await redisDb.del(req.body.username);
        return res.send({
            message: 'User registered successfully.',
        });
    } catch (err) {
        // 500: 服务器内部错误
        res.status(500).send({
            message: err.message,
        });
    }
};

const signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username,
        }
    }).then((user) => {
        if (!user) {
            // 用户没找到
            return res.status(404).send({
                message: 'User not found.',
            });
        }
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password,
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid password!',
            });
        }
        // 生成需要返回给客户端的(json web) token
        const token = jwt.sign(
            { username: user.username }, // 用户标识
            config.secret, //服务端秘钥
            {
                algorithm: config.algorithm, //加密算法
                allowInsecureKeySizes: true, //?
                expiresIn: config.expire, //24小时后失效(secs)
            }
        );
        // console.log('=========<<<>>>><<<<<)))))');
        // console.log(user);
        res.status(200).send({
            username: user.username,
            email: user.email,
            avatar: `http://localhost:8080/api/db/images/${user.username}/${user.avatar}`,
            selfIntro: user.selfIntro,
            accessToken: token,
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    });
};

const logout = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.decode(token, { complete: true });
        const nowTimestamp = Math.floor(Date.now() / 1000);
        const expTimestamp = (decoded && decoded.payload.exp && decoded.payload.exp)
            || nowTimestamp;
        const timeDiff = expTimestamp - nowTimestamp;
        if(timeDiff > 0){
            // key, seconds, value
            await redisDb.setEx(token, timeDiff, '');
        }
        return res.send({
            message: 'Logged out successfully.',
        });
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

const changeAccountName = async (req, res) => {
    // 在此之前，使用中间件检查新用户名的可用性
    try {
        const num = await User.update({
            username: req.body.newUsername,
        }, {
            where: {
                username: req.body.username,
            }
        });
        if (num !== 1) {
            return res.send({
                message: 'Account name failed to update',
            });
        }else {
            return res.send({
                message: 'Account name successfully updated',
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const num = await User.destroy({
            where: {
                username: req.body.username,
            }
        });
        if (num !== 1) {
            return res.send({
                message: 'Cannot delete account. Maybe not found.'
            });
        } else {
            await redisDb.setEx(req.body.username, config.expire, '');
            return res.send({
                message: 'Account deleted successfully.'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

module.exports = {
    signup,
    signin,
    logout,
    changeAccountName,
    deleteAccount,
};