const { response_handler } = require("../helpers/response_handler");
const { database } =  require("../helpers/database");
const { helpers } = require("../helpers/helpers");
const { file } = require("../helpers/file");

var storePost = {
    args: {
        "title": "required|string",
        "caption": "required|string",
        "image": "required|string",
        "global": "required|string", // "true" or "false"
        "groups": "object",
    },

    func : async function(body, response) {
        const imagePath = await file.store(body.image, "public/storage/user_images", "png");
        const now = helpers.formatDatetime();
        const global = body.global === "true";

        const entry = {
            post_user_id: body.user_id,
            post_title: body.title,
            post_picture: imagePath,
            post_text: body.caption,
            is_visible: 1,
            is_global: global ? 1 : 0, 
            post_created_time: now,
            post_updated_time: now
        };

        if (process.env.DEBUG_MODE === "true") {
            response_handler.errorResponse(response, "Debug mode enabled", 418);
        }
        else {
            database.query(`INSERT INTO Posts SET ?`, entry, function(error, result) {
                if (error) {
                    response_handler.errorResponse(response, `DB Error: ${error}`, 400);
                }
                else {
                    // store visibility mappings
                    if (!global) {
                        body.groups.forEach(group => {
                            const map = {
                                group_id: group.slice(4), // `opt-${group_id}`
                                post_id: result.insertId
                            }

                            database.query(`INSERT INTO PostVisibility SET ?`, map, function(err, res) {
                                if (error) {
                                    response_handler.errorResponse(response, `DB Error: ${err}`, 400);
                                }
                            });
                        });
                    }

                    response_handler.endResponse(response, `{"page": "profile", "user_id": "${body.user_id}"}`, 201);
                }
            });
        }
    }
};

module.exports = { storePost };