import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import { Env } from '../utils/configs/env';

@injectable()
export class JwtService {
	constructor() {}

	generate(payload: any) {
		return jwt.sign(payload, Env.jwt.secret, { expiresIn: Env.jwt.expiresIn });
	}
}
