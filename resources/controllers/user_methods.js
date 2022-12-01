const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");

var fetchUser = {
    args: {
        "target_user_id": "required|number",
    },

    // this returns sensitive information, but lets ignore that
    //    join tables to get friend count
    func : async function(body, response) {
        database.query(`SELECT * from Users WHERE user_id=${body.target_user_id}`, function(error, result) {
            if (error) {
                response_handler.errorResponse(response, `DB Error: ${error}`);
            }
            else {
                response.statusCode = 201;
                response.write(JSON.stringify(result));
                response.end();
            }
        });
    }
};

var updateUser = {
    args: {
        "target_user_id": "required|number",
    },

    func : async function(body, response) {
        if (body.user_id !== body.target_user_id) { // or check if admin
            response_handler.errorResponse(response, "Cannot edit user that is not yourself");
        }
        else {

        }
    }
};

module.exports = { fetchUser, updateUser };