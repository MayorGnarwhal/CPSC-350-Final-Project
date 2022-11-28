// -- Services
const http = require("http");
const querystring = require("querystring");
const crypto = require("crypto");

// -- Set up env
const { processEnv } = require("../../env");
processEnv();

// -- Variables from other .js files
const { helpers } = require("../helpers/helpers");
const { response_handler } = require("../helpers/response_handler");
const { router } = require("../js/router.js");

// -- Variables
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
    
    if (request.url === "/fetch_env") {
        response.statusCode = 201;
        response.write(JSON.stringify(process.env));
        response.end();
        return;
    }

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
});