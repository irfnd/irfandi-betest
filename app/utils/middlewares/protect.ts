import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { passport } from '../others/passport';

export function protect(req: Request, res: Response, next: NextFunction) {
	passport.authenticate('jwt', (err: any, user: any, _info: any) => {
		if (!user) {
			const errorCause = { statusCode: StatusCodes.UNAUTHORIZED, results: 'Please log in to continue.' };
			throw new Error('Unauthorized', { cause: errorCause });
		} else {
			req.user = user;
			next();
		}
	})(req, res, next);
}
