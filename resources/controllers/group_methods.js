const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { helpers } = require("../helpers/helpers");
const { queries } = require("../config/queries");
const { DB } = require("../helpers/dbi");

var fetchGroups = {
    args: {

    },

    func : async function(body, response) {
        database.query(`
            ${queries.GROUPS}
            WHERE group_user_id='${body.user_id}'
        `, function(error, groups) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`);
            }
            else {
                response_handler.endResponse(response, JSON.stringify(groups), 200);
            }
        });
    }
};

var viewGroup = {
    args: {
        group_id: "required|number"
    },

    func: async function(body, response) {
        var [error, group] = await DB.getGroupById(body.group_id);
        if (error) {
            response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
        }
        else {
            const data = {
                page: "group",
                page_args: {
                    group: group
                }
            };
            response_handler.endResponse(response, JSON.stringify(data), 200);
        }
    }
};

var fetchGroupMembers = {
    args: {
        group_id: "required|number"
    },

    func: async function(body, response) {
        database.query(`
            SELECT ${queries.USER_COLUMNS}
            FROM GroupMembership
            INNER JOIN Users
            ON GroupMembership.user_id=Users.user_id
            WHERE group_id='${body.group_id}'
        `, function(error, members) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
            }
            else {
                response_handler.endResponse(response, JSON.stringify(members), 200);
            }
        });
    }
};

var createGroup = {
    args: {
        "name": "required|string",
        "priority": "required|number"
    },

    func : async function(body, response) {
        if (body.priority < 0 || body.priority > 5) {
            return response_handler.errorResponse(response, "Invalid group priority (not integer between 1 and 5)", 401);
        }

        const now = helpers.formatDatetime();
        const entry = {
            group_user_id: body.user_id,
            group_name: body.name,
            group_priority: body.priority,
            group_created_time: now,
            group_updated_time: now,
        };

        database.query(`INSERT INTO Groups SET ?`, entry, function(error, results) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`, 400);
            }
            else {
                response_handler.endResponse(response, `{"page": "groups"}`, 201);
            }
        });
    }
};

var addToGroup = {
    args: {
        group_id: "required|number",
        target_user_id: "required|number"
    },

    func: async function(body, response) {
        const entry = {
            group_id: body.group_id,
            user_id: body.target_user_id
        };

        // make sure requester owns group
        database.query(`INSERT INTO GroupMembership SET ?`, entry, function(error, results) {
            if (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    response_handler.errorResponse(response, "User is already in group", 401);
                }
                else {
                    response_handler.errorResponse(response, `DB ERROR: ${error}`);
                }
            }
            else {
                viewGroup.func(body, response);
            }
        });
    }
};

var updateGroup = {
    args: {
        "group_id": "required|number",
        "name": "required|string",
        "priority": "required|number"
    },

    func: async function(body, response) {
        const updates = {
            group_name: body.name,
            group_priority: body.priority
        };

        database.query(`
            UPDATE Groups
            SET ?
            WHERE group_id='${body.group_id}'
            AND group_user_id='${body.user_id}'
        `, updates, function(error, results) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
            }
            else {
                if (results.affectedRows === 0) {
                    response_handler.errorResponse(response, "Failed to update group. Group does not exist or user does not have permissions for update", 401);
                }
                else {
                    response_handler.endResponse(response, `{"page": "groups"}`, 201);
                }
            }
        });
    }
};

var deleteGroup = {
    args: {
        group_id: "required|number"
    },

    func: async function(body, response) {
        database.query(`DELETE FROM Groups WHERE group_id='${body.group_id}'`, function(error, results) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
            }
            else {
                if (results.affectedRows === 0) {
                    response_handler.errorResponse(response, "Group does not exist", 401);
                }
                else {
                    response_handler.endResponse(response, `{"page": "groups"}`, 201);
                }
            }
        });
    }
};

module.exports = { fetchGroups, viewGroup, fetchGroupMembers, createGroup, addToGroup, updateGroup, deleteGroup };