const fs = require("fs");

const { response_handler } = require("../helpers/response_handler");
const { database } =  require("../helpers/database");
const { DB } = require("../helpers/dbi");

var init = {
    args: {
        
    },

    func : async function(body, response) {
        const [error, user] = await DB.getUserBySession(body.session_id);
        
        // session exists
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