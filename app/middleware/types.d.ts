import { Request, Response, NextFunction } from 'express';

declare type Md_Func = (req: Request, res: Response, next: NextFunction) => void|Promise<void>;