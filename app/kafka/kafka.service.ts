import { consume } from '../utils/others/kafka';
import { prisma } from '../utils/others/prisma';
import { User } from '../utils/validations/schema-user';

export async function syncUser() {
	await consume(async (msg) => {
		const { value } = msg;
		if (value) {
			const { status, ...data } = JSON.parse(value!.toString()) as User.BaseType;
			if (status === 'created') {
				const user = await prisma.userBackup.create({ data });
				console.log('User sync successful:', user);
			} else if (status === 'updated') {
				const { id, ...others } = data;
				const user = await prisma.userBackup.update({
					where: { id: data.id },
					data: others,
				});
				console.log('User sync successful:', user);
			} else if (status === 'deleted') {
				const user = await prisma.userBackup.delete({ where: { id: data.id } });
				console.log('User sync successful:', user);
			} else {
				console.log('Invalid status');
			}
		}
	});
}
