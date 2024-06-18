const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const mime = require('mime');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const http = require('http');
const {WebSocketServer} = require('ws');

const app = express();

var corsOptions = {
    // 允许前端服务器访问的域名
    origin: 'http://localhost:3000'
};

// middleware: 跨域检查
app.use(cors(corsOptions));

// 使用中间件处理JSON和x-www-urlencoded编码的request content
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// 导入本地定义的数据库(表的集合)
const { mysqlDb, redisDb, esDb } = require('./app/models');
const { Charsets } = require('mysql2');


// 配置路由到控制器的信息
require('./app/routes')(app);

// 服务端在8080端口监听
const PORT = process.env.PORT || 8080;

// 初始化WebSocket
const server = http.createServer(app);
// console.log('server', server);
const wsServer = new WebSocketServer({server});

// 生成随机字符串, 长度16
const generateRandomString = (length=16) => {
    const characterSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_';
    let randomStr = '';
    for (let i = 0; i < length; i++) {
        const randomIdx = crypto.randomInt(0, characterSet.length);
        randomStr += characterSet.charAt(randomIdx);
    }
    return randomStr;
}

// 清理img_data目录
const clearImages = async (directory) => {
    // const directory = 'img_data';
    // 递归删除当前路径下的子文件夹及文件
    try {
        const files = await fs.readdir(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {
                await fs.unlink(filePath);
                console.log(`deleted file: ${filePath}`);
            }else if (stats.isDirectory()) {
                await clearImages(filePath);
            }
        }
    } catch(err) {
        console.log('err during clearing images.');
    }
};


const checkAndCreateDir = async (dirPath) => {
    try {
        await fs.access(dirPath);
        // console.log(`Directory exists: ${dirPath}`);
    } catch(err) {
        if (err.code === 'ENOENT') {
            await fs.mkdir(dirPath, {recursive: true});
            console.log(`Directory created: ${dirPath}`);
        } else {
            throw err;
        }
    }
};

// 初始化图片函数
const initImages = async (imgName, author='pandoxone') => {
    // console.log('--------------------------\n');
    const filePath = `static/resource/${imgName}`;
    // console.log('***********************\n');
    const fileContent = await fs.readFile(filePath);
    // console.log('+++++++++++++++++++++++\n');
    // mime.getType('');
    const mimeType = mime.lookup(filePath);
    // console.log('mime type is ...-> ', mimeType);
    const originName = path.basename(filePath);
    const extension = mime.extension(mimeType);
    const fileId = generateRandomString();
    const fileName = fileId + '.' + extension;
    // random fileName generated but not used
    // console.log(__dirname);
    await fs.writeFile(
        `${__dirname}/img_data/${author}/${originName}`,
        fileContent
    );
    // await mysqlDb.images.create({
    //     type: mimeType,
    //     name: originName,
    //     author,
    // });
    return originName;
};

// 启动时同步数据库, 强制清除数据库已有表并重新创建(force为true)
(async () => {
    try {
        await mysqlDb.sequelize.sync({force: true});
        await redisDb.connect();
        await redisDb.flushDb();
        // return;

        await mysqlDb.users.create({
            username: 'pandoxone',
            email: 'astoninfer@gmail.com',
            selfIntro: 'I am pandoxone.',
            // avatar: avatar_data,
            // password: '1234',
            password: bcrypt.hashSync('1234', 8),
        });

        await clearImages('img_data');
        // const _img_name = await initImages('osaka.png');
        // 如果没有pandoxone文件夹, 则创建
        await checkAndCreateDir(path.join(__dirname, 'img_data', 'pandoxone'));
        await initImages('osaka.png');
        await initImages('sample1.png');
        await initImages('o_Many_Points_Example.jpg');
        await initImages('o_Untitled Diagram (1).png');
        await initImages('o_Untitled Diagram (2).png');
        await initImages('o_Untitled Diagram (3).png');
        await initImages('o_Untitled Diagram (4).png');
        await initImages('o_Untitled Diagram (5).png');
        await initImages('o_Untitled Diagram (6).png');
        await initImages('o_Untitled Diagram (7).png');
        await initImages('o_Untitled Diagram (2) (1).png');
        await initImages('o_Untitled Diagram (2) (2).png');
        const avatar_data = await initImages('WechatIMG21.jpeg');
        await mysqlDb.users.update({
            avatar: avatar_data,
        }, {
            where: {
                username: 'pandoxone',
            }
        });

        // const thread = await db.threads.create({author: 'pandoxone', text: 'Great post! very informative', pageId: 1});
        // 增加子评论
        // await db.comments.create({author: 'pandoxone', text: 'Thank you for liking it:)', threadId: thread.id});

        for(let i = 1; i <= 21; i++){
            const _jsonData = await fs.readFile(`jsonFiles/page${i}.json`, 'utf-8');
            const _parsedData = JSON.parse(_jsonData);
            await mysqlDb.pages.create({..._parsedData, status: 'published'}).then((data)=>{
                console.log('page entry inserted.================>');
            });
        }

        const threadsData = JSON.parse(await fs.readFile('jsonFiles/comment.json', 'utf-8'));
        // 增加评论/子评论
        for (let thread of threadsData){
            const threadData = await mysqlDb.threads.create({author: 'pandoxone', text: thread.body, pageId: 1});
            for (let comment of thread.comments){
                await mysqlDb.comments.create({from: 'pandoxone', to: 'pandoxone', text: comment, threadId: threadData.id});
            }
        }

        // 写pagekeyword表
        // keyword只写入pageId=1的文章中
        await mysqlDb.pagekeywords.create({pageId: 1, keyword: 'Graph Theory'});
        await mysqlDb.pagekeywords.create({pageId: 1, keyword: 'ACM/ICPC'});
        
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
        // server.listen(8000, () => {
        //     console.log(`WebSocket server is running on port 8000`);
        // });

        // wsServer.on('connection', (ws) => {
        //     console.log('WSS Client connected');
        //     ws.on('message', (message) => {
        //         // console.log('received message: ', message);
        //     });
        // });
        
    } catch (error) {
        console.log(error);
        console.log('failed to sync db or failed to init database');
    }
})();