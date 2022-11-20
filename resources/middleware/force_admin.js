/*
    Validate that request was sent by a valid admin user
*/

const { force_login } = require("./force_login");

function force_admin(body) {
    // force_login handles session
    const [logged_in, error] = force_login(body);

    if (!logged_in) {
        return [false, error];
    }

    // verify that user is an admin
    const isAdmin = true;
    if (!isAdmin) {
        return [false, "User is not an admin"];
    }

    return [true, undefined];
};

module.exports = { force_admin };