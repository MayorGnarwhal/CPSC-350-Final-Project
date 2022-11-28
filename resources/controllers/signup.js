const bcrypt = require("bcrypt"); 

const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { helpers } = require("../helpers/helpers");

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
            const now = helpers.formatDatetime();
            const password_hash = await bcrypt.hash(body.password, 10);

            database.query(`
                INSERT INTO Users (username, first_name, last_name, password, email, profile_picture, account_status, is_admin, account_created_time)
                VALUES ('${body.username}', '${body.first_name}', '${body.last_name}', '${password_hash}', '${body.email}', 'public/temp.png', 'ACTIVE', '0', '${now}');
            `, function(error, results, fields) {
                if (error) {
                    console.log("Failed to insert user to database");
                    console.log(error);
                    response_handler.errorResponse(response, `Failed to create account`);
                }
                else {
                    response.statusCode = 201;
                    response.write(`{"page": "index"}`);
                    response.end();
                }
            });
        }
    }
};

module.exports = { signup };