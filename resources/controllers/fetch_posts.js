const fs = require("fs");

const { response_handler } = require("../helpers/response_handler");
const { database } =  require("../helpers/database");

var fetchPosts = {
    args: {
        "filter": "required|number",
        "page" : "required|string",
    },
    func : async function(body, response) {
        //const whereClause = body.filter ? `WHERE A.user_id=${body.filter}` : "";
        var query;
        if(body.page === "index"){
            query = `SELECT A.post_id, A.user_id, alg_reaction, 
            alg_group, alg_time, algorithm_score,
            post_user_id, post_picture, 
            post_text, is_visible, is_global, 
            post_created_time, post_updated_time, 
            PR.reaction_score, username, first_name, 
            last_name, password, email, 
            profile_picture, account_status, 
            is_admin, account_created_time,
            IF(R.reaction_score IS NULL, 0, R.reaction_score)
            AS user_reaction_score
            FROM AlgorithmScores AS A
            JOIN Posts as P ON P.post_id = A.post_id
            JOIN PostReactionScores as PR ON A.post_id = PR.post_id
            JOIN Users AS U ON post_user_id = U.user_id
            LEFT JOIN Reactions AS R 
            ON A.user_id = R.user_id AND A.post_id = R.post_id
            WHERE A.user_id = ${body.filter}
            ORDER BY algorithm_score DESC;`
        }
        else if(body.page === "profile"){
            query = `SELECT post_id, user_id, 
                            post_user_id, post_title, post_picture, 
                            post_text, is_visible, is_global, 
                            post_created_time, post_updated_time, 
                            reaction_score, username, first_name, 
                            last_name, password, email, 
                            profile_picture, account_status, 
                            is_admin, account_created_time
                            FROM Posts
                            JOIN PostReactionScores USING(post_id)
                            JOIN Users ON post_user_id = user_id
                            WHERE post_user_id = ${body.filter}
                            ORDER BY post_created_time DESC;`
        }
        database.query(query, function(error, results) {
            if (error) {
                response_handler.errorResponse(response, `Failed to fetch posts for user of id ${body.user_id}`, 404);
            }
            else {
                response_handler.endResponse(response, JSON.stringify(results), 200);
            }
        });
    }
};

module.exports = { fetchPosts };