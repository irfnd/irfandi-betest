import { Router } from 'express';
import { container } from 'tsyringe';
import { ArgonService } from '../common/argon.service';
import { JwtService } from '../common/jwt.service';
import { validate } from '../utils/middlewares/validation';
import { RouteList } from '../utils/others/types';
import { Auth } from '../utils/validations/schema-auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Registering the service class
container.register('ArgonService', { useClass: ArgonService });
container.register('JwtService', { useValue: JwtService });
container.register('AuthService', { useClass: AuthService });

// Resolving the controller class
const handler = container.resolve(AuthController);

// Defining the routes
const routeList: RouteList[] = [
	{ path: '/sign-in', method: 'post', handler: [validate(Auth.SignInSchema), handler.signIn.bind(handler)] },
];

// Registering the routes
const router = Router();
routeList.forEach((route) => router[route.method](route.path, ...route.handler));

export { router as AuthRoutes };
