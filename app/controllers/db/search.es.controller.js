const {esDb} = require('../../models');
exports.searchPage = async (req, res) => {
    const idx = Math.max(1, parseInt(req.params.pageIdx) || 1);
    const keyword = req.params.keyword;
    const pageSize = 5;
    // 可以从results源于中的_source中得到item具体内容
    try {
        const from = (idx - 1) * pageSize;
        const ret = await esDb.search({
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
                                fuzziness: 'AUTO'
                            }
                        },
                        boost: 1
                    }
                }
            }
        });
        const total = Math.ceil(ret.hits.total.value/pageSize);
        // const isLastPage = ret.hits.hits.length <= pageSize;
        const results = ret.hits.hits;
        res.json({
            results,
            total,
            current: idx,
        });
    } catch (err) {
        res.status(500).send({
            message : err.message || 'Error while retrieving the pages using es.'
        });
    }
};

exports.searchUser = async (req, res) => {
    const idx = Math.max(1, parseInt(req.params.userIdx) || 1);
    const keyword = req.params.keyword;
    // console.log('===<><><>');
    // console.log('idx,', idx);
    // console.log('keyowrd, ', keyword);
    const pageSize = 10;
    try {
        const from = (idx - 1) * pageSize;
        const ret = await esDb.search({
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
                                        fuzziness: 'AUTO'
                                    }
                                }
                            },
                            {
                                wildcard: {
                                    username: `*${keyword}*`
                                }
                            }
                        ]
                    }
                }
            }
        });
        const total = Math.ceil(ret.hits.total.value/pageSize);
        // const isLastPage = ret.hits.hits.length <= pageSize;
        const results = ret.hits.hits;
        res.json({
            results,
            total,
            current: idx,
        });
    } catch (err) {
        res.status(500).send({
            message : err.message || 'Error while retrieving the users using es.'
        });
    }
};