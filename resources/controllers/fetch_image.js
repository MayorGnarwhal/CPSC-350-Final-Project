const { file } = require("../helpers/file");
const { response_handler } = require("../helpers/response_handler");

var fetchImage = {
    args: {
        "src": "required|string",
    },

    func : async function(body, response) {
        const imgData = await file.fetch(body.src);
        response_handler.endResponse(response, JSON.stringify(imgData), 200);
    }
}

module.exports = { fetchImage };