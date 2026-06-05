import { Request, Response } from 'express';

declare type C_Func = (req: Request, res: Response) => void|Promise<void>;