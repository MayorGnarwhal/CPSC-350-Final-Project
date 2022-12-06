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
        var [error, user] = await validatePassword(body.username, body.password);
        if(error) {
            response_handler.errorResponse(response, `Invalid credentials for login: ${error}`, 401);
        }
        else {
            if (user.account_status === "DISABLED" || user.account_status === "REJECTED") {
                return response_handler.errorResponse(response, `User account has been ${user.account_status.toLowerCase()}`, 401);
            }
            else if (user.account_status === "PENDING") {
                return response_handler.errorResponse(response, `Account approval is still pending. Come check back later.`, 401);
            }

            var [error, session] = await DB.getSessionByUser(user.user_id);
            if (session) { // session already exists
                response_handler.endResponse(response, `{"page": "index", "session_id": "${session.session_uuid}"}`, 201);
            }
            else { // session does not exist - create new
                const sessionID = crypto.randomUUID();
                var [error, session] = await DB.query(`
                    INSERT INTO Sessions (user_id, session_uuid)
                    VALUES ('${user.user_id}', '${sessionID}')
                `);
                if (error) {
                    response_handler.errorResponse(response, `DB Error: ${error}`, 400);
                }
                else {
                    response_handler.endResponse(response, `{"page": "index", "session_id": "${sessionID}"}`, 201);
                }
            }
        }
    }
};

module.exports = { login };