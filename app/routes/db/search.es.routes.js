
const { ESearch } = require('../../controllers/db');

module.exports = app => {
    var router = require('express').Router();
    // 用户搜索包含特定关键词的pages
    router.get('/pages/:keyword/:pageIdx', ESearch.searchPage);
    // 用户搜索包含特定关键词的users
    router.get('/users/:keyword/:userIdx', ESearch.searchUser);

    app.use('/api/db/es', router);
};