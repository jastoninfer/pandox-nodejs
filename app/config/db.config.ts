import { Dialect } from 'sequelize';
import { ConfigOptions as ESConfigOptions } from 'elasticsearch';
import { MYSQL_PWD, MYSQL_DB } from './env.config';

interface MySQLConfig {
    HOST: string;
    USER: string;
    PASSWORD: string;
    DB: string;
    dialect: Dialect;
    pool: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
}

interface RedisConfig {
    url: string;
}

// interface ElasticsearchConfig {
//     node: string;
// }

const mysqlConfig: MySQLConfig = {
    /* default port: 3306 */
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: MYSQL_PWD,
    DB: MYSQL_DB,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

const redisConfig: RedisConfig = {
    /* default port: 6379 */
    url: 'redis://localhost',
};

const elasticsearchConfig: ESConfigOptions = {
    host: 'http://localhost:9200',
};

export { mysqlConfig, redisConfig, elasticsearchConfig };
