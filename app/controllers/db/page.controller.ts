// const { Marked, marked } = require('marked');
import { Marked, TokensList, marked, Token } from "marked";
// const markedPlaintify = require('marked-plaintify');
import markedPlaintify from "marked-plaintify";
import { sequelize } from "../../models";

// const { sequelize } = require('../../models');
// const { IMAGE_PRFIX } = require('../../config/resource.config');
import { IMAGE_PREFIX } from "../../config/resource.config";

import type { M_Page, M_User, UserAttributes, PageAttribtues } from "../../models/types";
import type { C_Func } from '../types';
import { WhereOptions } from "sequelize";
import { PageStatus } from "../../enums/page.enum";

import { NUM_RECOMMENDED_PAGES } from "../../config/constants.config";

const DB_Page = sequelize.models.page;
const DB_User = sequelize.models.user;

/**
 * Use marked.lexer to find URLs/hrefs of all images (up to a maximum limit)
 * for the getRecommendPages method to attach and return to the frontend.
 * @param {*} pageContent
 * @param {*} maxNum max size of the image list returned
 * @returns
 */

const filterImagesFromPage = async (pageContent: string, maxNum: number = 3): Promise<string[]> => {
    const _tokens: TokensList = marked.lexer(pageContent);
    const _images: string[] = [];
    const _walkImageTokens = async (_token_list: TokensList|Token[]): Promise<void> => {
        if (_images.length >= maxNum) {
            return;
        }
        for (const _token of _token_list) {
            if (_token['type'] === 'image' && _images.length < maxNum) {
                _images.push(_token['href']);
            } else if ('tokens' in _token) {
                await _walkImageTokens(_token.tokens||[]);
            }
        }
    };
    await _walkImageTokens(_tokens);
    return _images;
};

const getPageImagesById: C_Func = async (req, res) => {
    const username: string|undefined = req.body.username; // can be undefined
    const pageId: string = req.params.pageId;

    try {
        const page: M_Page|null = await DB_Page.findByPk<M_Page>(pageId);
        if (
            !page ||
            (page.dataValues.author !== username && page.dataValues.status !== PageStatus.PUBLISHED)
        ) {
            res.status(404).send({
                message: "Page doesn't exist or protected.",
            });
            return;
        }
        const ret_PageData = {...page.dataValues, imageUrls: await filterImagesFromPage(page.dataValues.content)};
        res.send(ret_PageData);
        return;
    } catch (err: any) {
        res.status(500).send({
            message:
                err.message || 'Error while retrieving images of the page.',
        });
        return;
    }
};

/**
 * Attempt to create a new page, write a new entry to the Page table
 * @param {*} req
 * @param {*} res
 * @returns
 */

const createPage:C_Func = (req, res) => {
    /*
       It is important to note that
       req.body should include title, desc, content, status
       author information should not be included on req.body
     */

    if (!req.body.title) {
        res.status(400).send({
            message: 'Title can not be empty!',
        });
        return;
    }
    // create a new page
    const { username, newUsername, ...page } = req.body;
    DB_Page.create<M_Page>({
        ...page,
        author: req.body.username,
    })
        .then((data: M_Page) => {
            res.send(data.dataValues);
            return;
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while creating the page.',
            });
            return;
        });
};

const getRecommendPages:C_Func = async (req, res) => {
    const username: string|undefined = req.body.username; // can be NULL
    // console.log('+++++++++++++');

    // return 10 recommended pages
    try {
        const pages: M_Page[] = await DB_Page.findAll<M_Page>({
            where: {
                status: PageStatus.PUBLISHED,
            },
            order: sequelize.literal('RAND()'),
            limit: NUM_RECOMMENDED_PAGES,
        });

        // console.log('+++++++++++++');
        const parser: Marked = new Marked({ gfm: true }).use(markedPlaintify());
        // console.log('--------------');
        const ret_pages: any[] = [];

        for (const {dataValues: pageData} of pages) {
            // console.log('##############');
            // console.log(page);
            const user: M_User|null = await DB_User.findByPk<M_User>(pageData.author);
            const userData: UserAttributes|undefined = user?.dataValues;
            // console.log(page.author);
            // console.log('******************');
            // console.log(sequelize.models);
            // console.log(sequelize.models.user);
            // console.log(user);
            // console.log(await User.findByPk('pandoxone'));
            const ret_page = {...pageData, avatar: IMAGE_PREFIX(pageData.author||'') + (userData?.avatar||''),
                imageUrls: await filterImagesFromPage(
                    pageData.content
                ), content: parser.parse(pageData.content)};
            // console.log('<<<<<<<<<<<<<<<');
            // const ret_page = {...page, dataValues: {...page.dataValues, avatar: 
            //     IMAGE_PRFIX(page.author) + user.avatar,
            // imageUrls: await filterImagesFromPage(
            //     page.content
            // ),
            // content: parser.parse(page.content)}};
            // page.avatar = IMAGE_PRFIX(page.author) + user.avatar;

            // page.imageUrls = await filterImagesFromPage(
            //     page.content
            // );
            // page.dataValues.content = parser.parse(page.content);
            ret_pages.push(ret_page);
        }
        res.send(ret_pages);
        return;
    } catch (err: any) {
        console.log('ERROR OCCURRED');
        res.status(500).send({
            message:
                err.message ||
                'Some error occurred while retrieving recommended pages.',
        });
        return;
    }
};

/**
 * Attempt to retrieve specific pages based on pageOwner, with
 * support for pagination (offset)
 * @param {*} req
 * @param {*} res
 */

const getPagesByOwner:C_Func = async (req, res) => {
    const username:string|undefined = req.body.username; // can be undefined
    const pageOwner = req.query.pageOwner as string|undefined;
    let blogIdx:number = parseInt(req.query.pageIdx as string|undefined || '1');

    const blogPageSize:number = 5;

    try {
        const cntBlogs:number = await DB_Page.count<M_Page>({
            where: {
                author: pageOwner,
                ...(username && username === pageOwner ? {} : { status: PageStatus.PUBLISHED }),
            },
        });
        const cntBlogPages:number = Math.ceil(cntBlogs / blogPageSize);

        if (blogIdx === -1) {
            blogIdx = Math.max(1, cntBlogPages);
        } else {
            blogIdx = Math.max(1, Math.min(cntBlogPages, blogIdx));
        }

        const offset:number = (blogIdx - 1) * blogPageSize;

        const pages: M_Page[] = await DB_Page.findAll<M_Page>({
            where: {
                author: pageOwner,
                ...(username && username === pageOwner ? {} : { status: PageStatus.PUBLISHED }),
            },
            order: [['createdAt', 'DESC'], ['id', 'ASC']],
            offset: offset,
            limit: blogPageSize,
        });
        
        res.json({
            pages: pages.map((key)=>(key.dataValues)),
            total: cntBlogPages,
            current: blogIdx,
        });
        return;
    } catch (err: any) {
        res.status(500).send({
            message: err.message || 'Error while retrieving the pages.',
        });
        return;
    }
};

/**
 * retrieve a page by ID
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getPageById:C_Func = async (req, res) => {
    const username: string|undefined = req.body.username; // can be undefined
    const pageId:string = req.params.pageId;

    try {
        const page:M_Page|null = await DB_Page.findByPk<M_Page>(pageId);
        const pageData: PageAttribtues|undefined = page?.dataValues;
        if (
            !pageData ||
            (pageData.author !== username && pageData.status !== PageStatus.PUBLISHED)
        ) {
            res.status(404).send({
                message: "Page doesn't exist or protected.",
            });
            return;
        }
        const user:M_User|null = await DB_User.findByPk<M_User>(pageData.author);
        const userData: UserAttributes|undefined = user?.dataValues;
        const ret_page = {...pageData, avatar: IMAGE_PREFIX(userData?.username||'') + (userData?.avatar||'')};
        // const ret_page = {...data, dataValues: {...data.dataValues, avatar: IMAGE_PRFIX(user.dataValues.username) + user.dataValues.avatar}};
        // data.dataValues.avatar = IMAGE_PRFIX(user?.username) + user?.avatar;
        res.send(ret_page);
        return;
    } catch (err:any) {
        res.status(500).send({
            message: err.message || 'Error while retrieving the page.',
        });
        return;
    }
};

/**
 * update a page by ID
 * @param {*} req
 * @param {*} res
 */

const updatePageById:C_Func = (req, res) => {
    const pageId:string = req.params.pageId;
    const { username, newUsername, ...page } = req.body;

    DB_Page.update<M_Page>(page, {
        where: { id: pageId } as WhereOptions<M_Page>,
    })
        .then(([num]: [number]) => {
            if (num == 1) {
                res.send({
                    message: 'Page successfully updated.',
                });
            } else {
                res.send({
                    message: 'Page failed to update.',
                });
            }
            return;
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || 'Error occurred while updating the page.',
            });
            return;
        });
};

/**
 * delete a page by ID
 * @param {*} req
 * @param {*} res
 */

const deletePageById:C_Func = (req, res) => {
    const pageId:string = req.params.pageId;
    DB_Page.destroy<M_Page>({
        where: { id: pageId } as WhereOptions<M_Page>,
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: 'Page deleted successfully',
                });
            } else {
                res.send({
                    message: 'Cannot delete page. Maybe not found.',
                });
            }
            return;
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || 'Internal error when trying to delete page.',
            });
            return;
        });
};

export {
    getPageImagesById,
    createPage,
    getRecommendPages,
    getPagesByOwner,
    getPageById,
    updatePageById,
    deletePageById,
}
