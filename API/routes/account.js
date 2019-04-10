import express from 'express';
import { AccountController } from '../controllers/accountController';
import isAuthorized from '../middlewares/isAuthorized';
import isStaff from '../middlewares/isStaff';
import accountValidations from '../validations/accountValidations';

const router = express.Router();

router.post('/', accountValidations(), isAuthorized, AccountController.createAccount);
router.patch('/:accountNumber', isAuthorized, isStaff, AccountController.activateOrDeactivate);
router.delete('/:accountNumber', isAuthorized, isStaff, AccountController.deleteAccount);

export default router;
