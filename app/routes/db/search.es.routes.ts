// const { ESearch } = require('../../controllers/db');
import { Router } from "express";
import { ESearch } from "../../controllers/db";
import { Rt_Func } from "../types";

const esearchRoute:Rt_Func = (app) => {
    // var router = require('express').Router();
    const router: Router = Router();

    // Users search for pages containing specific keywords
    router.get('/pages/:keyword/:pageIdx', ESearch.searchPage);

    // Users search for users(usernames) containing specific keywords
    router.get('/users/:keyword/:userIdx', ESearch.searchUser);

    app.use('/api/db/es', router);
};

export default esearchRoute;
