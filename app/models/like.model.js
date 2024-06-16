
module.exports = (sequelize, Sequelize, DataTypes, User, Page) => {
    const Like = sequelize.define('like', {
        username: {
            type: DataTypes.STRING,
            references: {
                model: User,
                key: User.primaryKeyAttribute,
            },
        },
        pageId: {
            type: DataTypes.INTEGER,
            references: {
                model: Page,
                key: Page.primaryKeyAttribute,
            },
        }
    });
    return Like;
};