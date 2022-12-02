const bcrypt = require("bcrypt"); 

const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { helpers } = require("../helpers/helpers");
const { DB } = require("../helpers/dbi");

const { login } = require("./login");

async function verifyAccountInfo(body) {
    if (body.password !== body.password2) {
        return [false, `Confirmation password does not match.`];
    }

    // verify username format
    const username = body.username.trim();
    const invalidUsername = (username.length !== username.replace(/\s+/g, "").length);
    if (invalidUsername) {
        return [false, `Invalid username format. Username cannot contain spaces`];
    }

    // check username duplicates
    var [error, response] = await DB.query(`
        SELECT COUNT(user_id) AS duplicates
        FROM Users 
        WHERE username='${body.username}'
    `);
    if (response.duplicates > 0) {
        return [false, `Username ${username} already in use`];
    }

    // check email duplicates
    var [error, response] = await DB.query(`
        SELECT COUNT(user_id) AS duplicates
        FROM Users 
        WHERE email='${body.email}'
    `);
    if (response.duplicates > 0) {
        return [false, `Email ${body.email} already in use`];
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
        "password2":  "required|string",
    },

    func : async function(body, response) {
        const [success, error] = await verifyAccountInfo(body);

        if (!success) {
            response_handler.errorResponse(response, `Failed to create account: ${error}`, 400);
        }
        else {
            const now = helpers.formatDatetime();
            const password_hash = await bcrypt.hash(body.password, 10);

            if (process.env.DEBUG_MODE === "true") {
                response_handler.errorResponse(response, "Debug mode enabled", 418);
            }
            else {
                const entry = {
                    username: body.username,
                    first_name: body.first_name,
                    last_name: body.last_name,
                    password: password_hash,
                    email: body.email,
                    profile_picture: "public/storage/images/default-profile-picture.jpg",
                    account_status: "ACTIVE",
                    is_admin: 0,
                    account_created_time: now
                };

                database.query(`INSERT INTO Users SET ?`, entry, function(error, results, fields) {
                    if (error) {
                        response_handler.errorResponse(response, `DB Error: ${error}`, 400);
                    }
                    else {
                        login.func(body, response);
                    }
                });
            }
        }
    }
};

module.exports = { signup };