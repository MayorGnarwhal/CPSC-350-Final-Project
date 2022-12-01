const { response_handler } = require("../helpers/response_handler");
const { database } =  require("../helpers/database");
const { helpers } = require("../helpers/helpers");
const { file } = require("../helpers/file");

var storePost = {
    args: {
        "title": "required|string",
        "caption": "required|string",
        "image": "required|string",
        "groups": "required|object",
    },

    func : async function(body, response) {
        const imagePath = await file.store(body.image, "public/storage/user_images", "png");
        const now = helpers.formatDatetime();

        const entry = {
            post_user_id: body.user_id,
            post_title: body.title,
            post_picture: imagePath,
            post_text: body.caption,
            is_visible: 1,
            is_global: 1, // figure out mapping stuff and check if 0/1
            post_created_time: now,
            post_updated_time: now
        };

        database.query(`INSERT INTO Posts SET ?`, entry, function(error, results) {
            if (error) {
                response_handler.errorResponse(response, `DB Error: ${error}`);
            }
            else {
                response.statusCode = 201;
                response.write(`{"page": "profile"}`);
                response.end();
            }
        });
    }
};

module.exports = { storePost };