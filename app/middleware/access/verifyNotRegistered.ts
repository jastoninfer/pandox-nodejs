// const { sequelize } = require('../../models');
import { sequelize } from "../../models";
import type { M_User } from "../../models/types";
import type { Md_Func } from "../types";

const DB_User = sequelize.models.user;


const isUsernameUnused:Md_Func = (req, res, next) => {
    DB_User
        .findOne<M_User>({
            where: {
                username: req.body.newUsername || req.body.username,
            },
        })
        .then((user: M_User|null) => {
            if (user) {
                res.status(400).send({
                    message: 'Failed! Username is already in use!',
                });
                return;
            }
            next();
            return;
        });
};

export {
    isUsernameUnused,
};
