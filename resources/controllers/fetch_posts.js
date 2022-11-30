const fs = require("fs");

const { response_handler } = require("../helpers/response_handler");

var fetchPosts = {
    args: {
        "filter": "nullable",
    },

    func : async function(body, response) {
        const tempPath = "public/json/example-post-list.json";

        fs.readFile(tempPath, function(error, data) {
            if (error) {
                response_handler.errorResponse(response, "Failed to fetch posts");
            }
            else {
                response.statusCode = 201;
                response.write(data);
                response.end();
            }
        });
    }
};

module.exports = { fetchPosts };