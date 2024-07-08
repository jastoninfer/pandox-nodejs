const fs = require('fs').promises;
const path = require('path');
const mime = require('mime');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const {URL_PREFIX} = require('./app/config/env.config');
const { IMG_ROOT_DIR, IMG_DIR, STATIC_IMG_DIR } = require('./app/config/resource.config');
const { mysqlDb, redisDb } = require('./app/models');

class Page {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
}

const pages = [
    new Page(1, 'Graph Theory - Strongly Connected Components'),
    new Page(2, '123-123'),
    new Page(3, 'Linear Regression Model'),
    new Page(4, 'Graph Theory: 2-SAT Problem'),
    new Page(5, 'Graph Theory: The Shortest Path Problem'),
    new Page(6, 'hdu 5779: Tower Defence'),
    new Page(7, 'hdu 5780: gcd'),
    new Page(8, 'hdu 5749: Colmerauer'),
    new Page(9, 'hdu 5751: Eades'),
    new Page(10, 'cf 712E: Memory and Casinos'),
    new Page(11, 'hdu 5901: Count primes'),
    new Page(12, 'cf 710E: Generate a String'),
    new Page(13, 'hdu 4401: Battery'),
    new Page(14, 'Problem Solving Strategy: Simplification of States'),
    new Page(15, 'The Calculus of Variations'),
    new Page(16, 'Lagrange Multiplier'),
    new Page(17, 'Partial Matrix Derivative Results and Proofs'),
    new Page(18, 'Kernel Methods'),
    new Page(19, 'Sampling Methods'),
    new Page(20, 'Linear Classification Model'),
    new Page(21, 'Graph Model'),
];

const USER_PANDOXONE = {
    username: 'pandoxone',
    email: 'astoninfer@gmail.com',
    selfIntro: 'Hi, I am pandoxone.',
    password: '1234',
    avatar: 'WechatIMG21.jpeg',
};

const users = ((...args) => {
    const _users = {};
    args.forEach((arg, index) => {
        _users[arg.username] = arg;
    });
    return _users;
})(USER_PANDOXONE);

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif',
 'image/bmp', 'image/tiff', 'image/webp'];

const initPages = async (username, imageRename) => {
    // console.log('image rename is ');
    // console.log(imageRename);
    const domainRenameRegex = /!\[(.*?)\]\((.*?)\s*(".*?")?\)/g;
    const imgRenameRegex = new RegExp(Object.keys(imageRename).map(key => `\\b${key.replace(/\s/g, '%20').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}\\b`).join('|'), 'g');
    console.log(imgRenameRegex);
    for (const page of pages) {
        const {id, title} = page;
        const readPath = path.join(__dirname, 'page_data', `page${id}.txt`);
        const writePath = path.join(__dirname, 'page_data', 'json', `page${id}.json`);
        // console.log('write to: ', writePath);
        try {
            const data = await fs.readFile(readPath, 'utf-8');
        /**
         * resolve image urls
         */
        const urlRenamedData = data.replace(domainRenameRegex, (match, p1, p2, p3) => {
            const new_p2 = p2.replace(/https:\/\/[^\/]+/g, URL_PREFIX);
            return `![${p1}](${new_p2}${p3&&` ${p3}`||''})`;
        });
        const imgRenamedData = urlRenamedData.replace(imgRenameRegex, match => {
            return imageRename[match.replace(/%20/g, ' ')];
        });
        const jsonData = {
            title,
            content: imgRenamedData,
            author: username,
        };
        await fs.writeFile(writePath, JSON.stringify(jsonData), 'utf-8');
        await mysqlDb.pages.create({ ...jsonData, status: 'published' });

        } catch (err) {
            console.log('Error init pages: ', err);
        }
        
    }
};

const initComments = async () => {
    const readPath = path.join(__dirname, 'comment_data', 'comments.txt');
    const writePath = path.join(__dirname, 'comment_data', 'json', 'comment.json');
    try {
        const data = await fs.readFile(readPath, 'utf-8');
        const threads = [];
            for (let thread of data.split('\n\n')){
                const threadBody_t1 = thread.match(/\$\$([\n\s\S]*?)>>/);
                const threadBody_t2 = thread.match(/\$\$(.*)/);
                const threadBodyText = (threadBody_t1 ? threadBody_t1[1] : threadBody_t2[1]).trim();
                const subItems = [];
                const threadComments = Array.from(thread.matchAll(/([\n\s\S]*?)>>/g));
                for (let threadComment of threadComments.slice(1)) {
                    subItems.push(threadComment[1].trim());
                }
                const threadData = {
                    'body': threadBodyText,
                    'comments': subItems
                };
                threads.push(threadData);
                const threadDbData = await mysqlDb.threads.create({
                    author: 'pandoxone',
                    text: threadData.body,
                    pageId: 1,
                });
                for (let comment of threadData.comments) {
                    await mysqlDb.comments.create({
                        from: 'pandoxone',
                        to: 'pandoxone',
                        text: comment,
                        threadId: threadDbData.id,
                    });
                }
            }
            await fs.writeFile(writePath, JSON.stringify(threads), 'utf-8');
    } catch(err) {
        console.log('Error init comments: ', err);
    }
};

const initUsers = async () => {
    for(const [username, user] of Object.entries(users)) {
        await mysqlDb.users.create({
            ...user,
            password: bcrypt.hashSync(user.password, 8),
        });
    }
};

const updateUsers = async (imageRename) => {
    for (const [username, user] of Object.entries(users)) {
        // const avatar_filename = user.avatar;
        await mysqlDb.users.update(
            {
                avatar: imageRename[username][user.avatar],
            },
            {
                where: {
                    username,
                },
            }
        );
    }
};

const initImages = async () => {
    const clear = async (dir) => {
        try {
            const files = await fs.readdir(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = await fs.stat(filePath);
                if (stats.isFile()) {
                    await fs.unlink(filePath);
                } else if (stats.isDirectory()) {
                    await clear(filePath);
                }
            }
        } catch (err) {
            console.log(err || `Error while clearing ${dir}`);
        }
    };

    const createDir = async (dir) => {
        try {
            await fs.access(dir);
        } catch (err) {
            if (err.code === 'ENOENT') {
                await fs.mkdir(dir, { recursive: true });
            } else {
                throw err;
            }
        }
    };

    const writeDir = async (srcDir, destDir, renameDict) => {
        try {
            const files = await fs.readdir(srcDir);
            for (const file of files) {
                const filePath = path.join(srcDir, file);
                const stats = await fs.stat(filePath);
                if (stats.isFile()) {
                    const mimeType = mime.lookup(filePath);
                    if(IMAGE_MIME_TYPES.includes(mimeType)) {
                        const content = await fs.readFile(filePath);
                        const extension = mime.extension(mimeType);
                        const newFilename = `${uuidv4()}.${extension}`;
                        // console.log(newFilename);
                        renameDict[file] = newFilename;
                        // console.log('reanmedict...');
                        // console.log(renameDict);
                        const writePath = path.join(destDir, newFilename);
                        await fs.writeFile(writePath, content);
                    }
                }
            }
        } catch (err) {
            console.log(err || `Error while reading ${dir}`);
        }
    };

    await clear(IMG_ROOT_DIR);

    const imageRenameDict = {};

    for(const [username, user] of Object.entries(users)) {
        createDir(IMG_DIR(username));
        const renameDict = {};
        // imageRenameDict[username] = {};
        await writeDir(STATIC_IMG_DIR(username), IMG_DIR(username), renameDict);
        // console.log(renameDict);
        // console.log('+++++++++');
        imageRenameDict[username] = renameDict;
    }

    return imageRenameDict;
};

const initKeywords = async () => {
    // Write to the pagekeyword table
        // Keywords are only written into articles with pageId=1
        await mysqlDb.pagekeywords.create({
            pageId: 1,
            keyword: 'Graph Theory',
        });
        await mysqlDb.pagekeywords.create({ pageId: 1, keyword: 'ACM/ICPC' });
}

/**
 * Synchronize the database on startup; forcefully clear existing tables 
 * and recreate them (force=true)
 */

const init = async (username) => {
    try {
        await mysqlDb.sequelize.sync({ force: true });
        await redisDb.connect();
        await redisDb.flushDb();
        // console.log('------------');

        await initUsers();
        // console.log('<<<');
        const imageRename = await initImages();
        await updateUsers(imageRename);
        // console.log(imageRename);

        // console.log(username);

        await initPages(username, imageRename[username]);
        await initComments();

        await initKeywords();


        // console.log('++++++++');

    } catch (err) {
        console.error(err || 'Error during init...');
    }
};

// init('pandoxone');

module.exports = init;