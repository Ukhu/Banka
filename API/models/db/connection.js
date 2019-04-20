import { Pool } from 'pg';
import { config } from 'dotenv';

config();

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
    });
  }

  find(columns = '*', constraint = null) {
    let queryString;

    if (constraint) {
      queryString = `SELECT ${columns}
      FROM ${this.table}
      WHERE ${Object.keys(constraint)[0]} = ${Object.values(constraint)[0]}`;
    } else {
      queryString = `SELECT ${columns} FROM ${this.table}`;
    }

    this.pool.query(queryString, (err, res) => {
      if (err) {
        return err;
      }
      return res.rows;
    });
  }

  put(params) {
    this.pool.query(
      `INSERT INTO ${this.table}(first_name, last_name, email) VALUES(
      '${params.first_name}', '${params.last_name}', '${params.email}')`,
      (err, res) => {
        if (err) {
          return err.message;
        }
        return res.command;
      },
    );
  }
}

export default Model;
