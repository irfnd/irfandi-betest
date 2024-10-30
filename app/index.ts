import { App } from './app';
import { syncUser } from './kafka/kafka.service';

async function bootstrap() {
	const app = new App();

	app.start();
	await syncUser();
}
bootstrap();
