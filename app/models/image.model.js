
module.exports = (sequelize, Sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
        },
    });
    return Image;
};