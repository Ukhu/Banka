import express from 'express';
import TransactionController from '../controllers/transactionController';
import isAuthorized from '../middlewares/isAuthorized';
import isCashier from '../middlewares/isCashier';
import transactionValidation from '../validations/transactionValidations';
import errorHandler from '../middlewares/errorHandler';

const router = express.Router();

router.post('/:accountNumber/credit',
  isAuthorized, transactionValidation(), errorHandler,
  isCashier, TransactionController.credit);

router.post('/:accountNumber/debit',
  isAuthorized, transactionValidation(), errorHandler,
  isCashier, TransactionController.debit);

export default router;
