import { NextFunction, Request, Response } from 'express';

export interface RouteList {
	path: string | RegExp;
	method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'all';
	handler: Array<(req: Request, res: Response, next: NextFunction) => void>;
}
