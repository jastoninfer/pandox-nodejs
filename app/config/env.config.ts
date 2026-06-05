const MYSQL_PWD: string = process.env.MYSQL_PWD || '';
const MYSQL_DB: string = process.env.MYSQL_DB || '';
// console.log('env are...');
// console.log(process.env);

const PROD_MODE: boolean = process.env.RUN_MODE === 'PRODUCTION';

const PROD_URL_PREFIX: string = process.env.PROD_URL || '';
const DEV_URL_PREFIX: string = `http://localhost:${process.env.PORT || 8080}`;

const URL_PREFIX: string = (PROD_MODE && PROD_URL_PREFIX) || DEV_URL_PREFIX;

export { MYSQL_PWD, MYSQL_DB, URL_PREFIX };
