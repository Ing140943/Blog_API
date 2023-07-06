import pkg from 'pg';
const { Client } = pkg;


const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect();

export default db;