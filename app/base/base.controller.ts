import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

@injectable()
export class BaseController {
	constructor() {}

	root(_req: Request, res: Response): void {
		res.json({
			statusCode: StatusCodes.OK,
			message: 'Welcome to the API!',
			results: {
				desc: 'A Technical Test for Backend Developer',
				createdBy: 'irfnd - irfandiabimanyu@gmail.com',
			},
		});
	}

	notFound(_req: Request, res: Response): void {
		const statusCode = StatusCodes.NOT_FOUND;
		res.status(statusCode).json({
			statusCode,
			message: 'Not Found',
			results: 'The page you are looking for does not exist.',
		});
	}
}
