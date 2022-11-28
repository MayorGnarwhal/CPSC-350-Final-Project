/*
    Interface for connection to MySQL database

    npm install mysql
*/

const mysql = require("mysql");

var database = mysql.createPool({
    host: "localhost",
    user: "ehfort",
    password: "password",
    database: "postit_db"
});

module.exports = { database };