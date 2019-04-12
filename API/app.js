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

// API routes
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Banka API, check out the available endpoints below',
    endpoints: {
      createUser: 'POST /api/v1/auth/signup',
      loginUser: 'POST /api/v1/auth/signin',
      createBankAccount: 'POST /api/v1/accounts',
      activateDeactivate: 'PATCH /api/v1/accounts/<accountNumber>',
      deleteUser: 'DELETE /api/v1/accounts/<accountNumber>',
      debitBankAccount: 'POST /api/v1/transactions/<accountNumber/debit',
      creditBankAccount: 'POST /api/v1/transactions/<accountNumber/credit',
    },
  });
});

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);

// Catch all unavailable endpoints
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found, check the root route to know the available routes' });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong. Its our fault not yours!' });
});

app.listen(process.env.PORT, () => debug('server-start')('Server Has Started!!!'));

export default app;
