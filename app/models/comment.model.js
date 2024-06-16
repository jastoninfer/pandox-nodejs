
module.exports = (sequelize, Sequelize, DataTypes) => {
    // define a table
    const Comment = sequelize.define('comment', {
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });
    return Comment;
    // text: 子评论的内容
};