const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');
const {redisDb} = require('../../models');
// const db = require('../../models');
// const User = db.users;
// 401/403 应该引导用户进行重定向(登录), 或许可能在err上设置字段表示token无效

const ifTokenValid = (req, res, next) => {
    // console.log('-----------================');
    // console.log(req.headers);
    const token = req.headers['x-access-token'];
    if (!token) {
        console.log('LLSFJPFJOF');
        return next();
        // console.log('here....');
        // 后续代码不会被执行, 无需添加return
    }
    jwt.verify(token, config.secret, async (err, decoded) => {
        if(err) {
            console.log('>>>>>>>>>>>>>');
            // console.log('res', res);
            return next();
        }
        try {
            const isTokenBlocked = await redisDb.get(token);
            const isUserBlocked = await redisDb.get(decoded.username);
            console.log('<<<<<<<<<');
            if (isTokenBlocked || isUserBlocked) {
                return next();
            }
            console.log('++++++++here');
            req.body.username = decoded.username;
            // next();
        }catch(err) {
            // next();
        } finally {
            next();
        }
    });
};

const isTokenValid = (req, res, next) => {
    const token = req.headers['x-access-token'];
    console.log(req);
    // console.log(req.headers);
    if(!token) {
        // 401: 没有提供token
        return res.status(401).send({
            message: 'No token provided!',
        });
    }
    
    // 提供token以及服务器端的秘钥
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            // 401: 未授权, 身份验证凭据无效
            return res.status(401).send({
                message: 'Unauthorized! Token invalid.',
            });
        }
        try {
            // 检查token是否被BAN
            const isTokenBlocked = await redisDb.get(token);
            // 检查用户是否被block
            const isUserBlocked = await redisDb.get(decoded.username);
            if (isTokenBlocked || isUserBlocked) {
                return res.status(401).send({
                    message: 'Unauthorized! Token invalid.',
                });
            }
            req.body.username = decoded.username;
            console.log('req.body is ', req.body);
            console.log('go...');
            // console.log(req);
            next();
        } catch (err) {
            return res.status(500).send({
                message: err.message,
            });
        }
    });
};

module.exports = {
    isTokenValid,
    ifTokenValid,
};