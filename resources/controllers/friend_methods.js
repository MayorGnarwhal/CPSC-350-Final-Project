const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { queries } = require("../config/queries");
const { DB } = require("../helpers/dbi");
const { helpers } = require("../helpers/helpers");

var friendRequest = {
    args: {
        target_user_id: "required|number"
    },

    func : async function(body, response) {
        const friendUserID = parseInt(body.target_user_id);
        if (body.user_id === friendUserID) {
            response_handler.errorResponse(response, "Cannot send a friend request to yourself", 401);
            return;
        }

        const [error, friendUser] = await DB.getUserById(friendUserID);
        if (error) {
            response_handler.errorResponse(response, `DB ERROR: ${error}`);
        }
        else {
            const now = helpers.formatDatetime();

            const entry = {
                initiator_user_id: body.user_id,
                receiver_user_id: friendUserID,
                action_type: "FRIEND_REQUEST",
                friend_status: "PENDING",
                friend_created_time: now,
                friend_updated_time: now
            };

            database.query(`INSERT INTO Friends SET ?`, entry, function(error, results) {
                if (error) {
                    if (error.code === "ER_DUP_ENTRY") {
                        response_handler.errorResponse(response, "Cannot send a friend request to a user with existing friendship status", 401);
                    }
                    else {
                        response_handler.errorResponse(response, `DB ERROR: ${error}`);
                    }
                }
                else {
                    const returnResponse = {
                        "success": `Successfully invited ${friendUser.first_name} ${friendUser.last_name} to be your friend!`,
                    }
                    response_handler.endResponse(response, JSON.stringify(returnResponse), 201);
                }
            });
        }
    }
};

module.exports = { friendRequest };