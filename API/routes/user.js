import express from 'express';
import { UserController } from '../controllers/userController';
import userValidation from '../validations/userValidations';
import validateEmail from '../middlewares/validateEmail';
import errorHandler from '../middlewares/errorHandler';

const router = express.Router();

router.post('/signup', userValidation(), errorHandler, validateEmail, UserController.createUser);
router.post('/signin', UserController.loginUser);

export default router;
