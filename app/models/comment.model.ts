import { DataTypes, Model } from 'sequelize';

import sequelize from './sequelize';
import type { CommentAttributes } from './types';

class Comment extends Model<CommentAttributes> implements CommentAttributes {
    public text!: string;
}

const initComment = (): void => {
    Comment.init(
        {
            text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'comment',
        }
    );
}

export default initComment;

