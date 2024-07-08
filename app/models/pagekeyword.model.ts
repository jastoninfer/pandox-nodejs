import { DataTypes, Model } from 'sequelize';

import sequelize from './sequelize';
import type { PageKeywordAttributes } from './types';

class PageKeyword extends Model<PageKeywordAttributes> implements PageKeywordAttributes {
    public pageId!: number;
    public keyword!: string;
}

const initPageKeyword = () => {
    PageKeyword.init({
        pageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        keyword: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
    }, {sequelize, modelName: 'pagekeyword'});
};

export default initPageKeyword;
