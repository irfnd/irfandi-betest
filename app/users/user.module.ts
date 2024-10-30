import { Router } from 'express';
import { container } from 'tsyringe';
import { protect } from '../utils/middlewares/protect';
import { validate } from '../utils/middlewares/validation';
import { RouteList } from '../utils/others/types';
import { User } from '../utils/validations/schema-user';
import { UserController } from './user.controller';
import { UserService } from './user.service';

// Registering the service class
container.register('UserService', { useClass: UserService });

// Resolving the controller class
const handler = container.resolve(UserController);

// Defining the routes
const routeList: RouteList[] = [
	{
		path: '/',
		method: 'get',
		handler: [protect, handler.findAll.bind(handler)],
	},
	{
		path: '/',
		method: 'post',
		handler: [protect, validate(User.CreateSchema), handler.create.bind(handler)],
	},
	{
		path: '/:id',
		method: 'get',
		handler: [protect, validate(User.FindByNumberSchema, 'params'), handler.findOne.bind(handler)],
	},
	{
		path: '/:id',
		method: 'patch',
		handler: [protect, validate(User.FindSchema, 'params'), validate(User.UpdateSchema), handler.update.bind(handler)],
	},
	{
		path: '/:id',
		method: 'delete',
		handler: [protect, validate(User.FindSchema, 'params'), handler.delete.bind(handler)],
	},
];

// Registering the routes
const router = Router();
routeList.forEach((route) => router[route.method](route.path, ...route.handler));

export { router as UserRoutes };
