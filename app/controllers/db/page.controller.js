const { mysqlDb } = require('../../models');
const Page = mysqlDb.pages;
const User = mysqlDb.users;
const sequelize = mysqlDb.sequelize;
const {Marked, marked} = require('marked');
const markedPlaintify = require('marked-plaintify');
const { imagePrefix } = require('../../config/resource.config');

// 使用makred.lexer找到所有(限制最大数目)的image的url/href
// 以供getRecommendPages方法挂载返回给前端

const filterImagesFromPage = async (pageContent, maxNum=3) => {
    const _tokens = marked.lexer(pageContent);
    const _images = [];
    const _walkImageTokens = async (_token_list) => {
        if (_images.length >= maxNum) {
            return;
        }
        for (const _token of _token_list) {
            if (_token['type'] === 'image' && _images.length < maxNum) {
                _images.push(_token['href']);
            } else if (_token.tokens) {
                await _walkImageTokens(_token.tokens);
            }
        }
    };
    await _walkImageTokens(_tokens);
    return _images;
};

const getPageImagesById = async (req, res) => {
    const username = req.body.username; // can be undefined
    const pageId = req.params.pageId;

    try {
        const data = await Page.findByPk(pageId);
        if(!data || (data.author !== username && data.status !== 'published')) {
            return res.status(404).send({
                message: 'Page doesn\'t exist or protected.'
            });
        }
        data.dataValues.imageUrls = await filterImagesFromPage(data.content);
        // const user = await User.findByPk(data.author);
        // data.dataValues.avatar = imagePrefix + user?.avatar;
        return res.send(data);
    } catch (err) {
        return res.status(500).send({
            message : err.message || 'Error while retrieving images of the page.'
        });
    }
};

// 尝试创建一个新的page, 向Page表写入一个新的表项
exports.createPage = (req, res) => {
    // 需要注意的是,
    // req.body上需要挂载, title, desc, content, status
    // req.body上不需要挂载author信息
    // 验证title是否为空
    console.log('here');
    if (!req.body.title){
        // 400 请求错误
        res.status(400).send({
            message: 'Title can not be empty!'
        });
        return;
    }
    // 创建新的page
    const {username, newUsername, ...page} = req.body;
    Page.create({
        ...page,
        author: req.body.username,
    }).then(data => {
        res.send(data);
    }).catch(err => {
        // 500 服务器内部错误
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the page.'
        });
    });
};

exports.getRecommendPages = async (req, res) => {
    const username = req.body.username; // can be NULL
    // return 10 recommended pages
    // console.log('-------------');
    try {
        const pages = await Page.findAll({
            where: {
                status: 'published',
            },
            order: sequelize.literal('RAND()'),
            limit: 10,
        });
        // const page3 = await Page.findByPk(3);
        // const page21 = await Page.findByPk(21);
        // const pages = [page3, page21, ...pages_temp];
        const parser = new Marked({ gfm: true }).use(markedPlaintify());
        for (const page of pages) {
            const user = await User.findByPk(page.author);
            page.dataValues.avatar = imagePrefix(page.author) + user.avatar;
            // console.log(page.content);
            // break;
            page.dataValues.imageUrls = await filterImagesFromPage(page.content);
            page.dataValues.content = parser.parse(page.content);
            // console.log(page.dataValues);
        }
        // console.log(pages);
        res.send(pages);
    }catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving recommended pages.'
        });
    }
};

// 尝试根据pageOwner检索特定的pages, 支持翻页(offset)
exports.getPagesByOwner = async (req, res) => {
    const username = req.body.username; // can be NULL
    // console.log('get page by id...');
    // console.log(req.params.id);
    // console.log('-----------');
    // const pageOwner = req.params.pageOwner;
    const pageOwner = req.query.pageOwner;
    let blogIdx = parseInt(req.query.pageIdx) || 1;
    // const userId = req.params.userId;
    // const pageId = req.query.blogPageId;
    const blogPageSize = 5;
    // const offset = 
    try {
        const cntBlogs = await Page.count({
            where: {
                author: pageOwner,
                ...(username === pageOwner ? {} : {status: 'published'})
            }
        });
        const cntBlogPages = Math.ceil(cntBlogs/blogPageSize);
        if (blogIdx === -1) {
            blogIdx = Math.max(1, cntBlogPages);
        }else {
            blogIdx = Math.max(1, Math.min(cntBlogPages, blogIdx));
        }
        const offset = (blogIdx - 1) * blogPageSize;
        const pages = await Page.findAll({
            where: {
                author: pageOwner,
                ...(username === pageOwner ? {} : {status: 'published'})
            },
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: blogPageSize,
        });
        // res.json({})
        // res.send(pages);
        res.json({
            pages,
            total: cntBlogPages,
            current: blogIdx,
        });
        // ??? 为什么和threads对应的实现不同
        // res.send({
        // });
        // res.status(500).send({
        //     message : err.message || 'Error while retrieving the pages.'
        // });
    } catch (err) {
        res.status(500).send({
            message : err.message || 'Error while retrieving the pages.'
        });
    }
};

// 尝试根据id检索特定的page
exports.getPageById = async (req, res) => {
    // console.log('get page by id...');
    // console.log(req.params.id);
    // console.log('req.params', req.params);
    const username = req.body.username; // can be undefined
    const pageId = req.params.pageId;

    try {
        const data = await Page.findByPk(pageId);
        if(!data || (data.author !== username && data.status !== 'published')) {
            return res.status(404).send({
                message: 'Page doesn\'t exist or protected.'
            });
        }
        const user = await User.findByPk(data.author);
        data.dataValues.avatar = imagePrefix(user?.username) + user?.avatar;
        return res.send(data);
    } catch (err) {
        return res.status(500).send({
            message : err.message || 'Error while retrieving the page.'
        });
    }
};

// 尝试根据id更新某个page
exports.updatePageById = (req, res) => {
    // console.log('---------->>>><<<<');
    // console.log(req.params);
    // console.log(req.body);
    const pageId = req.params.pageId;
    const {username, newUsername, ...page} = req.body;
    Page.update(page, {
        where: {id: pageId}
    }).then(num => {
        // res.status(500).send({
        //     message: err.message || 'Error occurred while updating the page.'
        // });
        if(num == 1){
            res.send({
                message: 'Page successfully updated.'
            });
        } else {
            res.send({
                message: 'Page failed to update.'
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error occurred while updating the page.'
        });
    });
};

// 尝试根据id删除某个page
exports.deletePageById = (req, res) => {
    const pageId = req.params.pageId;
    Page.destroy({
        where: {id: pageId}
    }).then(num => {
        if(num == 1){
            res.send({
                message: 'Page deleted successfully',
            })
        }else{
            res.send({
                message: 'Cannot delete page. Maybe not found.'
            })
        }
    }).catch(err => {
        res.status(500).send({
            message: 'Internal error when trying to delete page.'
        });
    });
};