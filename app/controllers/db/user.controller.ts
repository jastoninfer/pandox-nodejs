// const { sequelize } = require('../../models');
// const { IMAGE_PRFIX } = require('../../config/resource.config');
import { sequelize } from "../../models";
import { IMAGE_PREFIX } from "../../config/resource.config";
import type { M_User, UserAttributes } from "../../models/types";
import type { C_Func } from '../types';

const DB_User = sequelize.models.user;

const viewProfile: C_Func = async (req, res) => {
    try {
        const user:M_User|null = await DB_User.findByPk<M_User>(req.params.username);
        const userData:UserAttributes|undefined = user?.dataValues;
        if (userData) {
            const { password, avatar, ...retData } = userData;
            // retData.avatar = IMAGE_PRFIX(req.params.username) + avatar;
            res.send({
                ...retData,
                avatar: IMAGE_PREFIX(req.params.username) + avatar,
            });
        } else {
            res.status(400).send({
                message: `User not found.`,
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

/**
 * The updated content obviously includes avatar and selfIntro; for now,
 * we are not considering allowing users to update their username
 * @param {*} req
 * @param {*} res
 * @returns
 */

const updateProfile: C_Func = async (req, res) => {
    try {
        const { username, newUsername, ...newProfile } = req.body;

        /**
         * The username may be directly attached to req.body by middleware
         * Check the keys of newProfile to determine which fields need to be
         * updated, including whether avatar is among them. Before calling this
         * method on the frontend, the user should have already called the upload
         * image method, ensuring that the new avatar (if any) is stored on the
         * server. Here, only provide the name corresponding to the new avatar
         */
        const [num]: [number] = await DB_User.update<M_User>(newProfile, {
            where: {
                username: req.body.username,
            },
        });
        if (num !== 1) {
            res.status(500).send({
                message: 'User profile failed to update',
            });
            return;
        }
        // on success, return profile content
        const user: M_User|null = await DB_User.findByPk<M_User>(req.body.username);
        if (user) {
            const userData: UserAttributes = user.dataValues;
            const { password, avatar, ...retData } = userData;
            res.send({
                ...retData,
                avatar: IMAGE_PREFIX(req.body.username) + avatar,
            });
        }
        return;
        // retData.avatar = IMAGE_PRFIX(req.body.username) + avatar;
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
        });
    }
};

export {
    viewProfile,
    updateProfile,
};
