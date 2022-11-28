/*
    Interface for connection to MySQL database
*/

const mysql = require("mysql");

var database = mysql.createPool({
    host: "http://cpsc.roanoke.edu",
    user: "ehfort",
    password: "password",
    database: "postit_db"
});

module.exports = { database };