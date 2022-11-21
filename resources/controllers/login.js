const { response_handler } = require("../helpers/response_handler");

var login = {
    args: {
        "username": "required|string",
        "password": "required|string",
    },

    func : async function(body, response) {
        // verify user is valid
        const validUser = true;
        if (validUser) {
            response.statusCode = 201;
            response.write(`{"page": "index"}`);
            response.end();

        }
        else {
            response_handler.errorResponse(response, "Invalid credentials for login");
        }
    }
};

module.exports = { login };