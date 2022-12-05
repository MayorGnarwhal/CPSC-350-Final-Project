const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { queries } = require("../config/queries");

var typeahead = {
    args: {
        "search_term": "required|string",
    },

    func : async function(body, response) {
        // get all words longer than 2 characters
        const terms = body.search_term.trim().split(" ").filter(term => term.length >= 2);
        
        if (terms.length === 0) {
            response_handler.endResponse(response, undefined, 201);
        }

        var whereClause = "WHERE";
        terms.forEach(term => {
            whereClause += ` first_name LIKE '%%${term}%%' OR last_name LIKE '%%${term}%%' OR`
        });
        whereClause = whereClause.slice(0, -3);

        database.query(`${queries.USER} ${whereClause} LIMIT 5`, function(error, users) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`);
            }
            else {
                response_handler.endResponse(response, JSON.stringify(users), 201);
            }
        });
    }
};

module.exports = { typeahead };