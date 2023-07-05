import mysql from "mysql"
import pkg from "pg";
const { Pool } = pkg;

// For localhost
// export const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "201194ing",
//     database: "blog",
// })  

// For Production

export const db = new Pool ({
    connectionString: process.env.DBConfigLink,
    ssl: {
        rejectUnauthorized: false
    }
})