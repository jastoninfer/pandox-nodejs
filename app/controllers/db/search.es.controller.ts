// const { esDb } = require('../../models');
import { SearchResponse } from "elasticsearch";
import { esDb } from "../../models";
import type { C_Func } from '../types';
import { ES_PAGE_RESULT_PAGES_NUM_LIMT, ES_PAGE_RESULT_USERS_NUM_LIMT } from "../../config/constants.config";

const searchPage: C_Func = async (req, res) => {
    const keyword:string = req.params.keyword;
    const pageSize:number = ES_PAGE_RESULT_PAGES_NUM_LIMT;
    // Specific item details can be obtained from the _source field in the results
    try {
        const idx:number = Math.max(1, parseInt(req.params.pageIdx));
        const from:number = (idx - 1) * pageSize;
        const ret: SearchResponse<any> = await esDb.search<any>({
            index: 'page',
            body: {
                from: from,
                size: pageSize,
                query: {
                    function_score: {
                        query: {
                            multi_match: {
                                query: keyword,
                                fields: ['content^0.2', 'title^0.8'],
                                fuzziness: 'AUTO',
                            },
                        },
                        boost: 1,
                    },
                },
            },
        });
        const total: number = Math.ceil((ret.hits.total as any).value / pageSize);
        const results = ret.hits.hits;
        res.json({
            results,
            total,
            current: idx,
        });
        return;
    } catch (err: any) {
        res.status(500).send({
            message:
                err.message || 'Error while retrieving the pages using es.',
        });
        return;
    }
};

const searchUser: C_Func = async (req, res) => {
    const keyword:string = req.params.keyword;
    const pageSize:number = ES_PAGE_RESULT_USERS_NUM_LIMT;
    try {
        const idx:number = Math.max(1, parseInt(req.params.userIdx));
        const from:number = (idx - 1) * pageSize;
        const ret:SearchResponse<any> = await esDb.search<any>({
            index: 'user',
            body: {
                from: from,
                size: pageSize,
                query: {
                    bool: {
                        should: [
                            {
                                match: {
                                    username: {
                                        query: keyword,
                                        fuzziness: 'AUTO',
                                    },
                                },
                            },
                            {
                                wildcard: {
                                    username: `*${keyword}*`,
                                },
                            },
                        ],
                    },
                },
            },
        });
        // const total = typeof ret.hits.total === 'object' ? ret.hits.total.value as number : ret.hits.total;
        // console.log(ret);
        const total = Math.ceil((ret.hits.total as any).value / pageSize);
        // const total:number = Math.ceil(ret.hits.total / pageSize);
        const results = ret.hits.hits;
        res.json({
            results,
            total,
            current: idx,
        });
        return;
    } catch (err:any) {
        res.status(500).send({
            message:
                err.message || 'Error while retrieving the users using es.',
        });
        return;
    }
};

export {
    searchPage,
    searchUser,
};