import { Sequelize } from 'sequelize';

import {
    mysqlConfig,
} from '../config/db.config';

const sequelize: Sequelize = new Sequelize(
    mysqlConfig.DB,
    mysqlConfig.USER,
    mysqlConfig.PASSWORD,
    {
        host: mysqlConfig.HOST,
        dialect: mysqlConfig.dialect,
        pool: {
            max: mysqlConfig.pool.max,
            min: mysqlConfig.pool.min,
            acquire: mysqlConfig.pool.acquire,
            idle: mysqlConfig.pool.idle,
        },
    }
);

// console.log('info is', mysqlConfig);

export default sequelize;