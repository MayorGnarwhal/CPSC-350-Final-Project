const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { queries } = require("../config/queries");
const { file } = require("../helpers/file");
const { DB } = require("../helpers/dbi");

const updateIgnoreColumns = ["session_id", "user_id", "target_user_id", "profile_picture"];

var fetchUser = {
    args: {
        "target_user_id": "number",
    },

    func : async function(body, response) {
        // try by target user id first
        var [error, user] = await DB.getUserById(body.target_user_id);
        if (error) {
            response_handler.errorResponse(response, `DB ERROR: ${error}`, 400);
        }
        else {
            if (user === undefined) {
                // try user from session id
                [error, user] = await DB.getUserBySession(body.session_id);
                if (error) {
                    response_handler.errorResponse(response, `DB ERROR: ${error}`, 400);
                }
            }

            if (user !== undefined) {
                response_handler.endResponse(response, JSON.stringify(user), 200);
            }
            else {
                response.errorResponse(response, "Cannot find user", 404);
            }
        }
    }
};

// maybe able to merge with fetchUser
// this will eventually have filters to get select users
var fetchAllUsers = {
    args: {
        
    },

    func : async function(body, response) {
        database.query(queries.USER, function(error, results) {
            if (error) {
                response_handler.errorResponse(response, `DB Error: ${error}`, 400);
            }
            else {
                response_handler.endResponse(response, JSON.stringify(results), 200);
            }
        });
    },
};

var updateUser = {
    args: {
        "target_user_id": "required|number",
        "first_name": "required|string",
        "last_name": "required|string",
        // other optional args can be passed
        //   must match a valid column name and type from Users
    },

    func : async function(body, response) {
        body.target_user_id = parseInt(body.target_user_id);

        if (body.user_id !== body.target_user_id) { // or check if admin
            response_handler.errorResponse(response, "Cannot edit user that is not yourself", 401);
        }
        else {
            // do status change?
            const updates = {};
            for (const [key, value] of Object.entries(body)) {
                if (!updateIgnoreColumns.find(elem => elem === key)) {
                    updates[key] = value;
                }
            }

            
            if (body.profile_picture !== undefined) {
                // delete old profile picture (requires join from user)
                //    https://stackoverflow.com/a/25195330
                updates.profile_picture = await file.store(body.profile_picture, "public/storage/user_images", ".png");
            }

            database.query(`UPDATE Users SET ? WHERE user_id=${body.target_user_id}`, updates, function(error, result) {
                if (error) {
                    response_handler.errorResponse(response, `DB Error: ${error}`, 400);
                }
                else {
                    response_handler.endResponse(response, `{"page": "profile", "user_id": "${body.target_user_id}"}`);
                }
            });
        }
    }
};

var viewProfile = {
    args: {
        target_user_id: "required|number"
    },

    func: async function(body, response) {
        var [error, user] = await DB.getUserById(body.target_user_id);
        if (error) {
            response_handler.errorResponse(response, `DB ERROR: ${error}`);
        }
        else {
            const data = {
                page: "profile",
                page_args: {
                    user_id: body.target_user_id
                }
            };
            response_handler.endResponse(response, JSON.stringify(data), 200);
        }
    }
};

module.exports = { fetchUser, fetchAllUsers, updateUser, viewProfile };