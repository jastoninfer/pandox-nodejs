import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from './sequelize';
import type { PageAttribtues } from './types';
import { PageStatus } from '../enums/page.enum';

class Page extends Model<PageAttribtues> implements PageAttribtues {
    public title!: string;
    // public description: string|undefined;
    public content!: string;
    // public status!: string;
}



const initPage = () => {
    Page.init({
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
            type: DataTypes.ENUM(...Object.values(PageStatus)),
            defaultValue: PageStatus.DRAFT,
        },
    }, {sequelize, modelName: 'page'});
};

export default initPage;
