/* 
    Database interface for easier async code
*/

const util = require("util");

const { database } = require("./database");

var DB = {
    query : async function(query_string) {
        const query = util.promisify(database.query).bind(database);
        var error, response;

        try {
            response = await query(query_string);
            response = response[0];
        }
        catch(err) {
            error = err;
        }

        return [error, response];
    },
};

module.exports = { DB };