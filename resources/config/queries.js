/* 
    Stores commonly use base queries.

    Meant to exclude WHERE clause and use DB.queryWhere instead
*/

var queries = {
    // TODO: join other tables for more info
    USER: `SELECT * FROM Users`,

    SESSION: `SELECT * FROM Sessions`,
};

module.exports = { queries };