const crypto = require("crypto");
const bcrypt = require("bcrypt"); 

const { response_handler } = require("../helpers/response_handler");
const { DB } = require("../helpers/dbi");

async function validatePassword(username, raw_password) {
    const [error, user] = await DB.getUserByUsername(username);

    try {
        const valid = await bcrypt.compare(raw_password, user.password);
        if (valid) {
            return [undefined, user];
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
                response_handler.errorResponse(response, `DB Error: ${error}`, 400);
            }
            else {
                response_handler.endResponse(response, `{"page": "index", "session_id": "${sessionID}"}`, 201);
             }       
        }
        else {
            response_handler.errorResponse(response, `Invalid credentials for login: ${error}`, 401);
        }
    }
};

module.exports = { login };