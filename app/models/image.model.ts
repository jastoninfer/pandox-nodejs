import { DataTypes, Model } from 'sequelize';

import sequelize from './sequelize';
import type { ImageAttribtues } from './types';

class Image extends Model<ImageAttribtues> implements ImageAttribtues {
    public name!: string;
    public type!: string;
}

const initImage = () => {
    Image.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
        },
    }, {sequelize, modelName: 'image'});
};

export default initImage;