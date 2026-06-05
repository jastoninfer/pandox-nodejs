import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from './sequelize';
import type { UserAttributes } from './types';

class User extends Model<UserAttributes> implements UserAttributes {
    public username!: string;
    public email!: string;
    public password!: string;
    avatar: string | undefined;
    selfIntro: string | undefined;
}

const initUser = () => {
    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        selfIntro: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {sequelize, modelName: 'user'});
};

export default initUser;