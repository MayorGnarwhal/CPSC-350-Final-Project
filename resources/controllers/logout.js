const { DB } = require("../helpers/dbi");
const { response_handler } = require("../helpers/response_handler");

var logout = {
    args: {
        
    },

    // no extra validation as force_login handles error cases
    func : async function(body, response) {
        const [error, results] = await DB.query(`
            DELETE FROM Sessions
            WHERE user_id='${body.user_id}'
        `);

        if (error) {
            response_handler.errorResponse(response, `DB Error: ${error}`);
        }
        else {
            response_handler.endResponse(response, `{"page": "login", "session_id": "${null}"}`);
        }
    }
};

module.exports = { logout };