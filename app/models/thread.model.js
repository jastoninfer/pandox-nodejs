
module.exports = (sequelize, Sequelize, DataTypes) => {
    // define a table
    const Thread = sequelize.define('thread', {
        // FK:author -> user.username
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
        // FK:pageId -> page.id
    });
    return Thread;
    // text: 主评论的内容
};