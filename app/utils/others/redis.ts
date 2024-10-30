import { Redis } from '@upstash/redis';
import { Env } from '../configs/env';

export const redis = new Redis({
	url: Env.redis.url,
	token: Env.redis.token,
});
