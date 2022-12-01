/*
    Validate that request was sent by a valid user
*/

const { DB } = require("../helpers/dbi");

async function force_login(body) {
    // verify user id was passed
    if (body.user_id === undefined) {
        return [false, "user_id not passed with request or undefined"];
    }

    // verify session exists (or create session)
    const [error, results] = await DB.query(`
        SELECT COUNT(user_id) as count
        FROM Sessions
        WHERE user_id='${body.user_id}'
    `);
    if (error || results.count === 0) {
        return [false, "User not logged in"];
    }

    return [true, undefined];
};

module.exports = { force_login };