/*
    Interface for connection to MySQL database

    npm install mysql
*/

const mysql = require("mysql");

var database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = { database };