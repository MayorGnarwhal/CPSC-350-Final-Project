const { response_handler } = require("../helpers/response_handler");
const { database } = require("../helpers/database");
const { queries } = require("../config/queries");
const { DB } = require("../helpers/dbi");

const typeaheadFilters = ["FRIENDS_ONLY"];

var typeahead = {
    args: {
        "search_term": "required|string",
        "filter": "string",
    },

    func : async function(body, response) {
        if (body.filter && !typeaheadFilters.find(filter => filter === body.filter.toUpperCase())) {
            response_handler.errorResponse(response, `Invalid filter ${body.filter}`, 401);
        }

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

        database.query(`${queries.USER} ${whereClause} LIMIT 5`, async function(error, users) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`);
            }
            else {
                if (body.filter === "FRIENDS_ONLY") { // filter to only friends
                    const asyncFilter = async(arr, predicate) => {
                        const results = await Promise.all(arr.map(predicate));
                        return arr.filter((value, index) => results[index]);
                    }
                    users = await asyncFilter(users, async user => {
                        var [error, friendship] = await DB.getFriendship(body.user_id, user.user_id);
                        return (friendship !== undefined && friendship.friend_status === "ACCEPTED");
                    });
                }

                response_handler.endResponse(response, JSON.stringify(users), 201);
            }
        });
    }
};

module.exports = { typeahead };