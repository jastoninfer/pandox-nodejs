const mysqlConfig = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '12345678',
    DB: 'testdb',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    // 默认端口3306
};
// 命令行打开mysql命令: mysql -u root -p
// 然后输入密码: 12345678

const redisConfig = {
    url: 'redis://localhost',
    // 默认端口6379
};

const elasticsearchConfig = {
    node: 'http://localhost:9200',
};

module.exports = {
    mysqlConfig,
    redisConfig,
    elasticsearchConfig,
};