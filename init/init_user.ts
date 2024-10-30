// const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
import { sequelize } from '../app/models';

import type { UserAttributes } from '../app/models/types';

import type { UserDict, UserImageRename } from './types';

import type { M_User } from '../app/models/types';

const DB_User = sequelize.models.user;

const USER_PANDOXONE:UserAttributes = {
    username: 'pandoxone',
    email: 'astoninfer@gmail.com',
    selfIntro: 'Hello! I\'m Jie Zhang, currently pursuing a Master of IT with a focus on Software Engineering at Charles Darwin University (CDU). I am deeply interested in the world of front-end development, specifically working with the React and Node.js technology stack. Alongside web development, I am also passionate about machine learning and its applications. I enjoy creating engaging, user-friendly interfaces and exploring how intelligent algorithms can bring data-driven insights to enhance software. This blog is a space to share my journey, projects, and the knowledge I gain along the way. Thank you for visiting!',
    password: '1234',
    avatar: 'WechatIMG21.jpeg',
};

const USER_JZHANG:UserAttributes = {
    username: 'jzhang',
    email: 's362996@students.cdu.edu.au',
    selfIntro: 'Hi! I\'m Jie Zhang, a Master of IT student at Charles Darwin University, specializing in front-end development with a focus on the React and Node.js stack. I\'m passionate about building intuitive, responsive user interfaces and continuously learning about new trends in web technology.',
    password: '1234',
    avatar: 'IMG20240225163605.jpg',
};

const USER_MSHAO:UserAttributes = {
    username: 'mshao',
    email: 'raeshao19960913@gmail.com',
    selfIntro: 'Hello! I\'m Meng Shao, a Master of IT student at Charles Darwin University, with a focus on Business Analysis. I\'m passionate about bridging technology and strategy to create data-driven solutions that help businesses thrive. Thanks for visiting my blog, where I share insights and experiences from my journey in tech and analysis!',
    password: '1234',
    avatar: 'WechatIMG47.jpg',
};

const users:UserDict = ((...args: UserAttributes[]) => {
    const _users: UserDict = {};
    args.forEach((arg) => {
        _users[arg.username] = arg;
    });
    return _users;
})(USER_PANDOXONE, USER_JZHANG, USER_MSHAO);

const initUsers = async (): Promise<UserDict> => {
    for (const [username, user] of Object.entries(users)) {
        await sequelize.models.user.create({
            ...user,
            password: bcrypt.hashSync(user.password, 8),
        });
    }
    return users;
};

const updateUsers = async (userImageRename: UserImageRename): Promise<void> => {
    for (const [username, user] of Object.entries(users)) {
        if(user.avatar) {
            await DB_User.update<M_User>(
                {
                    avatar: userImageRename[username][user.avatar],
                },
                {
                    where: {
                        username,
                    },
                }
            );
        }
    }
};

export { initUsers, updateUsers };
