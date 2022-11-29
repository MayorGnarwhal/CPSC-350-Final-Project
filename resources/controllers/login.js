const crypto = require("crypto");
const bcrypt = require("bcrypt"); 

const { response_handler } = require("../helpers/response_handler");
const { DB } = require("../helpers/dbi");

async function validatePassword(username, raw_password) {
    const [error, results] = await DB.query(`
        SELECT user_id, password
        FROM Users
        WHERE username='${username}'
    `);

    try {
        const valid = await bcrypt.compare(raw_password, results.password);
        if (valid) {
            return [true, undefined];
        }
        else {
            return [false, `Password does not match`];
        }
    }
    catch {
        return [false, `User ${username} does not exist in the database`];
    }
}

var login = {
    args: {
        "username": "required|string",
        "password": "required|string",
    },

    func : async function(body, response) {
        // verify user is valid
        const [success, error] = await validatePassword(body.username, body.password);
        if (success) {
            response.statusCode = 201;
            response.write(`{"page": "index"}`);
            response.end();
        }
        else {
            response_handler.errorResponse(response, `Invalid credentials for login: ${error}`);
        }
    }
};

module.exports = { login };