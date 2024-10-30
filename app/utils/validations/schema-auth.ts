import { z } from 'zod';

const AuthSignInSchema = z.object({
	emailAddress: z.string().email(),
	password: z.string(),
});

export namespace Auth {
	export const SignInSchema = AuthSignInSchema;

	export type SignInType = z.infer<typeof AuthSignInSchema>;
}
