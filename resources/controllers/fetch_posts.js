const fs = require("fs");

const { response_handler } = require("../helpers/response_handler");
const { database } =  require("../helpers/database");

var fetchPosts = {
    args: {
        "filter": "nullable",
    },

    func : async function(body, response) {
        const whereClause = body.filter ? `WHERE post_user_id=${body.filter}` : "";

        // need to join tables for extra information
        //    first_name, last_name, username, count(reactions), groups[]
        // need to apply algorithm
        //    also need to do this elsewhere, and then pull from there?
        database.query(`SELECT * FROM Posts ${whereClause}`, function(error, results) {
            if (error) {
                response_handler.errorResponse(response, `Failed to fetch posts for user of id ${body.user_id}`);
            }
            else {
                response.statusCode = 201;
                response.write(JSON.stringify(results));
                response.end();
            }
        });
    }
};

module.exports = { fetchPosts };