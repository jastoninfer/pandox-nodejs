
const { mysqlConfig, redisConfig, elasticsearchConfig } = require('../config/db.config');

const {Sequelize, DataTypes} = require('sequelize');
const { createClient: redisCreateClient } = require('redis');
const { Client: ESClient } = require('elasticsearch');


const sequelize = new Sequelize(mysqlConfig.DB, mysqlConfig.USER,
    mysqlConfig.PASSWORD,
    {
        host: mysqlConfig.HOST,
        dialect: mysqlConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: mysqlConfig.pool.max,
            min: mysqlConfig.pool.min,
            acquire: mysqlConfig.pool.acquire,
            idle: mysqlConfig.pool.idle
        }
    });

const mysqlDb = {};

mysqlDb.Sequelize = Sequelize;
mysqlDb.sequelize = sequelize;
mysqlDb.DataTypes = DataTypes;

mysqlDb.users = require('./user.model')(sequelize, Sequelize, DataTypes);
mysqlDb.pages = require('./page.model')(sequelize, Sequelize, DataTypes);
mysqlDb.threads = require('./thread.model')(sequelize, Sequelize, DataTypes);
mysqlDb.comments = require('./comment.model')(sequelize, Sequelize, DataTypes);
mysqlDb.images = require('./image.model')(sequelize, Sequelize, DataTypes);
mysqlDb.pagekeywords = require('./pagekeyword.model')(sequelize, Sequelize, DataTypes);

mysqlDb.follows = require('./follow.model')(
    sequelize, Sequelize, DataTypes, mysqlDb.users);
mysqlDb.likes = require('./like.model')(
    sequelize, Sequelize, DataTypes, mysqlDb.users, mysqlDb.pages);

mysqlDb.users.hasMany(mysqlDb.pages, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'author',
});

mysqlDb.users.hasMany(mysqlDb.threads, {
    onDelete: 'set null',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'author',
});

mysqlDb.pages.hasMany(mysqlDb.pagekeywords, {
    onDelete: 'cascade',
    hooks: true,
    foreignKey: 'pageId',
});

mysqlDb.pages.hasMany(mysqlDb.threads, {
    onDelete: 'cascade',
    hooks: true,
    foreignKey: 'pageId',
});

mysqlDb.users.hasMany(mysqlDb.comments, {
    onDelete: 'set null',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'from',
});

mysqlDb.users.hasMany(mysqlDb.comments, {
    onDelete: 'set null',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'to',
});

mysqlDb.threads.hasMany(mysqlDb.comments, {
    onDelete: 'cascade',
    hooks: true,
    foreignKey: 'threadId',
});

mysqlDb.users.hasMany(mysqlDb.images, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
    hooks: true,
    foreignKey: 'author',
});

mysqlDb.users.belongsToMany(mysqlDb.users, 
    { as: 'followed', foreignKey: 'followed', through: mysqlDb.follows });
mysqlDb.users.belongsToMany(mysqlDb.users, 
    { as: 'follower', foreignKey: 'follower', through: mysqlDb.follows });

mysqlDb.users.belongsToMany(
    mysqlDb.pages, { foreignKey: 'username', through: mysqlDb.likes});
mysqlDb.pages.belongsToMany(
    mysqlDb.users, { foreignKey: 'pageId', through: mysqlDb.likes});

// 首先在命令行运行: redis-server 以启动redis服务
const redisDb = redisCreateClient(redisConfig);

const esDb = new ESClient(elasticsearchConfig);

module.exports = {
    mysqlDb,
    redisDb,
    esDb,
};