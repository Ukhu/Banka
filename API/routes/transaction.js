import express from 'express';
import { TransactionController } from '../controllers/transactionController';
import isAuthorized from '../middlewares/isAuthorized';
import isCashier from '../middlewares/isCashier';
import transactionValidation from '../validations/transactionValidations';

const router = express.Router();

router.post('/:accountNumber/credit', transactionValidation('credit'), isAuthorized, isCashier, TransactionController.credit);

export default router;
