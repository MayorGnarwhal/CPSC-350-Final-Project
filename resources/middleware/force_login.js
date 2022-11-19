/*
    Validate that request was sent by a valid user
*/

function force_login(body) {
    const user_id = body.user_id;

    // verify user id was passed
    if (user_id === undefined) {
        return false;
    }

    // verify user exists in database

    // verify session exists (or create session)

    return true;
};

module.exports = { force_login };