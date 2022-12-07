const { response_handler } = require("../helpers/response_handler");
const { DB } = require("../helpers/dbi");

var init = {
    args: {
        
    },

    func : async function(body, response) {
        const [error, user] = await DB.getUserBySession(body.session_id);
        
        if (error || user === undefined) {
            response_handler.endResponse(response, '{"page": "login"}', 200);
        }
        else {
            response_handler.endResponse(response, '{"page": "feed"}', 200);
            // response_handler.endResponse(response, '{"page": "admin"}', 200);
        }
    }
};

module.exports = { init };