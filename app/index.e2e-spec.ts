import { faker } from '@faker-js/faker/locale/id_ID';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from './index';
import { Auth } from './utils/validations/schema-auth';
import { User } from './utils/validations/schema-user';

describe('App Integration', () => {
	let app: App;

	let emailTest: string;
	let userNameTest: string;
	let tokenTest: string;
	let userList: Omit<User.BaseType, 'status'>[] = [];

	beforeAll(() => {
		app = new App();
		app.start();

		emailTest = faker.internet.email();
		userNameTest = faker.internet.username().toLowerCase();
	});

	afterAll(() => {
		if (app.server && app.server.listening) {
			app.stop();
		}
	});

	it('Should be defined', () => {
		expect(app).toBeDefined();
	});

	describe('Base Route', () => {
		it('Should return 200 OK on path /', async () => {
			const response = await request(app.app).get('/');
			const statusCode = StatusCodes.OK;
			expect(response.status).toStrictEqual(statusCode);
			expect(response.body).toStrictEqual({
				statusCode,
				message: 'Welcome to the API!',
				results: {
					desc: 'A Technical Test for Backend Developer',
					createdBy: 'irfnd - irfandiabimanyu@gmail.com',
				},
			});
		});
		it('Should return 404 Not Found on path /(.*)/', async () => {
			const response = await request(app.app).get('/random-path');
			const statusCode = StatusCodes.NOT_FOUND;
			expect(response.status).toStrictEqual(statusCode);
			expect(response.body).toStrictEqual({
				statusCode,
				message: 'Not Found',
				results: 'The page you are looking for does not exist.',
			});
		});
	});

	describe('Auth Route', () => {
		describe('Sign in on POST /auth/sign-in', () => {
			it('Should return 200 OK', async () => {
				const signInData: Auth.SignInType = { emailAddress: 'admin@mail.com', password: 'Admin123.' };
				const response = await request(app.app).post('/auth/sign-in').send(signInData);
				const statusCode = StatusCodes.OK;
				tokenTest = response.body.results.token;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Sign in successful',
					results: { token: expect.any(String) },
				});
			});
			it('Should return 400 Bad Request', async () => {
				const signInData: Auth.SignInType = { emailAddress: 'email', password: 'password' };
				const response = await request(app.app).post('/auth/sign-in').send(signInData);
				const statusCode = StatusCodes.BAD_REQUEST;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Validation failed',
					results: expect.arrayContaining([
						expect.objectContaining({ message: expect.any(String), path: expect.any(String) }),
					]),
				});
			});
			it('Should return 401 Unauthorized', async () => {
				const signInData: Auth.SignInType = { emailAddress: 'admin1@mail.com', password: 'Admin123.' };
				const response = await request(app.app).post('/auth/sign-in').send(signInData);
				const statusCode = StatusCodes.UNAUTHORIZED;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Unauthorized',
					results: 'Invalid email or password',
				});
			});
		});
	});

	describe('User Route', () => {
		describe('Create user on POST /users', () => {
			it('Should return 200 OK', async () => {
				const newUser: User.CreateType = {
					emailAddress: emailTest,
					userName: userNameTest,
					accountNumber: '000000001',
					identityNumber: '000000001',
				};
				const response = await request(app.app).post('/users').send(newUser).set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.OK;
				userList.push(response.body.results);
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'User created',
					results: {
						id: expect.any(String),
						...newUser,
						createdAt: expect.any(String),
						updatedAt: expect.any(String),
					},
				});
			});
			it('Should return 400 Bad Request', async () => {
				const newUser: User.CreateType = {
					emailAddress: 'mail.com',
					userName: 'username!',
					accountNumber: '00000000a',
					identityNumber: '00000000a',
				};
				const response = await request(app.app).post('/users').send(newUser).set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.BAD_REQUEST;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Validation failed',
					results: expect.arrayContaining([
						expect.objectContaining({ message: expect.any(String), path: expect.any(String) }),
					]),
				});
			});
			it('Should return 401 Unauthorized', async () => {
				const newUser: User.CreateType = {
					emailAddress: emailTest,
					userName: userNameTest,
					accountNumber: '000000001',
					identityNumber: '000000001',
				};
				const response = await request(app.app).post('/users').send(newUser);
				const statusCode = StatusCodes.UNAUTHORIZED;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Unauthorized',
					results: 'Please log in to continue.',
				});
			});
			it('Should return 500 Internal Server Error', async () => {
				const newUser: User.CreateType = {
					emailAddress: emailTest,
					userName: userNameTest,
					accountNumber: '000000001',
					identityNumber: '000000001',
				};
				const response = await request(app.app).post('/users').send(newUser).set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Prisma validation error',
					results: expect.any(String),
				});
			});
		});

		describe('Find all users on GET /users', () => {
			it('Should return 200 OK', async () => {
				const response = await request(app.app).get('/users').set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.OK;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Users retrieved',
					results: userList,
				});
			});
			it('Should return 401 Unauthorized', async () => {
				const response = await request(app.app).get('/users');
				const statusCode = StatusCodes.UNAUTHORIZED;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Unauthorized',
					results: 'Please log in to continue.',
				});
			});
		});

		describe('Find user by unique number on GET /users/:number', () => {
			it('Should return 200 OK', async () => {
				const response = await request(app.app)
					.get(`/users/${userList[0].accountNumber}`)
					.set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.OK;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'User retrieved',
					results: userList[0],
				});
			});
			it('Should return 400 Bad Request', async () => {
				const response = await request(app.app).get(`/users/00000000a`).set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.BAD_REQUEST;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Validation failed',
					results: expect.arrayContaining([
						expect.objectContaining({ message: expect.any(String), path: expect.any(String) }),
					]),
				});
			});
			it('Should return 401 Unauthorized', async () => {
				const response = await request(app.app).get(`/users/${userList[0].accountNumber}`);
				const statusCode = StatusCodes.UNAUTHORIZED;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Unauthorized',
					results: 'Please log in to continue.',
				});
			});
			it('Should return 404 Not Found', async () => {
				const response = await request(app.app).get(`/users/000000000`).set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.NOT_FOUND;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'User not found',
					results: 'The user you are looking for does not exist',
				});
			});
		});

		describe('Update user by ID on PATCH /users/:id', () => {
			it('Should return 200 OK', async () => {
				const updateUser: User.UpdateType = {
					emailAddress: emailTest,
					userName: userNameTest,
					accountNumber: '000000002',
					identityNumber: '000000002',
				};
				const response = await request(app.app)
					.patch(`/users/${userList[0].id}`)
					.send(updateUser)
					.set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.OK;
				const { createdAt, updatedAt } = response.body.results;
				userList = userList.map((user) =>
					user.id === userList[0].id ? { ...user, ...updateUser, createdAt, updatedAt } : user
				);
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'User updated',
					results: {
						id: userList[0].id,
						...updateUser,
						createdAt: expect.any(String),
						updatedAt: expect.any(String),
					},
				});
			});
			it('Should return 400 Bad Request', async () => {
				const updateUser: User.UpdateType = {
					emailAddress: 'mail.com',
					userName: 'username!',
					accountNumber: '00000000a',
					identityNumber: '00000000a',
				};
				const response = await request(app.app)
					.patch(`/users/${userList[0].id}`)
					.send(updateUser)
					.set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.BAD_REQUEST;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Validation failed',
					results: expect.arrayContaining([
						expect.objectContaining({ message: expect.any(String), path: expect.any(String) }),
					]),
				});
			});
			it('Should return 401 Unauthorized', async () => {
				const updateUser: User.UpdateType = {
					accountNumber: '000000002',
					identityNumber: '000000002',
				};
				const response = await request(app.app).patch(`/users/${userList[0].id}`).send(updateUser);
				const statusCode = StatusCodes.UNAUTHORIZED;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Unauthorized',
					results: 'Please log in to continue.',
				});
			});
			it('Should return 404 Not Found', async () => {
				const updateUser: User.UpdateType = {
					accountNumber: '000000002',
					identityNumber: '000000002',
				};
				const response = await request(app.app)
					.patch(`/users/${faker.database.mongodbObjectId()}`)
					.send(updateUser)
					.set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.NOT_FOUND;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'User not found',
					results: 'The user you are looking for does not exist',
				});
			});
		});

		describe('Delete user by ID on DELETE /users/:id', () => {
			it('Should return 200 OK', async () => {
				const response = await request(app.app)
					.delete(`/users/${userList[0].id}`)
					.set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.OK;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'User deleted',
					results: userList[0],
				});
			});
			it('Should return 401 Unauthorized', async () => {
				const response = await request(app.app).delete(`/users/${userList[0].id}`);
				const statusCode = StatusCodes.UNAUTHORIZED;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'Unauthorized',
					results: 'Please log in to continue.',
				});
			});
			it('Should return 404 Not Found', async () => {
				const response = await request(app.app)
					.delete(`/users/${faker.database.mongodbObjectId()}`)
					.set('Authorization', `Bearer ${tokenTest}`);
				const statusCode = StatusCodes.NOT_FOUND;
				expect(response.status).toStrictEqual(statusCode);
				expect(response.body).toStrictEqual({
					statusCode,
					message: 'User not found',
					results: 'The user you are looking for does not exist',
				});
			});
		});
	});

	it('Should handle graceful shutdown signals', () => {
		const processOnSpy = vi.spyOn(process, 'on');
		app.start();
		expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
		expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
		processOnSpy.mockRestore();
	});
});
