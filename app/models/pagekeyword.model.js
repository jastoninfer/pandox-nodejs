

module.exports = (sequelize, Sequelize, DataTypes) => {
    const PageKeyword = sequelize.define('pagekeyword', {
        pageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        keyword: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        }
    });
    return PageKeyword;
};