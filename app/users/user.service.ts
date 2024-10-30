import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { send } from '../utils/others/kafka';
import { prisma } from '../utils/others/prisma';
import { redis } from '../utils/others/redis';
import { User } from '../utils/validations/schema-user';

@injectable()
export class UserService {
	constructor() {}

	async create(data: User.CreateType) {
		const user = await prisma.user.create({ data });
		send({
			key: `user_${user.id}`,
			value: JSON.stringify({ ...user, status: 'created' }),
		});
		return user;
	}

	async findOne(id: string) {
		const cacheKey = `user_${id}`;
		const cachedUser = await redis.get<Omit<User.BaseType, 'status'>>(cacheKey);
		if (cachedUser) return cachedUser;
		const user = await prisma.user.findFirst({
			where: { OR: [{ accountNumber: id }, { identityNumber: id }] },
		});
		if (!user) {
			throw new Error('User not found', {
				cause: {
					statusCode: StatusCodes.NOT_FOUND,
					results: 'The user you are looking for does not exist',
				},
			});
		}
		await redis.set(cacheKey, user, { ex: 30, nx: true });
		return user;
	}

	async findAll() {
		const cachedUsers = await redis.get<User.BaseType[]>('users_all');
		if (cachedUsers) return cachedUsers;
		const users = await prisma.user.findMany();
		await redis.set('users_all', users, { ex: 30, nx: true });
		return users;
	}

	async update(id: string, data: User.UpdateType) {
		return await prisma.$transaction(async (ctx) => {
			const getUser = await ctx.user.findFirst({ where: { id } });
			if (!getUser) {
				throw new Error('User not found', {
					cause: {
						statusCode: StatusCodes.NOT_FOUND,
						results: 'The user you are looking for does not exist',
					},
				});
			}
			const updatedUser = await ctx.user.update({ where: { id }, data });
			send({
				key: `user_${updatedUser.id}`,
				value: JSON.stringify({ ...updatedUser, status: 'updated' }),
			});
			return updatedUser;
		});
	}

	async delete(id: string) {
		return await prisma.$transaction(async (ctx) => {
			const getUser = await ctx.user.findFirst({ where: { id } });
			if (!getUser) {
				throw new Error('User not found', {
					cause: {
						statusCode: StatusCodes.NOT_FOUND,
						results: 'The user you are looking for does not exist',
					},
				});
			}
			const deletedUser = await ctx.user.delete({ where: { id } });
			send({
				key: `user_${deletedUser.id}`,
				value: JSON.stringify({ ...deletedUser, status: 'deleted' }),
			});
			return deletedUser;
		});
	}
}
