import { Router } from 'express';
import { container } from 'tsyringe';
import { RouteList } from '../utils/others/types';
import { BaseController } from './base.controller';

// Resolving the controller class
const handler = container.resolve(BaseController);

// Defining the routes
const routeList: RouteList[] = [
	{ path: '/', method: 'get', handler: [handler.root.bind(handler)] },
	{ path: /(.*)/, method: 'all', handler: [handler.notFound.bind(handler)] },
];

// Registering the routes
const router = Router();
routeList.forEach((route) => router[route.method](route.path, ...route.handler));

export { router as BaseRoutes };
