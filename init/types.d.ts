import type { UserAttributes } from '../app/models/types';

declare type UserDict = Record<string, UserAttributes>;

declare type ImageRename = Record<string, string>;

declare type UserImageRename = Record<string, ImageRename>;

declare interface ThreadData {
    body: string;
    comments: string[];
}