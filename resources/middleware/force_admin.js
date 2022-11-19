/*
    Validate that request was sent by valid admin user
*/

const { force_login } = require("./force_login");

function force_admin(body) {
    // force_login handles session
    const logged_in = force_login(body);

    if (!logged_in) {
        return false;
    }

    // verify that user is an admin
    return true;
}

module.exports = { force_admin };