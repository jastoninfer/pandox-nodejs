import { createClient as redisCreateClient, RedisClientType } from 'redis';
import { Client as ESClient } from 'elasticsearch';

import {
    redisConfig,
    elasticsearchConfig,
} from '../config/db.config';

import sequelize from './sequelize';

// import './user.model';
import initUser from './user.model';
// import './page.model';
// import './thread.model';
import initPage from './page.model';
import initThread from './thread.model';
import initComment from './comment.model';
// import './image.model';
// import './pagekeyword.model';
// import './follow.model';
// import './like.model';
import initImage from './image.model';
import initPageKeyword from './pagekeyword.model';
import initFollow from './follow.model';
import initLike from './like.model';

initUser();
initPage();
initThread();
initComment();
initImage();
initPageKeyword();
initFollow();
initLike();

// import makeFollow from './follow.model';
// import makeImage from './image.model';
// import makeLike from './like.model';
// import makePage from './page.model';
// import makePageKeyword from './pagekeyword.model';
// import makeThread from './thread.model';

// const sequelize = new Sequelize(
//     mysqlConfig.DB,
//     mysqlConfig.USER,
//     mysqlConfig.PASSWORD,
//     {
//         host: mysqlConfig.HOST,
//         dialect: mysqlConfig.dialect,
//         pool: {
//             max: mysqlConfig.pool.max,
//             min: mysqlConfig.pool.min,
//             acquire: mysqlConfig.pool.acquire,
//             idle: mysqlConfig.pool.idle,
//         },
//     }
// );

// mysqlDb.users = makeUser(sequelize);
// mysqlDb.pages = makePage(sequelize);
// mysqlDb.threads = makeThread(sequelize);
// makeComment(sequelize);
// mysqlDb.comments = Comment;
// mysqlDb.images = makeImage(sequelize);
// mysqlDb.pagekeywords = makePageKeyword(sequelize);

// mysqlDb.follows = makeFollow(sequelize, mysqlDb.users);
// mysqlDb.likes = makeLike(sequelize, mysqlDb.users, mysqlDb.pages);

sequelize.models.user.hasMany(sequelize.models.page, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'author',
});

sequelize.models.user.hasMany(sequelize.models.thread, {
    onDelete: 'set null',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'author',
});

sequelize.models.page.hasMany(sequelize.models.pagekeyword, {
    onDelete: 'cascade',
    hooks: true,
    foreignKey: 'pageId',
});

sequelize.models.page.hasMany(sequelize.models.thread, {
    onDelete: 'cascade',
    hooks: true,
    foreignKey: 'pageId',
});

sequelize.models.user.hasMany(sequelize.models.comment, {
    onDelete: 'set null',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'from',
});

sequelize.models.user.hasMany(sequelize.models.comment, {
    onDelete: 'set null',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'to',
});

sequelize.models.thread.hasMany(sequelize.models.comment, {
    onDelete: 'cascade',
    hooks: true,
    foreignKey: 'threadId',
});

sequelize.models.user.hasMany(sequelize.models.image, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'author',
});

sequelize.models.user.belongsToMany(sequelize.models.user, {
    as: 'followed',
    foreignKey: 'followed',
    through: sequelize.models.follow,
});

sequelize.models.user.belongsToMany(sequelize.models.user, {
    as: 'follower',
    foreignKey: 'follower',
    through: sequelize.models.follow,
});

sequelize.models.user.belongsToMany(sequelize.models.page, {
    foreignKey: 'username',
    through: sequelize.models.like,
});

sequelize.models.page.belongsToMany(sequelize.models.user, {
    foreignKey: 'pageId',
    through: sequelize.models.like,
});

const redisDb: RedisClientType = redisCreateClient(redisConfig);

const esDb: ESClient = new ESClient(elasticsearchConfig);

export { sequelize, redisDb, esDb };
