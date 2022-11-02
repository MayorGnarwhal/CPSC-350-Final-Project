const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const crypto = require("crypto");

const port = 3003;
const server = http.createServer();

server.on("request", function(request, response) {
    console.log("Method: " + request.method);
    console.log("URL " + request.url);

    // Setup CORS    
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
});

server.listen(port, function() {
    console.log("Server starting on port " + port);
    loadDatastore();
});