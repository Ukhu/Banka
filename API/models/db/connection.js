import { Pool } from 'pg';
import { config } from 'dotenv';

config();

class Model {
  constructor(table) {
    this.table = table;
    this.pool = Model.databaseConnect();
  }

  static databaseConnect() {
    let connectObj;

    if (process.env.NODE_ENV === 'development') {
      connectObj = {
        connectionString: process.env.DATABASE_URL,
      };
    } else if (process.env.NODE_ENV === 'production') {
      connectObj = {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      };
    } else {
      connectObj = {
        connectionString: process.env.PG_CLOUD,
      };
    }

    return new Pool(connectObj);
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
