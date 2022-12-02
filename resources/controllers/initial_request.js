const { DB } = require("../helpers/dbi");

var init = {
    args: {
        
    },

    func : async function(body, response) {
        const [error, user] = await DB.getUserBySession(body.session_id);
        
        if (error) {
            response.statusCode = 200;
            response.end(`{"page": "login"}`);
        }
        else {
            response.statusCode = 201;
            response.write(`{"page": "index"}`);
            response.end();
        }
    }
};

module.exports = { init };