const { response_handler } = require("../helpers/response_handler");
const { database } =  require("../helpers/database");
const { helpers } = require("../helpers/helpers");
const { file } = require("../helpers/file");
const { DB } = require("../helpers/dbi");

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
            post_user_id,post_title, post_picture, 
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
            query = `SELECT P.post_id, U.user_id, 
                post_user_id, post_title, post_picture, 
                post_text, is_visible, is_global, 
                post_created_time, post_updated_time, 
                PR.reaction_score, username, first_name, 
                last_name, password, email, 
                profile_picture, account_status, 
                is_admin, account_created_time,
                IF(R.reaction_score IS NULL, 0, R.reaction_score)
                AS user_reaction_score
                FROM Posts AS P
                JOIN PostReactionScores as PR USING(post_id)
                JOIN Users AS U ON post_user_id = user_id
                LEFT JOIN Reactions AS R 
                ON U.user_id = R.user_id AND P.post_id = R.post_id
                WHERE post_user_id = ${body.filter}
                ORDER BY post_created_time DESC`
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

var storePost = {
    args: {
        "title": "required|string",
        "caption": "required|string",
        "image": "required|string",
        "global": "required|string", // "true" or "false"
        "groups": "object",
    },

    func : async function(body, response) {
        const imagePath = await file.store(body.image, "public/storage/user_images", "png");
        const now = helpers.formatDatetime();
        const global = body.global === "true";

        const entry = {
            post_user_id: body.user_id,
            post_title: body.title,
            post_picture: imagePath,
            post_text: body.caption,
            is_visible: 1,
            is_global: global ? 1 : 0, 
            post_created_time: now,
            post_updated_time: now
        };

        if (process.env.DEBUG_MODE === "true") {
            response_handler.errorResponse(response, "Debug mode enabled", 418);
        }
        else {
            database.query(`INSERT INTO Posts SET ?`, entry, function(error, result) {
                if (error) {
                    response_handler.errorResponse(response, `DB Error: ${error}`, 400);
                }
                else {
                    // store visibility mappings
                    if (!global) {
                        if (!body.groups || body.groups.length === 0) {
                            return response_handler.errorResponse(response, "Cannot set group to have no group visibility", 401);
                        }

                        body.groups.forEach(group => {
                            const map = {
                                group_id: group.slice(4), // `opt-${group_id}`
                                post_id: result.insertId
                            }

                            database.query(`INSERT INTO PostVisibility SET ?`, map, function(err, res) {
                                if (error) {
                                    response_handler.errorResponse(response, `DB Error: ${err}`, 400);
                                }
                            });
                        });
                    }

                    response_handler.endResponse(response, `{"page": "profile", "user_id": "${body.user_id}"}`, 201);
                }
            });
        }
    }
};

var updatePost = {
    args: {
        "title": "required|string",
        "caption": "required|string",
        "image": "string",
        "global": "required|string", // "true" or "false"
        "groups": "object",
    },

    func: async function(body, response) {
        const now = helpers.formatDatetime();
        const global = body.global === "true";
        
        const entry = {
            post_user_id: body.user_id,
            post_title: body.title,
            post_text: body.caption,
            is_visible: 1,
            is_global: global ? 1 : 0, 
            post_updated_time: now
        };
        
        if (body.image) {
            const imagePath = await file.store(body.image, "public/storage/user_images", "png");
            entry.post_picture = imagePath;
        }

        await DB.query(`
            DELETE FROM PostVisibility
            WHERE post_id='${body.post_id}'
        `);

        if (process.env.DEBUG_MODE === "true") {
            response_handler.errorResponse(response, "Debug mode enabled", 418);
        }
        else {
            database.query(`UPDATE Posts SET ? WHERE post_id='${body.post_id}'`, [entry], function(error, result) {
                if (error) {
                    response_handler.errorResponse(response, `DB Error: ${error}`, 400);
                }
                else {
                    // store visibility mappings
                    if (!global) {
                        if (!body.groups || body.groups.length === 0) {
                            return response_handler.errorResponse(response, "Cannot set group to have no group visibility", 401);
                        }

                        body.groups.forEach(group => {
                            const map = {
                                group_id: group.slice(4), // `opt-${group_id}`
                                post_id: body.post_id,
                            }

                            database.query(`INSERT INTO PostVisibility SET ?`, map, function(err, res) {
                                if (error) {
                                    return response_handler.errorResponse(response, `DB Error: ${err}`, 400);
                                }
                                console.log(res);
                            });
                        });
                    }

                    response_handler.endResponse(response, `{"page": "profile", "user_id": "${body.user_id}"}`, 201);
                }
            });
        }
    }
};

var deletePost = {
    args: {
        post_id: "required|number"
    },

    func: async function(body, response) {
        database.query(`
            SELECT post_id 
            FROM Posts
            WHERE post_id='${body.post_id}' AND post_user_id='${body.user_id}'
        `, async function(error, results) {
            if (results.length === 0) {
                response_handler.errorResponse(response, "Cannot  delete post that is not your own", 401);
            }
            else {
                await DB.query(`DELETE FROM AlgorithmComponents WHERE post_id='${body.post_id}'`);
                await DB.query(`DELETE FROM Reactions WHERE post_id='${body.post_id}'`);
                await DB.query(`DELETE FROM Posts WHERE post_id='${body.post_id}'`);
                response_handler.endResponse(response, `{"page": "profile"}`, 201);
            }
        });
    }
};

var hidePost = {
    args: {
        post_id: "required|number",
        is_visible: "required|string" // true or false
    },

    func: async function(body, response) {
        database.query(`
            UPDATE Posts
            SET is_visible='${body.is_visible === "true" ? 1 : 0}'
            WHERE post_id='${body.post_id}' AND post_user_id='${body.user_id}'
        `, function(error, results) {
            if (error) {
                response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
            }
            else if (results.affectedRows === 0) {
                response_handler.errorResponse(response, "Cannot update a post that is not your own");
            }
            else {
                response_handler.endResponse(response, `{"page": "profile"}`, 201);
            }
        });
    }
};

var postReaction = {
    args: {
        post_id: "required|number",
        rating: "required|number",
    },

    func: async function(body, response) {
        const now = helpers.formatDatetime();

        const entry = {
            user_id: body.user_id,
            post_id: body.post_id,
            reaction_score: body.rating,
            reaction_created_time: now,
            reaction_updated_time: now
        };

        database.query(`INSERT INTO Reactions SET ?`, entry, function(error, results) {
            if (error) {
                if (error.code !== "ER_DUP_ENTRY") {
                    response_handler.errorResponse(response, `DB ERROR: ${error}`, 401);
                }
                else {
                    // reaction exists, update column
                    database.query(`
                        UPDATE Reactions
                        SET reaction_score='${body.rating}'
                        WHERE user_id='${body.user_id}' AND post_id='${body.post_id}'
                    `, function(err, results) {
                        if (err) {
                            response_handler.errorResponse(response, `DB ERROR: ${err}`, 401);
                        }
                        else {
                            console.log(results);
                            response_handler.endResponse(response, undefined, 201);
                        }
                    })
                }
            }
            else {
                response_handler.endResponse(response, undefined, 201);
            }
        });   
    }
};

var navigateEditPost = {
    args: {
        post_id: "required|number"
    },

    func: async function(body, response) {
        var [error, post] = await DB.getPostById(body.post_id);
        if (post === undefined) {
            response_handler.errorResponse(response, "Cannot edit post that is not your own", 401);
        }
        else {
            database.query(`
                SELECT * FROM Groups
                WHERE group_user_id='${body.user_id}'
            `, function(error, groups) {
                const groupIDs = groups.map(group => group.group_id);
                
                database.query(`
                    SELECT * FROM PostVisibility
                    WHERE post_id='${body.post_id}'
                `, function(error, visibilies) {
                    data = {
                        page: "edit_post",
                        page_args: {
                            post: post,
                            visibilies: visibilies
                        }
                    }

                    response_handler.endResponse(response, JSON.stringify(data), 200);
                });
            });
        }
    }
};

module.exports = { fetchPosts, storePost, deletePost, hidePost, updatePost, postReaction, navigateEditPost, updatePost };