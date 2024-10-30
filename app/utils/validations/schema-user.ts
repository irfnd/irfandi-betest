import validator from 'validator';
import { z } from 'zod';

const UserSchema = z.object({
	id: z.string({ required_error: 'ID is required' }).refine(validator.isMongoId, { message: 'ID must be valid MongoID' }),
	userName: z
		.string({ required_error: 'User name is required' })
		.refine((value) => validator.isAlphanumeric(value, 'en-US', { ignore: '_.' }), {
			message: 'Username must be alphanumeric',
		}),
	emailAddress: z.string({ required_error: 'Email address is required' }).email({ message: 'Email address must be valid' }),
	accountNumber: z
		.string({ required_error: 'Account number is required' })
		.refine(validator.isNumeric, { message: 'Account number must be numeric' }),
	identityNumber: z.string({ required_error: 'Identity number must be numeric' }).refine(validator.isNumeric, {
		message: 'Identity number must be numeric',
	}),
	createdAt: z.date(),
	updatedAt: z.date(),
	status: z.enum(['updated', 'deleted', 'created']),
});

const UserCreateSchema = UserSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	status: true,
});

const UserUpdateSchema = UserCreateSchema.partial();

const UserFindSchema = UserSchema.pick({ id: true });

const UserFindByNumberSchema = z.object({
	id: z.string({ required_error: 'Account or identity number is required' }).refine(validator.isNumeric, {
		message: 'Account or identity number must be numeric',
	}),
});

export namespace User {
	export const BaseSchema = UserSchema;
	export const CreateSchema = UserCreateSchema;
	export const UpdateSchema = UserUpdateSchema;
	export const FindSchema = UserFindSchema;
	export const FindByNumberSchema = UserFindByNumberSchema;

	export type BaseType = z.infer<typeof UserSchema>;
	export type CreateType = z.infer<typeof UserCreateSchema>;
	export type UpdateType = z.infer<typeof UserUpdateSchema>;
	export type FindType = z.infer<typeof UserFindSchema>;
	export type FindByNumberType = z.infer<typeof UserFindByNumberSchema>;
}
