import express from 'express';
import TransactionController from '../controllers/transactionController';
import isAuthorized from '../middlewares/isAuthorized';
import isCashier from '../middlewares/isCashier';
import transactionValidation from '../validations/transactionValidations';
import idValidation from '../validations/idValidation';
import errorHandler from '../middlewares/errorHandler';

const router = express.Router();

router.post('/:accountNumber/credit',
  isAuthorized, transactionValidation(), errorHandler,
  isCashier, TransactionController.credit);

router.post('/:accountNumber/debit',
  isAuthorized, transactionValidation(), errorHandler,
  isCashier, TransactionController.debit);

router.get('/:transactionId',
  isAuthorized, idValidation(), errorHandler, TransactionController.getDetails);

export default router;
