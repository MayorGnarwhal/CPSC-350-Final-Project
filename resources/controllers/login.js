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
            return [undefined, results];
        }
        else {
            return [`Password does not match`, undefined];
        }
    }
    catch {
        return [`User ${username} does not exist in the database`, undefined];
    }
}

var login = {
    args: {
        "username": "required|string",
        "password": "required|string",
    },

    func : async function(body, response) {
        const [error, results] = await validatePassword(body.username, body.password);
        if (!error) {
            const sessionID = crypto.randomUUID();
            const [error] = await DB.query(`
                INSERT INTO Sessions (user_id, session_uuid)
                VALUES ('${results.user_id}', '${sessionID}')
            `);

            if (error && error.code !== "ER_DUP_ENTRY") {
                response_handler.errorResponse(response, `DB Error: ${error}`);
            }
            else {
                response.statusCode = 201;
                response.write(`{"page": "index", "session_id": "${sessionID}"}`);
                response.end();
             }       
        }
        else {
            response_handler.errorResponse(response, `Invalid credentials for login: ${error}`);
        }
    }
};

module.exports = { login };