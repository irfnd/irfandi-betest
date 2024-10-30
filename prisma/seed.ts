import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();
const secret = process.env.HASHING_SALT;

async function seed() {
	const password = await argon.hash('Admin123.', { secret: Buffer.from(secret!, 'base64') });
	await prisma.admin.upsert({
		where: { emailAddress: 'admin@mail.com' },
		create: { emailAddress: 'admin@mail.com', password },
		update: { emailAddress: 'admin@mail.com', password },
	});
}

seed()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
