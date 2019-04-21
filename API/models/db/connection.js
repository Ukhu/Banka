import { Pool } from 'pg';
import { config } from 'dotenv';

config();

if (process.env.NODE_ENV === 'development') {
  process.env.PGDATABASE = 'banka';
} else {
  process.env.PGDATABASE = 'banka_test';
}

class Model {
  constructor(table) {
    this.table = table;
    this.pool = Model.databaseConnect();
  }

  static databaseConnect() {
    const {
      PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT,
    } = process.env;

    return new Pool({
      user: PGUSER,
      host: PGHOST,
      database: PGDATABASE,
      password: PGPASSWORD,
      port: PGPORT,
      idleTimeoutMillis: 1000,
    });
  }

  query(queryString, values) {
    return new Promise((resolve, reject) => {
      this.pool.query(queryString, values,
        (error, response) => {
          if (error) {
            reject(error);
          }
          resolve(response);
        });
    });
  }
}

export default Model;
