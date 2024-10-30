import 'reflect-metadata';

import { faker } from '@faker-js/faker/locale/id_ID';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { ArgonService } from '../common/argon.service';
import { Auth } from '../utils/validations/schema-auth';
import { AuthService } from './auth.service';

describe('Auth Service', () => {
	let auth: AuthService;

	beforeAll(() => {
		container.register('ArgonService', { useClass: ArgonService });
		auth = container.resolve(AuthService);
	});

	afterAll(() => {
		vi.resetAllMocks();
	});

	it('Should be defined', () => {
		expect(auth).toBeDefined();
	});

	describe('Sign In', () => {
		it('Should sign in', async () => {
			const signInData: Auth.SignInType = { emailAddress: 'admin@mail.com', password: 'Admin123.' };
			const mockData = {
				id: '6720db551f3502e77f8c11d4',
				emailAddress: 'admin@mail.com',
				password: '$argon2id$v=19$m=65536,t=3,p=4$iOP5OJrrKkDfLHFz5CZhaw$WdZGUdggQzTuR4YBd5HKBdmcw5uljIFcijYrw0c1rpo',
				createdAt: new Date('2024-10-29T12:55:49.519Z'),
				updatedAt: new Date('2024-10-29T12:55:49.519Z'),
			};
			vi.spyOn(auth, 'signIn').mockResolvedValue(mockData);
			const result = await auth.signIn(signInData);
			expect(result).toStrictEqual(mockData);
		});
		it("Shouldn't sign in with invalid email address/password", async () => {
			const signInData: Auth.SignInType = {
				emailAddress: 'admin123@mail.com',
				password: faker.internet.password({ length: 8 }),
			};
			vi.spyOn(auth, 'signIn').mockResolvedValue(null);
			const result = await auth.signIn(signInData);
			expect(result).toBeNull();
		});
	});
});
