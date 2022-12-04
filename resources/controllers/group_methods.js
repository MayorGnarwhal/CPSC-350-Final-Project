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

var storeGroup = {
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

module.exports = { fetchGroups, storeGroup };