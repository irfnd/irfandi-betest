import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaErrors } from '../others/prisma-error';

export function exception(err: any, req: Request, res: Response, next: NextFunction) {
	const response = {
		statusCode: err.cause?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		message: err.message || 'Internal server error',
		results: err.cause?.results || 'Something went wrong',
	};

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		const { BAD_REQUEST, CONFLICT, NOT_FOUND } = PrismaErrors;
		const code = err.code;
		response.message = 'Prisma validation error';
		if (Object.keys(BAD_REQUEST).includes(code)) {
			response.results = BAD_REQUEST[code as keyof typeof BAD_REQUEST];
		} else if (Object.keys(CONFLICT).includes(code)) {
			response.results = CONFLICT[code as keyof typeof CONFLICT];
		} else if (Object.keys(NOT_FOUND).includes(code)) {
			response.results = NOT_FOUND[code as keyof typeof NOT_FOUND];
		} else {
			response.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
			response.message = 'Internal server error';
			response.results = 'Something went wrong';
		}
	}

	res.status(err.cause?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(response);
}
