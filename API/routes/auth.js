import express from 'express';
import UserController from '../controllers/userController';
import { clientValidation, staffValidation }
  from '../validations/userValidations';
import isAuthorized from '../middlewares/isAuthorized';
import { isAdmin } from '../middlewares/checkUser';
import signinValidation from '../validations/signinValidations';
import validateEmail from '../middlewares/validateEmail';
import errorHandler from '../middlewares/errorHandler';

const router = express.Router();

router.post('/signup', clientValidation(),
  errorHandler, validateEmail, UserController.createUser);

router.post('/create-staff', isAuthorized, isAdmin, staffValidation(),
  errorHandler, validateEmail, UserController.createStaff);

router.post('/signin', signinValidation(),
  errorHandler, UserController.loginUser);


export default router;
