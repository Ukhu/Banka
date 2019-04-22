[![Build Status](https://travis-ci.com/Ukhu/Banka.svg?branch=develop)](https://travis-ci.com/Ukhu/Banka)
[![Coverage Status](https://coveralls.io/repos/github/Ukhu/Banka/badge.svg)](https://coveralls.io/github/Ukhu/Banka)
[![Maintainability](https://api.codeclimate.com/v1/badges/af0d6491eba303901232/maintainability)](https://codeclimate.com/github/Ukhu/Banka/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/af0d6491eba303901232/test_coverage)](https://codeclimate.com/github/Ukhu/Banka/test_coverage)

# BANKA
> A lightweight core banking appication

Banka is a light-weight core banking application that powers banking operations like account                          
creation, customer deposit and withdrawals. This app is meant to support a single bank, where                              
users can signup and create bank accounts online, but must visit the branch to withdraw or                                
deposit money.

## Features

With this app:
* User (client) can sign up
* User (client) can login
* User (client) can create an account
* User (client) can view account transaction history
* User (client) can view a specific account transaction.
* Staff (cashier) can debit user (client) account
* Staff (cashier) can credit user (client) account
* Admin/staff can view all user accounts
* Admin/staff can view a specific user account
* Admin/staff can activate or deactivate an account
* Admin/staff can delete a specific user account
* Admin can create staff and admin user accounts

## Installing / Getting started

Follow these steps to get the app up and running locally

```shell
## Fork/Clone the Repo
change directory to the git repository by doing cd Banka

## Install dependencies
npm install

## Setup Database Client
Download lastest POSTGRESQL database client (version 11.2 in this case)
Create a database

## Setting up environmental variables
Create a .env file in the root directory of the repo
Add the following environmental variables:
NODE_ENV= Your default Node environment
JWT_KEY= Your JSON web token secret key 
PGUSER= Your local database username
PGHOST= Your server host
PGDATABASE= Name of the database you want to use for development
PGPASSWORD= Your database password
PGPORT= The port number your database is using

## Create the followig tables in your local database
Use the Postgres CLI to create tables in your database

## Run tests
npm test

## Run the application
npm run dev

## Use the application
Download Postman to interact with the endpoints below
```

## API Endpoints

<table>
  <tr>
      <th>HTTP REQUEST VERB</th>
      <th>API ENDPOINT/PATH</th>
      <th>ACTION</th>
  </tr>
  <tr>
      <td>POST</td>
      <td>/api/v1/auth/signup</td>
      <td>Create user account</td>
  </tr>
  <tr>
      <td>POST</td>
      <td>/api/v1/auth/login</td>
      <td>Login a user</td>
  </tr>
  <tr>
      <td>POST</td>
      <td>/api/v1/accounts</td>
      <td>Create a bank account</td>
  </tr>
  <tr>
      <td>PATCH</td>
      <td>/api/v1/accounts/:accountNumber</td>
      <td>Activate or deactivate an account</td>
  </tr>
  <tr>
      <td>DELETE</td>
      <td>/api/v1/accounts/:accountNumber</td>
      <td>Delete a specific bank account</td>
  </tr>
  <tr>
      <td>POST</td>
      <td>/api/v1/transactions/:accountNumber/debit</td>
      <td>Debit a bank account</td>
  </tr>
  <tr>
      <td>POST</td>
      <td>/api/v1/transactions/:accountNumber/credit</td>
      <td>Credit a bank account</td>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/accounts/:accountNumber/transactions</td>
      <td>View an account's transaction history</td>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/transactions/:transactionId</td>
      <td>View a specific transaction</td>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/user/:userEmail/accounts</td>
      <td>View all accounts owned by a specific user</td>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/accounts/:accountDetails</td>
      <td>View a specific account's details</td>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/accounts</td>
      <td>View a list of all bank accounts</td>
  </tr>
  <tr>
      <td>GET</td>
      <td>/api/v1/accounts?status=active</td>
      <td>View a list of all active bank accounts</td>
  </tr>
  </tr>
      <td>GET</td>
      <td>/api/v1/accounts?status=dormant</td>
      <td>View a list of all dormant bank accounts</td>
  </tr>
</table>


## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome and should be raised for every feature.

## Links

- Project homepage: [Here](https://ukhu.github.io/Banka/UI/)
- Repository: [Here](https://github.com/Ukhu/Banka/)
- Pivotal Tracker Board: [Here](https://www.pivotaltracker.com/projects/2320587)
- Heroku Hosted Endpoints: [Here](https://osaukhu-banka.herokuapp.com/)


## Licensing

The code in this project is licensed under ISC license.

                                    ## Design Inspired by Jehna and Daramola
