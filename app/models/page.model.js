
module.exports = (sequelize, Sequelize, DataTypes) => {
    // define a table
    const Page = sequelize.define('page', {
        // FK: author -> user.username
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('draft', 'published', 'private'),
            defaultValue: 'draft',
        }
    });
    return Page;
    // id: 数据库自动生成的主键, 一般是NUMBER类型
    // title: 文章的标题, 不允许为空, 用户提供, STRING类型
    // content: 文章的内容, 文章的内容, 类型待定(应该是二进制较为合适)
    // published: 选择是否将文章公开, 用户选择, BOOLEAN类型
    // createdAt: 文章创建日期, 可能由数据库自动更新
    // updatedAt: 文章最后更新日期, 可能由数据库自动更新
};