import { DataTypes, Model } from 'sequelize';

import sequelize from './sequelize';
import type { LikeAttributes } from './types';

class Like extends Model<LikeAttributes> implements LikeAttributes {
    public username!: string;
    public pageId!: number;
}

const initLike = () => {
    Like.init({
        username: {
            type: DataTypes.STRING,
            references: {
                model: sequelize.models.user,
                key: sequelize.models.user.primaryKeyAttribute,
            },
        },
        pageId: {
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.page,
                key: sequelize.models.page.primaryKeyAttribute,
            },
        },
    }, {sequelize, modelName: 'like'});
};

export default initLike;
