import { sequelize, redisDb } from '../app/models';
const { initUsers, updateUsers } = require('./init_user');
const { initImages } = require('./init_image');
const { initComments } = require('./init_comment');
const { initKeywords } = require('./init_keyword');
const { initPages } = require('./init_page');

/**
 * Synchronize the database on startup; forcefully clear existing tables
 * and recreate them (force=true)
 */

const init = async () => {
    try {
        await sequelize.sync({ force: true });
        await redisDb.connect();
        await redisDb.flushDb();

        const users = await initUsers();
        const imageRenameDict = await initImages(users);
        await updateUsers(imageRenameDict);
        await initPages(users, imageRenameDict);
        await initComments(users);
        await initKeywords(users);
    } catch (err) {
        console.error('Error during init...: ', err);
    }
};

export default init;