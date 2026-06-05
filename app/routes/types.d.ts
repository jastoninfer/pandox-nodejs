import { Application } from 'express';

declare type Rt_Func = (app: Application) => void|Promise<void>;