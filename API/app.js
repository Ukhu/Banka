import express from 'express';
import { json, urlencoded } from 'body-parser';
import { debug } from 'debug';
import validator from 'express-validator';
import dotenv from 'dotenv';
import userRoutes from './routes/user';
import accountRoutes from './routes/account';
import transactionRoutes from './routes/transaction';

dotenv.config();
const app = express();

// express middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(validator());

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.listen(process.env.PORT, () => debug('server-start')('Server Has Started!!!'));

export default app;
