// -- Services
const http = require("http");
const querystring = require("querystring");
const crypto = require("crypto");

// -- Variables from other .js files
const { helpers } = require("../helpers/helpers");
const { response_handler } = require("../helpers/response_handler");
const { router } = require("../js/router.js");
const { database } = require("../helpers/database");

// -- Variables
const port = 3003;
const server = http.createServer();


// -- Route server requests
server.on("request", function(request, response) {
    helpers.setupCORS(response);
    
    if (request.method === "OPTIONS") {
        response.end();
        return;
    }

    console.log("Method: " + request.method);
    console.log("URL " + request.url);

    let body = {};
    let data = "";
    request.on("data", function(chunk) {
        data += chunk;
    });
    request.on("end", function() {
        if (data) {
            try {
                body = JSON.parse(data);
                console.log("body: " + data);
            }
            catch {
                console.log("failed to parse data");
                response_handler.errorResponse(response, "Failed to parse arguments", 400);
                return;
            }
        }

        router.routeRequest(request.method, request.url, body, response);
    });
});

server.listen(port, function() {
    console.log("Server starting on port " + port);
    database.query("SHOW TABLES", function(error, results, fields) {
        console.log(error, results);
    });
});