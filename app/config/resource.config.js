const path = require('path');

module.exports = {
    imagePrefix: (username) => (`https://www.pandox.xyz/api/db/images/${username}/`),
    rootPath: path.resolve(__dirname, '../../'),
};