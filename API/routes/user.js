// AUTH ROUTES

import { Router } from 'express';

import { User } from '../controllers/Users';
import userValidation from '../validations/userValidations';
import validateEmail from '../middlewares/validateEmail';

const router = Router();

router.post('/signup', userValidation(), validateEmail, User.createUser);

export default router;
