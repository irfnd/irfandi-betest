import { App } from './app';
import { syncUser } from './kafka/kafka.service';

const app = new App();

async function bootstrap() {
	app.start();
	await syncUser();
}
bootstrap();

export default app.app;
