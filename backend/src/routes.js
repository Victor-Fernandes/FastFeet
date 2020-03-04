import { Router } from 'express';
import multer from 'multer';
import configMulter from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(configMulter);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

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

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
