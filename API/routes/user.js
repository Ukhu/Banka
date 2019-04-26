import express from 'express';
import isAuthorized from '../middlewares/isAuthorized';
import UserController from '../controllers/userController';
import emailValidation from '../validations/emailValidation';
import errorHandler from '../middlewares/errorHandler';

const router = express.Router();

router.get('/:userEmail/accounts', isAuthorized,
  emailValidation(), errorHandler, UserController.getUserAccounts);

export default router;
