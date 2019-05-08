import express from 'express';
import { debug } from 'debug';
import validator from 'express-validator';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import nodemailer from 'nodemailer';
import cors from 'cors';
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

// CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Nodemailer Transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.NODE_MAILER_SERVICE,
//   auth: {
//     user: process.env.NODE_MAILER_EMAIL,
//     pass: process.env.NODE_MAILER_PASSWORD,
//   },
// });

// app.use((request, response, next) => {
//   request.transporter = transporter;
//   next();
// });

// API routes
app.get('/', (request, response) => {
  response.status(200).json({
    message: 'Welcome to Banka API, check out the available endpoints below',
    endpoints: {
      apiDocumentation: 'GET /api-docs',
      createUser: 'POST /api/v1/auth/signup',
      createStaff: 'POST /api/v1/auth/create-staff',
      loginUser: 'POST /api/v1/auth/signin',
      createBankAccount: 'POST /api/v1/accounts',
      activateDeactivate: 'PATCH /api/v1/accounts/<accountNumber>',
      deleteUser: 'DELETE /api/v1/accounts/<accountNumber>',
      debitBankAccount: 'POST /api/v1/transactions/<accountNumber>/debit',
      creditBankAccount: 'POST /api/v1/transactions/<accountNumber>/credit',
      viewTransactionHistory: 'GET /api/v1/accounts/<accountNumber>/transactions',
      viewSpecificTransaction: 'GET /api/v1/transactions/<transactionId>',
      viewUsersAccounts: 'GET /api/v1/user/<userEmail>/accounts',
      viewAccountDetails: 'GET /api/v1/accounts/<accountNumber>',
      viewActiveAccounts: 'GET /api/v1/accounts?status=active',
      viewDormantAccounts: 'GET /api/v1/accounts?status=dormant',
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
    message:
    'Endpoint not found, check root route for available endpoints',
  });
});

// Error handling middleware
app.use((error, request, response) => {
  debug('errorHandlingMidware')(error.stack);
  response.status(500).json(
    { message: 'Something went wrong. Its our fault not yours!' },
  );
});

app.listen(process.env.PORT);

export default app;
