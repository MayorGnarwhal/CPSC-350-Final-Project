const fs = require("fs");

const { response_handler } = require("../helpers/response_handler");

var fetchPage = {
    args: {
        "page": "required|string",
    },

    func : async function(body, response) {
        const pagePath = `public/views/${body.page}.html`;

        fs.readFile(pagePath, function(error, data) {
            if (error) {
                response_handler.errorResponse(response, `Failed to fetch '${pagePath}`);
            }
            else {
                response.statusCode = 201;
                response.write(data);
                response.end();
            }
        });
    }
}

module.exports = { fetchPage };