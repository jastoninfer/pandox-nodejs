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
    selfIntro: 'Hi, I am pandoxone.',
    password: '1234',
    avatar: 'WechatIMG21.jpeg',
};

const users:UserDict = ((...args: UserAttributes[]) => {
    const _users: UserDict = {};
    args.forEach((arg) => {
        _users[arg.username] = arg;
    });
    return _users;
})(USER_PANDOXONE);

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
