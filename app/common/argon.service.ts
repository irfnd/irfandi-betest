import * as argon from 'argon2';
import { injectable } from 'tsyringe';
import { Env } from '../utils/configs/env';

@injectable()
export class ArgonService {
	private salt: Buffer;

	constructor() {
		this.salt = Buffer.from(Env.hash.salt, 'base64');
	}

	async hash(password: string) {
		return await argon.hash(password, { secret: this.salt });
	}

	async verify(hash: string, password: string) {
		return await argon.verify(hash, password, { secret: this.salt });
	}
}
