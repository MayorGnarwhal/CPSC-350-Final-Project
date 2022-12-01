/* 
    Database interface for easier async code
*/

const util = require("util");

const { database } = require("./database");

var DB = {
    query : async function(query_string) {
        const query = util.promisify(database.query).bind(database);

        try {
            response = await query(query_string);
            return [undefined, response[0]];
        }
        catch(error) {
            return [error, undefined];
        }
    },
};

module.exports = { DB };