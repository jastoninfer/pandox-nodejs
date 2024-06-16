const express = require('express');
const cors = require('cors');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {Sequelize, DataTypes} = require('sequelize');

const mysqlConfig = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '12345678',
    DB: 'testdb',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const sequelize = new Sequelize(mysqlConfig.DB, mysqlConfig.USER, mysqlConfig.PASSWORD, {
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

mysqlDb.users = sequelize.define("iusers", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
});

mysqlDb.pages = sequelize.define("ipages", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
});

mysqlDb.follows = sequelize.define('follow', {
    followed: {
      type: DataTypes.STRING,
      references: {
        model: mysqlDb.users,
        key: 'username',
      },
      validate: {
        notEqualFollower(value) {
            if (value === this.follower) {
                throw new Error('Followed and follower must be different');
            }
        }
      }
    },
    follower: {
      type: DataTypes.STRING,
      references: {
        model: mysqlDb.users,
        key: 'username',
      },
      validate: {
        notEqualFollowed(value) {
            if (value === this.followed) {
                throw new Error('Followed and follower must be different');
            }
        }
      }
    }
});

mysqlDb.users.belongsToMany(mysqlDb.users, { as: 'followed', foreignKey: 'followed', through: mysqlDb.follows });
mysqlDb.users.belongsToMany(mysqlDb.users, { as: 'follower', foreignKey: 'follower', through: mysqlDb.follows });

mysqlDb.likes = sequelize.define('like', {
    username: {
        type: DataTypes.STRING,
        references: {
            model: mysqlDb.users,
            key: 'username',
        },
    },
    pageId: {
        type: DataTypes.INTEGER,
        references: {
            model: mysqlDb.pages,
            ley: 'id',
        },
    }
});

mysqlDb.users.belongsToMany(mysqlDb.pages, { foreignKey: 'username', through: mysqlDb.likes});
mysqlDb.pages.belongsToMany(mysqlDb.users, { foreignKey: 'pageId', through: mysqlDb.likes});

const main = async () => {
    
    await mysqlDb.sequelize.sync({force: true});
    await mysqlDb.users.create({username: 'pandox1'});
    await mysqlDb.users.create({username: 'pandox2'});
    await mysqlDb.users.create({username: 'pandox3'});
    console.log(mysqlDb.pages.primaryKeyAttribute === 'id');
    // const temp = mysqlDb.pages.getAttributes();
    // console.log(mysqlDb.pages.getAttributes()['id'].type.key);
    // console.log(DataTypes.INTEGER);

    // mysqlDb.users.belongsToMany(mysqlDb.users, { through: 'follows'});
    
    // await mysqlDb.follows.create({followed: 'pandox5', follower: 'pandox4'});
    // await mysqlDb.follows.create({followed: 'pandox1', follower: 'pandox1'});

    // await mysqlDb.pages.create({id: 1});
    // await mysqlDb.likes.create({username: 'pandox1', pageId: 1});
};

main();