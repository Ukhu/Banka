import express from 'express';
import AccountController from '../controllers/accountController';
import isAuthorized from '../middlewares/isAuthorized';

const router = express.Router();

export default router.post('/', isAuthorized, AccountController.createAccount);
