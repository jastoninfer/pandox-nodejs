/**
 * sign up: Create a new user in the database
 * sign in: 1. Query username in the database; if exists,
 *          2. Compare input password with database password using bcrypt,
 *          3. Generate a token using jsonwebtoken,
 *          4. Return user information and access token.
 */

import jwt, {
    DecodeOptions,
    JwtPayload,
    Secret,
    SignOptions,
} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { IMAGE_PREFIX } from '../../config/resource.config';
import { sequelize, redisDb } from '../../models';
import config from '../../config/auth.config';

import type { M_User, UserAttributes } from '../../models/types';
import type { C_Func } from '../types';

const DB_User = sequelize.models.user;

const signup: C_Func = async (req, res) => {
    try {
        await DB_User.create<M_User>({
            username: req.body.username,
            email: req.body.email,
            // Hash the password data sent by the client using bcrypt,
            // with salt rounds set to 8 (recommended range is 10-12).
            password: bcrypt.hashSync(req.body.password, 8),
        });
        // remove for Redis if user blocked
        await redisDb.del(req.body.username);
        res.send({
            message: 'User registered successfully.',
        });
        return;
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

const signin: C_Func = (req, res) => {
    DB_User.findOne<M_User>({
        where: {
            username: req.body.username,
        },
    })
        .then((user: M_User|null) => {
            if (!user) {
                // user not found
                res.status(404).send({
                    message: 'User not found.',
                });
                return;
            }
            const userData: UserAttributes = user.dataValues;
            const passwordIsValid: boolean = bcrypt.compareSync(
                req.body.password,
                userData.password
            );
            if (!passwordIsValid) {
                res.status(401).send({
                    accessToken: null,
                    message: 'Invalid password!',
                });
                return;
            }
            // generate the would-return json-web-token to client
            const token: string = jwt.sign(
                { username: userData.username }, // user identification
                config.secret as Secret, // server side secret
                {
                    algorithm: config.algorithm, // encryption algorithm
                    allowInsecureKeySizes: true,
                    expiresIn: config.expire,
                } as SignOptions
            );
            res.status(200).send({
                username: userData.username,
                email: userData.email,
                avatar: IMAGE_PREFIX(userData.username) + userData.avatar,
                selfIntro: userData.selfIntro,
                accessToken: token,
            });
            return;
        })
        .catch((err: any) => {
            res.status(500).send({
                message: err.message,
            });
            return;
        });
};

const logout:C_Func = async (req, res) => {
    try {
        const token: string =
            (req.headers['x-access-token'] as string | undefined) || '';
        const decoded: JwtPayload | string | null = jwt.decode(token, {
            complete: true,
        } as DecodeOptions);

        if (decoded && typeof decoded !== 'string') {
            const nowTimestamp: number = Math.floor(Date.now() / 1000);
            const expTimestamp: number = decoded.payload.exp || nowTimestamp;
            const timeDiff = expTimestamp - nowTimestamp;
            if (timeDiff > 0) {
                await redisDb.setEx(token, timeDiff, '');
            }
        }
        res.send({
            message: 'Logged out successfully.',
        });
        return;
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

const changeAccountName:C_Func = async (req, res) => {
    // Before this, use middleware to check the availability of the new username.
    try {
        const [num]: [number] = await DB_User.update<M_User>(
            {
                username: req.body.newUsername,
            },
            {
                where: {
                    username: req.body.username,
                },
            }
        );
        if (num !== 1) {
            res.send({
                message: 'Account name failed to update',
            });
        } else {
            res.send({
                message: 'Account name successfully updated',
            });
        }
        return;
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

const deleteAccount:C_Func = async (req, res) => {
    try {
        const num: number = await DB_User.destroy({
            where: {
                username: req.body.username,
            },
        });
        if (num !== 1) {
            res.send({
                message: 'Cannot delete account. Maybe not found.',
            });
            return;
        } else {
            await redisDb.setEx(req.body.username, config.expire, '');
            res.send({
                message: 'Account deleted successfully.',
            });
            return;
        }
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

export { signup, signin, logout, changeAccountName, deleteAccount };
