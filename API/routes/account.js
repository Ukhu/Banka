import express from 'express';
import { AccountController } from '../controllers/accountController';
import isAuthorized from '../middlewares/isAuthorized';
import accountValidations from '../validations/accountValidations';

const router = express.Router();

export default router.post('/', accountValidations(), isAuthorized, AccountController.createAccount);
