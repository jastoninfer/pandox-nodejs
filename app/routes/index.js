
module.exports = app => {
    require('./access/auth.routes')(app);
    require('./db/comment.routes')(app);
    require('./db/follow.routes')(app);
    require('./db/image.routes')(app);
    require('./db/like.routes')(app);
    require('./db/page.routes')(app);
    require('./db/thread.routes')(app);
    require('./db/user.routes')(app);
    require('./db/search.es.routes')(app);
    require('./db/pagekeyword.routes')(app);
};