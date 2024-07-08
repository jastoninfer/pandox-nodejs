// const jwt = require('jsonwebtoken');
import jwt, { decode } from 'jsonwebtoken';

// const config = require('../../config/auth.config');
import config from '../../config/auth.config';
import { redisDb } from '../../models';
// const { redisDb } = require('../../models');
import type { Md_Func } from "../types";

const ifTokenValid:Md_Func = (req, res, next) => {
    const token = req.headers['x-access-token'] as string | undefined;
    if (!token) {
        next();
        return;
    }
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
            next();
            return;
        }
        try {
            const isTokenBlocked = await redisDb.get(token);
            const isUserBlocked = await redisDb.get(decoded.username);
            if (isTokenBlocked || isUserBlocked) {
                next();
                return;
            }
            req.body.username = decoded.username;
        } catch (err) {
        } finally {
            next();
            return;
        }
    });
};

const isTokenValid:Md_Func = (req, res, next) => {
    const token = req.headers['x-access-token'] as string | undefined;

    if (!token) {
        res.status(401).send({
            message: 'No token provided!',
        });
        return;
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
            return res.status(401).send({
                message: 'Unauthorized! Token invalid.',
            });
        }
        try {
            // check if token banned
            const isTokenBlocked: string|null = await redisDb.get(token);
            // check if user banned
            const isUserBlocked: string|null = await redisDb.get(decoded.username);
            if (isTokenBlocked || isUserBlocked) {
                res.status(401).send({
                    message: 'Unauthorized! Token invalid.',
                });
                return;
            }
            req.body.username = decoded.username;
            next();
            return;
        } catch (err:any) {
            res.status(500).send({
                message: err.message,
            });
            return;
        }
    });
};

export {
    isTokenValid,
    ifTokenValid,
};
