// -- Services
const http = require("http");
const querystring = require("querystring");
const crypto = require("crypto");

// -- Variables from other .js files
const { helpers } = require("../js/helpers");
const { router } = require("../js/router.js");

// -- Variables
const port = 3003;
const server = http.createServer();


// -- Route server requests
server.on("request", function(request, response) {
    console.log("Method: " + request.method);
    console.log("URL " + request.url);

    // helpers.setupCORS(response);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    if (request.method === "OPTIONS") {
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
                response.statusCode = 400;
                response.write(`{"error": "Failed to parse arguments. Request dropped"}`);
                response.end();
                return;
            }
        }

        router.routeRequest(request.method, request.url, body, response);
    });
});

server.listen(port, function() {
    console.log("Server starting on port " + port);
});