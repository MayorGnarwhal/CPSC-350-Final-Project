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

    getUserBySession : async function(session_id) {
        var [error, session] = await this.query(`SELECT user_id FROM Sessions WHERE session_uuid='${session_id}'`);
        if (error || session === undefined) {
            return ["User not logged or session expired", undefined];
        }
        else {
            return this.getUserById(session.user_id);
        }
    },

    getUserById : async function(user_id) {
        var [error, user] = await this.query(`SELECT * FROM Users WHERE user_id='${user_id}'`);
        if (error || user === undefined) {
            return ["User does not exist in database", undefined];
        }
        else {
            return [undefined, user];
        }
    }
};

module.exports = { DB };