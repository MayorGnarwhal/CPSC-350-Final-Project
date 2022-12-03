const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { queries } = require("../config/queries");

var typeahead = {
    args: {
        "search_term": "required|string",
    },

    // TODO: split search terms?
    //   does not show results if space in words
    func : async function(body, response) {
        const searchTerm = body.search_term.trim();
        
        if (searchTerm <= 3) {
            response_handler.endResponse(response, undefined, 201);
        }

        database.query(
            `${queries.USER} 
            WHERE first_name LIKE '%%${searchTerm}%%'
            OR last_name LIKE '%%${searchTerm}%%'
        `, function(error, users) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`);
            }
            else {
                response_handler.endResponse(response, JSON.stringify(users), 201);
            }
        })
    }
};

module.exports = { typeahead };