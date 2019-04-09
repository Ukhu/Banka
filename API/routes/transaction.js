import express from 'express';
import { TransactionController } from '../controllers/transactionController';
import isAuthorized from '../middlewares/isAuthorized';
import isCashier from '../middlewares/isCashier';

const router = express.Router();

router.post('/:accountNumber/credit', isAuthorized, isCashier, TransactionController.credit);

export default router;
