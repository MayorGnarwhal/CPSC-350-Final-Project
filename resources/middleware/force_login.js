/*
    Validate that request was sent by valid user
*/

function force_login(body) {
    const user_id = body.user_id;

    // verify user exists in database

    // verify session exists (or create session)

    return user_id !== undefined;
}

module.exports = { force_login };