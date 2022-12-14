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
            return ["User not logged in or session expired", undefined];
        }
        else {
            return this.getUserById(session.user_id);
        }
    },

    getUserById : async function(user_id, status) {
        var whereClause = `WHERE user_id='${user_id}'`;
        if (status) {
            whereClause += ` AND account_status='${status.toUpperCase()}'`;
        }
        return await this.queryWhere(queries.USER, whereClause);
    },

    getUserByUsername : async function(username) {
        return await this.queryWhere(queries.USER, `WHERE username='${username}'`);
    },

    getFriendship : async function(user_id_1, user_id_2, extraCondition) {
        return await this.queryWhere(queries.FRIENDSHIP, `
            WHERE (
                (initiator_user_id='${user_id_1}' AND receiver_user_id='${user_id_2}')
                OR (initiator_user_id='${user_id_2}' AND receiver_user_id='${user_id_1}')
            ) ${extraCondition ? "AND " + extraCondition : ""}
        `);
    },

    getGroupsFromUser : async function(user_id) {
        return await this.queryWhere(queries.GROUPS, `WHERE group_user_id='${user_id}'`);
    },

    getGroupById : async function(group_id, user_id) {
        var whereClause = `WHERE group_id='${group_id}'`;
        if (user_id) {
            whereClause += ` AND group_user_id='${user_id}'`;
        }
        return await this.queryWhere(queries.GROUPS, whereClause);
    },

    userOwnsGroup : async function(user_id, group_id) {
        const [error, result] = await this.queryWhere(queries.GROUPS, `WHERE group_id='${group_id}' AND group_user_id='${user_id}'`);
        return (error === undefined && result !== undefined);
    },

    getPostById : async function(post_id, user_id) {
        var whereClause = `WHERE post_id='${post_id}'`;
        if (user_id) {
            whereClause += ` AND post_user_id='${user_id}'`;
        }
        return await this.queryWhere(queries.POST, whereClause);
    }
};

module.exports = { DB };