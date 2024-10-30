import 'reflect-metadata';

import { faker } from '@faker-js/faker/locale/id_ID';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { User } from '../utils/validations/schema-user';
import { UserService } from './user.service';

describe('User Service', () => {
	let users: UserService;

	let emailTest: string;
	let userList: Omit<User.BaseType, 'status'>[] = [];

	beforeAll(() => {
		users = container.resolve(UserService);
		emailTest = faker.internet.email();
	});

	afterAll(() => {
		vi.resetAllMocks();
	});

	it('Should be defined', () => {
		expect(users).toBeDefined();
	});

	describe('Create user', () => {
		it('Should create new user', async () => {
			const newUser: User.CreateType = {
				emailAddress: emailTest,
				userName: faker.internet.username(),
				accountNumber: '000000001',
				identityNumber: '000000001',
			};
			const mockData = {
				id: faker.database.mongodbObjectId(),
				...newUser,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			vi.spyOn(users, 'create').mockResolvedValue(mockData);
			const result = await users.create(newUser);
			userList.push(result);
			expect(result).toStrictEqual({
				id: expect.any(String),
				...newUser,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			});
		});
		it("Shouldn't create new user with duplicate unique field", async () => {
			const newUser: User.CreateType = {
				emailAddress: emailTest,
				userName: faker.internet.username(),
				accountNumber: '000000001',
				identityNumber: '000000001',
			};
			const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
				code: 'P2002',
				clientVersion: '5.21.1',
			});
			vi.spyOn(users, 'create').mockRejectedValue(prismaError);
			try {
				await users.create(newUser);
			} catch (error: any) {
				expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
				expect(error.code).toBe('P2002');
			}
		});
	});

	describe('Find user by unique number', () => {
		it('Should find user by account number', async () => {
			const user = userList[0];
			vi.spyOn(users, 'findOne').mockResolvedValue(user);
			const result = await users.findOne(user.accountNumber);
			expect(result).toStrictEqual(user);
		});
		it('Should find user by identity number', async () => {
			const user = userList[0];
			vi.spyOn(users, 'findOne').mockResolvedValue(user);
			const result = await users.findOne(user.identityNumber);
			expect(result).toStrictEqual(user);
		});
		it("Shouldn't find user by random character", async () => {
			const randomChar = faker.helpers.fromRegExp('[a-z0-9]{9}');
			const notFoundError = new Error('User not found', {
				cause: {
					statusCode: StatusCodes.NOT_FOUND,
					results: 'The user you are looking for does not exist',
				},
			});
			vi.spyOn(users, 'findOne').mockRejectedValue(notFoundError);
			try {
				await users.findOne(randomChar);
			} catch (error: any) {
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toStrictEqual('User not found');
				expect(error.cause).toStrictEqual({
					statusCode: StatusCodes.NOT_FOUND,
					results: 'The user you are looking for does not exist',
				});
			}
		});
	});

	describe('Find all users', () => {
		it('Should find all users', async () => {
			vi.spyOn(users, 'findAll').mockResolvedValue(userList);
			const result = await users.findAll();
			expect(result).toStrictEqual(userList);
		});
	});

	describe('Update user', () => {
		it('Should update user by ID', async () => {
			const getUser = userList[0];
			const updateData: User.UpdateType = {
				userName: faker.internet.username(),
				emailAddress: faker.internet.email(),
				accountNumber: '000000002',
				identityNumber: '000000002',
			};
			const mockData = { ...getUser, ...updateData, updatedAt: new Date() };
			vi.spyOn(users, 'update').mockResolvedValue(mockData);
			const result = await users.update(getUser.id, updateData);
			userList = userList.map((user) => (user.id === getUser.id ? result : user));
			expect(result).toStrictEqual(mockData);
		});
		it("Shouldn't update user by random character", async () => {
			const randomChar = faker.helpers.fromRegExp('[a-z0-9]{9}');
			const notFoundError = new Error('User not found', {
				cause: {
					statusCode: StatusCodes.NOT_FOUND,
					results: 'The user you are looking for does not exist',
				},
			});
			vi.spyOn(users, 'update').mockRejectedValue(notFoundError);
			try {
				await users.update(randomChar, {});
			} catch (error: any) {
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toStrictEqual('User not found');
				expect(error.cause).toStrictEqual({
					statusCode: StatusCodes.NOT_FOUND,
					results: 'The user you are looking for does not exist',
				});
			}
		});
		it("Shouldn't update user with duplicate unique field", async () => {
			const getUser = userList[0];
			const updateData: User.UpdateType = {
				userName: faker.internet.username(),
				emailAddress: emailTest,
				accountNumber: '000000002',
				identityNumber: '000000002',
			};
			const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
				code: 'P2002',
				clientVersion: '5.21.1',
			});
			vi.spyOn(users, 'update').mockRejectedValue(prismaError);
			try {
				await users.update(getUser.id, updateData);
			} catch (error: any) {
				expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
				expect(error.code).toBe('P2002');
			}
		});
	});

	describe('Delete user', () => {
		it('Should delete user by ID', async () => {
			const getUser = userList[0];
			vi.spyOn(users, 'delete').mockResolvedValue(getUser);
			const result = await users.delete(getUser.id);
			userList = userList.filter((user) => user.id !== getUser.id);
			expect(result).toStrictEqual(getUser);
		});
		it("Shouldn't delete user by random character", async () => {
			const randomChar = faker.helpers.fromRegExp('[a-z0-9]{9}');
			const notFoundError = new Error('User not found', {
				cause: {
					statusCode: StatusCodes.NOT_FOUND,
					results: 'The user you are looking for does not exist',
				},
			});
			vi.spyOn(users, 'delete').mockRejectedValue(notFoundError);
			try {
				await users.delete(randomChar);
			} catch (error: any) {
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toStrictEqual('User not found');
				expect(error.cause).toStrictEqual({
					statusCode: StatusCodes.NOT_FOUND,
					results: 'The user you are looking for does not exist',
				});
			}
		});
	});
});
