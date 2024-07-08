// const { sequelize } = require('../../models');
import { sequelize } from "../../models";
import type { M_PageKeyword } from "../../models/types";
import type { C_Func } from '../types';

const DB_PageKeyword = sequelize.models.pagekeyword;

const getKeywordsByPageId:C_Func = (req, res) => {
    const pageId:string = req.params.pageId;
    DB_PageKeyword.findAll<M_PageKeyword>({
        where: {
            pageId: pageId,
        },
        order: [['createdAt', 'ASC'], ['pageId', 'ASC']],
    })
        .then((data: M_PageKeyword[]) => {
            res.send(data.map((key)=>(key.dataValues)));
            return;
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving the keywords.',
            });
            return;
        });
};

const createKeyword:C_Func = async (req, res) => {
    /*
        Add a keyword to a specific page, with a maximum limit of 5 keywords
        per page. Frontend should also perform a quantity check
    */

    const pageId = req.params.pageId;
    const NumKeywordLimit:number = 5;
    if (!req.body.keyword) {
        /*
            Check if the keyword is empty; frontend should also enforce this
            restriction and trim excess whitespace from both ends of the string
        */
        res.status(400).send({
            message: 'Keyword can not be empty!',
        });
        return;
    }
    try {
        // Check if the number of keywords exceeds the limit
        const cntKeywords:number = await DB_PageKeyword.count<M_PageKeyword>({
            where: {
                pageId: pageId,
            },
        });
        if (cntKeywords >= NumKeywordLimit) {
            res.status(400).send({
                message: 'Keyword num reaches capacity!',
            });
            return;
        }
        DB_PageKeyword.create<M_PageKeyword>({
            pageId: +pageId,
            keyword: req.body.keyword,
        }).then((data: M_PageKeyword) => {
            res.send(data.dataValues);
            return;
        });
    } catch (err: any) {
        res.status(500).send({
            message:
                err.message ||
                'Some error occurred while creating the keyword.',
        });
        return;
    }
};

const deleteKeyword:C_Func = (req, res) => {
    const pageId:string = req.params.pageId;
    const keyword:string = req.params.keyword;
    try {
        DB_PageKeyword.destroy<M_PageKeyword>({
            where: {
                pageId,
                keyword,
            },
        }).then((num: number) => {
            if (num === 1) {
                res.send({
                    message: 'Keyword successfully deleted.',
                });
            } else {
                res.send({
                    message: 'Keyword cannot be deleted, maybe not found.',
                });
            }
            return;
        });
    } catch (err: any) {
        res.status(500).send({
            message:
                err.message ||
                'Some error occurred while deleting the keyword.',
        });
        return;
    }
};

export {
    getKeywordsByPageId,
    createKeyword,
    deleteKeyword,
}