/* 
    Database interface for easier async code
*/

const util = require("util");

const { database } = require("./database");
const { queries } = require("../config/queries");

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

    queryWhere : async function(queryString, whereClause) {
        return await this.query(queryString + " " + whereClause);
    },

    getSessionByUser : async function(user_id) {
        return await this.queryWhere(queries.SESSION, `WHERE user_id='${user_id}'`);
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
        return await this.queryWhere(queries.USER, `WHERE user_id='${user_id}'`)
    },

    getUserByUsername : async function(username) {
        return await this.queryWhere(queries.USER, `WHERE username='${username}'`);
    },
};

module.exports = { DB };