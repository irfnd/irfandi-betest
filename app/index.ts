import 'reflect-metadata';

import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import morgan from 'morgan';

import { AuthRoutes } from './auth/auth.module';
import { BaseRoutes } from './base/base.module';
import { UserRoutes } from './users/user.module';
import { Env } from './utils/configs/env';
import { exception } from './utils/middlewares/exception';
import { setHelmet } from './utils/others/helmet';
import { passport } from './utils/others/passport';
import { setScalar } from './utils/others/scalar';

export class App {
	public app: Express;
	public server?: ReturnType<Express['listen']>;

	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();
	}

	private middlewares() {
		this.app.disable('etag');
		this.app.use(setHelmet);
		this.app.use(cors());
		this.app.use(compression());
		this.app.use(morgan('dev'));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(passport.initialize());
	}

	private routes() {
		this.app.use('/docs', setScalar);
		this.app.use('/users', UserRoutes);
		this.app.use('/auth', AuthRoutes);
		this.app.use(BaseRoutes);
		this.app.use(exception);
	}

	private handleShutdown() {
		process.on('SIGTERM', () => {
			console.log('SIGTERM signal received: closing HTTP server');
			this.stop();
		});
		process.on('SIGINT', () => {
			console.log('SIGINT signal received: closing HTTP server');
			this.stop();
		});
	}

	public start() {
		this.server = this.app.listen(Env.server.port, () => {
			console.log(`🚀 [Express] - Server running on port ${Env.server.port}\n`);
		});
		this.handleShutdown();
	}

	public stop() {
		if (this.server) {
			this.server.close((err: any) => {
				if (err) {
					console.error('Error during server shutdown', err);
					process.exit(1);
				}
				console.log('HTTP server closed');
				process.exit(0);
			});
		}
	}
}
