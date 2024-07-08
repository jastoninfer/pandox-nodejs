import { DataTypes, Model } from 'sequelize';

import sequelize from './sequelize';
import type { ThreadAttributes } from './types';

class Thread extends Model<ThreadAttributes> implements ThreadAttributes {
    public text!: string;
}

const initThread = () => {
    Thread.init({
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },{sequelize, modelName: 'thread'});
    
};

export default initThread;