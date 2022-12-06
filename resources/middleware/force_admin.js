/*
    Validate that request was sent by a valid admin user
*/

const { force_login } = require("./force_login");

async function force_admin(body) {
    // force_login handles session
    const [user, error] = await force_login(body);

    if (!user) {
        return [false, error];
    }

    // verify that user is an admin
    if (user.account_status !== "ADMIN") {
        return [false, "User is not an admin"];
    }

    body.user_is_admin = true;

    return [user, undefined];
};

module.exports = { force_admin };