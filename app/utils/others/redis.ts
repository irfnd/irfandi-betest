import { Env } from '@/app/utils/configs/env';
import { Redis } from '@upstash/redis';

export const redis = new Redis({
	url: Env.redis.url,
	token: Env.redis.token,
});
