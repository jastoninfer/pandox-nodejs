import { Model } from "sequelize";

declare interface CommentAttributes {
    threadId?: number;
    from?: string;
    to?: string;
    text: string;
}

declare type M_Comment = Model<CommentAttributes>;

declare interface FollowAttributes {
    followed: string;
    follower: string;
}

declare type M_Follow = Model<FollowAttributes>;

declare interface ImageAttribtues {
    name: string;
    type: string;
    author?: string;
}

declare type M_Image = Model<ImageAttribtues>;

declare interface LikeAttributes {
    username: string;
    pageId: number;
}

declare type M_Like = Model<LikeAttributes>;

declare interface PageAttribtues {
    id?: number;
    title: string;
    description?: string;
    content: string;
    author?: string;
    status?: string;
}

declare type M_Page = Model<PageAttribtues>;

declare interface PageKeywordAttributes {
    pageId: number;
    keyword: string;
}

declare type M_PageKeyword = Model<PageKeywordAttributes>;

declare interface ThreadAttributes {
    id?: number;
    text: string;
    pageId?: number;
    author?: string;
}

declare type M_Thread = Model<ThreadAttributes>;

declare interface UserAttributes {
    username: string;
    email: string;
    avatar: string|undefined;
    selfIntro: string|undefined;
    password: string;
}

declare type M_User = Model<UserAttributes>;