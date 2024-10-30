import 'dotenv/config';
import { EnvSchema } from '../validations/schema-env';

const fromEnv = EnvSchema.parse({
	port: process.env.PORT ? Number(process.env.PORT) : undefined,
	db: { url: process.env.DATABASE_URL },
	redis: {
		url: process.env.UPSTASH_REDIS_URL,
		token: process.env.UPSTASH_REDIS_TOKEN,
	},
	hash: { salt: process.env.HASHING_SALT },
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN,
	},
	kafka: {
		clientId: process.env.KAFKA_CLIENT_ID,
		broker: process.env.KAFKA_BROKER,
		username: process.env.KAFKK_SASL_USERNAME,
		password: process.env.KAFKA_SASL_PASSWORD,
	},
});

export const Env = {
	server: { port: fromEnv.port },
	db: fromEnv.db,
	redis: fromEnv.redis,
	hash: fromEnv.hash,
	jwt: fromEnv.jwt,
	kafka: fromEnv.kafka,
};
