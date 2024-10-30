import { z } from 'zod';

export const EnvSchema = z.object({
	port: z.number().nonnegative().optional().default(8080),
	db: z.object({
		url: z.string(),
	}),
	redis: z.object({
		url: z.string(),
		token: z.string(),
	}),
	hash: z.object({
		salt: z.string(),
	}),
	jwt: z.object({
		secret: z.string(),
		expiresIn: z.string(),
	}),
	kafka: z.object({
		clientId: z.string(),
		broker: z.string(),
		username: z.string(),
		password: z.string(),
	}),
});
