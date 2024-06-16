const Page = require('./page.controller');
const Thread = require('./thread.controller');
const Comment = require('./comment.controller');
const Image = require('./image.controller');
const User = require('./user.controller');
const Follow = require('./follow.controller');
const Like = require('./like.controller');
const ESearch = require('./search.es.controller');
const PageKeyword = require('./pagekeyword.controller');

module.exports = {
    Page,
    Thread,
    Comment,
    Image,
    User,
    Follow,
    Like,
    ESearch,
    PageKeyword,
};