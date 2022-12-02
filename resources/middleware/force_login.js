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
    var [error, results] = await DB.query(`SELECT user_id FROM Sessions WHERE session_uuid='${body.session_id}'`);
    if (error || results === undefined) {
        return [false, "User not logged or session expired"];
    }
    
    body.user_id = results.user_id; // maybe join user table into body, or pass with request

    return [true, undefined];
};

module.exports = { force_login };