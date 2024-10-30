import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { User } from '../utils/validations/schema-user';
import { UserService } from './user.service';

@injectable()
export class UserController {
	constructor(@inject(UserService) private readonly user: UserService) {}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const results = await this.user.create(req.body);
			res.json({ statusCode: 200, message: 'User created', results });
		} catch (error) {
			next(error);
		}
	}

	async findOne(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params as User.FindByNumberType;
			const results = await this.user.findOne(id);
			res.status(StatusCodes.OK).json({
				statusCode: StatusCodes.OK,
				message: 'User retrieved',
				results,
			});
		} catch (error) {
			next(error);
		}
	}

	async findAll(req: Request, res: Response, next: NextFunction) {
		try {
			const results = await this.user.findAll();
			res.status(StatusCodes.OK).json({
				statusCode: StatusCodes.OK,
				message: 'Users retrieved',
				results,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params as User.FindType;
			const results = await this.user.update(id, req.body);
			res.json({ statusCode: 200, message: 'User updated', results });
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params as User.FindType;
			const results = await this.user.delete(id);
			res.json({ statusCode: 200, message: 'User deleted', results });
		} catch (error) {
			next(error);
		}
	}
}
