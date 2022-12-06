const { database } = require("../helpers/database");
const { DB } = require("../helpers/dbi");
const { response_handler } = require("../helpers/response_handler");

var acceptUser = {
    args: {
        "target_user_id": "required|number",
    },

    func : async function(body, response) {
        const [error, user] = await DB.getUserById(body.target_user_id, "PENDING");
        if (user === undefined) {
            response_handler.errorResponse(response, "User's status is not pending", 401);
        }
        else {
            database.query(`
                UPDATE Users
                SET account_status='ACCEPTED'
                WHERE user_id=${body.target_user_id}
            `, function(error, results) {
                response_handler.endResponse(response, `{"page": "admin"}`);
            });
        }
    }
};

var rejectUser = {
    args: {
        "target_user_id": "required|number",
    },

    func : async function(body, response) {
        const [error, user] = await DB.getUserById(body.target_user_id, "PENDING");
        if (user === undefined) {
            response_handler.errorResponse(response, "User's status is not pending", 401);
        }
        else {
            database.query(`
                UPDATE Users
                SET account_status='REJECTED'
                WHERE user_id=${body.target_user_id}
            `, function(error, results) {
                response_handler.endResponse(response, `{"page": "admin"}`);
            });
        }
    }
};

module.exports = { acceptUser, rejectUser };