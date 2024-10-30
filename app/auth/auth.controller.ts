import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { JwtService } from '../common/jwt.service';
import { AuthService } from './auth.service';

@injectable()
export class AuthController {
	constructor(
		@inject(AuthService) private readonly auth: AuthService,
		@inject(JwtService) private readonly jwt: JwtService
	) {}

	async signIn(req: Request, res: Response, next: NextFunction) {
		try {
			const user = await this.auth.signIn(req.body);
			if (!user) {
				const errorCause = {
					statusCode: StatusCodes.UNAUTHORIZED,
					results: 'Invalid email or password',
				};
				throw new Error('Unauthorized', { cause: errorCause });
			}
			const token = this.jwt.generate({ emailAddress: user.emailAddress });
			res.status(StatusCodes.OK).json({
				statusCode: StatusCodes.OK,
				message: 'Sign in successful',
				results: { token },
			});
		} catch (error) {
			next(error);
		}
	}
}
