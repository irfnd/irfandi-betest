import { inject, injectable } from 'tsyringe';
import { ArgonService } from '../common/argon.service';
import { prisma } from '../utils/others/prisma';
import { Auth } from '../utils/validations/schema-auth';

@injectable()
export class AuthService {
	constructor(@inject(ArgonService) private readonly hash: ArgonService) {}

	async signIn(data: Auth.SignInType) {
		const { emailAddress, password } = data;
		const admin = await prisma.admin.findFirst({ where: { emailAddress } });
		if (admin && (await this.hash.verify(admin.password, password))) return admin;
		return null;
	}
}
