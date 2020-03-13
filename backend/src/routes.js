import { Router } from 'express';
import multer from 'multer';
import configMulter from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(configMulter);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Deliverys list routes
routes.get('/deliveryman/:id/deliveries', DeliveryController.index);

// Status route
routes.post('/order/:id/status', DeliveryStatusController.store);
routes.put('/order/:id/status', DeliveryStatusController.update);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// recipients routes
routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

// Deliveryman routes
routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

// Order routes
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.get('/orders', OrderController.index);
routes.delete('/orders/:id', OrderController.delete);

// file uploads
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
