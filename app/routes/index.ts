import type { Rt_Func } from "./types";
import authRoute from "./access/auth.routes";
import commentRoute from "./db/comment.routes";
import followRoute from "./db/follow.routes";
import imageRoute from "./db/image.routes";
import likeRoute from "./db/like.routes";
import pageRoute from "./db/page.routes";
import threadRoute from "./db/thread.routes";
import userRoute from "./db/user.routes";
import esearchRoute from "./db/search.es.routes";
import pagekeywordRoute from "./db/pagekeyword.routes";

const routes:Rt_Func =  (app) => {
    const routeModules: Rt_Func[] = [
        authRoute,
        commentRoute,
        followRoute,
        imageRoute,
        likeRoute,
        pageRoute,
        threadRoute,
        userRoute,
        esearchRoute,
        pagekeywordRoute,
    ];
    routeModules.forEach((route) => route(app));
};

export default routes;
