const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    username: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    queueLimit: 0,
    waitForConnections: true
}).promise();

module.exports = pool;