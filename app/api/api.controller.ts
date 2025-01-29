import { Router } from 'express';
import apiTokensController from './token/token.controller';
import authController from './auth/auth.controller';

const apiController = Router();

apiController.use('/api-tokens', apiTokensController);
apiController.use('/auth', authController);

export default apiController;
