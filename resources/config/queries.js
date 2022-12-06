/* 
    Stores commonly use base queries.

    Meant to exclude WHERE clause and use DB.queryWhere instead
*/

var queries = {
    // TODO: join other tables for more info
    USER: `SELECT * FROM UsersWithNumFriends`,

    USER_COLUMNS: "Users.user_id, username, first_name, last_name, profile_picture",

    SESSION: `SELECT * FROM Sessions`,

    FRIENDSHIP: `SELECT * FROM Friends`,

    GROUPS: `SELECT * FROM GroupsWithNumFriends`,

    POST: `SELECT * FROM Posts`
};

module.exports = { queries };