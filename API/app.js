import express from 'express';
import { debug } from 'debug';
import validator from 'express-validator';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import accountRoutes from './routes/account';
import transactionRoutes from './routes/transaction';
import swaggerDocument from './swagger.json';

dotenv.config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(validator());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.get('/', (request, response) => {
  response.status(200).json({
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

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);

// Catch all unavailable endpoints
app.all('*', (request, response) => {
  response.status(404).json({
    message: `Endpoint not found, check the root route
    to know the available routes`,
  });
});

// Error handling middleware
app.use((error, request, response) => {
  debug('errorHandlingMidware')(error.stack);
  response.status(500).json({ message: 'Something went wrong. Its our fault not yours!' });
});

app.listen(process.env.PORT, () => debug('server-start')('Server Has Started!!!'));

export default app;
