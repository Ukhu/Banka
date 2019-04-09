import express from 'express';
import TransactionController from '../controllers/transactionController';
import isAuthorized from '../middlewares/isAuthorized';

const router = express.Router();

router.post('/:accountNumber/credit', isAuthorized, TransactionController.credit);

export default router;
