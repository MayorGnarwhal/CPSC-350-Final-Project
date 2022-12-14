const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { helpers } = require("../helpers/helpers");
const { queries } = require("../config/queries");
const { DB } = require("../helpers/dbi");

var fetchFriends = {
    args: {
        // TODO: Some sort of filters
        "friend_status": "string", // ACCEPTED, PENDING, BLOCKED
        "is_initiator": "string" // bool
    },

    func : async function(body, response) {
        const friendStatus = body.friend_status || "ACCEPTED";

        const initiatorCondition = `initiator_user_id=${body.user_id}`;
        const recieverCondition = `receiver_user_id='${body.user_id}'`;

        var condition;
        if (body.is_initiator === "true") {
            condition = initiatorCondition;
        }
        else if (body.is_initiator === "false") {
            condition = recieverCondition;
        }
        else {
            condition = initiatorCondition + " OR " + recieverCondition;
        }

        database.query(`
            SELECT * FROM Friends
            WHERE friend_status='${friendStatus}' AND (${condition})
        `, function(error, friendRelations) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`, 404);
            }
            else {
                const friendIDs = friendRelations.map(rel => {
                    return rel.initiator_user_id !== body.user_id ? rel.initiator_user_id : rel.receiver_user_id
                });

                if (friendIDs.length === 0) { // has no friends, next query would error
                    response_handler.endResponse(response, "{}", 201);
                }
                else {
                    database.query(`
                        ${queries.USER}
                        WHERE user_id IN (?)
                    `, [friendIDs], function(error, users) {
                        if (error) {
                            response_handler.errorResponse(response, `DB ERROR: ${error}`, 404);
                        }
                        else {
                            response_handler.endResponse(response, JSON.stringify(users));
                        }
                    });
                }
            }
        });
    },
};

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
        else if (friendUser === undefined) {
            response_handler.errorResponse(response, `Invalid user given`);
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
                    response_handler.endResponse(response, `{"page": "friends"}`, 201);
                }
            });
        }
    }
};

var acceptFriend = {
    args: {
        target_user_id: "required|number",
    },

    func: async function(body, response) {
        var [error, friendship] = await DB.getFriendship(body.user_id, body.target_user_id, `friend_status='PENDING'`);
        if (error) {
            response_handler.errorResponse(response, `DB ERROR: ${error}`, 404);
        }
        else if (friendship === undefined) {
            response_handler.errorResponse(response, "No existing friend request", 401);
        }
        else {
            database.query(`
                UPDATE Friends
                SET friend_status='ACCEPTED'
                WHERE (
                    initiator_user_id='${friendship.initiator_user_id}'
                    AND receiver_user_id='${friendship.receiver_user_id}'
                )
            `, function(error, results) {
                if (error) {
                    response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
                }
                else {
                    response_handler.endResponse(response, `{"page": "friends"}`, 201);
                }
            });
        }
    }
};

var blockFriend = {
    args: {
        target_user_id: "required|number",
    },

    func: async function(body, response) {
        var [error, friendship] = await DB.getFriendship(body.user_id, body.target_user_id);
        if (error) {
            response_handler.errorResponse(response, `DB ERROR: ${error}`, 404);
        }
        else if (friendship === undefined) {
            response_handler.errorResponse(response, "Friendship between users does not exist", 401);
        }
        else {
            const friendStatus = friendship.initiator_user_id === body.user_id ? "INITIATOR_BLOCKED" : "RECIEVER_BLOCKED";
            database.query(`
                UPDATE Friends
                SET friend_status='${friendStatus}'
                WHERE (
                    initiator_user_id='${friendship.initiator_user_id}'
                    AND receiver_user_id='${friendship.receiver_user_id}'
                )
            `, function(error, results) {
                if (error) {
                    response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
                }
                else {
                    response_handler.endResponse(response, `{"page": "friends"}`, 201);
                }
            });
            database.query(`
            DELETE M 
            FROM GroupMembership as M JOIN Groups as G
                ON M.group_id = G.group_id
            WHERE(
                group_user_id='${body.user_id}'
                AND user_id='${body.target_user_id}'
                )
            `, function(error, results) {
                if (error) {
                    response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
                }
                else {
                    response_handler.endResponse(response, `{"page": "friends"}`, 201);
                }
            });
        }
    }
};

module.exports = { fetchFriends, friendRequest, acceptFriend, blockFriend };