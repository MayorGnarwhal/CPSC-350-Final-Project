// -- Services
const http = require("http");
const querystring = require("querystring");
const crypto = require("crypto");

// -- Process .env file
require("dotenv").config();

// -- Variables from other .js files
const { helpers } = require("../helpers/helpers");
const { response_handler } = require("../helpers/response_handler");
const { router } = require("../js/router.js");
const feed = require('./feed.js');

// -- Variables
const server = http.createServer();


// -- Route server requests
server.on("request", function(request, response) {
    helpers.setupCORS(response);
    
    if (request.method === "OPTIONS") {
        response.end();
        return;
    }
    
    console.log(request.method, request.url);

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

server.listen(process.env.PORT, function() {
    console.log("Server starting on port " + process.env.PORT);
    setInterval(feed.updateFeed, 60000);
});