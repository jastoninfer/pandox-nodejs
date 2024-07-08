// const { sequelize } = require('../../models');
import { Request, Response } from "express";
import { WhereOptions } from "sequelize";
import { sequelize } from "../../models";

import type { M_Follow, M_User } from "../../models/types";
import type { C_Func } from '../types';

// import { FollowAttributes } from "../../models/follow.model";
// import { UserAttributes } from "../../models/user.model";

const DB_Follow = sequelize.models.follow;
const DB_User = sequelize.models.user;

// type C_Func = (req: Request, res: Response) => void|Promise<void>;

const addFollower: C_Func = async (req, res) => {
    const followedUsername: string = req.params.followedUsername;
    try {
        await DB_Follow.create<M_Follow>({
            followed: followedUsername,
            follower: req.body.username,
        });
        return;
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

const removeFollower: C_Func = async (req, res) => {
    try {
        const followedUsername = req.params.followedUsername;
        const num = await DB_User.destroy<M_User>({
            where: {
                followed: followedUsername,
                follower: req.body.username,
            } as WhereOptions<M_User>,
        });
        if (num !== 1) {
            res.send({
                message: 'Cannot delete followed-follower relationship.',
            });
            return;
        } else {
            res.send({
                message: 'Followed-follower relationship deleted successfully.',
            });
            return;
        }
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
        });
    }
};

export {
    addFollower,
    removeFollower,
};
