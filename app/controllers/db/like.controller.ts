// const { sequelize } = require('../../models');
import { WhereOptions } from 'sequelize';
import { sequelize } from '../../models';

import type { M_Like } from '../../models/types';
import type { C_Func } from '../types';

const DB_Like = sequelize.models.like;

const savePage: C_Func = async (req, res) => {
    const pageId: string = req.params.pageId;
    try {
        await DB_Like.create<M_Like>({
            username: req.body.username,
            pageId: +pageId,
        });
        return;
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
        });
        return;
    }
};

const removeSavedPage: C_Func = async (req, res) => {
    try {
        const pageId: string = req.params.pageId;
        const num:number = await DB_Like.destroy<M_Like>({
            where: {
                username: req.body.username,
                pageId: pageId,
            } as WhereOptions<M_Like>,
        });
        if (num !== 1) {
            res.send({
                message: 'Cannot delete saved page.',
            });
            return;
        } else {
            res.send({
                message: 'Saved page deleted successfully.',
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

export {
    savePage,
    removeSavedPage,
};
