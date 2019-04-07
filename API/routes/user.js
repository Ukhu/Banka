// AUTH ROUTES

import { Router } from 'express';

import UserController from '../controllers/UserController';
import userValidation from '../validations/userValidations';
import validateEmail from '../middlewares/validateEmail';

const router = Router();

router.post('/signup', userValidation(), validateEmail, UserController.createUser);

export default router;
