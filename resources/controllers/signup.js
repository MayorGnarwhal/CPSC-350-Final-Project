const { response_handler } = require("../helpers/response_handler");

function verifyAccountInfo(body) {
    const duplicateEmail = false;
    if (duplicateEmail) {
        return [false, `Email ${body.email} already in use`];
    }

    const username = body.username.trim();
    const invalidUsername = (username.length !== username.replace(/\s+/g, "").length);
    if (invalidUsername) {
        return [false, `Invalid username format. Username cannot contain spaces`];
    }

    const duplicateUsername = false;
    if (duplicateUsername) {
        return [false, `Username ${username} already in use`];
    }

    return [true, undefined]
}

var signup = {
    args: {
        "first_name": "required|string",
        "last_name":  "required|string",
        "email":      "required|regex:^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", // https://stackoverflow.com/a/719543
        "username":   "required|string",
        "password":   "required|string",
    },

    func : async function(body, response) {
        const [success, error] = verifyAccountInfo(body);

        if (!success) {
            response_handler.errorResponse(response, `Failed to create account: ${error}`);
        }
        else {
            response.statusCode = 201;
            response.write(`{"page": "index"}`);
            response.end();
        }
    }
};

module.exports = { signup };