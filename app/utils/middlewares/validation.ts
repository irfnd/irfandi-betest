import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z, ZodError } from 'zod';
import { fromError } from 'zod-validation-error';

export function validate(schema: z.ZodObject<any, any>, toValidate: 'body' | 'query' | 'params' = 'body') {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req[toValidate]);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const validationError = fromError(error).details;
				const statusCode = StatusCodes.BAD_REQUEST;
				const results = validationError.map((error) => ({ message: error.message, path: error.path[0] }));
				res.status(statusCode).json({ statusCode, message: 'Validation failed', results });
			} else {
				const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
				res.status(statusCode).json({ statusCode, message: 'Internal server error', results: error });
			}
		}
	};
}
