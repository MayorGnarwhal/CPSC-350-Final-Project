/*
    Validate that request was sent by a valid user
*/

const { DB } = require("../helpers/dbi");

async function force_login(body) {
    // verify session_id was passed
    if (body.session_id === undefined) {
        return [false, "session_id not passed with request or undefined"];
    }

    // verify session exists
    var [error, user] = await DB.query(`SELECT user_id FROM Sessions WHERE session_uuid='${body.session_id}'`);
    if (error || user === undefined) {
        return [false, "User not logged or session expired"];
    }

    if (user.account_status === "DISABLED" || user.account_status === "REJECTED") {
        return [false, `User account has been ${user.account_status.toLowerCase()}`];
    }
    
    body.user_id = user.user_id; // maybe join user table into body, or pass with request

    return [user, undefined];
};

module.exports = { force_login };